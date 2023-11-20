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
import { maxSmallInteger } from "../../../types/euclid/smallValue.ts";
import { PPositive } from "../../../types/general/derived/bounded/positive.ts";
import { Param } from "../../../types/euclid/param.ts";

export const genWildAssetParams = () => {
  const virtual = genPositive(maxInteger);
  const balance = genNonNegative(maxInteger - virtual);
  const locked = genNonNegative(balance);
  const available = balance - locked;
  const weight = genPositive(randomChoice([maxInteger, maxIntRoot]));
  const anchor = genPositive(maxInteger);
  const minDelta = genPositive(maxInteger);
  return { virtual, balance, available, weight, anchor, minDelta };
};

export const genTightAssetParams = (jumpSize: bigint) => {
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
  return { virtual, balance, available, weight, anchor, minDelta };
};

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

export class AssetConstants {
  readonly l: bigint;
  constructor(
    readonly type: "buying" | "selling",
    readonly v: bigint,
    readonly available: bigint,
    readonly b: bigint,
    readonly w: bigint,
    readonly a: bigint,
    readonly minDelta: bigint,
    readonly maxDelta: bigint | "oo",
  ) {
    if (type === "buying") {
      assert(maxDelta === available);
    }
    assert(maxDelta === "oo" || minDelta <= maxDelta);
    assert(minDelta > 0n);
    this.l = v + b;
  }
}

class PairOption {
  readonly effectivePrice: number;
  private constructor(
    readonly b: AssetConstants,
    readonly s: AssetConstants,
    readonly deltaBuying: bigint,
    readonly deltaSelling: bigint,
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
    this.effectivePrice = Number(this.deltaSelling) / Number(this.deltaBuying);
  }

  /*

  general strategy:

  - we have upper and lower bounds for buying and selling (minDelta and maxDelta)
  - for each asset, we first try to find a perfect solution, by trying to find the largest multiple of the denominator that satisfies the constraints
    - we do that by binary search over the range of the asset's multiples of the denominator, and checking the bounds of the other asset within
  - if that fails, we have one of the following scenarios:
    - A: the smallest rounded value is too large
      -> we use binary search to search the interval between the smallest value and the smallest rounded value for a solution
        - as first condition we check that the resulting other delta is within the bounds
        - to minimize rounding error:
          - we look for a minimal solution for deltaBuying, as we have to round that one down,
          - and a maximized one for deltaSelling, as we have to round that one up
        - if that fails, there is no solution
    - B: the largest rounded value is too small
      -> we use binary search to search the interval between the largest rounded value and the maximum value for a solution
        - as first condition we check that the resulting other delta is within the bounds
        - to minimize rounding error:
          - we look for a minimal solution for deltaBuying, as we have to round that one down,
          - and a maximized one for deltaSelling, as we have to round that one up
        - if that fails, there is no solution
    - C: one rounded value is too small and the next one too large
      -> we use binary search to search the interval between those two rounded values for a solution
        - as first condition we check that the resulting other delta is within the bounds
        - to minimize rounding error:
          - we look for a minimal solution for deltaBuying, as we have to round that one down,
          - and a maximized one for deltaSelling, as we have to round that one up
        - if that fails, there is no solution

    => the 2x3 cases only differ by the starting and ending points of the binary search, and the direction to optimize for
    => we also need to note the rounded boundaries during the first binary search

  */

  static fromBoth = (
    b: AssetConstants,
    s: AssetConstants,
    jse: bigint, // = js ** exp
    jsppe: bigint, // = js ** exp
    numerator: bigint, // = b.a * jse (reduced)
    denominator: bigint, // = s.a * jsppe (reduced)
  ): PairOption | null => {
    assert(b.maxDelta === b.available);
    const maxDeltaBuying = min(
      b.maxDelta,
      (b.l * b.w * jse - b.a * jsppe) / (b.w * jse),
    );
    assert(b.minDelta <= maxDeltaBuying);

    let maxDeltaSelling = (s.a * jsppe - s.l * s.w * jse) / (s.w * jse);
    if (s.maxDelta !== "oo") {
      maxDeltaSelling = min(maxDeltaSelling, s.maxDelta);
    }
    assert(s.minDelta <= maxDeltaSelling);

    // we can actually skip the first binary search by including buying in the boundaries
    const start = max(
      ceilDiv(s.minDelta, denominator),
      ceilDiv(b.minDelta, numerator),
    );
    const end = min(
      maxDeltaSelling / denominator,
      maxDeltaBuying / numerator,
    );

    if (start <= end) {
      const deltaSelling = end * denominator;
      const deltaBuying = end * numerator;
      assert(
        deltaSelling * numerator === deltaBuying * denominator,
        `${deltaSelling} * ${numerator} !== ${deltaBuying} * ${denominator}`,
      );
      return new PairOption(b, s, deltaBuying, deltaSelling, false); // found perfect solution
    } else {
      // if there isn't a perfect solution, how do we determine the boundaries for the secondary search?

      // rounding in the other direction
      const start = max(
        s.minDelta / denominator,
        b.minDelta / numerator,
      );
      const end = min(
        ceilDiv(maxDeltaSelling, denominator),
        ceilDiv(maxDeltaBuying, numerator),
      );

      if (start <= end) {
        let startSelling = max(s.minDelta, start * denominator);
        let endSelling = min(maxDeltaSelling, end * denominator);
        if (startSelling > endSelling) return null; // no overlap

        let startBuying = max(b.minDelta, start * numerator);
        let endBuying = min(maxDeltaBuying, end * numerator);
        if (startBuying > endBuying) return null; // no overlap

        let bestSellingFromSelling: bigint | null = null;
        let bestBuyingFromSelling: bigint | null = null;
        let bestPriceFromSelling: number | null = null;
        // trying to find the smallest, in order to reduce rounding-down error in the division below
        while (startSelling <= endSelling) {
          const deltaSelling = (startSelling + endSelling) / 2n;
          const deltaBuying = (deltaSelling / denominator) * numerator;
          if (deltaBuying >= b.minDelta) {
            if (deltaBuying <= maxDeltaBuying) {
              bestSellingFromSelling = deltaSelling;
              bestBuyingFromSelling = deltaBuying;
            }
            endSelling = deltaSelling - 1n;
          } else {
            startSelling = deltaSelling + 1n;
          }
        }
        if (bestBuyingFromSelling) {
          assert(bestSellingFromSelling);
          assert(
            bestSellingFromSelling * numerator >
              bestBuyingFromSelling * denominator,
            `${bestSellingFromSelling} * ${numerator} <= ${bestBuyingFromSelling} * ${denominator}`,
          );
          bestPriceFromSelling = Number(bestSellingFromSelling) /
            Number(bestBuyingFromSelling);
        }

        let bestSellingFromBuying: bigint | null = null;
        let bestBuyingFromBuying: bigint | null = null;
        let bestPriceFromBuying: number | null = null;
        // trying to find the largest, in order to reduce rounding-up error in the ceilDiv below
        while (startBuying <= endBuying) {
          const deltaBuying = (startBuying + endBuying) / 2n;
          const deltaSelling = ceilDiv(deltaBuying * denominator, numerator);
          if (deltaSelling <= maxDeltaSelling) {
            if (deltaSelling >= s.minDelta) {
              bestSellingFromBuying = deltaSelling;
              bestBuyingFromBuying = deltaBuying;
            }
            startBuying = deltaBuying + 1n;
          } else {
            endBuying = deltaBuying - 1n;
          }
        }
        if (bestBuyingFromBuying) {
          assert(bestSellingFromBuying);
          assert(
            bestSellingFromBuying * numerator >
              bestBuyingFromBuying * denominator,
            `${bestSellingFromBuying} * ${numerator} <= ${bestBuyingFromBuying} * ${denominator}`,
          );
          bestPriceFromBuying = Number(bestSellingFromBuying) /
            Number(bestBuyingFromBuying);
        }

        // TODO investigate which combinations do and should happen, respectively
        if (bestPriceFromSelling === null) {
          if (bestPriceFromBuying === null) {
            return null; // no overlap -- TODO: should this be allowed?
          } else {
            return new PairOption(
              b,
              s,
              bestBuyingFromBuying!,
              bestSellingFromBuying!,
              false,
            );
          }
        } else {
          if (
            bestPriceFromBuying === null ||
            bestPriceFromSelling < bestPriceFromBuying
          ) {
            return new PairOption(
              b,
              s,
              bestBuyingFromSelling!,
              bestSellingFromSelling!,
              false,
            );
          } else if (bestPriceFromSelling > bestPriceFromBuying) {
            return new PairOption(
              b,
              s,
              bestBuyingFromBuying!,
              bestSellingFromBuying!,
              false,
            );
            // same prices, returning the one with the higher trade size
          } else if (bestSellingFromSelling! > bestSellingFromBuying!) {
            assert(bestBuyingFromSelling! > bestBuyingFromBuying!);
            return new PairOption(
              b,
              s,
              bestBuyingFromSelling!,
              bestSellingFromSelling!,
              false,
            );
          } else {
            assert(bestBuyingFromSelling! <= bestBuyingFromBuying!);
            return new PairOption(
              b,
              s,
              bestBuyingFromBuying!,
              bestSellingFromBuying!,
              false,
            );
          }
        }
      } else {
        return null; // no overlap by a long shot
      }
    }
  };
}

export class PairOptions {
  readonly options: PairOption[] = [];

  constructor(
    b: AssetConstants,
    s: AssetConstants,
    js: bigint,
    expLimit: number,
  ) {
    assert(b.type === "buying");
    assert(s.type === "selling");

    const jspp = js + 1n;
    const logJM = log(jspp) - log(js);
    const minExp = BigInt(Math.ceil(
      (log(s.w * (s.v + s.b + s.minDelta)) - log(s.a)) /
        logJM,
    ));

    const maxExp = BigInt(Math.floor(
      (log(b.w * (b.v + b.b - b.minDelta)) - log(b.a)) /
        logJM,
    ));

    let exp = minExp;
    let jse: bigint;
    let jsppe: bigint;
    const [js_, jspp_] = reduce(js, jspp);
    if (exp < 0n) {
      jse = jspp ** -exp;
      jsppe = js ** -exp;
    } else {
      jse = js ** exp;
      jsppe = jspp ** exp;
    }
    let [numerator, denominator] = reduce(b.a * jse, s.a * jsppe);
    while (exp <= maxExp) {
      if (countMults(exp) <= expLimit) {
        const fromBoth = PairOption.fromBoth(
          b,
          s,
          jse,
          jsppe,
          numerator,
          denominator,
        );

        if (fromBoth) {
          const ammSelling = s.w * (s.l + fromBoth.deltaSelling);
          assert(jse * ammSelling <= s.a * jsppe); // = adheres onchain
          const ammBuying = b.w * (b.l - fromBoth.deltaBuying);
          assert(jse * ammBuying >= b.a * jsppe); // = adheres onchain

          this.options.push(fromBoth);
        }
      }
      exp++;
      if (exp < 0n) {
        jse /= jspp;
        jsppe /= js;
      } else if (exp === 0n) {
        jse = 1n;
        jsppe = 1n;
      } else {
        jse *= js;
        jsppe *= jspp;
      }
      [numerator, denominator] = reduce(numerator * js_, denominator * jspp_);
      // [numerator, denominator] = [numerator * js_, denominator * jspp_]; // doesn't work
      // const [numerator_, denominator_] = reduce(b.a * jse, s.a * jsppe); // works
      // assert(numerator === numerator_);
      // assert(denominator === denominator_);
    }

    // fails unless we add that perfect-clause
    // for (let i = 0; i < this.options.length - 1; i++) {
    //   const first = this.options[i];
    //   const second = this.options[i + 1];
    //   if (first.perfect) { // passes
    //   // if (first.perfect || (!second.perfect)) { // fails
    //     assert(
    //       first.effectivePrice <= second.effectivePrice,
    //       `${first.effectivePrice} > ${second.effectivePrice} (${i}-${
    //         i + 1
    //       } / ${this.options.length})`,
    //     );
    //   }
    // }

    // passes -> solutions without rounding-error cannot be improved in regards to price by increasing exponent
    for (let i = 0; i < this.options.length - 1; i++) {
      const first = this.options[i];
      if (first.perfect) {
        for (let j = i + 1; j < this.options.length; j++) {
          const second = this.options[j];
          assert(
            first.effectivePrice <= second.effectivePrice,
            `${first.effectivePrice} > ${second.effectivePrice} (${i}-${
              i + 1
            } / ${this.options.length})`,
          );
        }
      }
    }

    // passes -> the first solution without rounding-error has the lowest price
    for (let i = 0; i < this.options.length; i++) {
      const first = this.options[i];
      if (first.perfect) {
        for (let j = 0; j < i; j++) {
          const second = this.options[j];
          assert(
            first.effectivePrice <= second.effectivePrice,
            `${first.effectivePrice} > ${second.effectivePrice} (${i}-${
              i + 1
            } / ${this.options.length})`,
          );
        }
        break;
      }
    }
  }
}
