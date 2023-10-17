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
import { findForDirac } from "./actions/swapfinding/findForDirac.ts";

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
          PositiveValue.singleton(swapping.sellingAsset, swapping.sellingAmnt),
        )
        .normedMinus(
          PositiveValue.singleton(swapping.buyingAsset, swapping.buyingAmnt),
        ),
      //TODO note that the utxo is missing, this should result from the tx, which we don't have yet
    );
  };

  public swappingsFor = (
    adhereMaxInteger: boolean,
    user: User | null,
    paramUtxo: ParamUtxo,
    optimizeAmnts: boolean,
    minBuying = 1n,
    minSelling_ = 1n,
    availableSelling_?: Value, // subset of pool-assets. NOTE: Empty if infinite for any asset, -1 if infinite for a specific asset
    buyingAssets?: Assets, // for subsequent swappings we want only a single direction. Assets instead of Asset for simulator in webapp
    buyableAmnt?: bigint, // for the new subSwapA-calculator, in concert with buyingAsset.
    expLimit?: number,
  ): Swapping[] => {
    console.log("swappingsFor()");
    assert(minBuying > 0n, `minBuying <= 0n: ${minBuying}`);
    assert(minSelling_ > 0n, `minSelling_ <= 0n: ${minSelling_}`);
    return findForDirac(
      adhereMaxInteger,
      user,
      paramUtxo,
      this,
      optimizeAmnts,
      minBuying,
      minSelling_,
      availableSelling_ ?? null,
      buyingAssets ?? null,
      buyableAmnt ?? null,
      expLimit ?? null,
    );
  };

  // public swappingsFor = (
  //   adhereMaxInteger: boolean,
  //   user: User | null,
  //   paramUtxo: ParamUtxo,
  //   optimizeAmnts: boolean,
  //   minBuying = 1n,
  //   minSelling_ = 1n,
  //   availableSelling_?: Value, // subset of pool-assets. NOTE: Empty if infinite for any asset, -1 if infinite for a specific asset
  //   buyingAssets?: Assets, // for subsequent swappings we want only a single direction. Assets instead of Asset for simulator in webapp
  //   buyableAmnt?: bigint, // for the new subSwapA-calculator, in concert with buyingAsset.
  //   expLimit?: number,
  // ): Swapping[] => {
  //   console.log("swappingsFor()");
  //   assert(minBuying > 0n, `minBuying <= 0n: ${minBuying}`);
  //   assert(minSelling_ > 0n, `minSelling_ <= 0n: ${minSelling_}`);
  //   const swappings = new Array<Swapping>();
  //   let availableBuying_: PositiveValue;
  //   if (buyingAssets) {
  //     if (buyableAmnt === undefined) {
  //       availableBuying_ = this.available.ofAssets(buyingAssets);
  //     } else {
  //       const buyingAssets_ = buyingAssets.toList;
  //       assert(
  //         buyingAssets_.length === 1,
  //         `buyingAssets_.length !== 1: ${buyingAssets.show()}`,
  //       );
  //       const buyingAsset = buyingAssets_[0];
  //       availableBuying_ = PositiveValue.singleton(buyingAsset, buyableAmnt);
  //     }
  //   } else availableBuying_ = this.available;
  //   console.log("availableBuying_:", availableBuying_.concise());
  //   console.log("availableSelling_:", availableSelling_?.concise());
  //   const param = paramUtxo.param;

  //   const liquidity_ = new PositiveValue();

  //   const buyingSpot_ = new PositiveValue();
  //   const sellingSpot_ = new PositiveValue();
  //   const buyingExp_ = new Value();
  //   const sellingExp_ = new Value();
  //   const maxBuying_ = new PositiveValue();
  //   const maxSelling_ = new PositiveValue();
  //   const adherenceImpacted = new Assets();

  //   // deposit of asset into pool to move inverted amm-price a to inverted spot price s
  //   // s := a = (l + d) * w => d = (s / w) - l
  //   // const delta = (w: number, l: number) => (s: number) => (s / w) - l;
  //   // const delta = (s: number) => l * (((s / a) ** (w / (w + 1))) - 1);

  //   param.assets.forEach((asset) => {
  //     // if (asset.equals(Asset.ADA)) return; // TODO for debugging, revert
  //     const availableBuying = availableBuying_.amountOf(asset, 0n); // - getMinBalance(asset);
  //     const availableSelling = availableSelling_?.amountOf(asset, 0n);
  //     const infiniteSellable = availableSelling === undefined ||
  //       availableSelling === -1n;
  //     const minSelling = getMinSelling(asset, minSelling_);
  //     if (
  //       availableBuying < minBuying && !infiniteSellable &&
  //       availableSelling < minSelling
  //     ) {
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
  //     let buyingSpot = calcSpot(anchor, jumpSize, buyingExp);
  //     let adherenceImpacted_ = false;
  //     if (adhereMaxInteger && buyingSpot > maxInteger) {
  //       adherenceImpacted.insert(asset);
  //       adherenceImpacted_ = true;
  //       while (adhereMaxInteger && buyingSpot > maxInteger) {
  //         buyingExp--;
  //         buyingSpot = calcSpot(anchor, jumpSize, buyingExp);
  //       }
  //     }

  //     let sellingExp = BigInt(Math.ceil(exp));
  //     let sellingSpot = calcSpot(anchor, jumpSize, sellingExp);
  //     if (adhereMaxInteger && sellingSpot > maxInteger) {
  //       if (!adherenceImpacted_) {
  //         adherenceImpacted.insert(asset);
  //         adherenceImpacted_ = true;
  //       }
  //       while (adhereMaxInteger && sellingSpot > maxInteger) {
  //         sellingExp--;
  //         sellingSpot = calcSpot(anchor, jumpSize, sellingExp);
  //       }
  //     }

  //     // TODO what about this?
  //     // NOTE: inverted
  //     // assert(spot(anchor, jumpSize, buyingExp + 1n) >= amm, `buyingExp could be higher`);
  //     // assert(spot(anchor, jumpSize, sellingExp - 1n) <= amm, `sellingSpot could be lower`);
  //     // assert(buyingSpot >= anchor, `buyingSpot < anchor`); // TODO do we want that in the loop below? Do we want it at all?

  //     const delta_ = calcDelta(weight, liquidity);

  //     const foundBuyingExp = findBuyingExp(
  //       anchor,
  //       jumpSize,
  //       availableBuying,
  //       minBuying,
  //       delta_,
  //       buyingExp,
  //       expLimit,
  //     );
  //     if (foundBuyingExp) {
  //       buyingExp_.initAmountOf(asset, foundBuyingExp.buyingExp);
  //       buyingSpot_.initAmountOf(asset, foundBuyingExp.buyingSpot);
  //       maxBuying_.initAmountOf(asset, foundBuyingExp.maxBuying);
  //     }

  //     const foundSellingExp = findSellingExp(
  //       adhereMaxInteger,
  //       anchor,
  //       jumpSize,
  //       availableSelling,
  //       minSelling,
  //       delta_,
  //       sellingExp,
  //       expLimit,
  //     );
  //     if (foundSellingExp) {
  //       if (foundSellingExp === "cannotAdhere") {
  //         if (!adherenceImpacted_) {
  //           adherenceImpacted.insert(asset);
  //           adherenceImpacted_ = true;
  //         }
  //       } else {
  //         sellingExp_.initAmountOf(asset, foundSellingExp.sellingExp);
  //         sellingSpot_.initAmountOf(asset, foundSellingExp.sellingSpot);
  //         maxSelling_.initAmountOf(asset, foundSellingExp.maxSelling);
  //       }
  //     }
  //   });

  //   const sellableAssets = maxSelling_.assets.toList;
  //   const buyableAssets = maxBuying_.assets.toList;

  //   buyableAssets.forEach((buyingAsset) => {
  //     // NOTE if those become non-const again, move them into the inner loop again
  //     const buyingSpot = buyingSpot_.amountOf(buyingAsset); // NOTE: inverted
  //     const buyingExp = buyingExp_.amountOf(buyingAsset);
  //     const maxBuying = maxBuying_.amountOf(buyingAsset);
  //     const availableBuying = optimizeAmnts
  //       ? availableBuying_.amountOf(buyingAsset, 0n)
  //       : null;
  //     const adherenceImpactedBuying = adherenceImpacted.has(buyingAsset);

  //     const delta_ = optimizeAmnts
  //       ? calcDelta(
  //         param.weights.amountOf(buyingAsset),
  //         liquidity_.amountOf(buyingAsset),
  //       )
  //       : null;

  //     sellableAssets.forEach((sellingAsset) => {
  //       const sellingSpot = sellingSpot_.amountOf(sellingAsset);
  //       const sellingExp = sellingExp_.amountOf(sellingAsset);
  //       const maxSelling = maxSelling_.amountOf(sellingAsset);
  //       const minSelling = getMinSelling(sellingAsset, minSelling_);
  //       const adherenceImpacted_ = adherenceImpactedBuying ||
  //         adherenceImpacted.has(sellingAsset);

  //       const getSwappingForPair = (
  //         tmpMinBuying?: bigint,
  //       ): Swapping | null => {
  //         let buyingSpot__: bigint;
  //         let buyingExp__: bigint;
  //         let maxBuying__: bigint;
  //         if (tmpMinBuying !== undefined) {
  //           assert(availableBuying !== null, `availableBuying is null`);
  //           assert(delta_ !== null, `delta_ is null`);
  //           const foundBuyingExp__ = findBuyingExp(
  //             this.dirac.anchorPrices.amountOf(buyingAsset),
  //             param.jumpSizes.amountOf(buyingAsset),
  //             availableBuying,
  //             tmpMinBuying,
  //             delta_,
  //             buyingExp,
  //             expLimit,
  //           );
  //           if (foundBuyingExp__) {
  //             buyingExp__ = foundBuyingExp__.buyingExp;
  //             buyingSpot__ = foundBuyingExp__.buyingSpot;
  //             maxBuying__ = foundBuyingExp__.maxBuying;
  //           } else return null;
  //         } else {
  //           buyingSpot__ = buyingSpot;
  //           buyingExp__ = buyingExp;
  //           maxBuying__ = maxBuying;
  //         }

  //         return swappingForPair({
  //           adhereMaxInteger,
  //           adherenceImpacted: adherenceImpacted_,
  //           user,
  //           paramUtxo,
  //           diracUtxo: this,
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
  //           availableBuying_,
  //           availableSelling_,
  //           tmpMinBuying: tmpMinBuying ?? null,
  //           expLimit: expLimit ?? null,
  //       });
  //       };

  //       let swapping = getSwappingForPair();
  //       if (swapping) {
  //         // TODO revert
  //         if (optimizeAmnts) {
  //           let i = 0;
  //           // const availableSelling_ = Value.singleton(
  //           //   sellingAsset,
  //           //   availableSelling_?.amountOf(sellingAsset, 0n) ?? -1n,
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
  //             //   availableSelling_,
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
  //                 `found swapping with better or equal effective price (${i++}): ${maybeBetter.effectivePrice} <= ${swapping.effectivePrice}`,
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
}
