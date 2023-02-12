import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import {
  AssocMap,
  Currency,
  Data,
  gMaxHashes,
  IdNFT,
  KeyHash,
  PPreDiracDatum,
} from "../mod.ts";
import { Swapping } from "./actions/swapping.ts";
import { User } from "./mod.ts";
import { Pool, PrePool } from "./pool.ts";
import { ParamUtxo, PreDiracUtxo } from "./utxo.ts";

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

  constructor(
    utxos: Lucid.UTxO[],
    policy: Currency,
  ) {
    // 1. sort utxos into prePools
    const prePools = new AssocMap<KeyHash, AssocMap<IdNFT, PrePool>>(
      (kh) => kh.show(),
    );
    const ppreDiracDatum = new PPreDiracDatum(policy);
    utxos.forEach((utxo) => {
      try {
        // TODO assert scriptref, and all the other fields if it makes sense
        assert(utxo.datum, `datum must be present`);
        const datum = Data.from(utxo.datum);
        assert(datum instanceof Lucid.Constr, `datum must be a Constr`);
        switch (datum.index) {
          case 0: {
            const paramUtxo = ParamUtxo.parse(
              utxo,
              datum.fields,
            );
            const owner = paramUtxo.param.owner;
            const paramNFT = paramUtxo.paramNFT;
            const ownerPrePools = prePools.get(owner) ??
              new AssocMap<IdNFT, PrePool>((nft) => nft.show());
            const prePool = (ownerPrePools.get(paramNFT) ?? new PrePool())
              .setParamUtxo(paramUtxo);
            ownerPrePools.set(paramNFT, prePool);
            prePools.set(owner, ownerPrePools);
            break;
          }
          case 1: {
            const preDiracUtxo = new PreDiracUtxo(
              utxo,
              datum.fields,
              ppreDiracDatum,
            );
            const owner = preDiracUtxo.dirac.owner;
            const paramNFT = preDiracUtxo.dirac.paramNFT;
            const ownerPrePools = prePools.get(owner) ??
              new AssocMap<IdNFT, PrePool>((kh) => kh.show());
            const prePool = (ownerPrePools.get(paramNFT) ?? new PrePool())
              .addPreDiracUtxo(preDiracUtxo);
            ownerPrePools.set(paramNFT, prePool);
            prePools.set(owner, ownerPrePools);
            break;
          }
          default:
            throw new Error(`invalid datum index: ${datum.index}`);
        }
      } catch (e) {
        const is = this.invalidUtxos.get(e.message) ?? [];
        is.push(utxo);
        this.invalidUtxos.set(e.message, is);
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
            invalidOwnerPools.set(paramNFT, prePool);
          }
        } else {
          misses--;
        }
        paramNFT = paramNFT.next();
      }
      this.pools.set(owner, parsedOwnerPools);
      this.invalidPools.set(owner, invalidOwnerPools);
    });
  }

  public swappingsFor(user: User): Swapping[] {
    // TODO consider removing the user's own pools beforehand
    const pools = [...this.pools.values()].flatMap((p) => [...p.values()]);
    return pools.flatMap((pool) => pool.swappingsFor(user));
  }
}
