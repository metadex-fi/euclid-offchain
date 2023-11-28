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
    return this.type === "buying"
      ? (this.a * this.jse) / this.jsppe
      : (this.a * this.jsppe) / this.jse;
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
${ttf}l: ${this.l}
${ttf}wl: ${this.wl}
${ttf}jspp: ${this.jspp}
${ttf}logJM: ${this.logJM}
${ttf}logAW: ${this.logAW}
${ttf}exp: ${this.exp}
${ttf}jse: ${this.jse}
${ttf}jsppe: ${this.jsppe}
${tt})`;
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
  ): PairOption => {
    const option = new PairOption(
      b,
      s,
      deltaBuying,
      deltaSelling,
      effectivePrice,
      perfect,
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
    );
    assert(
      !option.validates(),
      `corrupted option should fail offchain validation: ${option.show()}`,
    );
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
    perfectionism = 1000n,
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
    ) => {
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
        );
        if (exceedsMaxInteger) {
          bestExceedingOption = bestPriceOption;
        } else {
          bestAdheringOption = bestPriceOption;
        }
      } else if (bestPriceOption) {
        assert(!perfect);
        // if we already found a solution, and this one is not better, we assert it isn't perfect
        // -> perfect solutions are always optimal (fails if we do perfect first)
      }
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
        else {
          const potential = (perfectionism * (mDeltaSelling - mDeltaBuying)) /
            mDeltaSelling;
          // console.log(
          //   "maximum possible improvement:",
          //   (100 * Number(potential)) / Number(perfectionism),
          //   "%",
          // );
          if (potential === 0n) return false; // good enough
        }
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
      const { expBuying, expSelling } = queue.shift()!;
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
      const exceedsMaxInteger = (b.newAnchor > maxInteger) ||
        (s.newAnchor > maxInteger);

      const checkNewOption_ = checkNewOption(
        expBuying,
        expSelling,
        exceedsMaxInteger,
      );

      const maxDeltaForExpSelling = s.maxDeltaForExp();
      if (maxDeltaForExpSelling === null) {
        // if we can't find a delta for this exp (presumably due to rounding-errors), try one bigger
        queue.push({ expBuying, expSelling: expSelling + 1n });
        continue;
      }
      assert(
        maxDeltaForExpSelling >= s.minDelta,
        `${maxDeltaForExpSelling} < ${s.minDelta}`,
      );
      const maxDeltaForExpBuying = b.maxDeltaForExp();
      if (maxDeltaForExpBuying === null) {
        // if we can't find a delta for this exp (presumably due to rounding-errors), try one bigger
        queue.push({ expBuying: expBuying + 1n, expSelling });
        continue;
      }
      assert(
        maxDeltaForExpBuying >= b.minDelta,
        `${maxDeltaForExpBuying} < ${b.minDelta}`,
      );

      const buyingDeltaMultiplierRaw = s.a * s.jsppe * b.jsppe;
      const sellingDeltaMultiplierRaw = b.a * b.jse * s.jse;
      const [buyingDeltaMultiplier, sellingDeltaMultiplier] = reduce(
        buyingDeltaMultiplierRaw,
        sellingDeltaMultiplierRaw,
      );
      const improvementFeasible_ = improvementFeasible(
        buyingDeltaMultiplier,
        sellingDeltaMultiplier,
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
        sellingDeltaMultiplier,
      );
      const minSellingMultiplier = ceilDiv(
        s.minDelta,
        buyingDeltaMultiplier,
      );
      const minMultiplier = max(minBuyingMultiplier, minSellingMultiplier);

      const maxBuyingMultiplier = maxDeltaForExpBuying /
        sellingDeltaMultiplier;
      const maxSellingMultiplier = maxDeltaForExpSelling /
        buyingDeltaMultiplier;
      const maxMultiplier = min(maxBuyingMultiplier, maxSellingMultiplier);

      if (minMultiplier <= maxMultiplier) {
        const deltaBuying = maxMultiplier * sellingDeltaMultiplier;
        const deltaSelling = maxMultiplier * buyingDeltaMultiplier;
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

        const minSellingForMinBuying = ceilDiv(
          b.minDelta * buyingDeltaMultiplier,
          sellingDeltaMultiplier,
        );
        const minDeltaSelling = max(minSellingForMinBuying, s.minDelta);
        // let direction: "worse" | "better" | "start" = "start";
        // let bestPrice: number | null = null;
        // let pivot = false;
        let prevDeltaBuying: bigint | null = null;
        // let prevDeltaSelling: bigint | null = null;
        // let bestDeltaSelling: bigint | null = null;
        let deltaSelling = minDeltaSelling;
        while (
          deltaSelling <= maxDeltaForExpSelling && improvementFeasible_()
        ) {
          const maxBuyingForSelling = (deltaSelling * sellingDeltaMultiplier) /
            buyingDeltaMultiplier;
          // if (prevDeltaBuying === maxBuyingForSelling) {
          //   // console.log("same");
          //   continue;
          // }
          if (prevDeltaBuying !== null) {
            assert(
              maxBuyingForSelling > prevDeltaBuying,
              `${maxBuyingForSelling} <= ${prevDeltaBuying}`,
            );
            const maxBuyingForSelling_ =
              ((deltaSelling - 1n) * sellingDeltaMultiplier) /
              buyingDeltaMultiplier;
            assert(maxBuyingForSelling_ === prevDeltaBuying);
          }
          prevDeltaBuying = maxBuyingForSelling;
          // if (prevDeltaSelling !== null) {
          //   console.log("diff deltaSelling:", deltaSelling - prevDeltaSelling);
          // }
          // prevDeltaSelling = deltaSelling;
          assert(maxBuyingForSelling >= b.minDelta);
          // const effectivePrice = Number(deltaSelling) /
          //   Number(maxBuyingForSelling);
          // console.log(
          //   deltaSelling,
          //   maxBuyingForSelling,
          //   effectivePrice,
          //   bestPriceOption
          //     ? (bestPriceOption as PairOption).effectivePrice - effectivePrice
          //     : null,
          // );

          if (maxBuyingForSelling < maxDeltaForExpBuying) {
            checkNewOption_(
              maxBuyingForSelling,
              deltaSelling,
              false,
            );

            // const effectivePrice = Number(deltaSelling) /
            //   Number(maxBuyingForSelling);
            // if (bestPrice === null || effectivePrice < bestPrice) {
            //   bestPrice = effectivePrice;
            //   bestDeltaSelling = deltaSelling;
            // }
          } else {
            checkNewOption_(
              maxDeltaForExpBuying,
              deltaSelling,
              false,
            );
            break;
          }

          const minDeltaSellingForNextBuying = ceilDiv(
            (maxBuyingForSelling + 1n) * buyingDeltaMultiplier,
            sellingDeltaMultiplier,
          );
          assert(minDeltaSellingForNextBuying > deltaSelling);
          deltaSelling = minDeltaSellingForNextBuying;
        }
        // if (bestDeltaSelling !== null) {
        //   {
        //     console.log(
        //       "bestDeltaSelling after:",
        //       (100 * Number(bestDeltaSelling - minDeltaSelling)) /
        //         Number(maxDeltaForExpSelling - minDeltaSelling),
        //       "%",
        //     );
        //   }
        //   // console.log(
        //   //   "bestDeltaSelling:",
        //   //   bestDeltaSelling,
        //   //   "of",
        //   //   minDeltaSelling,
        //   //   "-",
        //   //   maxDeltaForExpSelling,
        //   // );
        //   // assert(bestDeltaSelling === maxDeltaForExpSelling); // fails
        // }
      }

      assert(b.maxDelta !== "oo");
      if (maxDeltaForExpBuying < b.maxDelta) {
        queue.push({ expBuying: expBuying + 1n, expSelling });
      }
      if (s.maxDelta === "oo" || maxDeltaForExpSelling < s.maxDelta) {
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
