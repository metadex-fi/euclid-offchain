import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import {
  Assets,
  Data,
  Dirac,
  DiracDatum,
  f,
  IdNFT,
  min,
  Param,
  ParamDatum,
  PConstanted,
  PDiracDatum,
  PositiveValue,
  PParamDatum,
  PPreDiracDatum,
  t,
  Value,
} from "../mod.ts";
import { Swapping } from "./actions/swapping.ts";
import { Contract, Pool, User } from "./mod.ts";

export class ParamUtxo {
  private constructor(
    public readonly param: Param,
    public readonly paramNFT: IdNFT,
    public readonly utxo?: Lucid.UTxO, //exists only when reading, not when creating
  ) {}

  static parse(
    utxo: Lucid.UTxO,
    fields: Data[],
  ): ParamUtxo {
    const param = PParamDatum.ptype.plift(fields).param;
    const balance = PositiveValue.fromLucid(
      utxo.assets,
    );
    assert(
      balance.size === 1n,
      `expected exactly id-NFT in ${balance.concise()}`,
    );
    const paramNFT = IdNFT.fromAsset(balance.headAsset);

    return new ParamUtxo(param, paramNFT, utxo);
  }

  static open(
    param: Param,
    paramNFT: IdNFT,
  ): ParamUtxo {
    return new ParamUtxo(param, paramNFT);
  }

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(this.param));
    const paramNFT = this.paramNFT.toLucidNFT();

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
  public readonly dirac: Dirac;
  public readonly balance: PositiveValue;
  constructor(
    public readonly utxo: Lucid.UTxO,
    public readonly fields: Data[],
    ppreDiracDatum: PPreDiracDatum,
  ) {
    this.dirac = ppreDiracDatum.plift(fields).dirac;
    this.balance = PositiveValue.fromLucid(
      utxo.assets,
    );
    this.balance.popIdNFT(this.dirac.threadNFT);
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
    public readonly dirac: Dirac,
    public readonly balance: PositiveValue,
    public readonly datum: PConstanted<PDiracDatum>,
    public readonly utxo?: Lucid.UTxO, //exists when reading, not when creating
  ) {}

  static parse(
    from: PreDiracUtxo,
    param: Param,
  ): DiracUtxo {
    const pdiracDatum = new PDiracDatum(
      param,
      from.dirac.paramNFT,
      from.dirac.threadNFT,
    );
    const dirac = pdiracDatum.plift(from.fields).dirac;
    return new DiracUtxo(dirac, from.balance, from.fields, from.utxo);
  }

  static open(
    param: Param,
    dirac: Dirac,
    balance: PositiveValue,
  ): DiracUtxo {
    const pdiracDatum = new PDiracDatum(param, dirac.paramNFT, dirac.threadNFT);
    const datum = pdiracDatum.pconstant(new DiracDatum(dirac));
    return new DiracUtxo(dirac, balance, datum);
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

  public swappingsFor = (
    user: User,
    pool: Pool,
    sellable: Value,
  ): Swapping[] => {
    const swappings = new Array<Swapping>();
    const param = pool.paramUtxo.param;
    const buyable = this.balance.unsigned;
    const virtual = param.virtual.unsigned;
    const weights = param.weights.unsigned;
    const jumpSizes = param.jumpSizes.unsigned;
    const lowestPrices = this.dirac.lowestPrices.unsigned;

    const amm = Value.newUnionWith(
      (
        buyable: bigint,
        virtual: bigint,
        weight: bigint,
      ): bigint => (buyable + virtual) * weight,
      0n,
      0n,
      0n,
    )( // TODO consider what happens if 0n
      buyable,
      virtual,
      weights,
    );
    const spotBuying = Value.newUnionWith((
      amm: bigint,
      lowest: bigint,
      jumpSize: bigint,
    ): bigint => (((amm - lowest) / jumpSize) + 1n) * jumpSize + lowest)(
      amm,
      lowestPrices,
      jumpSizes,
    );
    const spotSelling = Value.newUnionWith((
      amm: bigint,
      lowest: bigint,
      jumpSize: bigint,
    ): bigint => ((amm - lowest) / jumpSize) * jumpSize + lowest)(
      amm,
      lowestPrices,
      jumpSizes,
    );

    // TODO those two are rather inefficient, but so is all our value-arithmetic. Consider fixing that first.
    const demand = Value.newUnionWith(
      (
        sellable: bigint,
        buyable: bigint,
        virtual: bigint,
        weight: bigint,
        spot: bigint,
        amm: bigint,
      ): bigint => {
        const liquidity = buyable + virtual;
        const demand = liquidity * (((amm / spot) ** weight) - 1n); // amm --> spot
        return min(demand, sellable);
      },
      0n,
      0n,
      0n,
      0n,
    )(
      sellable,
      buyable,
      virtual,
      weights,
      spotSelling,
      amm,
    );

    const offer = Value.newUnionWith(
      (
        buyable: bigint,
        virtual: bigint,
        weight: bigint,
        spot: bigint,
        amm: bigint,
      ): bigint => {
        const liquidity = buyable + virtual;
        const offer = liquidity * (1n - ((amm / spot) ** weight)); // amm --> spot
        return min(offer, buyable);
      },
      0n,
      0n,
      0n,
    )(
      buyable,
      virtual,
      weights,
      spotBuying,
      amm,
    );

    sellable.assets.forEach((sellingAsset) => {
      const sellingDemand = demand.amountOf(sellingAsset);
      const sellingSpot = spotSelling.amountOf(sellingAsset);
      this.balance.assets.drop(sellingAsset).forEach((buyingAsset) => {
        const buyingSpot = spotBuying.amountOf(buyingAsset);
        const buyingOffer = offer.amountOf(buyingAsset);
        const swapping = Swapping.limit(
          user,
          this,
          buyingAsset,
          sellingAsset,
          buyingOffer,
          sellingDemand,
          buyingSpot,
          sellingSpot,
        );
        swappings.push(swapping);
      });
    });

    return swappings;
  };

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    assert(
      this.datum !== undefined,
      "DiracUtxo.openingTx: datum must be defined",
    );
    const funds = this.balance.toLucid;
    const threadNFT = this.dirac.threadNFT.toLucidNFT();
    funds[Object.keys(threadNFT)[0]] = 1n;

    return tx
      .mintAssets(threadNFT, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
      .payToContract(
        contract.address,
        {
          inline: Data.to(this.datum),
        },
        funds,
      );
  };
}
