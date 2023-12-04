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

          console.log("m_b =", buyingMultiplier.toString());
          console.log("m_s =", sellingMultiplier.toString());
          console.log("min_delta_b =", b.minDelta.toString());
          console.log("min_delta_s =", s.minDelta.toString());
          console.log("max_delta_b =", maxBuyingForExp.toString());
          console.log("max_delta_s =", maxSellingForExp.toString());

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



            for starters: simply try to find the up/down distances and use those to traverse the data
          */

          type Point = {
            price: number;
            deltaSelling: bigint;
            deltaBuying: bigint;
            done: boolean;
          };

          const pointForSelling = (deltaSelling: bigint): Point => {
            let done = false;
            if (deltaSelling < minSelling) {
              deltaSelling = minSelling;
              done = true;
            }
            const deltaBuying = buyingForSelling(deltaSelling);
            const price = Number(deltaSelling) / Number(deltaBuying);
            return { price, deltaSelling, deltaBuying, done };
          };

          const pointForBuying = (deltaBuying: bigint): Point => {
            let deltaSelling = sellingForBuying(deltaBuying);
            let done = false;
            if (deltaSelling < minSelling) {
              deltaSelling = minSelling;
              done = true;
            }
            const price = Number(deltaSelling) / Number(deltaBuying);
            return { price, deltaSelling, deltaBuying, done };
          };

          const minimizeSelling = (point: Point): Point => {
            const stepSize = 1n;
            let lessBuying = pointForSelling(
              point.deltaSelling - stepSize,
            );
            if (point.deltaBuying === lessBuying.deltaBuying) {
              while (point.deltaBuying === lessBuying.deltaBuying) {
                // console.log(
                //   "minimzing_ selling",
                //   lessBuying.deltaBuying,
                //   lessBuying.deltaSelling,
                //   lessBuying.price,
                //   lessBuying.done,
                // );
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

          // const minimizeSelling = (point: Point): Point => {
          //   console.log("minimizing:", point);
          //   // const point_ = minimizeSelling_(point);
          //   const stepSize = 1n;
          //   let lessBuying = pointForSelling(
          //     point.deltaSelling - stepSize,
          //   );
          //   if (point.deltaBuying === lessBuying.deltaBuying) {
          //     lessBuying = pointForBuying(point.deltaBuying - stepSize);
          //     while (lessBuying.deltaBuying < point.deltaBuying) {
          //       console.log(
          //         "minimzing selling",
          //         lessBuying.deltaBuying,
          //         lessBuying.deltaSelling,
          //         lessBuying.price,
          //         lessBuying.done,
          //       );
          //       lessBuying = pointForSelling(
          //         lessBuying.deltaSelling + stepSize,
          //       );
          //       // if (lessBuying.done) break;
          //     }
          //     point = lessBuying.done ? lessBuying : pointForSelling(
          //       lessBuying.deltaSelling + stepSize,
          //     );
          //   }
          //   return minimizeSelling_(point);
          //   // console.log(point);
          //   // console.log(point_);
          //   // assert(point.deltaBuying === point_.deltaBuying);
          //   // assert(point.deltaSelling === point_.deltaSelling);
          //   // assert(point.price === point_.price);
          //   // return point;
          // };

          const stepPoint = (point: Point, stepSize = 1n): Point => {
            const nextPoint = pointForSelling(point.deltaSelling - stepSize);
            return minimizeSelling(nextPoint);
          };

          // const skipped1 = pointForSelling(maxSelling);
          // const skipped2 = stepPoint(skipped1);
          let currentPoint = minimizeSelling(pointForSelling(maxSelling));
          // let currentPoint = stepPoint(skipped2); // TODO hack
          let bestPoint = currentPoint;
          let secondBest: Point | null = null;
          let bestBettered = false;
          let stepSizeDown: bigint | null = null;
          let stepSizeUp: bigint | null = null;

          const print = true;

          // finding stepSizes
          if (print) console.log("slopes = [[");
          if (print) {
            console.log(
              `\t(${currentPoint.deltaBuying}, ${currentPoint.deltaSelling}, ${currentPoint.price}),`,
            );
          }
          // for infinite loop detection
          // const seenPrices: Map<number, number> = new Map();
          let previousPoints = [currentPoint];
          let groundhogs = 0;
          const groundhogLimit = 100;
          const memsize = 3;
          let infiniteLoop = false;
          while (((!stepSizeDown) || (!stepSizeUp)) && (!currentPoint.done)) {
            const nextPoint = stepPoint(currentPoint);
            // const seen = seenPrices.get(nextPoint.price) ?? 0;
            // seenPrices.set(nextPoint.price, seen + 1);
            // if (seen > 10) {
            //   infiniteLoop = true;
            //   break;
            // }
            // console.log(nextPoint);
            if (nextPoint.price < bestPoint.price) {
              if (bestBettered) {
                stepSizeDown = bestPoint.deltaSelling - nextPoint.deltaSelling;
                if (
                  secondBest && bestPoint.deltaSelling > secondBest.deltaSelling
                ) {
                  stepSizeUp = bestPoint.deltaSelling - secondBest.deltaSelling;
                }
              } else bestBettered = true;
              bestPoint = nextPoint;
            } else if ((!secondBest) || nextPoint.price <= secondBest.price) {
              secondBest = nextPoint;
            }
            if (
              previousPoints.some((previousPoint) =>
                previousPoint.price === nextPoint.price
              )
            ) {
              if (++groundhogs > groundhogLimit) {
                infiniteLoop = true;
                console.log("infinite loop");
                break;
              }
            } else {
              groundhogs = 0;
              previousPoints = [nextPoint, ...previousPoints].slice(
                0,
                memsize,
              );
            }
            currentPoint = nextPoint;
            if (print) {
              console.log(
                `\t(${currentPoint.deltaBuying}, ${currentPoint.deltaSelling}, ${currentPoint.price}),`,
              );
            }
          }
          if (!infiniteLoop) {
            if (!print) console.log("stepSizeDown", stepSizeDown);
            if (!print) console.log("stepSizeUp", stepSizeUp);

            const stepSizesDown = [{ stepSize: stepSizeDown, repeats: 1n }];
            let bestRepeatsGlobal = 1n;

            // traversing boundary of feasible region using stepSizes
            if (print) console.log("],[");
            if (!currentPoint.done) {
              assert(stepSizeDown, `${stepSizeDown}`);
              assert(stepSizeUp, `${stepSizeUp}`);
              assert(stepSizeDown > 0, `${stepSizeDown}`);
              assert(stepSizeUp > 0, `${stepSizeUp}`);
              currentPoint = bestPoint;
              if (print) {
                console.log(
                  `\t(${currentPoint.deltaBuying}, ${currentPoint.deltaSelling}, ${currentPoint.price}),`,
                );
              }
              let repeatedDown = 0n;
              // seenPrices.clear();
              while (!currentPoint.done) {
                let nextPoint = stepPoint(currentPoint, stepSizeUp);
                let bestRepeats = -1n;
                for (const down of stepSizesDown) {
                  assert(down.stepSize);
                  const step = stepPoint(currentPoint, down.stepSize);
                  if (step.price < nextPoint.price) {
                    bestRepeats = down.repeats;
                    nextPoint = step;
                  }
                }
                if (bestRepeats === -1n) {
                  if (repeatedDown > bestRepeatsGlobal) {
                    bestRepeatsGlobal = repeatedDown;
                    stepSizesDown.push({
                      stepSize: stepSizeDown * repeatedDown,
                      repeats: repeatedDown,
                    });
                  }
                  repeatedDown = 0n;
                } else {
                  repeatedDown += bestRepeats;
                }
                assert(nextPoint);
                if (
                  previousPoints.some((previousPoint) =>
                    previousPoint.price === nextPoint.price
                  )
                ) {
                  if (++groundhogs > groundhogLimit) {
                    infiniteLoop = true;
                    console.log("infinite loop");
                    break;
                  }
                } else {
                  groundhogs = 0;
                  previousPoints = [nextPoint, ...previousPoints].slice(
                    0,
                    memsize,
                  );
                }
                currentPoint = nextPoint;
                // const seen = seenPrices.get(currentPoint.price) ?? 0;
                // seenPrices.set(currentPoint.price, seen + 1);
                // if (seen > 10) {
                //   infiniteLoop = true;
                //   break;
                // }
                if (currentPoint.price < bestPoint.price) {
                  bestPoint = currentPoint;
                }
                if (print) {
                  console.log(
                    `\t(${currentPoint.deltaBuying}, ${currentPoint.deltaSelling}, ${currentPoint.price}),`,
                  );
                }
              }
            }
            if (print) console.log("]]");
          } else {
            runAsserts = false; // TODO FIXME
          }
          console.log("stepSizeDown", stepSizeDown);
          console.log("stepSizeUp", stepSizeUp);
          // if (skipped1.price < bestPoint.price) {
          //   bestPoint = skipped1;
          // }
          // if (skipped2.price < bestPoint.price) {
          //   bestPoint = skipped2;
          // }
          foundImperfectSolution(bestPoint.deltaSelling);
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
        // console.log("exhaustive search");
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
