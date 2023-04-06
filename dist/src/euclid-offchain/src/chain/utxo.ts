import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../lucid.mod.js";
import { Dirac } from "../types/euclid/dirac.js";
import {
  DiracDatum,
  ParamDatum,
  PEuclidDatum,
  PPreEuclidDatum,
} from "../types/euclid/euclidDatum.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { Param } from "../types/euclid/param.js";
import { Asset } from "../types/general/derived/asset/asset.js";
import { Assets } from "../types/general/derived/asset/assets.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
import { Value } from "../types/general/derived/value/value.js";
import { Data, f, PConstanted, t } from "../types/general/fundamental/type.js";
import { min } from "../utils/generators.js";
import { Swapping } from "./actions/swapping.js";
import { Contract } from "./contract.js";
import { Pool } from "./pool.js";
import { User } from "./user.js";

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
    const spotBuying_ = new PositiveValue();
    const spotSelling_ = new PositiveValue();
    const maxBuying_ = new PositiveValue();
    const maxSelling_ = new PositiveValue();

    param.assets.forEach((asset) => {
      // console.log("asset", asset.concise())
      const virtual = param.virtual.amountOf(asset, 0n);
      const buyable = this.balance.amountOf(asset, 0n);
      const sellable = sellable_.amountOf(asset, 0n);
      const weight = param.weights.amountOf(asset); // NOTE: inverted
      const jumpSize = param.jumpSizes.amountOf(asset);
      const lowest = this.dirac.lowestPrices.amountOf(asset, 0n);

      const liquidity = buyable + virtual;
      if (liquidity <= 0n) return; // TODO reconsider if this can happen, throw error instead if not
      liquidity_.initAmountOf(asset, liquidity);
      const amm = liquidity * weight; // NOTE: inverted aka "price when selling for A0"
      assert(amm > 0n, `amm <= 0n`);
      let spotBuying = ((amm - lowest) / jumpSize) * jumpSize + lowest; // NOTE: inverted
      assert(spotBuying >= lowest, `spotBuying < lowest`); // TODO do we want that in the loop below? ("Lowest" should be rather termed "anchor")
      let spotSelling = spotBuying + jumpSize; // NOTE: inverted aka "price when selling for A0"

      const a = Number(amm);
      const w = Number(weight);
      const l = Number(liquidity);

      // console.log("amm", amm)
      // console.log("weight", weight)
      // console.log("liquidity", liquidity)

      // deposit of asset into pool to move inverted amm-price a to inverted spot price s
      const delta = (s: number) => l * (((s / a) ** (w / (w + 1))) - 1);
      // console.log("spotSelling", spotSelling)

      if (buyable > 0n) {
        while (spotBuying > 0n) {
          // console.log("spotBuying", spotBuying)

          const sb = Number(spotBuying);
          const d = delta(sb);
          const maxBuying = d === Infinity
            ? buyable
            : min(buyable, BigInt(Math.floor(-d)));

          // console.log("buyable", buyable)
          // console.log("d", d)
          // console.log("maxBuying", maxBuying)
          if (maxBuying > 0n) {
            spotBuying_.initAmountOf(asset, spotBuying);
            maxBuying_.initAmountOf(asset, maxBuying);
            break;
          } else {
            spotBuying -= jumpSize;
            // if maxBuying is 0, then d is too low, which means that
            // we are too close at the amm-price. So we ~increase~ the
            // (uninverted) price we are willing to ~buy~ at stepwise
            // until either we hit the bounds or find a d >= 1.
          }
        }
      }

      if (sellable > 0n && spotSelling > 0n) {
        while (true) {
          // console.log("spotSelling", spotBuying)

          const ss = Number(spotSelling);
          const d = delta(ss);
          const maxSelling = d === Infinity
            ? sellable
            : min(sellable, BigInt(Math.floor(d)));

          // console.log("sellable", sellable)
          // console.log("d", d)
          // console.log("maxSelling", maxSelling)
          if (maxSelling > 0n) {
            spotSelling_.initAmountOf(asset, spotSelling);
            maxSelling_.initAmountOf(asset, maxSelling);
            break;
          } else {
            spotSelling += jumpSize;
            // if maxSelling is 0, then d is too low, which means that
            // we are too close at the amm-price. So we ~decrease~ the
            // (uninverted) price we are willing to ~sell~ at stepwise
            // until we find a d >= 1.
            // NOTE/TODO: This should never result in an infite loop,
            // as decreasing uninverted selling price should eventually
            // result in some delta.
          }
        }
      }
    });

    const sellableAssets = maxSelling_.assets.toList;
    const buyableAssets = maxBuying_.assets.toList;
    sellableAssets.forEach((sellingAsset) => {
      // console.log("sellingAsset", sellingAsset.concise())
      const spotSelling = spotSelling_.amountOf(sellingAsset); // NOTE: inverted
      const maxSelling = maxSelling_.amountOf(sellingAsset);

      buyableAssets.forEach((buyingAsset) => {
        // console.log("buyingAsset", buyingAsset.concise())
        if (sellingAsset.equals(buyingAsset)) return;

        const spotBuying = spotBuying_.amountOf(buyingAsset); // NOTE: inverted
        const maxBuying = maxBuying_.amountOf(buyingAsset);

        // NOTE: below not strictly A0, but want to avoid divisions.
        // Ok, since only relative value matters. Assume it's a different A0'.
        const maxBuyingA0 = maxBuying * spotSelling;
        const maxSellingA0 = maxSelling * spotBuying;
        const maxSwapA0 = min(maxSellingA0, maxBuyingA0);

        if (maxSwapA0 < spotSelling) return; // to avoid zero buying amount
        const buyingAmount = maxSwapA0 / spotSelling;
        const sellingAmount = BigInt(
          Math.ceil(Number(maxSwapA0) / Number(spotBuying)),
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
        // console.log("swapping", swapping.show())
        swappings.push(swapping);
      });
    });

    // console.log("swappings", swappings)
    return swappings;
  };
}
