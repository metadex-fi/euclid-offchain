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
import { ceilDiv, min } from "../utils/generators.ts";
import { Swapping } from "./actions/swapping.ts";
import { Contract } from "./contract.ts";
import { User } from "./user.ts";
import { utxoToCore } from "https://deno.land/x/lucid@0.10.7/mod.ts";

// TODO minimum deposit of 1 ADA is rather the guess
const getMinAda = (asset: Asset): bigint => asset.equals(Asset.ADA) ? 1000000n : 0n;
export const getMinBuying = (asset: Asset): bigint => getMinAda(asset) || 1n;

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

export class DiracUtxo {
  private constructor( // keep private, because how we handle optional utxo arg
    public readonly peuclidDatum: PEuclidDatum,
    public readonly dirac: Dirac,
    public readonly balance: PositiveValue,
    public utxo?: Lucid.UTxO, //exists when reading, not when creating. Not readonly because subesequent-swappings needs to set it. TODO more safety here
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
    // const size = this.utxo ?
    //   utxoToCore(this.utxo).to_bytes().length  // TODO very inefficent print 
    // : undefined
    return `DiracUtxo (
  ${ttf}dirac: ${this.dirac.concise(ttf)},
  ${ttf}balance: ${this.balance?.concise(ttf) ?? "undefined"}
  ${tt})`;
  // ${ttf}utxo size: ${size ?? "undefined"}
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

  public applySwapping = (swapping: Swapping): DiracUtxo => {
    return new DiracUtxo(
      this.peuclidDatum,
      this.dirac,
      this.balance
        .normedPlus(
          PositiveValue.singleton(swapping.soldAsset, swapping.soldAmount),
        )
        .normedMinus(
          PositiveValue.singleton(swapping.boughtAsset, swapping.boughtAmount),
        ),
      //TODO note that the utxo is missing, this should result from the tx, which we don't have yet
    );
  };

  public swappingsFor = (
    user: User | undefined,
    paramUtxo: ParamUtxo,
    sellable_?: Value, // subset of pool-assets. NOTE: Empty if infinite for any asset, -1 if infinite for a specific asset
    buyingAsset?: Asset, // for subsequent swappings we want only a single direction
    //buyableAmnt?: bigint, // for the new subswap-calculator, in concert with buyingAsset. Unused rn
  ): Swapping[] => {
    // console.log("swappingsFor()");
    const swappings = new Array<Swapping>();
    let buyable_ = this.balance;
    if (buyingAsset) {
      // const buyableAmnt_ = buyableAmnt ?? this.balance.amountOf(buyingAsset, 0n);
      const buyableAmnt_ = this.balance.amountOf(buyingAsset, 0n);
      if (buyableAmnt_ > 0n) {
        buyable_ = PositiveValue.singleton(buyingAsset, buyableAmnt_);
      } else {
        return [];
      }
    }
    const param = paramUtxo.param;

    const liquidity_ = new PositiveValue();

    const spotBuying_ = new PositiveValue();
    const spotSelling_ = new PositiveValue();
    const expBuying_ = new PositiveValue();
    const expSelling_ = new PositiveValue();
    const maxBuying_ = new PositiveValue();
    const maxSelling_ = new PositiveValue();

    // deposit of asset into pool to move inverted amm-price a to inverted spot price s
    // s := a = (l + d) * w => d = (s / w) - l
    const delta = (w: bigint, l: bigint) => (s: bigint) => (s - l * w) / w;
    // const delta = (w: number, l: number) => (s: number) => (s / w) - l;
    // const delta = (s: number) => l * (((s / a) ** (w / (w + 1))) - 1);
    const spot = (a: bigint, j: bigint, e: bigint) =>
      (a * ((j + 1n) ** e)) / (j ** e);

    param.assets.forEach((asset) => {
      // if (asset.equals(Asset.ADA)) return; // TODO for debugging, revert
      const buyable = buyable_.amountOf(asset, 0n);
      const sellable = sellable_?.amountOf(asset, 0n);
      const minBuying = getMinBuying(asset);
      if (buyable < minBuying && sellable && sellable === 0n) return;

      const virtual = param.virtual.amountOf(asset);
      const weight = param.weights.amountOf(asset); // NOTE: inverted
      const jumpSize = param.jumpSizes.amountOf(asset);
      const anchor = this.dirac.anchorPrices.amountOf(asset); // NOTE: inverted aka "price when selling for A0"

      const liquidity = virtual + this.balance.amountOf(asset, 0n);
      if (liquidity <= 0n) return; // TODO reconsider if this can happen, throw error instead if not
      liquidity_.initAmountOf(asset, liquidity);

      const amm = liquidity * weight; // NOTE: inverted aka "price when selling for A0"
      assert(amm > 0n, `amm <= 0n`);

      const jumpMultiplier = (Number(jumpSize) + 1) / Number(jumpSize);
      const exp = Math.log(Number(amm) / Number(anchor)) /
        Math.log(jumpMultiplier);

      let expBuying = BigInt(Math.floor(exp));
      let expSelling = BigInt(Math.ceil(exp));

      let spotBuying = spot(anchor, jumpSize, expBuying);
      let spotSelling = spot(anchor, jumpSize, expSelling);

      // TODO what about this?
      // NOTE: inverted
      // assert(spot(anchor, jumpSize, expBuying + 1n) >= amm, `expBuying could be higher`);
      // assert(spot(anchor, jumpSize, expSelling - 1n) <= amm, `spotSelling could be lower`);
      // assert(spotBuying >= anchor, `spotBuying < anchor`); // TODO do we want that in the loop below? Do we want it at all?

      const delta_ = delta(weight, liquidity);

      if (buyable >= minBuying) {
        while (spotBuying > 0n) {
          const d = delta_(spotBuying);
          const maxBuying = min(buyable, -d);
          // console.log(`
          // buyable: ${buyable}
          // d: ${d}
          // maxBuying: ${maxBuying}
          // `);

          if (maxBuying >= minBuying) {
            spotBuying_.initAmountOf(asset, spotBuying);
            expBuying_.initAmountOf(asset, expBuying + 1n); // NOTE/TODO +1n is a hack to fit zeroes into PositiveValue
            maxBuying_.initAmountOf(asset, maxBuying);
            break;
          } else {
            expBuying--;
            spotBuying = spot(anchor, jumpSize, expBuying);
            // if maxBuying is 0, then d is too low, which means that
            // we are too close at the amm-price. So we ~increase~ the
            // (uninverted) price we are willing to ~buy~ at stepwise
            // until either we hit the bounds or find a d >= 1.
          }
        }
      }

      if ((sellable === undefined || sellable != 0n) && spotSelling > 0n) {
        while (true) {
          const d = delta_(spotSelling);
          const maxSelling = sellable && sellable > 0n ? min(sellable, d) : d;

          if (maxSelling > 0n) {
            spotSelling_.initAmountOf(asset, spotSelling);
            expSelling_.initAmountOf(asset, expSelling);
            maxSelling_.initAmountOf(asset, maxSelling);
            break;
          } else {
            expSelling++;
            spotSelling = spot(anchor, jumpSize, expSelling);
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
    
    buyableAssets.forEach((buyingAsset) => {
      const minBuying = getMinBuying(buyingAsset);

      sellableAssets.forEach((sellingAsset) => {
        if (sellingAsset.equals(buyingAsset)) return;
        // console.log(`
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // buyingAsset: ${buyingAsset.show()}
        // sellingAsset: ${sellingAsset.show()}
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // `);
        // NOTE if those ever have to be made changeable again, move them into the inner loop
        let spotBuying = spotBuying_.amountOf(buyingAsset); // NOTE: inverted
        let expBuying = expBuying_.amountOf(buyingAsset) - 1n; // NOTE the -1 is part of the hack to fit zeroes into PositiveValue (see above)
        let maxBuying = maxBuying_.amountOf(buyingAsset);
        
        let spotSelling = spotSelling_.amountOf(sellingAsset); // NOTE: inverted
        let expSelling = expSelling_.amountOf(sellingAsset);
        let maxSelling = maxSelling_.amountOf(sellingAsset);

        // NOTE: below not strictly A0, but want to avoid divisions.
        // Ok, since only relative value matters. Assume it's a different A0', derived from:
        //  const maxBuyingA0 = (maxBuying / spotBuying) * (spotSelling * spotBuying);
        //  const maxSellingA0 = (maxSelling / spotSelling) * (spotSelling * spotBuying);
        //  (spotSelling * spotBuying) are the same for both and added so we can remove divisions.

        let maxBuyingA0 = maxBuying * spotSelling;
        let maxSellingA0 = maxSelling * spotBuying;
        let maxSwapA0 = min(maxSellingA0, maxBuyingA0);
        let buyingAmount = maxSwapA0 / spotSelling;

        // if (maxSwapA0 < spotSelling) return; // TODO comment out again
        if (buyingAmount <= minBuying) {
          // console.log("looping")
          // TODO marginal efficiency gains possible here by initialzing only JIT
          const sellingAnchor = this.dirac.anchorPrices.amountOf(sellingAsset);
          const buyingAnchor = this.dirac.anchorPrices.amountOf(buyingAsset);

          const sellingJumpSize = param.jumpSizes.amountOf(sellingAsset);
          const buyingJumpSize = param.jumpSizes.amountOf(buyingAsset);

          const buyable = buyable_.amountOf(buyingAsset, 0n);
          const sellable = sellable_?.amountOf(sellingAsset, 0n);
          if (buyable < minBuying || (sellable && sellable === 0n)) return;

          const deltaSelling = delta(
            param.weights.amountOf(sellingAsset),
            liquidity_.amountOf(sellingAsset),
          );
          const deltaBuying = delta(
            param.weights.amountOf(buyingAsset),
            liquidity_.amountOf(buyingAsset),
          );

          let limitReached = false;
          while (buyingAmount <= minBuying) {
            // const buyingAmount = maxSwapA0 / spotSelling;
            // const sellingAmount = ceilDiv(buyingAmount * spotSelling, spotBuying);
            // console.log(`
            //   maxBuying:     ${maxBuying}
            //   maxSelling:    ${maxSelling}
            //   maxBuyingA0:   ${maxBuyingA0}
            //   maxSellingA0:  ${maxSellingA0}
            //   maxSwapA0:     ${maxSwapA0}
            //   spotBuying:    ${spotBuying}
            //   spotSelling:   ${spotSelling}
            //   buyingAmount:  ${buyingAmount}
            //   sellingAmount: ${sellingAmount}
            //   limitReached: ${limitReached}
            // `)
            if (limitReached) return;
            if (maxSellingA0 <= maxBuyingA0 || expBuying === 0n) { // TODO second half might cause issues, idk
              expSelling++;
              spotSelling = spot(sellingAnchor, sellingJumpSize, expSelling);
              const d = deltaSelling(spotSelling);
              if (sellable && sellable > 0n) {
                if (sellable <= d) {
                  maxSelling = sellable;
                  limitReached = true;
                } else {
                  maxSelling = d;
                }
              } else {
                maxSelling = d;
              }
            } else {
              // if (expBuying === 0n) return; // TODO is this the only option in this case?
              // throw new Error("after all this branch is being visited!");
              // this branch is only visited if buying ADA (because of the higher minBuying)
              expBuying--;
              spotBuying = spot(buyingAnchor, buyingJumpSize, expBuying);
              const d = deltaBuying(spotBuying);
              maxBuying = min(buyable, -d);
            }

            maxBuyingA0 = maxBuying * spotSelling;
            maxSellingA0 = maxSelling * spotBuying;
            maxSwapA0 = min(maxSellingA0, maxBuyingA0);
            buyingAmount = maxSwapA0 / spotSelling;
            // TODO is this true?
            // assert(maxSwapA0_ <= maxSwapA0, `maxSwapA0 should be decreasing`);
            // assert(maxSwapA0_ < maxSwapA0, `maxSwapA0 should be strictly decreasing`);
          }
        } //else console.log("not looping")

        const sellingAmount = ceilDiv(buyingAmount * spotSelling, spotBuying);
        // console.log(`
        //   ---------------------------
        //   maxBuying:     ${maxBuying}
        //   maxSelling:    ${maxSelling}
        //   maxBuyingA0:   ${maxBuyingA0}
        //   maxSellingA0:  ${maxSellingA0}
        //   maxSwapA0:     ${maxSwapA0}
        //   spotBuying:    ${spotBuying}
        //   spotSelling:   ${spotSelling}
        //   buyingAmount:  ${buyingAmount}
        //   sellingAmount: ${sellingAmount}
        //   ---------------------------
        // `)
        // const sellingAmount = maxSellingA0 <= maxBuyingA0 ? maxSelling : BigInt(sellingAmount_);

        // /// logging/debugging

        // const buyingJs = param.jumpSizes.amountOf(buyingAsset);
        // const sellingJs = param.jumpSizes.amountOf(sellingAsset);
        // const buyingAnchor = this.dirac.anchorPrices.amountOf(buyingAsset);
        // const sellingAnchor = this.dirac.anchorPrices.amountOf(sellingAsset);

        // const buyingJumpMultiplier = (Number(buyingJs) + 1) / Number(buyingJs);
        // const sellingJumpMultiplier = (Number(sellingJs) + 1) /
        //   Number(sellingJs);
        // const ammBuying = liquidity_.amountOf(buyingAsset) *
        //   param.weights.amountOf(buyingAsset);
        // const ammSelling = liquidity_.amountOf(sellingAsset) *
        //   param.weights.amountOf(sellingAsset);
        // const buyingExp = Math.log(Number(ammBuying) / Number(buyingAnchor)) /
        //   Math.log(buyingJumpMultiplier);
        // const sellingExp =
        //   Math.log(Number(ammSelling) / Number(sellingAnchor)) /
        //   Math.log(sellingJumpMultiplier);

        // // console.log(
        //   `buyingExp: ${buyingExp} -> ${expBuying}, sellingExp: ${sellingExp} -> ${expSelling}`,
        // );

        // /// end logging/debugging

        const swapping = Swapping.boundary(
          user,
          paramUtxo,
          this,
          buyingAsset,
          sellingAsset,
          buyingAmount,
          sellingAmount,
          spotBuying,
          spotSelling,
          expBuying,
          expSelling,
        );

        swappings.push(swapping);

      });
    });

    // // console.log("swappings", swappings)
    return swappings;
  };
}
