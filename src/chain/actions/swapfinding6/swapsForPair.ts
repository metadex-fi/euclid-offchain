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
  readonly l: bigint;
  readonly wl: bigint;
  readonly jspp: bigint;
  readonly logJM: number;
  readonly logAW: number;
  exp: bigint;
  jse: bigint;
  jsppe: bigint;
  constructor(
    readonly type: "buying" | "selling",
    readonly v: bigint,
    readonly available: bigint,
    readonly b: bigint,
    readonly w: bigint,
    readonly a: bigint,
    readonly js: bigint,
    readonly minDelta: bigint,
    readonly maxDelta: bigint | "oo",
  ) {
    if (type === "buying") {
      assert(maxDelta === available);
    }
    assert(maxDelta === "oo" || minDelta <= maxDelta);
    assert(minDelta > 0n);
    this.l = v + b;
    this.wl = this.l * w;
    this.jspp = js + 1n;
    this.logJM = log(this.jspp) - log(this.js);
    this.logAW = log(this.a) - log(this.w);

    this.exp = this.minExpForDelta(this.minDelta);
    this.jse = js ** this.exp;
    this.jsppe = this.jspp ** this.exp;
  }

  public setExp = (to: bigint): void => {
    assert(to >= 0n);
    const by = to - this.exp;
    this.exp = to;
    if (by > 0n) {
      this.jse *= this.js ** by;
      this.jsppe *= this.jspp ** by;
    } else if (by < 0n) {
      this.jse /= this.js ** -by;
      this.jsppe /= this.jspp ** -by;
    }
  };

  public minExpForDelta = (delta: bigint): bigint => {
    const numerator = this.type === "buying"
      ? this.logAW - log(this.l - delta)
      : log(this.l + delta) - this.logAW;

    const exp = BigInt(Math.ceil(numerator / this.logJM));
    if (exp < 0n) return 0n;
    return exp;
  };

  public maxDeltaForExp = (): bigint => {
    const maxDelta = this.type === "buying"
      ? (this.wl * this.jsppe - this.a * this.jse) / (this.jsppe * this.w)
      : (this.a * this.jsppe - this.wl * this.jse) / (this.jse * this.w);
    if (maxDelta <= 0n) return 1n; // apparently rounding errors? TODO check
    if (this.maxDelta === "oo") {
      return maxDelta;
    } else {
      return min(maxDelta, this.maxDelta);
    }
  };
}

class PairOption {
  constructor(
    readonly b: AssetOption,
    readonly s: AssetOption,
    readonly deltaBuying: bigint,
    readonly deltaSelling: bigint,
    readonly expBuying: bigint,
    readonly expSelling: bigint,
    readonly effectivePrice: number,
    readonly perfect: boolean,
  ) {
    assert(b.type === "buying");
    assert(s.type === "selling");
    assert(deltaBuying >= b.minDelta, `${deltaBuying} < ${b.minDelta}`);
    assert(deltaSelling >= s.minDelta, `${deltaSelling} < ${s.minDelta}`);
    assert(b.maxDelta === b.available);
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
}

const log = (x: bigint): number => Math.log(Number(x));

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
  readonly bestPriceOption: PairOption | null = null;

  constructor(
    b: AssetOption,
    s: AssetOption,
    expLimit: number,
    perfectionism = 1000000n,
  ) {
    assert(b.type === "buying");
    assert(s.type === "selling");
    assert(b.maxDelta === b.available);

    const minExpSelling = s.minExpForDelta(s.minDelta);
    const minExpBuying = b.minExpForDelta(b.minDelta);

    let bestPriceOption: PairOption | null = null;
    // let now = performance.now();

    const checkNewOption = (
      expBuying: bigint,
      expSelling: bigint,
    ) =>
    (
      deltaBuying: bigint,
      deltaSelling: bigint,
      perfect: boolean,
    ) => {
      const effectivePrice = Number(deltaSelling) / Number(deltaBuying);
      if (
        (!bestPriceOption) ||
        effectivePrice < bestPriceOption.effectivePrice || // TODO Revert
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
        bestPriceOption = new PairOption(
          b,
          s,
          deltaBuying,
          deltaSelling,
          expBuying,
          expSelling,
          effectivePrice,
          perfect,
        );
      } else if (bestPriceOption) {
        assert(!perfect);
        // if we already found a solution, and this one is not better, we assert it isn't perfect
        // -> perfect solutions are always optimal (fails if we do perfect first)
      }
    };

    const improvementFeasible = (
      buyingDeltaMultiplier: bigint,
      sellingDeltaMultiplier: bigint,
    ): boolean => {
      if (bestPriceOption) {
        // spot = buyingDeltaMultiplier / sellingDeltaMultiplier
        // effective = deltaSelling / deltaBuying
        // spot > effective
        // <=> buyingDeltaMultiplier / sellingDeltaMultiplier > deltaSelling / deltaBuying
        // <=> buyingDeltaMultiplier * deltaBuying > sellingDeltaMultiplier * deltaSelling
        const best = bestPriceOption as PairOption;
        if (
          buyingDeltaMultiplier * best.deltaBuying >
            sellingDeltaMultiplier * best.deltaSelling
        ) return false; // spot price is the best we can get, so if that's worse than what we got already, we can skip this
        else {
          const mDeltaBuying = best.deltaBuying * buyingDeltaMultiplier;
          const mDeltaSelling = best.deltaSelling * sellingDeltaMultiplier;
          const improvement = (perfectionism * (mDeltaSelling - mDeltaBuying)) /
            mDeltaSelling;
          // console.log(
          //   "maximum possible improvement:",
          //   (100 * Number(improvement)) / Number(perfectionism),
          //   "%",
          // );
          if (improvement === 0n) return false; // good enough
        }
      }
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
      s.setExp(expSelling);
      b.setExp(expBuying);
      if (
        (b.a * b.jse) / b.jsppe > maxInteger ||
        (s.a * s.jsppe) / s.jse > maxInteger
      ) {
        // console.log("maxInteger exceeded");
        continue;
      }
      const checkNewOption_ = checkNewOption(expBuying, expSelling);

      const maxDeltaForExpSelling = s.maxDeltaForExp();
      assert(maxDeltaForExpSelling >= s.minDelta);
      const maxDeltaForExpBuying = b.maxDeltaForExp();
      assert(maxDeltaForExpBuying >= b.minDelta);

      const buyingDeltaMultiplierRaw = s.a * s.jsppe * b.jsppe;
      const sellingDeltaMultiplierRaw = b.a * b.jse * s.jse;

      // value-equation: deltaBuying * buyingDeltaMultiplier <= deltaSelling * sellingDeltaMultiplier
      if (
        !improvementFeasible(
          buyingDeltaMultiplierRaw,
          sellingDeltaMultiplierRaw,
        )
      ) continue;

      const [buyingDeltaMultiplier, sellingDeltaMultiplier] = reduce(
        buyingDeltaMultiplierRaw,
        sellingDeltaMultiplierRaw,
      );

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
        let bestPrice: number | null = null;
        // let pivot = false;
        let prevDeltaBuying: bigint | null = null;
        // let prevDeltaSelling: bigint | null = null;
        let bestDeltaSelling: bigint | null = null;
        let deltaSelling = minDeltaSelling;
        while (
          deltaSelling <= maxDeltaForExpSelling &&
          improvementFeasible(buyingDeltaMultiplier, sellingDeltaMultiplier)
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

            const effectivePrice = Number(deltaSelling) /
              Number(maxBuyingForSelling);
            if (bestPrice === null || effectivePrice < bestPrice) {
              bestPrice = effectivePrice;
              bestDeltaSelling = deltaSelling;
            }
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
    this.bestPriceOption = bestPriceOption;
  }
}
