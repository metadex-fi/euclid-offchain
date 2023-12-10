import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { Dirac } from "../../types/euclid/dirac.ts";
import { EuclidValue } from "../../types/euclid/euclidValue.ts";
import { Param } from "../../types/euclid/param.ts";
import { Asset } from "../../types/general/derived/asset/asset.ts";
import { Value } from "../../types/general/derived/value/value.ts";
import { PPositive } from "../../types/general/derived/bounded/positive.ts";
import { PositiveValue } from "../../types/general/derived/value/positiveValue.ts";
import { genNonNegative, max, min } from "../../utils/generators.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";
import {
  gMaxLength,
  maxInteger,
  minAdaBalance,
} from "../../utils/constants.ts";
import { log } from "./swapfinding6/swapsForPair.ts";
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

  public show = (): string => {
    return `Opening (
  param: ${this.param.concise()}
  deposit: ${this.deposit.concise()}
  numTicks: ${this.numTicks.concise()}
)`;
  };

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
  // we basically want the anchor price to be as close to the initial amm-price as possible;
  // if it's slightly "better" (which means different things for buying/selling) this means the minimum
  // exponent for the next swap will be 1 (because we need to worsen it at least once to get to the right
  // side of the amm-price), otherwise 0
  // TODO FIXME
  private static adjustAnchorPrice = (
    baseAnchor: bigint,
    balance: bigint,
    virtual: bigint,
    weight: bigint,
    jumpSize: bigint,
  ): bigint | null => {
    const amm = weight * (balance + virtual);
    // const jumpMultiplier = 1 + (1 / Number(jumpSize));
    // let exp = BigInt(Math.round(calcExp(
    //   Number(baseAnchor),
    //   Number(amm),
    //   jumpMultiplier,
    // )));
    // let finalAnchor = baseAnchor;

    const upperLimit = min(amm, maxInteger);
    const logRatio = log(upperLimit) - log(baseAnchor);
    const logJM = log(jumpSize + 1n) - log(jumpSize);
    let exp: bigint;
    let finalAnchor: bigint;
    if (baseAnchor <= upperLimit) {
      // if the base anchor is below the amm/maxInteger, we increase it
      // as much as possible while staying below amm/maxInteger
      exp = BigInt(Math.floor(logRatio / logJM));
      finalAnchor = (baseAnchor * ((jumpSize + 1n) ** exp)) /
        (jumpSize ** exp);
    } else {
      // TODO revisit this
      // if the base anchor is above the amm/maxInteger, we decrease it
      // as little as required to make it lower than amm/maxInteger
      exp = BigInt(Math.ceil(logRatio / -logJM));
      finalAnchor = (baseAnchor * (jumpSize ** exp)) /
        ((jumpSize + 1n) ** exp);
    }
    if (finalAnchor > upperLimit) { // presumably due to rounding-errors
      finalAnchor = (finalAnchor * jumpSize) / (jumpSize + 1n);
    } else {
      while (true) {
        const oneBigger = (finalAnchor * (jumpSize + 1n)) /
          jumpSize;
        if (oneBigger <= upperLimit) { // presumably due to rounding-errors
          finalAnchor = oneBigger;
        } else break;
      }
    }
    assert(
      finalAnchor <= upperLimit,
      `finalAnchor must be <= upperLimit, but got ${finalAnchor} > ${upperLimit} (exp: ${exp}, baseAnchor: ${baseAnchor}, upperLimit: ${upperLimit})`,
    );
    const tightness = 1n;
    const bigger = (finalAnchor * ((jumpSize + 1n) ** tightness)) /
      (jumpSize ** tightness);
    assert(
      bigger > upperLimit,
      `finalAnchor could be bigger: ${finalAnchor} * ${
        jumpSize + 1n
      } ** ${tightness} / ${jumpSize} ** ${tightness} = ${bigger} <= ${upperLimit} (exp: ${exp}, baseAnchor: ${baseAnchor}, upperLimit: ${upperLimit})`,
    );
    return finalAnchor;

    // console.log("initial exp:", exp, "finalAnchor:", finalAnchor);
    // while (finalAnchor <= upperLimit) {
    //   exp++;
    //   finalAnchor = calcSpot(baseAnchor, jumpSize)(exp);
    //   console.log("exp increased:", exp, "finalAnchor:", finalAnchor);
    // }
    // while (finalAnchor > upperLimit && finalAnchor >= baseAnchor) {
    //   exp--;
    //   finalAnchor = calcSpot(baseAnchor, jumpSize)(exp);
    //   // console.log("exp decreased:", exp, "finalAnchor:", finalAnchor);
    // }

    // console.log(`finalAnchor: ${finalAnchor} vs. baseAnchor: ${baseAnchor}`);
    // if (finalAnchor < baseAnchor) {
    //   console.log(`returning null`); // TODO revisit this
    //   return null;
    // }
    // console.log(`returning finalAnchor: ${finalAnchor}`);
    // return finalAnchor;
  };

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
      jumpSize,
    );
    return finalAnchor ?? baseAnchor;
  };

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
  };

  public pool = (): Pool => {
    if (this.poolCache) return this.poolCache;
    const assets = this.param.assets;
    const deposit = this.deposit.unsigned;
    const virtual = this.param.virtual.unsigned;
    const weights = this.param.weights.unsigned;
    const jumpSizes = this.param.jumpSizes.unsigned;
    const paramNFT = this.user.nextParamNFT.next(); // TODO remove next() - why is it there and why is it wrong?
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
          // console.log(`updated anchors: ${anchorPrices.concise()}`);
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
  static genOfUser = (user: User): Opening | null => {
    console.log(
      `Opening.genOfUser(): generating opening 
      for user ${user.paymentKeyHash?.show()} 
      with balance ${user.balance?.concise()}
      (available: ${user.availableBalance?.concise()})`,
    );
    // console.log(`attempting to open`);
    const balance = user.availableBalance;
    if (!balance) return null;

    const adaBalance = balance.amountOf(Asset.ADA, 0n);
    if (adaBalance < 2n * minAdaBalance) return null; // for one dirac and one param. TODO minAdaBalance is excessive
    balance.increaseAmountOf(Asset.ADA, -minAdaBalance); // for param-utxo. TODO minAdaBalance is excessive

    if (balance.size < 1) return null;
    const maxAssets = gMaxLength;
    const deposit = balance.boundedSubValue(1n, maxAssets);
    const maxDiracsByMinADA = deposit.amountOf(Asset.ADA) / minAdaBalance;
    // const allowAda = deposit.has(Asset.ADA);

    // in case we don't want ADA to be listed in the pool
    let allowAda = true;
    if (Math.random() < 0.5) {
      deposit.drop(Asset.ADA);
      allowAda = false;
    }
    if (deposit.size < 1) return null;

    const allAssets = deposit.assets;
    let addVirtualAssets = max(genNonNegative(maxAssets), 2n) - allAssets.size;
    while (addVirtualAssets > 0n) {
      const asset = Asset.generate();
      if (allAssets.has(asset)) continue;
      if ((!allowAda) && asset.equals(Asset.ADA)) continue;
      // we require for now either no ADA in the pool, or at least minAdaBalance, to fix swapfinding
      // note that there is always a minimum amount of ADA in the pool, so if that's lower than
      // minAdaBalance, we can't allow ADA to be one of the pool-assets, or our swapfinding is imperfect
      // TODO this is actually a bit bullshit in prod - why impose extra costs on LPs just so
      // our swapfinding can claim to be perfect? There might be reasons though
      allAssets.insert(asset);
      addVirtualAssets--;
    }
    // console.log(allAssets.show());
    const param = Param.genOf(user.paymentKeyHash, allAssets);

    // const gMaxDiracs = 26n; // because tx size
    const maxDiracs = min(maxDiracsByMinADA, deposit.smallestAmount); // because minimum deposit
    console.log("maxDiracs:", maxDiracs);

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
