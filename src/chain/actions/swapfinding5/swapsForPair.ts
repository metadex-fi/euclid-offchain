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
    // assert(b.maxDelta === b.available);
    // assert(deltaBuying <= b.maxDelta, `${deltaBuying} > ${b.maxDelta}`);
    // assert(
    //   s.maxDelta === "oo" || deltaSelling <= s.maxDelta,
    //   `${deltaSelling} > ${s.maxDelta}`,
    // );
    this.effectivePrice = Number(this.deltaSelling) / Number(this.deltaBuying);
  }

  static fromSelling = (
    b: AssetConstants,
    s: AssetConstants,
    maxDeltaSelling: bigint,
    numerator: bigint, // = b.a * jse (reduced)
    denominator: bigint, // = s.a * jsppe (reduced)
  ): PairOption | null => {
    assert(maxDeltaSelling >= s.minDelta, `${maxDeltaSelling} < ${s.minDelta}`);

    // we want a deltaSelling that is a multiple of the denoniminator.
    // if we can't get that because rounding down maxDeltaSelling would violate the minDelta,
    // we pick the next larger value, which is s.minDelta.
    // we do that because we're rounding down deltaBuying, and want to minimize rounding error.
    // note that rounding up would exceed maxDeltaSelling, so we can't do that.
    let deltaSelling = (maxDeltaSelling / denominator) * denominator;
    let deltaBuying: bigint;
    if (deltaSelling < s.minDelta) {
      deltaSelling = s.minDelta;
      deltaBuying = (deltaSelling * numerator) / denominator;
      assert(
        deltaSelling * numerator > deltaBuying * denominator,
        `${deltaSelling} * ${numerator} <= ${deltaBuying} * ${denominator}`,
      );
    } else {
      deltaBuying = (deltaSelling * numerator) / denominator;
      assert(
        deltaSelling * numerator === deltaBuying * denominator,
        `${deltaSelling} * ${numerator} !== ${deltaBuying} * ${denominator}`,
      );
    }

    if (deltaBuying >= b.minDelta) {
      return new PairOption(b, s, deltaBuying, deltaSelling, true);
    } else {
      // using binary search to find the smallest deltaSelling that gives deltaBuying >= b.minDelta, to minimize rounding error
      let start = deltaSelling + 1n;
      let end = maxDeltaSelling;
      let bestSelling: bigint | null = null;
      let bestBuying: bigint | null = null;
      while (start <= end) {
        const mid = (start + end) / 2n;
        const deltaBuying = (mid * numerator) / denominator;
        if (deltaBuying >= b.minDelta) {
          bestSelling = mid;
          bestBuying = deltaBuying;
          end = mid - 1n;
        } else {
          start = mid + 1n;
        }
      }
      if (bestSelling) {
        assert(bestBuying !== null);
        assert(
          bestSelling * numerator > bestBuying * denominator,
          `${bestSelling} * ${numerator} <= ${bestBuying} * ${denominator}`,
        );
        return new PairOption(b, s, bestBuying, bestSelling, false);
      } else {
        return null; // means even maxDeltaSelling is too small
      }
    }
  };

  static fromBuying = (
    b: AssetConstants,
    s: AssetConstants,
    maxDeltaBuying: bigint,
    numerator: bigint, // = s.a * jsppe (reduced)
    denominator: bigint, // = b.a * jse (reduced)
  ): PairOption | null => {
    assert(maxDeltaBuying >= b.minDelta, `${maxDeltaBuying} < ${b.minDelta}`);

    // we want a deltaBuying that is a multiple of the denoniminator.
    // if we can't get that because rounding down maxDeltaBuying would violate the minDelta,
    // we pick the next smaller value from rounding up, which is maxDeltaBuying.
    // we do that because we're rounding up deltaSelling, and want to minimize rounding error.
    // note that rounding up would exceed maxDeltaBuying, so we can't do that.
    let deltaBuying = (maxDeltaBuying / denominator) * denominator;
    if (deltaBuying >= b.minDelta) {
      const deltaSelling = (deltaBuying * numerator) / denominator;
      assert(
        deltaSelling * denominator === deltaBuying * numerator,
        `${deltaSelling} * ${denominator} !== ${deltaBuying} * ${numerator}`,
      );
      if (deltaSelling >= s.minDelta) {
        return new PairOption(b, s, deltaBuying, deltaSelling, true);
      }
    }

    // we pick the next smaller value from rounding up, which is maxDeltaBuying.
    deltaBuying = maxDeltaBuying;
    const deltaSelling = ceilDiv(deltaBuying * numerator, denominator);
    assert(
      deltaSelling * denominator >= deltaBuying * numerator,
      `${deltaSelling} * ${denominator} < ${deltaBuying} * ${numerator}`,
    );
    if (deltaSelling >= s.minDelta) {
      return new PairOption(b, s, deltaBuying, deltaSelling, true);
    } else {
      return null; // means even maxDeltaBuying is too small
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
      // if (exp > minExp + 10n) break; // for testing
      if (countMults(exp) <= expLimit) {
        let maxDeltaSelling = (s.a * jsppe - s.l * s.w * jse) /
          (s.w * jse);
        if (s.maxDelta !== "oo") {
          maxDeltaSelling = min(maxDeltaSelling, s.maxDelta);
        }
        assert(b.maxDelta === b.available);
        const maxDeltaBuying = min(
          b.maxDelta,
          (b.l * b.w * jse - b.a * jsppe) /
            (b.w * jse),
        );
        let fromSelling: PairOption | null = null;
        let fromSellingViolates = false;

        fromSelling = PairOption.fromSelling(
          b,
          s,
          maxDeltaSelling,
          numerator,
          denominator,
        );
        if (fromSelling) {
          const ammSelling = s.w * (s.l + fromSelling.deltaSelling);
          assert(jse * ammSelling <= s.a * jsppe); // = adheres onchain
          const ammBuying = b.w * (b.l - fromSelling.deltaBuying);
          // assert(jse * ammBuying >= b.a * jsppe); // = adheres onchain
          if (jse * ammBuying < b.a * jsppe) { // = violates onchain
            assert(fromSelling.deltaBuying > maxDeltaBuying);
            fromSellingViolates = true;
            // console.log("fromSelling violates onchain");
            fromSelling = null;
          } // else assert(fromSelling.deltaBuying <= maxDeltaBuying); // fails when adding maxDeltas to AssetConstants
        }

        let fromBuying: PairOption | null = null;
        let fromBuyingViolates = false;
        fromBuying = PairOption.fromBuying(
          b,
          s,
          maxDeltaBuying,
          denominator,
          numerator,
        );
        if (fromBuying) {
          const ammBuying = b.w * (b.l - fromBuying.deltaBuying);
          assert(jse * ammBuying >= b.a * jsppe); // = adheres onchain
          const ammSelling = s.w * (s.l + fromBuying.deltaSelling);
          // assert(jse * ammSelling <= s.a * jsppe); // = adheres onchain
          if (jse * ammSelling > s.a * jsppe) { // = violates onchain
            assert(fromBuying.deltaSelling > maxDeltaSelling);
            fromBuyingViolates = true;
            // console.log("fromBuying violates onchain");
            fromBuying = null;
          } // else assert(fromBuying.deltaSelling <= maxDeltaSelling); // fails when adding maxDeltas to AssetConstants
        }

        // console.log("fromBuying:", fromBuyingViolates, fromBuying);
        // console.log("fromSelling:", fromSellingViolates, fromSelling);

        // assert(fromSelling || fromBuying); // empirically (false) <- unless we allow deltaBuying === 0n; as expected
        // assert((!fromSelling) || (!fromBuying)); // empirically (false)
        // assert(!fromSellingViolates); // empirically (false)
        // assert(!fromBuyingViolates); // empirically (false)
        if (fromBuyingViolates === fromSellingViolates) { // empirically
          assert(!fromBuyingViolates);
          // assert(fromBuying); // fails when adding maxDeltas to AssetConstants
          // assert(fromSelling);  // fails when adding maxDeltas to AssetConstants
          // assert(fromBuying.deltaBuying === fromSelling.deltaBuying); // fails when adding maxDeltas to AssetConstants
          // assert(fromBuying.deltaSelling !== fromSelling.deltaSelling); // (false)
          // assert(fromBuying.deltaSelling === fromSelling.deltaSelling); // (false)
          // assert(fromBuying.deltaSelling >= fromSelling.deltaSelling); // (false)
          // assert(fromBuying.deltaSelling <= fromSelling.deltaSelling);  // fails when adding maxDeltas to AssetConstants
        }

        /*
        Implications:

        - it can never happen that both approaches violate onchain
        - it can (rarely) happen that both approaches yield a correct result
          - they can be equal or different
          - if that happens, fromBuying is always equal or better than fromSelling
        - it can happen (often) that fromSelling does not find a deltaBuying > 0 and fromBuying violates onchain
        - the violations only happen due to the delta of the other asset

        below: with looping
        */

        if (fromBuying) {
          this.options.push(fromBuying);
        } else if (fromSelling) {
          this.options.push(fromSelling);
        } else {
          // assert(fromBuyingViolates); // empirically
          // assert(!fromSellingViolates); // empirically
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

    // for (let i = 1; i < this.options.length - 1; i++) {
    //   assert(
    //     this.options[0].effectivePrice <= this.options[i + 1].effectivePrice,
    //     `${this.options[i].effectivePrice} > ${
    //       this.options[i + 1].effectivePrice
    //     } (${0}-${i + 1} / ${this.options.length - 1})`,
    //   );
    // }

    // for (let i = 0; i < this.options.length - 1; i++) {
    //   assert(
    //     this.options[i].effectivePrice <= this.options[i + 1].effectivePrice,
    //     `${this.options[i].effectivePrice} > ${
    //       this.options[i + 1].effectivePrice
    //     } (${i}-${i + 1} / ${this.options.length - 1})`,
    //   );
    // }
  }
}
