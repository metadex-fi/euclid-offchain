import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import { Dirac } from "../types/euclid/dirac.ts";
import {
  DiracDatum,
  ParamDatum,
  PEuclidDatum,
  PPreEuclidDatum,
} from "../types/euclid/euclidDatum.ts";
import { IdNFT } from "../types/euclid/idnft.ts";
import { Param } from "../types/euclid/param.ts";
import { Asset } from "../types/general/derived/asset/asset.ts";
import { Assets } from "../types/general/derived/asset/assets.ts";
import { PositiveValue } from "../types/general/derived/value/positiveValue.ts";
import { Value } from "../types/general/derived/value/value.ts";
import { Data, f, PConstanted, t } from "../types/general/fundamental/type.ts";
import { min } from "../utils/generators.ts";
import { Swapping } from "./actions/swapping.ts";
import { Contract } from "./contract.ts";
import { Pool } from "./pool.ts";
import { User } from "./user.ts";

export class ParamUtxo {
  private constructor(
    public readonly param: Param,
    public readonly paramNFT: IdNFT,
    public readonly utxo?: Lucid.UTxO, //exists only when reading, not when creating
  ) {}

  static parse(
    utxo: Lucid.UTxO,
    param: Param,
  ): ParamUtxo {
    const lovelace = Asset.ADA.toLucid();
    const assets = Object.keys(utxo.assets).filter((a) => a !== lovelace);
    assert(
      assets.length === 1,
      `expected exactly id-NFT in ${assets.toString()}`,
    );
    assert(utxo.assets[assets[0]] === 1n, `expected exactly 1 id-NFT`);
    const paramNFT = IdNFT.fromLucid(assets[0]);

    return new ParamUtxo(param, paramNFT, utxo);
  }

  static open(
    param: Param,
    paramNFT: IdNFT,
  ): ParamUtxo {
    return new ParamUtxo(param, paramNFT);
  }

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const peuclidDatum = PPreEuclidDatum.genPType(); //only need this for ParamDatum, so this is fine
    const paramDatum = peuclidDatum.pconstant(new ParamDatum(this.param));
    const paramNFT = this.paramNFT.toLucidNFT;
    // console.log(paramNFT);

    return tx
      .attachMintingPolicy(contract.mintingPolicy)
      .mintAssets(paramNFT, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
      .payToContract(
        contract.address,
        {
          inline: Data.to(paramDatum),
          scriptRef: contract.validator, // for now, for simplicities' sake
        },
        paramNFT,
      );
  };

  public sharedAssets = (assets: Assets): Assets =>
    this.param.sharedAssets(assets);

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `ParamUtxo (
  ${ttf}param: ${this.param.concise(ttf)}
  ${tt})`;
  };
}

export class PreDiracUtxo {
  public readonly balance: PositiveValue;
  constructor(
    public readonly utxo: Lucid.UTxO,
    public readonly datum: PConstanted<PEuclidDatum>,
    public readonly preDirac: Dirac,
  ) {
    const threadNFT = this.preDirac.threadNFT.toLucid;
    assert(
      utxo.assets[threadNFT] === 1n,
      `expected exactly 1 thread-NFT, got ${utxo.assets[threadNFT]}`,
    );
    this.balance = PositiveValue.fromLucid(
      utxo.assets,
      threadNFT,
    );
  }

  public parse = (
    param: Param,
  ): DiracUtxo | undefined => {
    try {
      return DiracUtxo.parse(this, param);
    } catch (_e) { // TODO log this somewhere
      return undefined;
    }
  };
}

export class DiracUtxo {
  private constructor( // keep private, because how we handle optional utxo arg
    public readonly peuclidDatum: PEuclidDatum,
    public readonly dirac: Dirac,
    public readonly balance: PositiveValue,
    public readonly utxo?: Lucid.UTxO, //exists when reading, not when creating
  ) {}

  static parse(
    from: PreDiracUtxo,
    param: Param,
  ): DiracUtxo {
    // lifting it again, to utilize the tighter constraints in PEuclidDatum
    const peuclidDatum = new PEuclidDatum(
      param,
      from.preDirac.paramNFT,
      from.preDirac.threadNFT,
    );
    const diracDatum = peuclidDatum.plift(from.datum);
    assert(diracDatum instanceof DiracDatum, `expected DiracDatum`);
    return new DiracUtxo(
      peuclidDatum,
      diracDatum.dirac,
      from.balance,
      from.utxo,
    );
  }

  static open(
    param: Param,
    dirac: Dirac,
    balance: PositiveValue,
  ): DiracUtxo {
    const peuclidDatum = new PEuclidDatum(
      param,
      dirac.paramNFT,
      dirac.threadNFT,
    );
    return new DiracUtxo(peuclidDatum, dirac, balance);
  }

  // public assets = (): Assets => this.dirac.assets;
  // public sharedAssets = (assets: Assets): Assets =>
  //   this.dirac.sharedAssets(assets);

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `DiracUtxo (
  ${ttf}dirac: ${this.dirac.concise(ttf)},
  ${ttf}balance: ${this.balance?.concise(ttf) ?? "undefined"}
  ${tt})`;
  };

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const diracDatum = this.peuclidDatum.pconstant(new DiracDatum(this.dirac));
    const funds = this.balance.toLucid;
    const threadNFT = this.dirac.threadNFT.toLucidNFT;
    funds[Object.keys(threadNFT)[0]] = 1n;

    return tx
      .mintAssets(threadNFT, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
      .payToContract(
        contract.address,
        {
          inline: Data.to(diracDatum),
        },
        funds,
      );
  };

  public swappingsFor = (
    user: User,
    pool: Pool,
    sellable: Value, // subset of pool-assets
  ): Swapping[] => {
    const swappings = new Array<Swapping>();
    const param = pool.paramUtxo.param;

    const virtual = param.virtual.unsigned; // subset of pool-assets
    const weights = param.weights.unsigned; // exact pool-assets
    const jumpSizes = param.jumpSizes.unsigned; // exact pool-assets

    const lowestPrices = this.dirac.lowestPrices.unsigned; // subset of pool-assets
    const buyable = this.balance.unsigned; // ADA + subset of pool-assets

    if (!weights.has(Asset.ADA)) {
      buyable.drop(Asset.ADA);
    }

    // exact pool-assets (at least buyable or virtual should be nonzero for each pool-asset)
    const liquidity = Value.normedAdd(virtual, buyable);

    console.log(buyable.concise());
    console.log(virtual.concise());
    console.log(liquidity.concise());

    // exact pool-assets
    const amm = Value.hadamard(liquidity, weights);

    // exact pool-assets
    const spotSelling = Value.newUnionWith(
      (
        lowest: bigint, // subset of pool-assets
        jumpSize: bigint, // exact pool-assets
        amm: bigint, // exact pool-assets
      ): bigint => ((amm - lowest) / jumpSize) * jumpSize + lowest,
      0n, // --> should never happen, removing 0n to cause errors downstream if it does
      0n, // subset of pool-assets
    )(
      lowestPrices, // subset of pool-assets
      jumpSizes, // exact pool-assets
      amm, // exact pool-assets
    );

    // exact pool-assets
    const spotBuying = Value.add(spotSelling, jumpSizes);

    // TODO those two are rather inefficient, but so is all our value-arithmetic. Consider fixing that first.
    // subset of pool-assets
    const demand = Value.newUnionWith(
      (
        sellable: bigint, // subset of pool-assets
        liquidity: bigint, // subset of pool-assets
        weight: bigint, // exact pool-assets
        spot: bigint, // exact pool-assets
        amm: bigint, // exact pool-assets
      ): bigint => {
        const demand = liquidity * (((amm / spot) ** weight) - 1n); // amm --> spot
        return min(demand, sellable);
      },
      undefined, // --> leaving non-demanded/sellable pool-assets as 0n
      0n, // subset of pool-assets
      0n, // subset of pool-assets
    )(
      sellable, // subset of pool-assets
      liquidity, // subset of pool-assets
      weights, // exact pool-assets
      spotSelling, // exact pool-assets
      amm, // exact pool-assets
    );

    // subset of pool-assets
    const offer = Value.newUnionWith(
      (
        buyable: bigint, // subset of pool-assets
        liquidity: bigint, // exact pool-assets
        weight: bigint, // exact pool-assets
        spot: bigint, // exact pool-assets
        amm: bigint, // exact pool-assets
      ): bigint => {
        const offer = liquidity * (1n - ((amm / spot) ** weight)); // amm --> spot
        return min(offer, buyable);
      },
      undefined, // --> leaving non-demanded/sellable pool-assets as 0n
      0n, // subset of pool-assets
    )(
      buyable, // subset of pool-assets
      liquidity, // exact pool-assets
      weights, // exact pool-assets
      spotBuying, // exact pool-assets
      amm, // exact pool-assets
    );

    sellable.assets.forEach((sellingAsset) => {
      const sellingDemand = demand.amountOf(sellingAsset);
      if (sellingDemand) {
        const sellingSpot = spotSelling.amountOf(sellingAsset);
        this.balance.assets.drop(sellingAsset).forEach((buyingAsset) => {
          const buyingOffer = offer.amountOf(buyingAsset);
          if (buyingOffer) {
            const buyingSpot = spotBuying.amountOf(buyingAsset);
            const swapping = Swapping.boundary(
              user,
              pool.paramUtxo,
              this,
              buyingAsset,
              sellingAsset,
              buyingOffer,
              sellingDemand,
              buyingSpot,
              sellingSpot,
            );
            swappings.push(swapping);
          }
        });
      }
    });

    return swappings;
  };
}
