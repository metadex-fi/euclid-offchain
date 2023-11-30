import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import {
  DiracDatum,
  ParamDatum,
  PPreEuclidDatum,
} from "../types/euclid/euclidDatum.ts";
import { gMaxHashes, IdNFT } from "../types/euclid/idnft.ts";
import { Currency } from "../types/general/derived/asset/currency.ts";
import { KeyHash } from "../types/general/derived/hash/keyHash.ts";
import { AssocMap } from "../types/general/fundamental/container/map.ts";
import { Data } from "../types/general/fundamental/type.ts";
import { Swapping } from "./actions/swapping.ts";
import { Pool, PrePool } from "./pool.ts";
import { User } from "./user.ts";
import { ParamUtxo, PreDiracUtxo } from "./utxo.ts";
import { Asset } from "../types/general/derived/asset/asset.ts";
import { handleInvalidPools } from "../utils/constants.ts";

type ErrorMessage = string;

export class EuclidState {
  // private invalidDiracs = new AssocMap<PErrorMessage, PreDiracUtxo[]>(PString.ptype);
  private invalidUtxos = new AssocMap<ErrorMessage, Lucid.UTxO[]>((str) => str);
  // public emptyPoolParams!: AssocMap<PKeyHash, AssocMap<PToken, ParamUtxo>>;
  public pools = new AssocMap<KeyHash, AssocMap<IdNFT, Pool>>((kh) =>
    kh.show()
  );
  public invalidPools = new AssocMap<KeyHash, AssocMap<IdNFT, PrePool>>(
    (kh) => kh.show(),
  );

  public get listPools(): Pool[] {
    return [...this.pools.values()].flatMap((p) => [...p.values()]);
  }

  constructor(
    utxos: Lucid.UTxO[],
    policy: Currency,
  ) {
    // 1. sort utxos into prePools
    const prePools = new AssocMap<KeyHash, AssocMap<IdNFT, PrePool>>(
      (kh) => kh.show(),
    );
    const ppreEuclidDatum = new PPreEuclidDatum(policy);

    utxos.forEach((utxo) => {
      try {
        // TODO assert scriptref, and all the other fields if it makes sense
        assert(utxo.datum, `datum must be present`);
        const datum = Data.from(utxo.datum);
        assert(
          datum instanceof Lucid.Constr,
          `datum must be a Constr, got ${datum}`,
        );
        const preEuclidDatum = ppreEuclidDatum.plift(datum);
        if (preEuclidDatum instanceof ParamDatum) {
          const paramUtxo = ParamUtxo.parse(
            utxo,
            preEuclidDatum.param,
          );
          const owner = paramUtxo.param.owner;
          const paramNFT = paramUtxo.paramNFT;
          const ownerPrePools = prePools.get(owner) ??
            new AssocMap<IdNFT, PrePool>((nft) => nft.show());
          const prePool = (ownerPrePools.get(paramNFT) ?? new PrePool())
            .setParamUtxo(paramUtxo);
          ownerPrePools.set(paramNFT, prePool);
          prePools.set(owner, ownerPrePools);
        } else if (preEuclidDatum instanceof DiracDatum) {
          const preDiracUtxo = new PreDiracUtxo(
            utxo,
            datum,
            preEuclidDatum.dirac,
          );
          const owner = preDiracUtxo.preDirac.owner;
          const paramNFT = preDiracUtxo.preDirac.paramNFT;
          const ownerPrePools = prePools.get(owner) ??
            new AssocMap<IdNFT, PrePool>((kh) => kh.show());
          const prePool = (ownerPrePools.get(paramNFT) ?? new PrePool())
            .addPreDiracUtxo(preDiracUtxo);
          ownerPrePools.set(paramNFT, prePool);
          prePools.set(owner, ownerPrePools);
        } else {
          throw new Error(`unknown preEuclidDatum`);
        }
      } catch (e) {
        if (handleInvalidPools) console.error(e);
        else throw e;
        // const is = this.invalidUtxos.get(e.message) ?? [];
        // is.push(utxo);
        // this.invalidUtxos.set(e.message, is);
      }
    });

    // 2. parse prePools into pools
    this.pools = new AssocMap<KeyHash, AssocMap<IdNFT, Pool>>((kh) =>
      kh.show()
    );
    prePools.forEach((ownerPrePools, owner) => { // TODO this could be parallelized
      const parsedOwnerPools = new AssocMap<IdNFT, Pool>((kh) => kh.show());
      const invalidOwnerPools = new AssocMap<IdNFT, PrePool>((kh) => kh.show());
      let hits = ownerPrePools.size;
      let misses = gMaxHashes;
      let paramNFT = new IdNFT(
        policy, // NOTE this is the only place where we actually constrain the policy, preserve that
        owner.hash(),
      );
      while (hits && misses) {
        const prePool = ownerPrePools.get(paramNFT);
        if (prePool) {
          misses = gMaxHashes;
          const parsed = prePool.parse();
          if (parsed) {
            const [parsedPool, lastIdNFT] = parsed;
            parsedOwnerPools.set(paramNFT, parsedPool);
            paramNFT = lastIdNFT;
            hits--;
          } else {
            if (handleInvalidPools) invalidOwnerPools.set(paramNFT, prePool);
            else throw new Error(`invalid prePool: ${prePool.show()}`);
          }
        } else {
          misses--;
        }
        paramNFT = paramNFT.next();
      }
      this.pools.set(owner, parsedOwnerPools);
      this.invalidPools.set(owner, invalidOwnerPools);

      // console.log(
      //   "found valid pools for owner:",
      //   owner.show(),
      //   parsedOwnerPools.size,
      //   parsedOwnerPools.last?.paramUtxo.paramNFT.show(),
      // );
      // console.log(
      //   "found invalid pools for owner:",
      //   owner.show(),
      //   invalidOwnerPools.size,
      //   invalidOwnerPools.last?.paramUtxo?.paramNFT.show(),
      // );
    });
  }

  // TODO Rethink and fix this
  public weightedPrice(denominator: Asset, numerator: Asset): [number, number] {
    const pools = this.listPools;
    const diracPrices = pools.filter((p) => {
      const assets = p.assets;
      return assets.has(denominator) && assets.has(numerator);
    }).flatMap((pool) => pool.weightedPrices);
    const [priceSum, valueSum] = diracPrices.reduce(
      ([priceSum, valueSum], dp) => {
        const price = dp.pricesA1.get(numerator)! /
          dp.pricesA1.get(denominator)!;
        const value = dp.valueA1;
        return [priceSum + price * value, valueSum + value];
      },
      [0, 0],
    );
    return [priceSum, valueSum]; // uninverted price = priceSum / valueSum
  }

  public swappingsFor(
    user: User,
    minBuying?: bigint,
    minSelling?: bigint,
    expLimit?: number,
  ): Swapping[] {
    // TODO consider removing the user's own pools beforehand
    const pools = [...this.pools.values()].flatMap((p) => [...p.values()]);
    // console.log("euclidState.swappingsFor pools", pools)
    // if (pools.length) {
    //   console.log(`\t\tpools: ${pools.length}`);
    // }
    return pools.flatMap((pool) =>
      pool.swappingsFor(user, minBuying, minSelling, expLimit)
    );
  }
}
