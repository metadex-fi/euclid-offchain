import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { Dirac } from "../../types/euclid/dirac.ts";
import { EuclidValue } from "../../types/euclid/euclidValue.ts";
import { Param } from "../../types/euclid/param.ts";
import { Asset } from "../../types/general/derived/asset/asset.ts";
import { Value } from "../../types/general/derived/value/value.ts";
import { PPositive } from "../../types/general/derived/bounded/positive.ts";
import { PositiveValue } from "../../types/general/derived/value/positiveValue.ts";
import {
  genNonNegative,
  gMaxLength,
  max,
  min,
} from "../../utils/generators.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";
import { IdNFT, maxInteger } from "../../mod.ts";
import { Swapping } from "./mod.ts";

// complete settings for opening a pool
export class Opening {
  constructor(
    public readonly user: User,
    public readonly param: Param,
    public readonly deposit: PositiveValue, // total of all Diracs
    public readonly numTicks: EuclidValue,
    private poolCache?: Pool,
  ) {
    // console.log(deposit.assets.union(this.param.virtual.assets).show());
    assert(
      deposit.assets.union(this.param.virtual.assets).equals(this.param.assets),
      `deposit and virtual must cover all assets, but got\ndeposit: ${deposit.concise()}\nparam: ${this.param.concise()}`,
    );

    // TODO assert 2. numDiracs resulting from numTicks <= lowest deposit
  }

  public get type(): string {
    return "Opening";
  }

  public split = (): Opening[] => {
    console.log(`splitting opening`);
    const pools = this.pool().split();
    return pools.map((p) => {
      return new Opening(
        this.user,
        this.param,
        this.deposit,
        this.numTicks,
        p,
      );
    });
  };

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    return this.pool().openingTx(tx, this.user.contract).addSigner(
      this.user.address!,
    );
  };

  public succeeded = (_txCore: Lucid.C.Transaction) => {};

  // adjust the baseline anchor price for a single asset, in order to reduce required exponents when swapping
  private static adjustAnchorPrice = (
    baseAnchor: bigint, 
    balance: bigint, 
    virtual: bigint,
    weight: bigint,
    jumpSize: bigint,
  ): bigint | undefined => {

    const amm = weight * (balance + virtual);
    const jumpMultiplier = 1 + (1 / Number(jumpSize));
    let exp = BigInt(Math.round(Swapping.exp(
      Number(baseAnchor), 
      Number(amm), 
      jumpMultiplier
      )));
    let finalAnchor = baseAnchor;
    const upperLimit = min(amm, maxInteger);
    console.log("initial exp:", exp, "finalAnchor:", finalAnchor);
    while (finalAnchor <= upperLimit) {
      exp++;
      finalAnchor = Swapping.spot(
        baseAnchor,
        jumpSize,
        exp,
      );
      console.log("exp increased:", exp, "finalAnchor:", finalAnchor);
    }
    while (finalAnchor > upperLimit && finalAnchor >= baseAnchor) {
      exp--;
      finalAnchor = Swapping.spot(
        baseAnchor,
        jumpSize,
        exp,
      );
      console.log("exp decreased:", exp, "finalAnchor:", finalAnchor);
    }

    console.log(`finalAnchor: ${finalAnchor} vs. baseAnchor: ${baseAnchor}`);
    if (finalAnchor < baseAnchor) {
      console.log(`returning undefined`);
      return undefined;
    }
    console.log(`returning finalAnchor: ${finalAnchor}`);
    return finalAnchor;
  }

  // get the adjusted anchor price for the first dirac, for a single asset
  private static firstAnchorPrice = (
    balance: bigint,
    virtual: bigint,
    weight: bigint,
    jumpSize: bigint,
  ): bigint => {
    const baseAnchor = Param.minAnchorPrice(virtual, weight, jumpSize);
    const finalAnchor = Opening.adjustAnchorPrice(
      baseAnchor, 
      balance, 
      virtual,
      weight,
      jumpSize
    );
    return finalAnchor ?? baseAnchor;
  }

  // get the adjusted anchor prices for the first dirac, for all assets
  private static firstAnchorPrices = (
    balance: Value,
    virtual: Value,
    weights: Value,
    jumpSizes: Value,
  ): EuclidValue => {
    const f = Value.newUnionWith(Opening.firstAnchorPrice, undefined, 0n);
    return EuclidValue.fromValue(
      f(balance, virtual, weights, jumpSizes),
    );

  }

  public pool = (): Pool => {
    if (this.poolCache) return this.poolCache;
    const assets = this.param.assets;
    const deposit = this.deposit.unsigned;
    const virtual = this.param.virtual.unsigned;
    const weights = this.param.weights.unsigned;
    const jumpSizes = this.param.jumpSizes.unsigned;
    const paramNFT = this.user.nextParamNFT.next(); // TODO remove next()
    const paramUtxo = ParamUtxo.open(this.param, paramNFT);
    
    const numDiracs = this.numTicks.unsigned.mulAmounts();
    const balance = deposit.divideByScalar(numDiracs);
    const firstAnchorPrices = Opening.firstAnchorPrices(
      balance,
      virtual,
      weights,
      jumpSizes,
    );

    // TODO consider checking if balance has assets left over
    assert(
      balance.size === this.deposit.size,
      `balance size should match deposit size: ${balance.concise()} vs. ${this.deposit.concise()}`,
    );

    let threadNFT = paramNFT.next();
    let diracs = [
      new Dirac(
        this.user.paymentKeyHash,
        threadNFT,
        paramNFT,
        firstAnchorPrices,
      ),
    ];

    // for each asset and for each existing dirac, "spread" that dirac
    // in that asset's dimension. "spread" means: add all other tick
    // offsets for that asset's lowest price.
    // UPDATE: then, jump enough times to approximate the initial amm-price (TODO)
    assets.forEach((asset) => {
      const ticks = this.numTicks.amountOf(asset);
      const jumpMultiplier = 1 +
        (1 / Number(jumpSizes.amountOf(asset)));
      const tickMultiplier = jumpMultiplier ** (1 / Number(ticks));
      const diracs_ = new Array<Dirac>();

      const weight = weights.amountOf(asset);
      const balance_ = balance.amountOf(asset, 0n);
      const virtual_ = virtual.amountOf(asset);
      const jumpSize = jumpSizes.amountOf(asset);

      /* TODO important: assert everywhere that anchorPrices allow for the required tickSizes - consider:

- tickMultiplier must be >= 1 + (1 / anchor0), otherwise different anchors will round to the same price
- -> tickSize must be <= anchor0, which unfortunately is not a used parameter, but can be deduced via
- tickSize = 1 / (calcTic)

      */
      diracs.forEach((dirac) => {
        for (let i = 1; i < ticks; i++) {
          const anchorPrices = dirac.anchorPrices.clone;
          const firstAnchor = anchorPrices.amountOf(asset);
          const baseAnchor = BigInt(
            Math.floor(Number(firstAnchor) * (tickMultiplier ** i)),
          );
          assert(
            firstAnchor < baseAnchor,
            `anchor price collision - first: ${firstAnchor} >= current: ${baseAnchor}`,
          );
          const finalAnchor = Opening.adjustAnchorPrice(
            baseAnchor, 
            balance_, 
            virtual_,
            weight,
            jumpSize,
          );
          if (!finalAnchor) {
            // NOTE/TODO for now this will simply result in a reduced deposit
            console.log(`impossible anchor price, skipping dirac`);
            continue;
          }

          anchorPrices.setAmountOf(asset, finalAnchor);
          console.log(`updated anchors: ${anchorPrices.concise()}`);
          threadNFT = threadNFT.next();
          diracs_.push(
            new Dirac(
              this.user.paymentKeyHash,
              threadNFT,
              paramNFT,
              anchorPrices,
            ),
          );
        }
      });
      diracs = diracs.concat(diracs_);
    });

    assert(diracs.length, `Opening.pool(): no diracs generated`);
    const diracUtxos = diracs.map((dirac) => {
      return DiracUtxo.open(this.param, dirac, new PositiveValue(balance));
    });

    this.user.setLastIdNFT(threadNFT);
    const pool = Pool.open(
      paramUtxo,
      diracUtxos,
    );

    this.poolCache = pool;
    return pool;
  };

  // splitting it up this way to later use the same class to process actual user input
  static genOfUser = (user: User): Opening | undefined => {
    // console.log(`attempting to open`);
    const balance = user.availableBalance;
    if (!balance || balance.size < 1) return undefined;
    const maxAssets = gMaxLength;
    const deposit = balance.boundedSubValue(1n, maxAssets);
    const allAssets = deposit.assets;
    let addVirtualAssets = max(genNonNegative(maxAssets), 2n) - allAssets.size;
    while (addVirtualAssets > 0n) {
      const asset = Asset.generate();
      if (allAssets.has(asset)) continue;
      allAssets.insert(asset);
      addVirtualAssets--;
    }
    // console.log(allAssets.show());
    const param = Param.genOf(user.paymentKeyHash, allAssets);

    // const gMaxDiracs = 26n; // because tx size
    const maxDiracs = deposit.smallestAmount; // because minimum deposit
    let maxTicks = maxDiracs; //min(gMaxDiracs, maxDiracs);
    const numTicks = new PositiveValue();
    allAssets.forEach((asset) => {
      const maxTicks_ = Opening.maxTicks(
        param.virtual.amountOf(asset),
        param.weights.amountOf(asset),
        param.jumpSizes.amountOf(asset),
      );
      // console.log(`maxTicks: ${maxTicks}`);
      // console.log(`maxTicks_: ${maxTicks_}`);
      // console.log(`${min(min(gMaxLength, maxTicks_), maxTicks)}`);
      const ticks = new PPositive(
        1n,
        min(min(gMaxLength, maxTicks_), maxTicks), // TODO what to do when maxTicks_ < 1n? Should this be possible..?
      ).genData();
      maxTicks /= ticks;
      numTicks.initAmountOf(asset, ticks);
    });

    // console.log(`numDiracs: ${numTicks.unsigned.mulAmounts()}`);
    // NOTE 27 diracs slightly exceeds the max tx size (17444 vs. 16384)
    // TODO consider splitting up the tx
    // console.log(`Opening`);
    return new Opening(
      user,
      param,
      deposit,
      new EuclidValue(numTicks),
    );
  };

  static maxTicks = (
    virtual: bigint,
    weight: bigint,
    jumpSize: bigint,
  ) => {
    const minAnchorPrice = Param.minAnchorPrice(
      virtual,
      weight,
      jumpSize,
    );
    const jumpMultiplier = 1 +
      (1 / Number(jumpSize));
    const anchorMultiplier = 1 +
      (1 / Number(minAnchorPrice));

    let jumpLog = Math.log(jumpMultiplier);
    jumpLog = isFinite(jumpLog) ? jumpLog : Number(maxInteger);
    let anchorLog = Math.log(anchorMultiplier);
    anchorLog = isFinite(anchorLog) ? anchorLog : Number(maxInteger);
    // console.log(`virtual: ${virtual}`);
    // console.log(`weight: ${weight}`);
    // console.log(`jumpSize: ${jumpSize}`);
    // console.log(`minAnchorPrice: ${minAnchorPrice}`);
    // console.log(`jumpLog: ${jumpLog}`);
    // console.log(`anchorLog: ${anchorLog}`);
    // console.log(`${jumpLog / anchorLog}`);
    const maxTicks = Math.floor(jumpLog / anchorLog);
    assert(maxTicks > 0, `maxTicks must be > 0, but got ${maxTicks}`);
    if (isFinite(maxTicks)) return BigInt(maxTicks);
    else return maxInteger;
  };
}
