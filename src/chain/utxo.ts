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
import { max, maxInteger, min } from "../utils/generators.ts";
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

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `PreDiracUtxo (
  ${ttf}utxo: {this.utxo.concise(ttf)}
  ${ttf}datum: {this.datum.concise(ttf)}
  ${ttf}preDirac: ${this.preDirac.concise(ttf)}
  ${tt})`;
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
    sellable_: Value, // subset of pool-assets
  ): Swapping[] => {
    const swappings = new Array<Swapping>();
    const param = pool.paramUtxo.param;

    const liquidity_ = new PositiveValue();
    const spotSelling_ = new PositiveValue();
    const spotBuying_ = new PositiveValue();
    const demand_ = new PositiveValue();
    const offer_ = new PositiveValue();

    param.assets.forEach((asset) => {
      const buyable = this.balance.amountOf(asset, 0n);
      const virtual = param.virtual.amountOf(asset, 0n);
      const weight = param.weights.amountOf(asset);
      const jumpSize = param.jumpSizes.amountOf(asset);
      const lowest = this.dirac.lowestPrices.amountOf(asset, 0n);

      const liquidity = buyable + virtual;
      if (liquidity <= 0n) return;
      liquidity_.initAmountOf(asset, liquidity);
      const amm = liquidity * weight;
      assert(amm > 0n, `amm <= 0n`);
      const spotSelling = ((amm - lowest) / jumpSize) * jumpSize + lowest;
      assert(spotSelling >= lowest, `spotSelling < lowest`);
      const spotBuying = spotSelling + jumpSize;

      const a = Number(amm);
      const w = Number(weight);
      const l = Number(liquidity);

      if (spotSelling > 0n) {
        const ss = Number(spotSelling);
        const d = l * (((a / ss) ** w) - 1); // amm --> spot
        const sellable = sellable_.amountOf(asset, 0n);
        const demand = d !== Infinity
          ? min(BigInt(Math.floor(d)), sellable)
          : sellable;
        if (demand > 0n) {
          spotSelling_.initAmountOf(asset, spotSelling);
          demand_.initAmountOf(asset, demand);
        }
      }

      const sb = Number(spotBuying);
      const o = l * (1 - ((a / sb) ** w)); // amm --> spot
      const offer = o !== Infinity
        ? min(BigInt(Math.floor(o)), buyable)
        : buyable;
      if (offer > 0n) {
        spotBuying_.initAmountOf(asset, spotBuying);
        offer_.initAmountOf(asset, offer);
      }
    });

    demand_.assets.forEach((sellingAsset) => {
      const spotSelling = spotSelling_.amountOf(sellingAsset);
      const demand = demand_.amountOf(sellingAsset);
      const demandA0 = demand * spotSelling;
      const offeredAssets = offer_.assets;
      if (offeredAssets.has(sellingAsset)) offeredAssets.drop(sellingAsset);
      offeredAssets.forEach((buyingAsset) => {
        const spotBuying = spotBuying_.amountOf(buyingAsset);
        const offer = offer_.amountOf(buyingAsset);
        const offerA0 = offer * spotBuying;
        const maxSwapA0 = min(demandA0, offerA0);
        if (maxSwapA0 >= spotBuying) {
          const buyingAmount = maxSwapA0 / spotBuying;
          const sellingAmount = BigInt(
            Math.ceil(Number(maxSwapA0) / Number(spotSelling)),
          );

          const swapping = Swapping.boundary(
            user,
            pool.paramUtxo,
            this,
            buyingAsset,
            sellingAsset,
            buyingAmount,
            sellingAmount,
            spotBuying,
            spotSelling,
          );

          assert(
            Swapping.validates(
              spotBuying,
              spotSelling,
              this.dirac.lowestPrices.amountOf(buyingAsset, 0n),
              this.dirac.lowestPrices.amountOf(sellingAsset, 0n),
              param.jumpSizes.amountOf(buyingAsset),
              param.jumpSizes.amountOf(sellingAsset),
              param.weights.amountOf(buyingAsset),
              param.weights.amountOf(sellingAsset),
              liquidity_.amountOf(buyingAsset),
              liquidity_.amountOf(sellingAsset),
              buyingAmount,
              sellingAmount,
            ),
            `invalid swap: ${swapping.show()}`,
          );

          swappings.push(swapping);
        }
      });
    });

    return swappings;
  };
}
