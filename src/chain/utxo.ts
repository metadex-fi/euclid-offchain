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
import { Swapping } from "./actions/swapping.ts";
import { Contract } from "./contract.ts";
import { User } from "./user.ts";
import { ceilDiv, max, min } from "../utils/generators.ts";
import {
  compareVariants,
  maxInteger,
  // webappExpLimit,
} from "../utils/constants.ts";
import {
  AssetOption,
  PairOptions,
} from "./actions/swapfinding6/swapsForPair.ts";

// export const getMinBalance = (asset: Asset): bigint =>
//   asset.equals(Asset.ADA) ? 10000000n : 0n; // TODO arbitary aka both excessive and edge-casing

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

  public openingTx = (
    tx: Lucid.Tx,
    contract: Contract,
    paramContainingSplit: boolean,
  ): Lucid.Tx => {
    if (paramContainingSplit) {
      const peuclidDatum = PPreEuclidDatum.genPType(); //only need this for ParamDatum, so this is fine
      const paramDatum = peuclidDatum.pconstant(new ParamDatum(this.param));
      const paramNFT = this.paramNFT.toLucidNFT;

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
    } else {
      return tx.attachMintingPolicy(contract.mintingPolicy);
    }
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

export const minAdaBalance = 10000000n; // TODO arbitary aka both excessive and edge-casing

export class DiracUtxo {
  public readonly available: PositiveValue;

  private constructor( // keep private, because how we handle optional utxo arg
    public readonly peuclidDatum: PEuclidDatum,
    public readonly dirac: Dirac,
    public readonly funds: PositiveValue,
    public utxo?: Lucid.UTxO, //exists when reading, not when creating. Not readonly because subesequent-swappings needs to set it. TODO more safety here
  ) {
    const adaBalance = funds.amountOf(Asset.ADA, 0n);
    this.available = funds.clone;
    if (0n < adaBalance) {
      if (adaBalance <= minAdaBalance) {
        this.available.drop(Asset.ADA);
      } else {
        this.available.increaseAmountOf(Asset.ADA, -minAdaBalance);
      }
    }
  }

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
    // const size = this.utxo ?
    //   utxoToCore(this.utxo).to_bytes().length  // TODO very inefficent print
    // : undefined
    return `DiracUtxo (
  ${ttf}dirac: ${this.dirac.concise(ttf)},
  ${ttf}balance: ${this.funds?.concise(ttf) ?? "undefined"},
  ${ttf}available: ${this.available?.concise(ttf) ?? "undefined"}
  ${tt})`;
    // ${ttf}utxo size: ${size ?? "undefined"}
  };

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const diracDatum = this.peuclidDatum.pconstant(new DiracDatum(this.dirac));
    const funds = this.funds.toLucid;
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

  public applySwapping = (swapping: Swapping): DiracUtxo => {
    assert(
      swapping.diracUtxo.dirac.concise() === this.dirac.concise(),
      `dirac mismatch:\n${swapping.diracUtxo.dirac.concise()}\n!==\n${this.dirac.concise()}`,
    );
    return new DiracUtxo(
      this.peuclidDatum,
      swapping.posteriorDirac,
      this.funds
        .normedPlus(
          PositiveValue.singleton(
            swapping.sellingAsset,
            swapping.option.deltaSelling,
          ),
        )
        .normedMinus(
          PositiveValue.singleton(
            swapping.buyingAsset,
            swapping.option.deltaBuying,
          ),
        ),
      //TODO note that the utxo is missing, this should result from the tx, which we don't have yet
    );
  };

  public swappingsFor = (
    user: User | null,
    paramUtxo: ParamUtxo,
    minBuying = 1n,
    minSelling = 1n,
    availableSelling?: Value, // subset of pool-assets. NOTE: Empty if infinite for any asset, -1 if infinite for a specific asset
    buyableAssets?: Assets, // for subsequent swappings we want only a single direction. Assets instead of Asset for simulator in webapp
    availableBuying?: bigint, // for the new subSwapA-calculator, in concert with buyingAsset.
    expLimit = Infinity,
  ): Swapping[] => {
    console.log("diracUtxo.swappingsFor()");
    const param = paramUtxo.param;
    const dirac = this.dirac;
    const assets = param.assets;
    const expLimit_ = expLimit ?? Infinity;
    const swappings: Swapping[] = [];
    assets.forEach((sellingAsset, sellingIndex) => {
      const virtualSelling = param.virtual.amountOf(sellingAsset);
      const weightSelling = param.weights.amountOf(sellingAsset);
      const jumpSizeSelling = param.jumpSizes.amountOf(sellingAsset);
      const anchorSelling = dirac.anchorPrices.amountOf(sellingAsset);
      const balanceSelling = this.funds.amountOf(sellingAsset, 0n);
      const availableSelling_ = availableSelling?.amountOf(sellingAsset, 0n) ??
        -1n;
      if (availableSelling_ === 0n) return;
      if (availableSelling_ !== -1n && minSelling > availableSelling_) return;
      assets.forEach((buyingAsset, buyingIndex) => {
        if (sellingIndex === buyingIndex) return;
        if (buyableAssets && !buyableAssets.has(buyingAsset)) return;
        const virtualBuying = param.virtual.amountOf(buyingAsset);
        const weightBuying = param.weights.amountOf(buyingAsset);
        const jumpSizeBuying = param.jumpSizes.amountOf(buyingAsset);
        const anchorBuying = dirac.anchorPrices.amountOf(buyingAsset);
        const balanceBuying = this.funds.amountOf(buyingAsset, 0n);
        const availableBuying_ = availableBuying ??
          this.available.amountOf(buyingAsset, 0n);
        if (minBuying > availableBuying_) return;

        const sellingOption = AssetOption.initial( // TODO don't need to repeat this in the inner loop (probably needs some fixing first)
          "selling",
          virtualSelling,
          balanceSelling,
          weightSelling,
          anchorSelling,
          jumpSizeSelling,
          minSelling,
          availableSelling_ === -1n ? "oo" : availableSelling_,
        );
        const buyingOption = AssetOption.initial( // TODO don't need to repeat this in the inner loop (probably needs some fixing first)
          "buying",
          virtualBuying,
          balanceBuying,
          weightBuying,
          anchorBuying,
          jumpSizeBuying,
          minBuying,
          availableBuying_,
        );
        const pairOptions = new PairOptions(
          buyingOption,
          sellingOption,
          expLimit_,
        );

        const option = pairOptions.bestAdheringOption;
        if (option === null) return;

        swappings.push(Swapping.boundary(
          user,
          paramUtxo,
          this,
          buyingAsset,
          sellingAsset,
          option,
          pairOptions.maxIntegerImpacted,
          expLimit,
        ));
      });
    });
    return swappings;
  };

  // public swappingsFor_ = (
  //   adhereMaxInteger: boolean,
  //   user: User | null,
  //   paramUtxo: ParamUtxo,
  //   optimizeAmnts: boolean,
  //   minBuying = 1n,
  //   minSelling_ = 1n,
  //   availableSelling_?: Value, // subset of pool-assets. NOTE: Empty if infinite for any asset, -1 if infinite for a specific asset
  //   buyableAssets?: Assets, // for subsequent swappings we want only a single direction. Assets instead of Asset for simulator in webapp
  //   availableBuying?: bigint, // for the new subSwapA-calculator, in concert with buyingAsset.
  //   expLimit?: number,
  // ): Swapping[] => {
  //   console.log("diracUtxo.swappingsFor_()");
  //   assert(minBuying > 0n, `minBuying <= 0n: ${minBuying}`);
  //   assert(minSelling_ > 0n, `minSelling_ <= 0n: ${minSelling_}`);
  //   const swappings = findForDirac({
  //     adhereMaxInteger,
  //     user,
  //     paramUtxo,
  //     diracUtxo: this,
  //     optimizeAmnts,
  //     minBuying,
  //     minSelling_,
  //     availableSelling_: availableSelling_ ?? null,
  //     buyableAssets: buyableAssets ?? null,
  //     availableBuying: availableBuying ?? null,
  //     expLimit: expLimit ?? null,
  //   });

  //   // if (compareVariants) {
  //   //   let swappings_: Swapping[];
  //   //   const ignore: string[] = [];
  //   //   if (expLimit === undefined) {
  //   //     // return swappings;
  //   //     console.log("calculating variant with oldSwappingsFor()");
  //   //     swappings_ = this.oldSwappingsFor(
  //   //       adhereMaxInteger,
  //   //       user ?? undefined,
  //   //       paramUtxo,
  //   //       optimizeAmnts,
  //   //       minBuying,
  //   //       minSelling_,
  //   //       availableSelling_,
  //   //       buyableAssets,
  //   //       availableBuying,
  //   //     );
  //   //   } else {
  //   //     return swappings;
  //   //     // if (expLimit < webappExpLimit) return swappings;
  //   //     // console.log("calculating variant with expLimit:", expLimit);
  //   //     // ignore = [
  //   //     //   "expLimit",
  //   //     //   "Exp",
  //   //     //   "Spot",
  //   //     //   "Price",
  //   //     //   "Amnt",
  //   //     //   "A0",
  //   //     //   "tmpMinBuying",
  //   //     // ]; // NOTE most of those are not irrelevant
  //   //     // swappings_ = this.swappingsFor(
  //   //     //   adhereMaxInteger,
  //   //     //   user,
  //   //     //   paramUtxo,
  //   //     //   optimizeAmnts,
  //   //     //   minBuying,
  //   //     //   minSelling_,
  //   //     //   availableSelling_,
  //   //     //   buyableAssets,
  //   //     //   availableBuying,
  //   //     //   // expLimit <- only difference
  //   //     // );
  //   //   }
  //   //   console.log("expLimit:", expLimit);
  //   //   assert(
  //   //     swappings_.length === swappings.length,
  //   //     `length mismatch:\nvariant:\n${
  //   //       swappings_.map((s) => s.show()).join("\n")
  //   //     }\nactual:\n${swappings.map((s) => s.show()).join("\n")}`,
  //   //   );
  //   //   const notFound: Swapping[] = [];
  //   //   swappings.forEach((swapping) => {
  //   //     const i = swappings_.findIndex((s) => s.equals(swapping, true, ignore));
  //   //     if (i === -1) notFound.push(swapping);
  //   //     else swappings_.splice(i, 1);
  //   //   });
  //   //   // if (expLimit !== undefined) {
  //   //   //   // NOTE this is not correct
  //   //   //   swappings_ = swappings_.filter((s) => !s.maxIntImpacted);
  //   //   // }
  //   //   assert(
  //   //     notFound.length === 0 && swappings_.length === 0,
  //   //     `swappings mismatch:\nvariant:\n${
  //   //       swappings_.map((s) => s.show()).join("\n")
  //   //     }\nactual:\n${notFound.map((s) => s.show()).join("\n")}`,
  //   //   );
  //   // }

  //   return swappings;
  // };

  // private oldSwappingsFor = (
  //   adhereMaxInteger: boolean,
  //   user: User | undefined,
  //   paramUtxo: ParamUtxo,
  //   optimizeAmnts: boolean,
  //   minBuying = 1n,
  //   minSelling_ = 1n,
  //   sellable_?: Value, // subset of pool-assets. NOTE: Empty if infinite for any asset, -1 if infinite for a specific asset
  //   buyingAssets?: Assets, // for subsequent swappings we want only a single direction. Assets instead of Asset for simulator in webapp
  //   buyableAmnt?: bigint, // for the new subSwapA-calculator, in concert with buyingAsset.
  // ): Swapping[] => {
  //   console.log("oldSwappingsFor()");
  //   assert(minBuying > 0n, `minBuying <= 0n: ${minBuying}`);
  //   assert(minSelling_ > 0n, `minSelling_ <= 0n: ${minSelling_}`);
  //   const swappings = new Array<Swapping>();
  //   let buyable_: PositiveValue;
  //   if (buyingAssets) {
  //     if (buyableAmnt === undefined) {
  //       buyable_ = this.available.ofAssets(buyingAssets);
  //     } else {
  //       const buyingAssets_ = buyingAssets.toList;
  //       assert(
  //         buyingAssets_.length === 1,
  //         `buyingAssets_.length !== 1: ${buyingAssets.show()}`,
  //       );
  //       const buyingAsset = buyingAssets_[0];
  //       buyable_ = PositiveValue.singleton(buyingAsset, buyableAmnt);
  //     }
  //   } else buyable_ = this.available;
  //   console.log("buyable_:", buyable_.concise());
  //   console.log("sellable_:", sellable_?.concise());
  //   const param = paramUtxo.param;

  //   const liquidity_ = new PositiveValue();

  //   const buyingSpot_ = new PositiveValue();
  //   const sellingSpot_ = new PositiveValue();
  //   const buyingExp_ = new Value();
  //   const sellingExp_ = new Value();
  //   const maxBuying_ = new PositiveValue();
  //   const maxSelling_ = new PositiveValue();
  //   const maxIntImpacted = new Assets();

  //   // deposit of asset into pool to move inverted amm-price a to inverted spot price s
  //   // s := a = (l + d) * w => d = (s / w) - l
  //   // const delta = (w: number, l: number) => (s: number) => (s / w) - l;
  //   // const delta = (s: number) => l * (((s / a) ** (w / (w + 1))) - 1);

  //   const getMinSelling = (
  //     asset: Asset,
  //     minSelling: bigint | null,
  //   ): bigint => max(minSelling ?? 1n, asset.equals(Asset.ADA) ? 1000000n : 1n); // TODO arbitary aka both excessive and edge-casing

  //   param.assets.forEach((asset) => {
  //     // if (asset.equals(Asset.ADA)) return; // TODO for debugging, revert
  //     const buyable = buyable_.amountOf(asset, 0n); // - getMinBalance(asset);
  //     const sellable = sellable_?.amountOf(asset, 0n);
  //     const infiniteSellable = sellable === undefined || sellable === -1n;
  //     const minSelling = getMinSelling(asset, minSelling_);
  //     if (buyable < minBuying && !infiniteSellable && sellable < minSelling) {
  //       return;
  //     }

  //     const virtual = param.virtual.amountOf(asset);
  //     const weight = param.weights.amountOf(asset); // NOTE: inverted
  //     const jumpSize = param.jumpSizes.amountOf(asset);
  //     const anchor = this.dirac.anchorPrices.amountOf(asset); // NOTE: inverted aka "price when selling for A0"

  //     const liquidity = virtual + this.funds.amountOf(asset, 0n);
  //     if (liquidity <= 0n) return; // TODO reconsider if this can happen, throw error instead if not
  //     liquidity_.initAmountOf(asset, liquidity);

  //     const amm = liquidity * weight; // NOTE: inverted aka "price when selling for A0"
  //     assert(amm > 0n, `amm <= 0n`);

  //     const jumpMultiplier = (Number(jumpSize) + 1) / Number(jumpSize);
  //     const exp = calcExp(Number(anchor), Number(amm), jumpMultiplier);

  //     let buyingExp = BigInt(Math.floor(exp));
  //     let buyingSpot = calcSpot(anchor, jumpSize)(buyingExp);
  //     let maxIntImpacted_ = false;
  //     if (adhereMaxInteger && buyingSpot > maxInteger) {
  //       maxIntImpacted.insert(asset);
  //       maxIntImpacted_ = true;
  //       while (adhereMaxInteger && buyingSpot > maxInteger) {
  //         buyingExp--;
  //         buyingSpot = calcSpot(anchor, jumpSize)(buyingExp);
  //       }
  //     }

  //     let sellingExp = BigInt(Math.ceil(exp));
  //     let sellingSpot = calcSpot(anchor, jumpSize)(sellingExp);
  //     if (adhereMaxInteger && sellingSpot > maxInteger) {
  //       if (!maxIntImpacted_) {
  //         maxIntImpacted.insert(asset);
  //         maxIntImpacted_ = true;
  //       }
  //       while (adhereMaxInteger && sellingSpot > maxInteger) {
  //         sellingExp--;
  //         sellingSpot = calcSpot(anchor, jumpSize)(sellingExp);
  //       }
  //     }

  //     // TODO what about this?
  //     // NOTE: inverted
  //     // assert(spot(anchor, jumpSize, buyingExp + 1n) >= amm, `buyingExp could be higher`);
  //     // assert(spot(anchor, jumpSize, sellingExp - 1n) <= amm, `sellingSpot could be lower`);
  //     // assert(buyingSpot >= anchor, `buyingSpot < anchor`); // TODO do we want that in the loop below? Do we want it at all?

  //     const delta_ = calcDelta(weight, liquidity);

  //     if (buyable >= minBuying) {
  //       while (buyingSpot > 0n) {
  //         const d = delta_(buyingSpot);
  //         const maxBuying = min(buyable, -d);
  //         // console.log(`
  //         //   buyable: ${buyable}
  //         //   d: ${d}
  //         //   maxBuying: ${maxBuying}
  //         // `);

  //         if (maxBuying >= minBuying) {
  //           buyingSpot_.initAmountOf(asset, buyingSpot);
  //           buyingExp_.initAmountOf(asset, buyingExp);
  //           maxBuying_.initAmountOf(asset, maxBuying);
  //           break;
  //         } else {
  //           buyingExp--;
  //           buyingSpot = calcSpot(anchor, jumpSize)(buyingExp);
  //           // if maxBuying is 0, then d is too low, which means that
  //           // we are too close at the amm-price. So we ~increase~ the
  //           // (uninverted) price we are willing to ~buy~ at stepwise
  //           // until either we hit the bounds or find a d >= 1.
  //         }
  //       }
  //     }

  //     if ((infiniteSellable || sellable >= minSelling) && sellingSpot > 0n) {
  //       while (true) {
  //         const d = delta_(sellingSpot);
  //         const maxSelling = infiniteSellable ? d : min(sellable, d);
  //         if (maxSelling >= minSelling) {
  //           sellingSpot_.initAmountOf(asset, sellingSpot);
  //           sellingExp_.initAmountOf(asset, sellingExp);
  //           maxSelling_.initAmountOf(asset, maxSelling);
  //           break;
  //         } else {
  //           sellingExp++;
  //           sellingSpot = calcSpot(anchor, jumpSize)(sellingExp);
  //           // if maxSelling is 0, then d is too low, which means that
  //           // we are too close at the amm-price. So we ~decrease~ the
  //           // (uninverted) price we are willing to ~sell~ at stepwise
  //           // until we hit the bounds or find a d >= 1.
  //           // NOTE/TODO: This should never result in an infite loop,
  //           // as decreasing uninverted selling price should eventually
  //           // result in some delta.
  //           if (adhereMaxInteger && sellingSpot > maxInteger) {
  //             // below is probably wrong, because we are in this case not even adding this one to sellable assets
  //             // if (!maxIntImpacted_) {
  //             //   maxIntImpacted.insert(asset);
  //             //   maxIntImpacted_ = true;
  //             // }
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   });

  //   const sellableAssets = maxSelling_.assets.toList;
  //   const buyableAssets = maxBuying_.assets.toList;

  //   buyableAssets.forEach((buyingAsset) => {
  //     // NOTE if those become non-const again, move them into the inner loop again
  //     // const buyingSpot = buyingSpot_.amountOf(buyingAsset); // NOTE: inverted
  //     // const buyingExp = buyingExp_.amountOf(buyingAsset);
  //     // const maxBuying = maxBuying_.amountOf(buyingAsset);
  //     const maxIntImpactedBuying = maxIntImpacted.has(buyingAsset);

  //     sellableAssets.forEach((sellingAsset) => {
  //       const buyingSpot = buyingSpot_.amountOf(buyingAsset);
  //       const sellingSpot = sellingSpot_.amountOf(sellingAsset);

  //       const buyingExp = buyingExp_.amountOf(buyingAsset);
  //       const sellingExp = sellingExp_.amountOf(sellingAsset);

  //       const buyable = buyable_.amountOf(buyingAsset, 0n);
  //       const maxBuying = maxBuying_.amountOf(buyingAsset);
  //       const maxSelling = maxSelling_.amountOf(sellingAsset);

  //       const minSelling = getMinSelling(sellingAsset, minSelling_);
  //       let maxIntImpacted_ = maxIntImpactedBuying ||
  //         maxIntImpacted.has(sellingAsset);

  //       const getSwappingForPair = (tmpMinBuying?: bigint): Swapping | null => {
  //         let buyingSpot__: bigint;
  //         let buyingExp__: bigint;
  //         let maxBuying__: bigint | undefined;
  //         if (tmpMinBuying !== undefined) {
  //           // TODO this is just copypaste from above, with slight adjustments. Clean it up some time
  //           if (buyable >= tmpMinBuying) {
  //             const weight = param.weights.amountOf(buyingAsset); // NOTE: inverted
  //             const jumpSize = param.jumpSizes.amountOf(buyingAsset);
  //             const anchor = this.dirac.anchorPrices.amountOf(buyingAsset); // NOTE: inverted aka "price when selling for A0"
  //             const liquidity = liquidity_.amountOf(buyingAsset);
  //             const amm = liquidity * weight; // NOTE: inverted aka "price when selling for A0"
  //             const jumpMultiplier = (Number(jumpSize) + 1) / Number(jumpSize);
  //             const exp = calcExp(
  //               Number(anchor),
  //               Number(amm),
  //               jumpMultiplier,
  //             );
  //             buyingExp__ = BigInt(Math.floor(exp));
  //             buyingSpot__ = calcSpot(anchor, jumpSize)(buyingExp__);
  //             if (adhereMaxInteger && buyingSpot__ > maxInteger) {
  //               maxIntImpacted_ = true;
  //               while (adhereMaxInteger && buyingSpot__ > maxInteger) {
  //                 buyingExp__--;
  //                 buyingSpot__ = calcSpot(anchor, jumpSize)(buyingExp__);
  //               }
  //             }

  //             const delta_ = calcDelta(weight, liquidity);
  //             while (buyingSpot__ > 0n) {
  //               const d = delta_(buyingSpot__);
  //               maxBuying__ = min(buyable, -d);
  //               if (maxBuying__ >= tmpMinBuying) {
  //                 break;
  //               } else {
  //                 buyingExp__--;
  //                 buyingSpot__ = calcSpot(anchor, jumpSize)(buyingExp__);
  //               }
  //             }
  //             if (maxBuying__ === undefined) return null;
  //           } else return null;
  //         } else {
  //           buyingSpot__ = buyingSpot;
  //           buyingExp__ = buyingExp;
  //           maxBuying__ = maxBuying;
  //         }

  //         return this.swappingForPair(
  //           adhereMaxInteger,
  //           maxIntImpacted_,
  //           user,
  //           paramUtxo,
  //           buyingAsset,
  //           sellingAsset,
  //           buyingSpot__,
  //           sellingSpot,
  //           buyingExp__,
  //           sellingExp,
  //           minBuying,
  //           minSelling,
  //           maxBuying__,
  //           maxSelling,
  //           liquidity_,
  //           buyable_,
  //           sellable_,
  //           tmpMinBuying,
  //         );
  //       };
  //       let swapping = getSwappingForPair();
  //       if (swapping) {
  //         if (optimizeAmnts) {
  //           let i = 0;
  //           // const sellable__ = Value.singleton(
  //           //   sellingAsset,
  //           //   sellable_?.amountOf(sellingAsset, 0n) ?? -1n,
  //           // );
  //           // const buyableAssets_ = Assets.singleton(buyingAsset);
  //           while (true) {
  //             console.log(`trying to find better effective price (${i})`);
  //             const tmpMinBuying: bigint = swapping.buyingAmnt + 1n;
  //             const maybeBetterFast = getSwappingForPair(tmpMinBuying);
  //             // NOTE don't delete below, it's for asserting that the fast and slow version are equivalent
  //             // const maybeBetters: Swapping[] = this.swappingsFor(
  //             //   user,
  //             //   paramUtxo,
  //             //   false,
  //             //   tmpMinBuying,
  //             //   minSelling,
  //             //   sellable__,
  //             //   buyableAssets_,
  //             //   buyableAmnt,
  //             // );
  //             // console.log(`maybeBetters: ${maybeBetters.length}`);
  //             // assert(
  //             //   maybeBetters.length <= 1,
  //             //   `maybeBetters.length must be <= 1, but got:\n${
  //             //     maybeBetters.map((s) => s.show()).join("\n")
  //             //   }`,
  //             // );
  //             // let maybeBetterSlow: Swapping | null = maybeBetters?.length
  //             //   ? maybeBetters[0]
  //             //   : null;
  //             // maybeBetterSlow = maybeBetterSlow
  //             //   ? Swapping.boundary(
  //             //     user,
  //             //     paramUtxo,
  //             //     this,
  //             //     buyingAsset,
  //             //     sellingAsset,
  //             //     maybeBetterSlow.buyingAmnt,
  //             //     maybeBetterSlow.sellingAmnt,
  //             //     maybeBetterSlow.buyingSpot,
  //             //     maybeBetterSlow.sellingSpot,
  //             //     maybeBetterSlow.buyingExp,
  //             //     maybeBetterSlow.sellingExp,
  //             //     minBuying,
  //             //     minSelling,
  //             //     tmpMinBuying,
  //             //   )
  //             //   : null;
  //             // console.log(`maybeBetterSlow: ${maybeBetterSlow?.show()}`);
  //             // assert(
  //             //   maybeBetterSlow?.show() === maybeBetterFast?.show(),
  //             //   `maybeBetterSlow !== maybeBetterFast:\n${maybeBetterSlow?.show()}\n!==\n${maybeBetterFast?.show()}`,
  //             // );
  //             // const maybeBetter = maybeBetterSlow;
  //             const maybeBetter = maybeBetterFast;
  //             if (
  //               maybeBetter &&
  //               maybeBetter.effectivePrice <= swapping.effectivePrice
  //             ) {
  //               console.log(
  //                 `found swapping with better effective price (${i++}): ${maybeBetter.effectivePrice} <= ${swapping.effectivePrice}`,
  //               );
  //               swapping = maybeBetter;
  //             } else break;
  //           }
  //         }
  //         swappings.push(swapping);
  //       }
  //     });
  //   });

  //   // console.log("swappings", swappings)
  //   return swappings;
  // };

  // private swappingForPair = (
  //   adhereMaxInteger: boolean,
  //   maxIntImpacted: boolean,
  //   user: User | undefined,
  //   paramUtxo: ParamUtxo,
  //   buyingAsset: Asset,
  //   sellingAsset: Asset,
  //   buyingSpot: bigint,
  //   sellingSpot: bigint,
  //   buyingExp: bigint,
  //   sellingExp: bigint,
  //   minBuying_: bigint,
  //   minSelling: bigint,
  //   maxBuying: bigint,
  //   maxSelling: bigint,
  //   liquidity_: PositiveValue,
  //   buyable_: PositiveValue,
  //   sellable_?: Value,
  //   tmpMinBuying?: bigint,
  // ): Swapping | null => {
  //   if (sellingAsset.equals(buyingAsset)) return null;
  //   console.log(`
  //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //     buyingAsset: ${buyingAsset.show()}
  //     sellingAsset: ${sellingAsset.show()}
  //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //   `);
  //   const param = paramUtxo.param;

  //   // NOTE: below not strictly A0, but want to avoid divisions.
  //   // Ok, since only relative value matters. Assume it's a different A0', derived from:
  //   //  const maxBuyingA0 = (maxBuying / buyingSpot) * (sellingSpot * buyingSpot);
  //   //  const maxSellingA0 = (maxSelling / sellingSpot) * (sellingSpot * buyingSpot);
  //   //  (sellingSpot * buyingSpot) are the same for both and added so we can remove divisions.

  //   // const minSelling = tmpMinSelling ?? minSelling_;
  //   const minBuying = tmpMinBuying ?? minBuying_;
  //   assert(
  //     minBuying <= maxBuying,
  //     `minBuying > maxBuying: ${minBuying} > ${maxBuying}`,
  //   );
  //   assert(
  //     minSelling <= maxSelling,
  //     `minSelling > maxSelling: ${minSelling} > ${maxSelling}`,
  //   );
  //   // if (minBuying > maxBuying) return null;
  //   let maxBuyingA0 = -1n;
  //   let maxSellingA0 = -1n;
  //   let maxSwapA0 = -1n;
  //   let buyingAmount = -1n;
  //   let sellingAmount = -1n;
  //   let _limitReached = "none";
  //   let increaseExpSelling = (_by: bigint) => {};
  //   let increaseExpBuying = (_by: bigint) => {};

  //   const updateValues = () => {
  //     const newMaxBuyingA0 = maxBuying * sellingSpot;
  //     const newMaxSellingA0 = maxSelling * buyingSpot;
  //     const newMaxSwapA0 = min(newMaxSellingA0, newMaxBuyingA0);

  //     // NOTE this fails iff trying to find better effective price
  //     assert(
  //       newMaxSwapA0 >= maxSwapA0,
  //       `maxSwapA0 was decreased:
  //           ${newMaxSwapA0} < ${maxSwapA0}
  //           diff: ${newMaxSwapA0 - maxSwapA0}
  //           maxBuyingA0: ${maxBuyingA0} -> ${newMaxBuyingA0}
  //           maxSellingA0: ${maxSellingA0} -> ${newMaxSellingA0}
  //       `,
  //     );

  //     const newBuyingAmount = newMaxSwapA0 / sellingSpot;
  //     let newSellingAmount = ceilDiv(
  //       newBuyingAmount * sellingSpot,
  //       buyingSpot,
  //     );

  //     if (newSellingAmount < minSelling && minSelling <= maxSelling) {
  //       newSellingAmount = minSelling;
  //     }

  //     maxSwapA0 = newMaxSwapA0;
  //     maxBuyingA0 = newMaxBuyingA0;
  //     maxSellingA0 = newMaxSellingA0;
  //     buyingAmount = newBuyingAmount;
  //     sellingAmount = newSellingAmount;
  //   };

  //   updateValues();

  //   if (buyingAmount < minBuying || sellingAmount < minSelling) {
  //     console.log("looping");
  //     // return;
  //     // TODO marginal efficiency gains possible here by initialzing only JIT
  //     const sellingAnchor = this.dirac.anchorPrices.amountOf(sellingAsset);
  //     const buyingAnchor = this.dirac.anchorPrices.amountOf(buyingAsset);

  //     const sellingJumpSize = param.jumpSizes.amountOf(sellingAsset);
  //     const buyingJumpSize = param.jumpSizes.amountOf(buyingAsset);

  //     const buyable = buyable_.amountOf(buyingAsset, 0n); // - getMinBalance(buyingAsset);
  //     const sellable = sellable_?.amountOf(sellingAsset, 0n);
  //     const infiniteSellable = sellable === undefined || sellable === -1n;
  //     if (
  //       buyable <= 0n || (!infiniteSellable && sellable < minSelling)
  //     ) return null;

  //     const deltaSelling = calcDelta(
  //       param.weights.amountOf(sellingAsset),
  //       liquidity_.amountOf(sellingAsset),
  //     );
  //     const deltaBuying = calcDelta(
  //       param.weights.amountOf(buyingAsset),
  //       liquidity_.amountOf(buyingAsset),
  //     );

  //     increaseExpSelling = (by: bigint) => {
  //       sellingExp += by;
  //       const newSpotSelling = calcSpot(
  //         sellingAnchor,
  //         sellingJumpSize,
  //       )(
  //         sellingExp,
  //       );
  //       // console.log(
  //       //   `increaseExpSelling: ${sellingExp - by} + ${by} = ${sellingExp}`,
  //       // );
  //       // console.log(`newSpotSelling: ${sellingSpot} -> ${newSpotSelling}`);
  //       sellingSpot = newSpotSelling;
  //     };

  //     increaseExpBuying = (by: bigint) => {
  //       buyingExp += by;
  //       const newSpotBuying = calcSpot(
  //         buyingAnchor,
  //         buyingJumpSize,
  //       )(
  //         buyingExp,
  //       );
  //       // console.log(
  //       //   `increaseExpBuying: ${buyingExp - by} + ${by} = ${buyingExp}`,
  //       // );
  //       // console.log(`newSpotBuying: ${buyingSpot} -> ${newSpotBuying}`);
  //       buyingSpot = newSpotBuying;
  //     };

  //     let sellingLimit = false;
  //     let buyingLimit = false;
  //     while (buyingAmount < minBuying || sellingAmount < minSelling) {
  //       // console.log(`
  //       //   minBuying:     ${minBuying}
  //       //   minSelling:    ${minSelling}
  //       //   maxBuying:     ${maxBuying}
  //       //   maxSelling:    ${maxSelling}
  //       //   maxBuyingA0:   ${maxBuyingA0}
  //       //   maxSellingA0:  ${maxSellingA0}
  //       //   maxSwapA0:     ${maxSwapA0}
  //       //   buyingSpot:    ${buyingSpot}
  //       //   sellingSpot:   ${sellingSpot}
  //       //   buyingExp:     ${buyingExp}
  //       //   sellingExp:    ${sellingExp}
  //       //   buyingAmount:  ${buyingAmount}
  //       //   sellingAmount: ${sellingAmount}
  //       //   sellingLimit:  ${sellingLimit}
  //       //   buyingLimit:   ${buyingLimit}
  //       //   limitReached:  ${_limitReached}
  //       //   `);

  //       if (maxSellingA0 <= maxBuyingA0) {
  //         if (sellingLimit) return null;
  //         // assert(!sellingLimit, `sellingLimit reached already`);
  //         increaseExpSelling(1n);
  //         if (adhereMaxInteger && sellingSpot > maxInteger) {
  //           // console.log(
  //           //   `sellingSpot > maxInteger: ${sellingSpot} > ${maxInteger}`,
  //           // );
  //           increaseExpSelling(-1n);
  //           sellingLimit = true;
  //           _limitReached = "selling";
  //           maxIntImpacted = true;
  //         } else {
  //           const d = deltaSelling(sellingSpot);
  //           // console.log(`deltaSelling: ${d}`);
  //           let newMaxSelling;
  //           if (!infiniteSellable) {
  //             if (sellable <= d) {
  //               newMaxSelling = sellable;
  //               // console.log(
  //               //   `sellingLimit reached - sellable <= d: ${sellable} <= ${d}`,
  //               // );
  //               sellingLimit = true;
  //               _limitReached = "selling";
  //             } else {
  //               newMaxSelling = d;
  //             }
  //           } else {
  //             newMaxSelling = d;
  //           }
  //           assert(
  //             newMaxSelling >= maxSelling,
  //             `maxSelling was decreased:
  //             ${newMaxSelling} < ${maxSelling}
  //             diff: ${newMaxSelling - maxSelling}`,
  //           );
  //           maxSelling = newMaxSelling;
  //         }
  //       } else {
  //         if (buyingLimit) return null;
  //         // assert(!buyingLimit, `buyingLimit reached already`);
  //         // NOTE this fails iff trying to find better effective price
  //         assert(
  //           minSelling > 1n,
  //           `only expecting this branch when minSelling > 1n`,
  //         );
  //         increaseExpBuying(-1n);
  //         const d = -deltaBuying(buyingSpot);
  //         // console.log(`-deltaBuying: ${d}`);
  //         let newMaxBuying;
  //         if (buyable <= d) {
  //           newMaxBuying = buyable;
  //           // console.log(
  //           //   `buyingLimit reached - buyable <= d: ${buyable} <= ${d}`,
  //           // );
  //           buyingLimit = true;
  //           _limitReached = "buying";
  //         } else {
  //           newMaxBuying = d;
  //         }
  //         assert(
  //           newMaxBuying >= maxBuying,
  //           `maxBuying was decreased:
  //           ${newMaxBuying} <= ${maxBuying}
  //           diff: ${newMaxBuying - maxBuying}`,
  //         );
  //         maxBuying = newMaxBuying;
  //       }

  //       updateValues();
  //     }
  //   } //else console.log("not looping")

  //   console.log(`
  //     ---------------------------
  //     minBuying:     ${minBuying}
  //     minSelling:    ${minSelling}
  //     maxBuying:     ${maxBuying}
  //     maxSelling:    ${maxSelling}
  //     maxBuyingA0:   ${maxBuyingA0}
  //     maxSellingA0:  ${maxSellingA0}
  //     maxSwapA0:     ${maxSwapA0}
  //     buyingSpot:    ${buyingSpot}
  //     sellingSpot:   ${sellingSpot}
  //     buyingExp:     ${buyingExp}
  //     sellingExp:    ${sellingExp}
  //     buyingAmount:  ${buyingAmount}
  //     sellingAmount: ${sellingAmount}
  //     ---------------------------
  //   `);
  //   // const sellingAmount = maxSellingA0 <= maxBuyingA0 ? maxSelling : BigInt(sellingAmount_);

  //   // /// logging/debugging

  //   // const buyingJs = param.jumpSizes.amountOf(buyingAsset);
  //   // const sellingJs = param.jumpSizes.amountOf(sellingAsset);
  //   // const buyingAnchor = this.dirac.anchorPrices.amountOf(buyingAsset);
  //   // const sellingAnchor = this.dirac.anchorPrices.amountOf(sellingAsset);

  //   // const buyingJumpMultiplier = (Number(buyingJs) + 1) / Number(buyingJs);
  //   // const sellingJumpMultiplier = (Number(sellingJs) + 1) /
  //   //   Number(sellingJs);
  //   // const ammBuying = liquidity_.amountOf(buyingAsset) *
  //   //   param.weights.amountOf(buyingAsset);
  //   // const ammSelling = liquidity_.amountOf(sellingAsset) *
  //   //   param.weights.amountOf(sellingAsset);
  //   // const buyingExp = Math.log(Number(ammBuying) / Number(buyingAnchor)) /
  //   //   Math.log(buyingJumpMultiplier);
  //   // const sellingExp =
  //   //   Math.log(Number(ammSelling) / Number(sellingAnchor)) /
  //   //   Math.log(sellingJumpMultiplier);

  //   // console.log(
  //   //   `buyingExp: ${buyingExp} -> ${buyingExp}, sellingExp: ${sellingExp} -> ${sellingExp}`,
  //   // );

  //   // /// end logging/debugging

  //   // TODO better solution than this
  //   // if (buyingSpot > maxInteger) return;
  //   // if (sellingSpot > maxInteger) return;

  //   const swapping = Swapping.boundary(
  //     adhereMaxInteger,
  //     maxIntImpacted,

  //     user ?? null,
  //     paramUtxo,
  //     this,
  //     buyingAsset,
  //     sellingAsset,
  //     buyingAmount,
  //     sellingAmount,
  //     buyingSpot,
  //     sellingSpot,
  //     buyingExp,
  //     sellingExp,
  //     buyable_.amountOf(buyingAsset),
  //     sellable_?.amountOf(sellingAsset) ??
  //       (user ? user.availableBalance!.amountOf(sellingAsset) : -1n),
  //     minBuying_,
  //     minSelling,
  //     tmpMinBuying ?? null,
  //   );

  //   return swapping;
  //   // swappings.push(swapping);
  // };
}
