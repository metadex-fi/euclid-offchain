import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  ceilDiv,
  genNonNegative,
  genPositive,
  max,
  min,
  randomChoice,
} from "../../../utils/generators.ts";
import { maxInteger, maxIntRoot } from "../../../utils/constants.ts";
import { PPositive } from "../../../types/general/derived/bounded/positive.ts";
import { maxSmallInteger } from "../../../types/euclid/smallValue.ts";
import { Param } from "../../../types/euclid/param.ts";
import { f, t } from "../../../types/general/fundamental/type.ts";

export const genWildAssetParams = () => {
  const jumpSize = genPositive(maxSmallInteger);
  const virtual = genPositive(maxInteger);
  const balance = genNonNegative(maxInteger - virtual);
  const locked = genNonNegative(balance);
  const available = balance - locked;
  const weight = genPositive(randomChoice([maxInteger, maxIntRoot]));
  const anchor = genPositive(maxInteger);
  const minDelta = genPositive(maxInteger);
  return { virtual, balance, available, weight, anchor, jumpSize, minDelta };
};

export const genTightAssetParams = () => {
  const jumpSize = genPositive(maxSmallInteger);
  const virtual = new PPositive(
    ceilDiv(jumpSize + 1n, maxSmallInteger),
  ).genData();
  const balance = genNonNegative(maxInteger - virtual);
  const locked = genNonNegative(balance);
  const available = balance - locked;
  const [minWeight, maxWeight] = Param.weightBounds(jumpSize, virtual);
  const weight = new PPositive(minWeight, maxWeight).genData();
  const anchor = genPositive(maxInteger);
  const minDelta = genPositive(maxInteger);
  return { virtual, balance, available, weight, anchor, jumpSize, minDelta };
};

export class AssetOption {
  private newAnchorCache: bigint | null = null;
  private multsCache: number | null = null;

  private constructor(
    readonly type: "buying" | "selling",
    readonly v: bigint,
    readonly b: bigint,
    readonly w: bigint,
    readonly a: bigint,
    readonly js: bigint,
    readonly minDelta: bigint,
    readonly maxDelta: bigint | "oo",
    readonly l: bigint,
    readonly wl: bigint,
    readonly jspp: bigint,
    readonly logJM: number,
    readonly logAW: number,
    readonly exp: bigint,
    readonly jse: bigint,
    readonly jsppe: bigint,
  ) {}

  static initial(
    type: "buying" | "selling",
    v: bigint,
    b: bigint,
    w: bigint,
    a: bigint,
    js: bigint,
    minDelta: bigint,
    maxDelta: bigint | "oo",
  ): AssetOption {
    assert(
      maxDelta === "oo" || minDelta <= maxDelta,
      `${type}: ${minDelta} > ${maxDelta}`,
    );
    assert(minDelta > 0n);
    const l = v + b;
    const wl = l * w;
    const jspp = js + 1n;
    const logJM = log(jspp) - log(js);
    const logAW = log(a) - log(w);

    const option = new AssetOption(
      type,
      v,
      b,
      w,
      a,
      js,
      minDelta,
      maxDelta,
      l,
      wl,
      jspp,
      logJM,
      logAW,
      0n,
      1n,
      1n,
    );

    const exp = option.minExpForDelta(minDelta);
    return option.withExp(exp);
  }

  public withExp = (exp: bigint): AssetOption => {
    assert(exp >= 0n);
    const by = exp - this.exp;

    let jse = this.jse;
    let jsppe = this.jsppe;
    if (by > 0n) {
      jse *= this.js ** by;
      jsppe *= this.jspp ** by;
    } else if (by < 0n) {
      jse /= this.js ** -by;
      jsppe /= this.jspp ** -by;
    }
    // assert(jse === this.js ** exp);
    // assert(jsppe === this.jspp ** exp);

    return new AssetOption(
      this.type,
      this.v,
      this.b,
      this.w,
      this.a,
      this.js,
      this.minDelta,
      this.maxDelta,
      this.l,
      this.wl,
      this.jspp,
      this.logJM,
      this.logAW,
      exp,
      jse,
      jsppe,
    );
  };

  public minExpForDelta = (delta: bigint): bigint => {
    const numerator = this.type === "buying"
      ? this.logAW - log(this.l - delta)
      : log(this.l + delta) - this.logAW;

    const exp = BigInt(Math.ceil(numerator / this.logJM));
    if (exp < 0n) return 0n;
    return exp;
  };

  public maxDeltaForExp = (): bigint | null => {
    const maxDelta = this.type === "buying"
      ? (this.wl * this.jsppe - this.a * this.jse) / (this.jsppe * this.w)
      : (this.a * this.jsppe - this.wl * this.jse) / (this.jse * this.w);
    if (maxDelta < this.minDelta) return null; // apparently rounding errors? TODO check
    if (this.maxDelta === "oo") {
      return maxDelta;
    } else {
      return min(maxDelta, this.maxDelta);
    }
  };

  public get newAnchor(): bigint {
    if (this.newAnchorCache === null) {
      this.newAnchorCache = this.type === "buying"
        ? (this.a * this.jse) / this.jsppe
        : (this.a * this.jsppe) / this.jse;
    }
    return this.newAnchorCache;
  }

  public get mults(): number {
    if (this.multsCache === null) {
      this.multsCache = countMults(this.exp);
    }
    return this.multsCache;
  }

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `AssetOption (
${ttf}type: ${this.type}
${ttf}v: ${this.v}
${ttf}b: ${this.b}
${ttf}w: ${this.w}
${ttf}a: ${this.a}
${ttf}js: ${this.js}
${ttf}minDelta: ${this.minDelta}
${ttf}maxDelta: ${this.maxDelta}
${ttf}exp: ${this.exp}
${ttf}newAnchor: ${this.newAnchor}
${ttf}mults: ${this.mults}
${tt})`;
    //     return `AssetOption (
    // ${ttf}type: ${this.type}
    // ${ttf}v: ${this.v}
    // ${ttf}b: ${this.b}
    // ${ttf}w: ${this.w}
    // ${ttf}a: ${this.a}
    // ${ttf}js: ${this.js}
    // ${ttf}minDelta: ${this.minDelta}
    // ${ttf}maxDelta: ${this.maxDelta}
    // ${ttf}l: ${this.l}
    // ${ttf}wl: ${this.wl}
    // ${ttf}jspp: ${this.jspp}
    // ${ttf}logJM: ${this.logJM}
    // ${ttf}logAW: ${this.logAW}
    // ${ttf}exp: ${this.exp}
    // ${ttf}jse: ${this.jse}
    // ${ttf}jsppe: ${this.jsppe}
    // ${ttf}newAnchor: ${this.newAnchor}
    // ${ttf}mults: ${this.mults}
    // ${tt})`;
  };
}

export class PairOption {
  private constructor(
    readonly b: AssetOption,
    readonly s: AssetOption,
    readonly deltaBuying: bigint,
    readonly deltaSelling: bigint,
    readonly effectivePrice: number,
    readonly perfect: boolean,
    readonly adhereMaxInteger: boolean,
    readonly expLimit: number,
  ) {
    assert(b.type === "buying");
    assert(s.type === "selling");
    assert(deltaBuying >= b.minDelta, `${deltaBuying} < ${b.minDelta}`);
    assert(deltaSelling >= s.minDelta, `${deltaSelling} < ${s.minDelta}`);
    assert(b.maxDelta !== "oo");
    assert(deltaBuying <= b.maxDelta, `${deltaBuying} > ${b.maxDelta}`);
    assert(
      s.maxDelta === "oo" || deltaSelling <= s.maxDelta,
      `${deltaSelling} > ${s.maxDelta}`,
    );
    assert(
      this.effectivePrice ===
        Number(this.deltaSelling) / Number(this.deltaBuying),
    );
  }

  static new = (
    b: AssetOption,
    s: AssetOption,
    deltaBuying: bigint,
    deltaSelling: bigint,
    effectivePrice: number,
    perfect: boolean,
    adhereMaxInteger: boolean,
    expLimit: number,
  ): PairOption => {
    const option = new PairOption(
      b,
      s,
      deltaBuying,
      deltaSelling,
      effectivePrice,
      perfect,
      adhereMaxInteger,
      expLimit,
    );
    assert(
      option.validates(),
      `new option should pass offchain validation: ${option.show()}`,
    );
    return option;
  };

  private validates = (): boolean => {
    let passes = true;

    if (this.perfect) {
      if (
        this.deltaBuying * this.s.a * this.s.jsppe * this.b.jsppe !==
          this.deltaSelling * this.b.a * this.b.jse * this.s.jse
      ) {
        passes = false;
        console.error(`value equation: ${this.show()}`);
      }
    } else {
      if (
        this.deltaBuying * this.s.a * this.s.jsppe * this.b.jsppe >=
          this.deltaSelling * this.b.a * this.b.jse * this.s.jse
      ) {
        passes = false;
        console.error(`value equation: ${this.show()}`);
      }
    }
    if (
      this.b.a * this.b.jse >
        (this.b.l - this.deltaBuying) * this.b.jsppe * this.b.w
    ) {
      passes = false;
      console.error(`price fit buying: ${this.show()}`);
    }

    if (
      (this.s.l + this.deltaSelling) * this.s.jse * this.s.w >
        this.s.a * this.s.jsppe
    ) {
      passes = false;
      console.error(`price fit selling: ${this.show()}`);
    }

    // TODO REVERT
    // if (this.adhereMaxInteger) {
    //   if (this.b.newAnchor > maxInteger) {
    //     passes = false;
    //     console.error(`maxInteger buying: ${this.show()}`);
    //   }

    //   if (this.s.newAnchor > maxInteger) {
    //     passes = false;
    //     console.error(`maxInteger selling: ${this.show()}`);
    //   }
    // }

    if (this.b.mults + this.s.mults > this.expLimit) {
      passes = false;
      console.error(`expLimit: ${this.show()}`);
    }

    return passes;
  };

  public corrupted = (
    deltaBuying: bigint,
    deltaSelling: bigint,
    expBuying: bigint,
    expSelling: bigint,
  ): PairOption => {
    const option = new PairOption(
      this.b.withExp(expBuying),
      this.s.withExp(expSelling),
      deltaBuying,
      deltaSelling,
      Number(deltaSelling) / Number(deltaBuying),
      this.perfect,
      this.adhereMaxInteger,
      this.expLimit,
    );
    assert(
      !option.validates(),
      `corrupted option should fail offchain validation: ${this.show()}\n~~~>\n${option.show()}`,
    );
    // TODO FIXME
    // if (
    //   !option.validates()
    // ) {
    //   console.error(
    //     `corrupted option should fail offchain validation: ${this.show()}\n~~~>\n${option.show()}`,
    //   );
    // }
    return option;
  };

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `PairOption (
${ttf}b: ${this.b.show(ttf)}
${ttf}s: ${this.s.show(ttf)}
${ttf}deltaBuying: ${this.deltaBuying}
${ttf}deltaSelling: ${this.deltaSelling}
${ttf}effectivePrice: ${this.effectivePrice}
${ttf}perfect: ${this.perfect}
${ttf}adhereMaxInteger: ${this.adhereMaxInteger}
${tt})`;
  };
}

export const log = (x: bigint): number => Math.log(Number(x));

const gcd = (a: bigint, b: bigint): bigint => {
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

const reduce = (a: bigint, b: bigint): [bigint, bigint] => {
  const gcd_ = gcd(a, b);
  // assert(gcd_ === gcd(b, a));
  const a_ = a / gcd_;
  const b_ = b / gcd_;
  // assert(a_ * gcd_ === a);
  // assert(b_ * gcd_ === b);
  return [a_, b_];
};

// const smallestPrimeFactor = (n: bigint): bigint => {
//   for (let i = 2n; i <= Math.sqrt(Number(n)); i++) {
//     if (n % i === 0n) {
//       return i; // Found the smallest prime factor
//     }
//   }
//   return n; // The number itself is prime if no factor is found
// };

// each power of 2 is a multiplication.
export const countMults = (exp: bigint): number => {
  const exp_ = Math.abs(Number(exp));

  const binaryRepresentation = exp_.toString(2).slice(1);
  const b = binaryRepresentation.length; // Total bits
  const k = (binaryRepresentation.match(/1/g) || []).length; // Count of '1' bits

  return b + k;
};

// best we can do to decrease the number of multiplications is reaching the next power of 2
export const bestMultsAhead = (exp: bigint): number =>
  Math.abs(Number(exp) - 1).toString(2).length;

export class PairOptions {
  readonly bestAdheringOption: PairOption | null;
  readonly bestOverallOption: PairOption | null;
  readonly maxIntegerImpacted: boolean;

  constructor(
    b: AssetOption,
    s: AssetOption,
    expLimit: number,
    // perfectionism = 1000n,
  ) {
    assert(b.type === "buying");
    assert(s.type === "selling");

    const minExpSelling = s.minExpForDelta(s.minDelta);
    const minExpBuying = b.minExpForDelta(b.minDelta);

    let bestAdheringOption: PairOption | null = null;
    let bestExceedingOption: PairOption | null = null;
    // let now = performance.now();

    const checkNewOption = (
      expBuying: bigint,
      expSelling: bigint,
      exceedsMaxInteger: boolean,
    ) =>
    (
      deltaBuying: bigint,
      deltaSelling: bigint,
      perfect: boolean,
    ): PairOption | null => {
      const effectivePrice = Number(deltaSelling) / Number(deltaBuying);
      let bestPriceOption = exceedsMaxInteger
        ? bestExceedingOption
        : bestAdheringOption;
      if (
        (!bestPriceOption) ||
        effectivePrice <= bestPriceOption.effectivePrice ||
        (effectivePrice === bestPriceOption.effectivePrice &&
          (deltaBuying > bestPriceOption.deltaBuying ||
            deltaSelling > bestPriceOption.deltaSelling))
      ) {
        // const duration = performance.now() - now;
        // now = performance.now();
        // console.log(
        //   duration / 1000,
        //   "s, found better price option",
        //   perfect,
        //   deltaBuying,
        //   deltaSelling,
        //   effectivePrice,
        // );
        // if (bestPriceOption) assert(!bestPriceOption.perfect);

        /*
        in order to find out if we got a suboptimal solution due to maxInteger,
        we are keeping track of two bestPriceOptions separately - one adhering one and one exceeding one.
        in the end, we compare the best of each to see if we have maxIntegerImpacted or not.
        */

        bestPriceOption = PairOption.new(
          b.withExp(expBuying),
          s.withExp(expSelling),
          deltaBuying,
          deltaSelling,
          effectivePrice,
          perfect,
          !exceedsMaxInteger,
          expLimit,
        );
        if (exceedsMaxInteger) {
          bestExceedingOption = bestPriceOption;
        } else {
          bestAdheringOption = bestPriceOption;
        }
        return bestPriceOption;
      } else if (bestPriceOption) {
        assert(!perfect);
        // if we already found a solution, and this one is not better, we assert it isn't perfect
        // -> perfect solutions are always optimal (fails if we do perfect first)
      }
      return null;
    };

    const improvementFeasible = (
      buyingDeltaMultiplier: bigint,
      sellingDeltaMultiplier: bigint,
      exceedsMaxInteger: boolean,
    ) =>
    (): boolean => {
      // const bestPriceOptions = exceedsMaxInteger
      //   ? [bestExceedingOption, bestAdheringOption]
      //   : [bestAdheringOption];
      // for (const bestPriceOption of bestPriceOptions) {
      const bestPriceOption = exceedsMaxInteger
        ? bestExceedingOption
        : bestAdheringOption;
      if (bestPriceOption) {
        // spot = buyingDeltaMultiplier / sellingDeltaMultiplier
        // effective = deltaSelling / deltaBuying
        // spot > effective
        // <=> buyingDeltaMultiplier / sellingDeltaMultiplier > deltaSelling / deltaBuying
        // <=> buyingDeltaMultiplier * deltaBuying > sellingDeltaMultiplier * deltaSelling
        const best = bestPriceOption as PairOption;
        const mDeltaBuying = best.deltaBuying * buyingDeltaMultiplier;
        const mDeltaSelling = best.deltaSelling * sellingDeltaMultiplier;
        if (mDeltaBuying > mDeltaSelling) return false; // spot price is the best we can get, so if that's worse than what we got already, we can skip this
        // else {
        //   const potential = (perfectionism * (mDeltaSelling - mDeltaBuying)) /
        //     mDeltaSelling;
        //   // console.log(
        //   //   "maximum possible improvement:",
        //   //   (100 * Number(potential)) / Number(perfectionism),
        //   //   "%",
        //   // );
        //   // if (potential === 0n) return false; // good enough // TODO revert
        // }
      }
      // }
      return true;
    };

    // for (const mode of ["perfect", "imperfect"]) {
    const queue: { expBuying: bigint; expSelling: bigint }[] = [{
      expBuying: minExpBuying,
      expSelling: minExpSelling,
    }];
    const checked: { expBuying: bigint; expSelling: bigint }[] = [];

    while (queue.length) {
      // queue.sort((a, b) => {
      //   const aMin = min(a.expBuying, a.expSelling);
      //   const bMin = min(b.expBuying, b.expSelling);
      //   return Number(aMin - bMin);
      // });
      const { expBuying, expSelling } = queue.shift()!;
      // let minExpBuying = queue[0].expBuying;
      // let minExpSelling = queue[0].expSelling;
      // queue.forEach(({ expBuying, expSelling }) => {
      //   minExpBuying = min(minExpBuying, expBuying);
      //   minExpSelling = min(minExpSelling, expSelling);
      // });
      // const best = queue.findIndex(({ expBuying, expSelling }) =>
      //   expBuying === minExpBuying || expSelling === minExpSelling
      // );
      // const { expBuying, expSelling } = queue.splice(best, 1)[0];
      if (
        checked.find((e) =>
          e.expBuying === expBuying &&
          e.expSelling === expSelling
        )
      ) continue;
      checked.push({ expBuying, expSelling });
      if (countMults(expBuying) + countMults(expSelling) > expLimit) {
        if (
          bestMultsAhead(expBuying) + bestMultsAhead(expSelling) <= expLimit
        ) {
          queue.push({ expBuying: expBuying + 1n, expSelling });
          queue.push({ expBuying, expSelling: expSelling + 1n });
        }
        continue;
      }
      s = s.withExp(expSelling);
      b = b.withExp(expBuying);
      // const exceedsMaxInteger = (b.newAnchor > maxInteger) ||
      //   (s.newAnchor > maxInteger); // TODO REVERT
      const exceedsMaxInteger = false;

      const checkNewOption_ = checkNewOption(
        expBuying,
        expSelling,
        exceedsMaxInteger,
      );

      const maxSellingForExp = s.maxDeltaForExp();
      if (maxSellingForExp === null) {
        // if we can't find a delta for this exp (presumably due to rounding-errors), try one bigger
        queue.push({ expBuying, expSelling: expSelling + 1n });
        continue;
      }
      assert(
        maxSellingForExp >= s.minDelta,
        `${maxSellingForExp} < ${s.minDelta}`,
      );
      const maxBuyingForExp = b.maxDeltaForExp();
      if (maxBuyingForExp === null) {
        // if we can't find a delta for this exp (presumably due to rounding-errors), try one bigger
        queue.push({ expBuying: expBuying + 1n, expSelling });
        continue;
      }
      assert(
        maxBuyingForExp >= b.minDelta,
        `${maxBuyingForExp} < ${b.minDelta}`,
      );

      const [buyingMultiplier, sellingMultiplier] = reduce(
        s.a * s.jsppe * b.jsppe,
        b.a * b.jse * s.jse,
      );
      // console.log("buying-multiplier", buyingMultiplier);
      // console.log("selling-multiplier", sellingMultiplier);
      const improvementFeasible_ = improvementFeasible(
        buyingMultiplier,
        sellingMultiplier,
        exceedsMaxInteger,
      );

      // value-equation: deltaBuying * buyingDeltaMultiplier <= deltaSelling * sellingDeltaMultiplier
      if (!improvementFeasible_()) continue;

      // if (mode === "perfect") {
      // trying to find perfect solution, meaning without rounding-error and with tight value equation
      // console.log(
      //   "trying to find perfect solution for ",
      //   expBuying,
      //   expSelling,
      // );

      const minBuyingMultiplier = ceilDiv(
        b.minDelta,
        sellingMultiplier,
      );
      const minSellingMultiplier = ceilDiv(
        s.minDelta,
        buyingMultiplier,
      );
      const minMultiplier = max(minBuyingMultiplier, minSellingMultiplier);

      const maxBuyingMultiplier = maxBuyingForExp /
        sellingMultiplier;
      const maxSellingMultiplier = maxSellingForExp /
        buyingMultiplier;
      const maxMultiplier = min(maxBuyingMultiplier, maxSellingMultiplier);

      if (minMultiplier <= maxMultiplier) {
        const deltaBuying = maxMultiplier * sellingMultiplier;
        const deltaSelling = maxMultiplier * buyingMultiplier;
        checkNewOption_(
          deltaBuying,
          deltaSelling,
          true,
        );
        continue; // if we found a perfect solution, we know that increasing exps will only make it worse
        // }
      } else {
        // try to find imperfect solution if we can't find a perfect one (TODO this eats the bulk of the expected runtime)
        // console.log(
        //   "trying to find imperfect solution for ",
        //   expBuying,
        //   expSelling,
        // );

        const findImperfectExhaustively = (
          minSelling: bigint,
          maxSelling: bigint,
        ): PairOption | null => {
          let prevDeltaBuying: bigint | null = null;
          let deltaSelling = minSelling;
          let bestFoundImprovement: PairOption | null = null;
          while (
            deltaSelling <= maxSelling // && improvementFeasible_() // TODO what
          ) {
            const maxBuyingForSelling = buyingForSelling(deltaSelling);
            if (prevDeltaBuying !== null) {
              assert(
                maxBuyingForSelling > prevDeltaBuying,
                `${maxBuyingForSelling} <= ${prevDeltaBuying}`,
              );
              const maxBuyingForSelling_ =
                ((deltaSelling - 1n) * sellingMultiplier) /
                buyingMultiplier;
              assert(maxBuyingForSelling_ === prevDeltaBuying);
            }
            prevDeltaBuying = maxBuyingForSelling;
            assert(maxBuyingForSelling >= b.minDelta);

            if (maxBuyingForSelling < maxBuyingForExp) {
              const maybeBetter = checkNewOption_(
                maxBuyingForSelling,
                deltaSelling,
                false,
              );
              if (maybeBetter) {
                bestFoundImprovement = maybeBetter;
              }
            } else {
              const maybeBetter = checkNewOption_(
                maxBuyingForExp,
                deltaSelling,
                false,
              );
              if (maybeBetter) {
                bestFoundImprovement = maybeBetter;
              }
              break;
            }

            const minDeltaSellingForNextBuying = sellingForBuying(
              maxBuyingForSelling + 1n,
            );
            assert(minDeltaSellingForNextBuying > deltaSelling);
            deltaSelling = minDeltaSellingForNextBuying;
          }

          return bestFoundImprovement;
        };

        // see math/swapfinding/rounding.ipynb for reasoning behind the algorithm below

        const buyingForSelling = (selling: bigint): bigint =>
          (selling * sellingMultiplier) / buyingMultiplier;
        const sellingForBuying = (buying: bigint): bigint =>
          ceilDiv(buying * buyingMultiplier, sellingMultiplier);

        const minSelling = max(s.minDelta, sellingForBuying(b.minDelta));
        assert(buyingForSelling(minSelling) >= b.minDelta);
        // const maxSelling = maxSellingForExp;
        const maxSelling = min(
          maxSellingForExp,
          sellingForBuying(maxBuyingForExp),
        );
        // assert(
        //   buyingForSelling(maxSelling) <= maxBuyingForExp,
        //   `${maxSelling} * ${sellingMultiplier} / ${buyingMultiplier} = ${
        //     buyingForSelling(maxSelling)
        //   } > ${maxBuyingForExp}`,
        // );

        let bestImperfectOption: PairOption | null = null;
        const foundImperfectSolution = (deltaSelling: bigint) => {
          const deltaBuying = buyingForSelling(deltaSelling);
          console.log("found imperfect solution", deltaBuying, deltaSelling);
          const maybeBetter = checkNewOption_(
            deltaBuying,
            deltaSelling,
            false,
          );
          if (maybeBetter) {
            bestImperfectOption = maybeBetter;
          }
        };
        let runAsserts = true;
        if (minSelling === maxSelling) {
          console.log(`${minSelling} === ${maxSelling}`);
          foundImperfectSolution(minSelling);
        } else if (minSelling < maxSelling) {
          console.log(`${minSelling} < ${maxSelling}`);
          /*
          Starting with the largest delta, we decrease it one by one, recording the best price found.
          If that improves a second time, we assume we have found the distance between points in a "slope".
          We continue decreasing delta by that amount, until the price gets worse again, at which
          point we start over, this time trying to ascertain the distance between slopes.
          This happens automatically, as we keep bestPrice around, which now is the best of the previous slope.
          */

          console.log("m_b =", buyingMultiplier.toString());
          console.log("m_s =", sellingMultiplier.toString());
          console.log("min_delta_b =", b.minDelta.toString());
          console.log("min_delta_s =", s.minDelta.toString());
          console.log("max_delta_b =", maxBuyingForExp.toString());
          console.log("max_delta_s =", maxSellingForExp.toString());

          /*
          We first traverse the rightmost slope, beginning on the right side.
          This might give us a solution already (done = true).
          If not, it gives us the intraSlopeStep and the delta of its leftmost point.
          We then traverse the second slope from the right.
          This might give us a solution too (done = true).
          If so, we take the better one of the two slopes' optima.
          If not, it gives us the delta of its leftmost point, which we can use
          together with the delta of the leftmost point of the first slope to determine the
          interSlopeStep.
          We use this to look through the remaining slopes, only evaluating their best/leftmost
          points.
          */

          /*
          recursive method

          - we note that there are more than two "layers" of slopes - meaning: sometimes the
            iteration over the ends of the (first type of) slope (which we call the secondary
            slope) hits an endpoint - meaning: The following lowest primary-slope-point both
            has a larger price and larger delta-offset than our secondary-slope-stepsize.
            (see the graph in math/swapfinding/rounding copy 4.ipynb)
          - consequently we want to abstract the method of two slopes into one that can deal
            with any number of slopes
          - general approach:
              - starting with slope type n = 1
              - move left until best price improves with stepsize 1 := stepsize(0)
              - if we don't have a stepsize for n, continue until it improves a second time,
                and record stepsize(n)
              - continue using stepsize(n) until price worsens - meaning: we hit the end of
                that slope of type n
              - if we don't have a stepsize for slopes of type n+1, do the same thing again,
                recording the stepsize(n+1) once we reach the end of the second slope
              - once we have a stepsize(n+1), continue moving leftwards using that one, until
                price gets worse again - meaning, we hit the end of the current slope of type
                n+1
              - now our next goal is to find the next leftmost endpoint of the next slope of
                type n+1
              - for that, we first try to find any of it's points - if we got one, we can
                continue stepping through it with stepsize(n) until we find that leftmost point
              - in order to do that, we invoke another fresh instance of this whole algorithm,
                but hand it our knowledge of stepsize(n') for n' <= n+1
              - (we need to invoke it a bit differently, technically, let's figure this out below)
              - this second invocation is supposed to provide us with the second point of
                the slope of type n+2
              - we use this to compute stepsize(n+2)
              - we use this to step through the slope of type n+2, until price gets worse again
              - at


          - implementation:
              - a mapping from n to stepsize(n), initialized with 0 -> 1n
              - a function iterateSlopeType(n)
                - this starts with n_ := 0
                - it invokes iterateSlopeType(n_)
                - this will return a point on the slope of type n_+1
                - it then checks the mapping if we got a stepsize(n_+1)
                - if it doesn't, it invokes iterateSlopeType(n') again, determines stepsize(n_+1),
                  and adds it to the array
                - steps through slope of type n_+1 using stepsize(n_+1)
                - updates the righmost (starting) point with that
                - n_++
                - repeat until n_ === n (or something like that...)
                - returns:
                  - x-coordinate ("bestSelling") of leftmost point of slope of type n
                  - y-coordinate ("bestPrice") of leftmost point of slope of type n
                  - whether the global leftmost end of the x-axis was met ("done")
          */

          /*
          next version:
          - record stepsizes upwards as well
          - if going "downwards" actually makes the price worse (aka we overstepped the slope),
            we take another step with "upwards" stepsize, expecting to hit the next slope again
          -

          */

          /*
          unsorted ideas for other versions:

          - mind the upwards-slopes as well
          - keep a record of all encountered distances, then
              - for all downwards-distances, see if we can find an improvement, recording the best in any case
              - if we can't find an improvement, take the best from the previous and all upwards-distances

          - utilize the fact that we got those parallelograms everywhere
          - same for triangles

          - record for each stepsize also the y-change; then, in each step, try them in order of
            decreasing y-decrease, until one sticks
            - that info -whether it sticks - can probably be made use of as well
            - we can try to lego them together - i.e. if up+down hits, add that to the repertoire
            - we can also record how often we're repeating any move until another one is better,
              and add that to the repertoire
            - question now: how far do we want to go with this pattern-recognition-approach?
              - repetition of the same move should be a no-brainer
              - improvement of global optimum feels dangerous
              - merging direction-change feels like a requirement for serious recursive compression
              - we could also look at the diff between certain events and add those as new moves
                - i.e. direction-changes feel like good candidates
                - or misses of the previous pattern?
                - consider all four combinations of pre/post event
              - we could also in each step:
                - for any sequence-length >= 2 up to a sensible limit:
                  - see if we just encountered a repeating pattern
                  - if we did, add it to the repertoire
                  - consider wiping the history then and/or replacing the pattern in it
                  - also ensure the repertoire doesn't get spammed with a million copies of the same
              - keep in mind that an increasing repertoire will increase the runtime per step
              - we could use the knowledge of the theoretical optimum to skip certain patterns
                - we could in each step use binary search to find the best applicable pattern,
                  try it, and if it fails try the next worse one stepwise
                - we could initialize said binary search with the previous step




          outline of one approach:
          - record best and worst encountered points (initialized with initial)
          - start from the right
          - go left with stepsize 1, minimizing deltaSelling
          - if worst price gets worse a second time, we found an upwards-distance
          - if best price gets better a second time, we found a downwards-distance
          - if we find or already have both, we look at the best price in that loop
          - we repeatedly try
              - first the downwards-distance
              - if that doesn't improve the price, we also look at upwards-distance,
                and pick the better one
              - if our best price improves again, we add that distance to our repertoire
          */

          const stepSizeDownN: Map<number, bigint> = new Map();
          stepSizeDownN.set(0, 1n);

          const stepSizeUpN: Map<number, bigint> = new Map();

          type Point = {
            price: number;
            deltaSelling: bigint;
            deltaBuying: bigint;
            done: boolean;
          };

          const pointForSelling = (deltaSelling: bigint): Point => {
            let done = false;
            if (deltaSelling <= minSelling) {
              deltaSelling = minSelling;
              done = true;
            }
            const deltaBuying = buyingForSelling(deltaSelling);
            const price = Number(deltaSelling) / Number(deltaBuying);
            return { price, deltaSelling, deltaBuying, done };
          };

          const printPoints = (
            n: number,
            points: Point[],
            msg: string,
            returned: Point,
          ) => {
            if (points.length <= 1) return;
            console.log("[ # n =", n, msg);
            points.forEach((point) => {
              console.log(
                `\t(${point.deltaBuying}, ${point.deltaSelling}, ${point.price}),`,
              );
            });
            console.log(
              "], # ->",
              returned.deltaBuying,
              returned.deltaSelling,
              returned.price,
            );
          };

          const minimizeSelling = (point: Point): Point => {
            const stepSize = 1n;
            let lessBuying = pointForSelling(
              point.deltaSelling - stepSize,
            );
            if (point.deltaBuying === lessBuying.deltaBuying) {
              while (point.deltaBuying === lessBuying.deltaBuying) {
                lessBuying = pointForSelling(
                  lessBuying.deltaSelling - stepSize,
                );
                if (lessBuying.done) break;
              }
              point = lessBuying.done ? lessBuying : pointForSelling(
                lessBuying.deltaSelling + stepSize,
              );
            }
            return point;
          };

          let maybeMissed: Point | null = null;

          const iterateSlopeType = (
            n: number,
            rightmost: Point,
          ): Point => {
            const points: Point[] = []; // for debugging
            if (n === 0) {
              // primary type of iteration: until improvement/finding beginning of slope,
              // then until worsening/finding end of slope
              const stepSize = 1n;
              let currentPoint = minimizeSelling(rightmost);
              points.push(currentPoint);
              let bestPoint = currentPoint;
              let withinSlope = false;
              let lookingForUpwards = true;
              let initialUpwardsMovement = true; // TODO hack, likely has edgecases
              while (!currentPoint.done) {
                let nextPoint = pointForSelling(
                  currentPoint.deltaSelling - stepSize,
                );
                nextPoint = minimizeSelling(nextPoint);
                points.push(nextPoint);
                if (nextPoint.price <= bestPoint.price) {
                  initialUpwardsMovement = false;
                  // price getting better -> beginning of slope
                  if (stepSizeDownN.has(1)) {
                    // don't need to find stepSize(1) again
                    printPoints(
                      n,
                      points,
                      "found stepSize(1) before",
                      nextPoint,
                    );
                    return nextPoint;
                  } else if (withinSlope) {
                    // found stepSize(1)
                    const nextStepSize = bestPoint.deltaSelling -
                      nextPoint.deltaSelling;
                    stepSizeDownN.set(1, nextStepSize);
                    printPoints(
                      n,
                      points,
                      "calculating stepSize(1)",
                      nextPoint,
                    );
                    return nextPoint;
                  } else {
                    // looking for stepSize(1) from now on
                    withinSlope = true;
                  }
                  bestPoint = nextPoint;
                } else if (initialUpwardsMovement) {
                  if ((!maybeMissed) || maybeMissed.price > nextPoint.price) {
                    maybeMissed = bestPoint;
                  }
                  bestPoint = nextPoint; // TODO technically wrong, part of said hack
                } // else {
                //   // printPoints(
                //   //   n,
                //   //   points,
                //   //   "found currentPoint",
                //   //   currentPoint,
                //   // );
                //   // return currentPoint;
                // }
                else if (lookingForUpwards) {
                  stepSizeUpN.set(
                    1,
                    bestPoint.deltaSelling - nextPoint.deltaSelling,
                  );
                  lookingForUpwards = false;
                }

                // if (withinSlope && nextPoint.price > rightmost.price) {
                //   // alternative win condition for some edge-cases:
                //   // if we're walking upwards, after finding our first
                //   // improvement, and reaching the point where
                //   // we're getting worse than the initial point, we can
                //   // determine stepsize by going one step back and comparing
                //   // that point with the initial one.

                //   // found stepSize(1)
                //   const nextStepSize = rightmost.deltaSelling -
                //     currentPoint.deltaSelling;
                //   stepSizeDownN.set(1, nextStepSize);
                //   printPoints(
                //     n,
                //     points,
                //     "calculating stepSize(1) (alternative)",
                //     bestPoint,
                //   );
                //   return bestPoint;
                // }

                currentPoint = nextPoint;
              }
              assert(bestPoint);
              printPoints(n, points, "reached minSelling", bestPoint);
              return {
                ...bestPoint,
                done: true,
              };
            } else {
              // secondary+ type of iteration: until worsening/finding end of slope
              let stepSizeUp = stepSizeUpN.get(n);
              let currentPoint: Point;
              if (stepSizeUp) {
                currentPoint = pointForSelling(
                  rightmost.deltaSelling - stepSizeUp + 1n,
                );
              } else {
                currentPoint = iterateSlopeType(n - 1, rightmost);
              }

              points.push(currentPoint);

              const checkIfDone = (nextPoint: Point): Point | null => {
                if (nextPoint.done) {
                  if (nextPoint.price < currentPoint.price) {
                    printPoints(
                      n,
                      points,
                      "reached minSelling (better)",
                      nextPoint,
                    );
                    return nextPoint;
                  } else {
                    printPoints(
                      n,
                      points,
                      "reached minSelling (worse)",
                      currentPoint,
                    );
                    return {
                      ...currentPoint,
                      done: true,
                    };
                  }
                }
                return null;
              };

              if (currentPoint.done) {
                printPoints(
                  n,
                  points,
                  "reached minSelling (currentPoint)",
                  currentPoint,
                );
                return currentPoint;
              }
              let stepSizeDown = stepSizeDownN.get(n);
              if (stepSizeDown === undefined) {
                let nextPoint: Point;
                stepSizeUp = stepSizeUpN.get(n);
                if (stepSizeUp) {
                  nextPoint = pointForSelling(
                    currentPoint.deltaSelling - stepSizeUp,
                  );
                } else {
                  nextPoint = iterateSlopeType(
                    n - 1,
                    pointForSelling(currentPoint.deltaSelling - 1n),
                  );
                }

                points.push(nextPoint);
                const maybeDone = checkIfDone(nextPoint);
                if (maybeDone) return maybeDone;
                stepSizeDown = currentPoint.deltaSelling -
                  nextPoint.deltaSelling;
                stepSizeDownN.set(n, stepSizeDown);
                if (nextPoint.price > currentPoint.price) { // TODO not too sure about this
                  // weird situation where we're continuing upwards with
                  // stepsize(n), until walking downwards once with stepsize(n-1)
                  // gives us an improvement over where we started.
                  // we're starting walking once with stepsize(n-1) first.
                  // remember to update the stepsize(n) with whatever we find
                  // --> no, because the number of steps vary

                  // -> update: some kind of zigzag-motion, until we find an improvement,
                  // using stepsize(n) and stepsize(n-1)

                  // -> update: since it's some sort of square sometimes, also look at
                  // the 3rd point if it exists

                  let smallerStepSize = stepSizeDown;
                  let smallerN = n - 1;
                  while (smallerStepSize === stepSizeDown) {
                    smallerStepSize = stepSizeDownN.get(smallerN--)!; // TODO hack
                  }
                  while (nextPoint.price > currentPoint.price) {
                    const nextPointBigStep = pointForSelling(
                      nextPoint.deltaSelling - stepSizeDown,
                    );
                    const nextPointSmallStep = minimizeSelling(pointForSelling(
                      nextPoint.deltaSelling - smallerStepSize,
                    ));
                    if (nextPointBigStep.price < nextPointSmallStep.price) {
                      const backStep = nextPointSmallStep.deltaSelling -
                        nextPoint.deltaSelling;
                      const nextPointMediumStep = pointForSelling(
                        nextPoint.deltaSelling - stepSizeDown + backStep,
                      );
                      if (nextPointBigStep.price < nextPointMediumStep.price) {
                        nextPoint = nextPointBigStep;
                        points.push(nextPointMediumStep);
                      } else {
                        nextPoint = nextPointMediumStep;
                        points.push(nextPointBigStep);
                      }
                      points.push(nextPointSmallStep);
                    } else {
                      nextPoint = nextPointSmallStep;
                      points.push(nextPointBigStep);
                    }
                    points.push(nextPoint);
                    const maybeDone = checkIfDone(nextPoint);
                    if (maybeDone) return maybeDone;
                  }
                }
                currentPoint = nextPoint;
              }
              while (true) {
                const nextPoint = pointForSelling(
                  currentPoint.deltaSelling - stepSizeDown,
                );
                points.push(nextPoint);
                const maybeDone = checkIfDone(nextPoint);
                if (maybeDone) return maybeDone;
                if (nextPoint.price > currentPoint.price) {
                  // price getting worse -> end of slope
                  printPoints(n, points, "end of slope", currentPoint);
                  return currentPoint;
                }
                points.push(nextPoint);
                currentPoint = nextPoint;
              }
            }
          };

          // let bestOfSlope = pointForSelling(maxSelling);
          // let n = 0;
          console.log("slopes = [");
          // while (!bestOfSlope.done) {
          //   console.log("# new outer iteration:", n);
          //   const bestOfNext = iterateSlopeType(
          //     n++,
          //     pointForSelling(bestOfSlope.deltaSelling - 1n),
          //   );
          // }
          const bestOfSlope = iterateSlopeType(
            100, // TODO probably ugly - first of all what to do with the excess, second of all might need to repeat if we don't hit leftmost end
            pointForSelling(maxSelling),
          );
          console.log("]");
          stepSizeDownN.forEach((stepSize, n) => {
            console.log(`stepSizeDown(${n}) = ${stepSize}`);
          });
          stepSizeUpN.forEach((stepSize, n) => {
            console.log(`stepSizeUp(${n}) = ${stepSize}`);
          });
          console.log("bestOfSlope:", bestOfSlope);
          console.log("maybeMissed:", maybeMissed);
          if (
            maybeMissed && (maybeMissed as Point).price <= bestOfSlope.price
          ) {
            foundImperfectSolution((maybeMissed as Point).deltaSelling);
          } else {
            foundImperfectSolution(bestOfSlope.deltaSelling);
          }
        } // we're here because maxSelling < minSelling
        else if (minSelling <= maxSellingForExp) {
          console.log(`${minSelling} <= ${maxSellingForExp}`);
          const maybeBetter = findImperfectExhaustively(
            minSelling,
            maxSellingForExp,
          );
          if (maybeBetter) {
            bestImperfectOption = maybeBetter;
          }
        } // otherwise no solution possible

        // here: assert that we can't find a better solution
        console.log("exhaustive search");
        const maybeBetter = findImperfectExhaustively(
          minSelling,
          maxSellingForExp,
        );
        if (maybeBetter && runAsserts) {
          console.log("asserting");
          assert(bestImperfectOption !== null, maybeBetter.show());
          const best = bestImperfectOption as PairOption;
          assert(
            best.effectivePrice <= maybeBetter.effectivePrice,
            `${best.effectivePrice} > ${maybeBetter.effectivePrice}
diff: ${best.effectivePrice - maybeBetter.effectivePrice}
best imperfect: ${best.show()} 
exhaustive: ${maybeBetter.show()}}`,
          );
        }
      }

      assert(b.maxDelta !== "oo");
      if (maxBuyingForExp < b.maxDelta) {
        queue.push({ expBuying: expBuying + 1n, expSelling });
      }
      if (s.maxDelta === "oo" || maxSellingForExp < s.maxDelta) {
        queue.push({ expBuying, expSelling: expSelling + 1n });
      }
    }
    //   if (bestPriceOption) break; // since we know that perfect solutions are also optimal
    // }

    // assert(!bestPriceOption || (bestPriceOption as PairOption).perfect); // fails, which means sometimes the best solution has rounding error
    const exceeding = bestExceedingOption as PairOption | null;
    const adhering = bestAdheringOption as PairOption | null;
    this.bestAdheringOption = adhering;
    this.maxIntegerImpacted = exceeding !== null &&
      (adhering === null || exceeding.effectivePrice < adhering.effectivePrice); // not bothering with comparing deltas at this point
    this.bestOverallOption = this.maxIntegerImpacted ? exceeding : adhering;

    assert(!(this.maxIntegerImpacted && adhering)); // just verifying a curious obvervation, no reason to insist on this
  }
}
