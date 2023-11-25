import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { ceilDiv, max, min } from "../../../utils/generators.ts";
import { e } from "../../../../../webapp/.next/server/webpack-runtime.js";

export class AssetOption {
  readonly l: bigint;
  readonly jspp: bigint;
  readonly wa: bigint;
  readonly logJM: number;
  readonly logWA: number;
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
    this.jspp = js + 1n;
    this.wa = w * a;
    this.logJM = log(this.jspp) - log(this.js);
    this.logWA = log(this.w * this.a);

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
      ? this.logWA - log(this.l - delta)
      : log(this.l + delta) - this.logWA;

    const exp = BigInt(Math.ceil(numerator / this.logJM));
    assert(exp >= 0n);
    return exp;
  };

  public maxDeltaForExp = (): bigint => {
    const maxDelta = this.type === "buying"
      ? (this.l * this.jsppe - this.wa * this.jse) / this.jsppe
      : (this.wa * this.jsppe - this.l * this.jse) / this.jse;
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
  ) {
    assert(b.type === "buying");
    assert(s.type === "selling");
    assert(b.maxDelta === b.available);

    const minExpSelling = s.minExpForDelta(s.minDelta);
    const minExpBuying = b.minExpForDelta(b.minDelta);

    let bestPriceOption: PairOption | null = null;
    const queue: { expBuying: bigint; expSelling: bigint }[] = [{
      expBuying: minExpBuying,
      expSelling: minExpSelling,
    }];

    const checkNewOption = (
      deltaBuying: bigint,
      deltaSelling: bigint,
      expBuying: bigint,
      expSelling: bigint,
      perfect: boolean,
    ) => {
      const effectivePrice = Number(deltaSelling) / Number(deltaBuying);
      if (
        (!bestPriceOption) || effectivePrice < bestPriceOption.effectivePrice ||
        (effectivePrice === bestPriceOption.effectivePrice &&
          (deltaBuying > bestPriceOption.deltaBuying ||
            deltaSelling > bestPriceOption.deltaSelling))
      ) {
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
      }
    };

    while (queue.length) {
      const { expBuying, expSelling } = queue.shift()!;
      if (countMults(expBuying) + countMults(expSelling) > expLimit) {
        if (bestMultsAhead(expBuying) + bestMultsAhead(expSelling) <= expLimit) {
          queue.push({ expBuying: expBuying + 1n, expSelling });
          queue.push({ expBuying, expSelling: expSelling + 1n });
        }
        continue;
      }
      s.setExp(expSelling);
      b.setExp(expBuying);

      const maxDeltaForExpSelling = s.maxDeltaForExp();
      const maxDeltaForExpBuying = b.maxDeltaForExp();

      const buyingDeltaMultiplierRaw = s.a * s.jsppe * b.jsppe;
      const sellingDeltaMultiplierRaw = b.a * b.jse * s.jse;
      // value-equation: deltaBuying * buyingDeltaMultiplier <= deltaSelling * sellingDeltaMultiplier
      const spot = Number(buyingDeltaMultiplierRaw) /
        Number(sellingDeltaMultiplierRaw);
      if (
        bestPriceOption && spot > (bestPriceOption as PairOption).effectivePrice
      ) continue; // spot price is the best we can get, so if that's worse than what we got already, we can skip this

      // trying to find perfect solution, meaning without rounding-error and with tight value equation
      const [buyingDeltaMultiplier, sellingDeltaMultiplier] = reduce(
        buyingDeltaMultiplierRaw,
        sellingDeltaMultiplierRaw,
      );
      const minMultiplier = max(
        ceilDiv(s.minDelta, buyingDeltaMultiplier),
        ceilDiv(b.minDelta, sellingDeltaMultiplier),
      );
      const maxMultiplier = min(
        maxDeltaForExpSelling / buyingDeltaMultiplier,
        maxDeltaForExpBuying / sellingDeltaMultiplier,
      );
      if (minMultiplier <= maxMultiplier) {
        const deltaBuying = maxMultiplier * buyingDeltaMultiplier;
        const deltaSelling = maxMultiplier * sellingDeltaMultiplier;
        checkNewOption(
          deltaBuying,
          deltaSelling,
          expBuying,
          expSelling,
          true,
        );
        continue; // if we found a perfect solution, we know that increasing exps will only make it worse
      } else {
        // try to find imperfect solution if we can't find a perfect one
        const minSellingForMinBuying = ceilDiv(
          b.minDelta * buyingDeltaMultiplier,
          sellingDeltaMultiplier,
        );
        const minDeltaSelling = max(minSellingForMinBuying, s.minDelta);
        for (
          let deltaSelling = minDeltaSelling;
          deltaSelling <= maxDeltaForExpSelling;
          deltaSelling++
        ) {
          const maxBuyingForSelling = (deltaSelling * sellingDeltaMultiplier) /
            buyingDeltaMultiplier;
          assert(maxBuyingForSelling >= b.minDelta);

          if (maxBuyingForSelling < maxDeltaForExpBuying) {
            checkNewOption(
              maxBuyingForSelling,
              deltaSelling,
              expBuying,
              expSelling,
              false,
            );
          } else {
            checkNewOption(
              maxDeltaForExpBuying,
              deltaSelling,
              expBuying,
              expSelling,
              false,
            );
            break;
          }
        }
      }

      if (maxDeltaForExpBuying < b.maxDelta) {
        queue.push({ expBuying: expBuying + 1n, expSelling });
      }
      if (s.maxDelta === "oo" || maxDeltaForExpSelling < s.maxDelta) {
        queue.push({ expBuying, expSelling: expSelling + 1n });
      }
    }
  }
}
