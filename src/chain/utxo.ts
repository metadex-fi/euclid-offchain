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
  ): Swapping[] => {
    const swappings = new Array<Swapping>();
    let buyable_ = this.balance;
    if (buyingAsset) {
      const buyableAmnt = this.balance.amountOf(buyingAsset, 0n);
      if (buyableAmnt > 0n) {
        buyable_ = PositiveValue.singleton(buyingAsset, buyableAmnt);
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

    param.assets.forEach((asset) => {
      const buyable = buyable_.amountOf(asset, 0n);
      const sellable = sellable_?.amountOf(asset, 0n);
      if (buyable <= 0n && sellable && sellable === 0n) return;

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

      let expBuying = Math.floor(exp);
      let expSelling = Math.ceil(exp);

      let spotBuying = BigInt(
        Math.floor(Number(anchor) * (jumpMultiplier ** expBuying)),
      );
      let spotSelling = BigInt(
        Math.floor(Number(anchor) * (jumpMultiplier ** expSelling)),
      );

      // let spotBuying = ((amm - anchor) / jumpSize) * jumpSize + anchor; // NOTE: inverted
      // assert(spotBuying >= anchor, `spotBuying < anchor`); // TODO do we want that in the loop below? Do we want it at all?
      // let spotSelling = spotBuying + jumpSize; // NOTE: inverted aka "price when selling for A0"

      const delta_ = delta(weight, liquidity);

      if (buyable > 0n) {
        while (spotBuying > 0n) {
          const d = delta_(spotBuying);
          const maxBuying = min(buyable, -d);

          if (maxBuying > 0n) {
            spotBuying_.initAmountOf(asset, spotBuying);
            expBuying_.initAmountOf(asset, BigInt(expBuying) + 1n); // NOTE/TODO +1n is a hack to fit it into PositiveValue
            maxBuying_.initAmountOf(asset, maxBuying);
            break;
          } else {
            expBuying--;
            spotBuying = BigInt(
              Math.floor(Number(anchor) * (jumpMultiplier ** expBuying)),
            );
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
            expSelling_.initAmountOf(asset, BigInt(expSelling));
            maxSelling_.initAmountOf(asset, maxSelling);
            break;
          } else {
            expSelling++;
            spotSelling = BigInt(
              Math.floor(Number(anchor) * (jumpMultiplier ** expSelling)),
            );
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
      let spotSelling = spotSelling_.amountOf(sellingAsset); // NOTE: inverted
      let expSelling = expSelling_.amountOf(sellingAsset);
      let maxSelling = maxSelling_.amountOf(sellingAsset);

      buyableAssets.forEach((buyingAsset) => {
        // console.log("buyingAsset", buyingAsset.concise())
        if (sellingAsset.equals(buyingAsset)) return;

        let spotBuying = spotBuying_.amountOf(buyingAsset); // NOTE: inverted
        let expBuying = expBuying_.amountOf(buyingAsset) - 1n; // NOTE/TODO +1n is a hack to fit it into PositiveValue
        let maxBuying = maxBuying_.amountOf(buyingAsset);

        // NOTE: below not strictly A0, but want to avoid divisions.
        // Ok, since only relative value matters. Assume it's a different A0', derived from:
        //  const maxBuyingA0 = (maxBuying / spotBuying) * (spotSelling * spotBuying);
        //  const maxSellingA0 = (maxSelling / spotSelling) * (spotSelling * spotBuying);
        //  (spotSelling * spotBuying) are the same for both and added so we can remove divisions.

        let maxBuyingA0 = maxBuying * spotSelling;
        let maxSellingA0 = maxSelling * spotBuying;
        let maxSwapA0 = min(maxSellingA0, maxBuyingA0);

        // if (maxSwapA0 < spotSelling) return; // to avoid zero buying amount TODO this is somewhat wrong, correct would be to instead relax the prices further instead

        if (maxSwapA0 < spotSelling) {
          // TODO marginal efficiency gains possible here by initialzing only JIT
          const sellingAnchor = Number(
            this.dirac.anchorPrices.amountOf(sellingAsset),
          );
          const buyingAnchor = Number(
            this.dirac.anchorPrices.amountOf(buyingAsset),
          );

          const sellingJumpSize = Number(
            param.jumpSizes.amountOf(sellingAsset),
          );
          const buyingJumpSize = Number(param.jumpSizes.amountOf(buyingAsset));

          const sellingJumpMultiplier = (sellingJumpSize + 1) / sellingJumpSize;
          const buyingJumpMultiplier = (buyingJumpSize + 1) / buyingJumpSize;

          const buyable = buyable_.amountOf(buyingAsset, 0n);
          const sellable = sellable_?.amountOf(sellingAsset, 0n);
          if (buyable <= 0n || (sellable && sellable === 0n)) return;

          const deltaSelling = delta(
            param.weights.amountOf(sellingAsset),
            liquidity_.amountOf(sellingAsset),
          );
          const deltaBuying = delta(
            param.weights.amountOf(buyingAsset),
            liquidity_.amountOf(buyingAsset),
          );

          // TODO not sure if infinite loop is possible here
          while (maxSwapA0 < spotSelling) {
            if (maxSellingA0 <= maxBuyingA0) {
              expSelling++;

              const spotSelling_ = Math.floor(
                sellingAnchor * (sellingJumpMultiplier ** Number(expSelling)),
              );
              if (!isFinite(spotSelling_)) return;
              spotSelling = BigInt(spotSelling_);

              const d = deltaSelling(spotSelling);
              maxSelling = sellable && sellable > 0n ? min(sellable, d) : d;
            } else {
              // TODO not sure if this branch adds value
              expBuying--;
              spotBuying = BigInt(
                Math.floor(
                  buyingAnchor * (buyingJumpMultiplier ** Number(expBuying)),
                ),
              );

              const d = deltaBuying(spotBuying);
              maxBuying = min(buyable, -d);
            }

            maxBuyingA0 = maxBuying * spotSelling;
            maxSellingA0 = maxSelling * spotBuying;
            maxSwapA0 = min(maxSellingA0, maxBuyingA0);
          }
        }

        const buyingAmount = maxSwapA0 / spotSelling;
        const sellingAmount_ = Math.ceil(
          Number(maxSwapA0) / Number(spotBuying),
        );
        if (!isFinite(sellingAmount_)) return;
        const sellingAmount = BigInt(sellingAmount_);
        // const sellingAmount = maxSellingA0 <= maxBuyingA0 ? maxSelling : BigInt(sellingAmount_);

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

        // TODO FIXME
        if (
          Swapping.validates(
            spotBuying,
            spotSelling,
            // this.dirac.anchorPrices.amountOf(buyingAsset),
            // this.dirac.anchorPrices.amountOf(sellingAsset),
            // param.jumpSizes.amountOf(buyingAsset),
            // param.jumpSizes.amountOf(sellingAsset),
            param.weights.amountOf(buyingAsset),
            param.weights.amountOf(sellingAsset),
            liquidity_.amountOf(buyingAsset),
            liquidity_.amountOf(sellingAsset),
            buyingAmount,
            sellingAmount,
          )
        ) {
          swappings.push(swapping);
        } else {
          console.error("invalid swap", swapping.show());
          return;
          // throw new Error(`invalid swap: ${swapping.show()}`); // TODO throw error and fix
        }
        // console.log("swapping", swapping.show())
      });
    });

    // console.log("swappings", swappings)
    return swappings;
  };
}
