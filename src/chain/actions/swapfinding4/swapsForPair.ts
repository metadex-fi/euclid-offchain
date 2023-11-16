import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { maxInteger, maxIntRoot } from "../../../utils/constants.ts";
import {
  ceilDiv,
  genNonNegative,
  genPositive,
  min,
  randomChoice,
  strictDiv,
} from "../../../utils/generators.ts";
import { maxSmallInteger } from "../../../types/euclid/smallValue.ts";
import { PPositive } from "../../../types/general/derived/bounded/positive.ts";
import { Param } from "../../../types/euclid/param.ts";

class AssetOption {
  constructor(
    readonly exp: bigint,
    readonly spot: bigint,
    readonly delta: bigint,
    readonly a0: number,
    readonly mults: number,
    readonly maximized: boolean,
  ) {
    assert(spot > 0n);
  }
}

export const assetOptionsEqual = (a: AssetOption, b: AssetOption): boolean =>
  a.exp === b.exp && a.spot === b.spot && a.delta === b.delta && a.a0 === b.a0;

class PairOption {
  public readonly effectivePrice: number;
  constructor(
    public readonly buyingOption: AssetOption,
    public readonly sellingOption: AssetOption,
  ) {
    assert(buyingOption.a0 <= sellingOption.a0);
    this.effectivePrice = Number(sellingOption.delta) /
      Number(buyingOption.delta);
    assert(buyingOption.spot > 0n);
    assert(sellingOption.spot > 0n);
  }
}

export const pairOptionsEqual = (a: PairOption, b: PairOption): boolean =>
  assetOptionsEqual(a.buyingOption, b.buyingOption) &&
  assetOptionsEqual(a.sellingOption, b.sellingOption);

export const genWildAssetParams = () => {
  const jumpSize = genPositive(maxSmallInteger);
  const virtual = genPositive(maxInteger);
  const balance = genNonNegative(maxInteger - virtual);
  const locked = genNonNegative(balance);
  const weight = genPositive(randomChoice([maxInteger, maxIntRoot]));
  const anchor = genPositive(maxInteger);
  const minDelta = genPositive(maxInteger);
  return { virtual, balance, locked, weight, jumpSize, anchor, minDelta };
};

export const genTightAssetParams = () => {
  const jumpSize = genPositive(maxSmallInteger);
  const virtual = new PPositive(
    ceilDiv(jumpSize + 1n, maxSmallInteger),
  ).genData();
  const balance = genNonNegative(maxInteger - virtual);
  const locked = genNonNegative(balance);
  const [minWeight, maxWeight] = Param.weightBounds(jumpSize, virtual);
  const weight = new PPositive(minWeight, maxWeight).genData();
  const anchor = genPositive(maxInteger);
  const minDelta = genPositive(maxInteger);
  return { virtual, balance, locked, weight, jumpSize, anchor, minDelta };
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

export class AssetOptions {
  private readonly available: bigint;
  private readonly liquidity: bigint;
  private readonly amm: bigint;
  private readonly jumpMultiplier: number;
  private readonly jumpSizePlusOne: bigint;
  private readonly maxDelta: bigint | "oo";
  private readonly minSpot: bigint;
  private readonly maxSpot: bigint;
  private readonly minExp: bigint;
  private readonly maxExp: bigint;
  // private readonly options: AssetOption[];
  private readonly buyingCache: Map<bigint, AssetOption[] | null> = new Map();
  private headIndex = 0;
  private numerator = 0n;
  private denominator = 0n;
  private heads: AssetOption[] | null = [];

  constructor(
    private readonly assetType: "buying" | "selling",
    private readonly virtual: bigint,
    private readonly locked: bigint,
    private readonly balance: bigint,
    private readonly weight: bigint,
    public readonly jumpSize: bigint, // TODO make private again
    public readonly anchor: bigint, // TODO make private again
    private readonly minDelta: bigint,
    private readonly sellingMaxDeltaOrWeight: bigint, // selling-maxDelta if selling, selling-weight if buying
    private readonly expLimit: number,
    private readonly strictBuying = true,
  ) {
    // assert(strictBuying, "not implemented");
    this.available = balance - locked;
    this.liquidity = virtual + balance;
    this.amm = this.liquidity * weight;
    this.jumpMultiplier = 1 + 1 / Number(jumpSize);
    this.jumpSizePlusOne = jumpSize + 1n;

    if (assetType === "buying") {
      this.maxDelta = min(
        this.available,
        strictDiv(weight * this.liquidity, weight + sellingMaxDeltaOrWeight),
      );
      this.minSpot = weight * (this.liquidity - this.maxDelta);
      this.maxSpot = min(maxInteger, weight * (this.liquidity - minDelta));
    } else {
      this.maxDelta = sellingMaxDeltaOrWeight === -1n
        ? "oo"
        : sellingMaxDeltaOrWeight;
      this.minSpot = weight * (this.liquidity + minDelta);
      this.maxSpot = this.maxDelta === "oo"
        ? maxInteger
        : min(maxInteger, weight * (this.liquidity + this.maxDelta));
    }
    assert(this.minSpot >= 0n, `${this.minSpot} < 0`);
    if (this.maxDelta !== "oo" && this.maxDelta < minDelta) {
      // this.options = [];
      this.minExp = 0n;
      this.maxExp = 0n;
      this.reset();
      return;
    }
    const logJump = Math.log(this.jumpMultiplier);
    const logAnchor = Math.log(Number(anchor));

    const logMinSpot = Math.log(Number(this.minSpot));
    const minExp_ = (logMinSpot - logAnchor) / logJump;
    let minExp = BigInt(Math.ceil(minExp_));
    if (Math.abs(Number(minExp) - minExp_) < 1e-12) {
      minExp += 1n;
    }
    this.minExp = minExp;

    const logMaxSpot = Math.log(Number(this.maxSpot + 1n));
    const maxExp_ = (logMaxSpot - logAnchor) / logJump;
    let maxExp = BigInt(Math.floor(maxExp_));
    if (Math.abs(Number(maxExp) - maxExp_) < 1e-14) {
      maxExp -= 1n;
    }
    this.maxExp = maxExp;

    this.reset();
  }

  public reset = (): void => {
    this.headIndex = 0;
    this.numerator = this.anchor;
    this.denominator = 1n;
    if (this.minExp >= this.maxExp) return;
    if (this.minExp < 0n) { // TODO we should only get on of those, depending on the assetType
      this.numerator *= this.jumpSize ** -this.minExp;
      this.denominator *= this.jumpSizePlusOne ** -this.minExp;
    } else {
      this.numerator *= this.jumpSizePlusOne ** this.minExp;
      this.denominator *= this.jumpSize ** this.minExp;
    }
    const mults = countMults(this.minExp);
    if (mults <= this.expLimit) {
      const spot = this.numerator / this.denominator;
      const head = this.calcOptionFromSpot(this.minExp, spot, mults);
      this.heads = this.spreadOption(this.minDelta, head);
    }
  };

  // TODO compare with previous versions
  // public shift = (): AssetOption | undefined => {
  //   if (this.assetType === "buying") {
  //     return this.shiftBuying();
  //   } else {
  //     return this.shiftSelling();
  //   }
  // };

  public shift = (): AssetOption | undefined => {
    if (this.heads === null) return undefined; // means we're past the edge already
    if (this.headIndex < this.heads.length) return this.heads[this.headIndex++];

    const fromDelta = this.heads.length
      ? this.heads[this.heads.length - 1].delta + 1n
      : this.minDelta;
    let exp = this.heads.length
      ? this.heads[this.heads.length - 1].exp
      : (this.minExp + 1n);
    if (exp > this.maxExp) {
      this.heads = null;
      return undefined;
    } // means we're past the edge already

    while (bestMultsAhead(exp) <= this.expLimit) {
      this.numerator *= this.jumpSizePlusOne;
      this.denominator *= this.jumpSize;
      exp++;
      const mults = countMults(exp);
      if (mults > this.expLimit) {
        continue;
      }
      const spot = this.numerator / this.denominator;
      if (spot > maxInteger) {
        this.heads = null;
        return undefined;
      }

      const head = exp > this.maxExp
        ? (this.assetType === "buying" ? null : this.calcEdgeOptionFromSpot( // TODO
          exp,
          spot,
          mults,
        ))
        : this.calcOptionFromSpot(exp, spot, mults);

      if (!head) {
        this.heads = null;
        return undefined;
      }

      this.heads = this.spreadOption(fromDelta, head);
      this.headIndex = 1;
      return this.heads[0];
    }
  };

  private calcDeltaCapacityFromSpot = (spot: bigint): bigint =>
    this.assetType === "buying"
      ? (this.amm - spot) / this.weight
      : (spot - this.amm) / this.weight;

  private calcOptionFromSpot = (
    exp: bigint,
    spot: bigint,
    mults: number,
  ): AssetOption => {
    assert(spot >= this.minSpot, `${spot} < ${this.minSpot}`);
    assert(spot <= this.maxSpot, `${spot} > ${this.maxSpot}`);

    const delta = this.calcDeltaCapacityFromSpot(spot);
    assert(
      delta >= this.minDelta,
      `${delta} < ${this.minDelta}, exp: ${exp}, spot: ${spot}`,
    );
    assert(
      this.maxDelta === "oo" || delta <= this.maxDelta,
      `${delta} > ${this.maxDelta}`,
    );

    const a0 = Number(delta) / Number(spot);
    return new AssetOption(exp, spot, delta, a0, mults, true);
  };

  // TODO we can do this lazily as well
  private spreadOption = (
    fromDelta: bigint,
    option: AssetOption,
  ): AssetOption[] => {
    // assert(
    //   fromDelta <= option.delta + 1n,
    //   `${fromDelta} > ${option.delta} + 1`,
    // );
    const options: AssetOption[] = [];
    // this will increase a0
    for (let delta = fromDelta; delta < option.delta; delta++) {
      const a0 = Number(delta) / Number(option.spot);
      options.push(
        new AssetOption(
          option.exp,
          option.spot,
          delta,
          a0,
          option.mults,
          false,
        ),
      );
    }
    options.push(option);
    return options;
  };

  private calcEdgeOptionFromSpot = (
    exp: bigint,
    spot: bigint,
    mults: number,
  ): AssetOption | null => {
    if (spot <= maxInteger && this.maxDelta !== "oo") {
      const delta = this.maxDelta;
      const a0 = Number(delta) / Number(spot);
      return new AssetOption(exp, spot, delta, a0, mults, true);
    } else return null;
  };

  // public getCorrBuyingOption = (
  //   sellingOption: AssetOption,
  // ): AssetOption | undefined =>
  //   this.strictBuying
  //     ? this.getCorrBuyingOptionStrict(sellingOption)
  //     : this.getCorrBuyingOptionLazy(sellingOption);

  // private getCorrBuyingOptionStrict = (
  //   sellingOption: AssetOption,
  //   expLimit = this.expLimit - sellingOption.mults,
  //   start = 0,
  //   end = this.options.length - 1,
  // ): AssetOption | undefined => {
  //   assert(this.assetType === "buying");
  //   assert(expLimit >= 0);
  //   let result: AssetOption | undefined = undefined;

  //   while (start <= end) {
  //     const mid = Math.floor((start + end) / 2);
  //     const buyingOption = this.options[mid];

  //     if (buyingOption.a0 <= sellingOption.a0) {
  //       if (buyingOption.mults > expLimit) {
  //         // if our potential solution violates the expLimit, try to find a better one in the right half
  //         const better = this.getCorrBuyingOptionStrict(
  //           sellingOption,
  //           expLimit,
  //           mid + 1,
  //           end,
  //         );
  //         if (better) {
  //           // if we find one, return it
  //           return better;
  //         } else {
  //           // otherwise continue in the left half
  //           end = mid - 1;
  //         }
  //       } else {
  //         // Store the potential answer and search in the right half for an even better one
  //         result = buyingOption;
  //         start = mid + 1;
  //       }
  //     } else {
  //       // Search in the left half
  //       end = mid - 1;
  //     }
  //   }
  //   return result;
  // };

  /*
  we can generate those dynamically for a given sellingOption:

  -
 */
  //   private getCorrBuyingOptionLazy = (
  //     sellingOption: AssetOption,
  //     expLimit = this.expLimit - sellingOption.mults,
  //     start = 0,
  //     end = this.options.length - 1,
  //   ): AssetOption | undefined => {
  //     throw new Error("not implemented");
  //   };
}

// export const swapsForPairBinary = (
//   buyingOptions: AssetOptions,
//   sellingOptions: AssetOptions,
//   // expLimit: number,
// ): [PairOption[], number] => { //PairOption[] => {
//   const start = performance.now();

//   const options: PairOption[] = [];
//   let sellingOption = sellingOptions.shift();
//   while (sellingOption) {
//     const buyingOption = buyingOptions.getCorrBuyingOption(sellingOption);
//     if (!buyingOption) continue;
//     options.push(new PairOption(buyingOption, sellingOption));
//     sellingOption = sellingOptions.shift();
//   }

//   const duration = performance.now() - start;
//   // const options_ = options;
//   // const duration_ = 0;
//   const [options_, duration_] = paretoOptionsSort(options);

//   if (options_.length) {
//     console.log(
//       ` -> ${options_.length} pair-options (binary)`,
//     );
//   }
//   return [options_, duration + duration_];
//   // return options_;
// };

export const swapsForPairExhaustive = (
  buyingOptions: AssetOptions,
  sellingOptions: AssetOptions,
  expLimit: number,
): [PairOption[], number] => {
  const start = performance.now();
  const options: PairOption[] = [];
  let buyingOption = buyingOptions.shift();
  while (buyingOption) {
    let sellingOption = sellingOptions.shift();
    while (sellingOption) {
      if (
        buyingOption.a0 <= sellingOption.a0 &&
        buyingOption.mults + sellingOption.mults <= expLimit
      ) {
        const newOption = new PairOption(buyingOption, sellingOption);
        options.push(newOption);
      }
      sellingOption = sellingOptions.shift();
    }
    sellingOptions.reset();
    buyingOption = buyingOptions.shift();
  }
  if (options.length) {
    console.log(
      ` -> ${options.length} pair-options (exhaustive)`,
    );
  }
  const duration = performance.now() - start;
  return [options, duration];
};

export const paretoOptionsSort = (
  options: PairOption[],
): [PairOption[], number] => {
  if (!options.length) return [[], 0];
  const start = performance.now();
  const sorted = options.toSorted((a, b) => {
    const priceDiff = a.effectivePrice - b.effectivePrice;
    if (priceDiff === 0) {
      return Number(b.buyingOption.delta - a.buyingOption.delta);
    }
    return priceDiff;
  }); // increasing aka worsening price, secondary decreasing aka worsening delta
  const options_ = [sorted[0]];
  let bestDelta = sorted[0].buyingOption.delta;
  let bestPrice = sorted[0].effectivePrice;

  // we look at the options in order of worsening price...
  for (let i = 1; i < sorted.length; i++) {
    const option = sorted[i];
    // ...and accept as only redeeming quality if they have a better delta
    if (
      option.buyingOption.delta > bestDelta ||
      (option.buyingOption.delta === bestDelta &&
        option.effectivePrice < bestPrice)
    ) {
      options_.push(option);
      bestDelta = option.buyingOption.delta;
      bestPrice = option.effectivePrice;
      // if they do, we raise the new threshold for delta
    }
  }
  return [options_, performance.now() - start];
};

// far slower if we have many options, as expected
export const paretoOptionsStraight = (
  options: PairOption[],
): [PairOption[], number] => {
  const start = performance.now();
  const options_: PairOption[] = [];
  console.log(options.length);
  options.forEach((option) => {
    if (
      !options.some((otherOption) => {
        return (otherOption.effectivePrice < option.effectivePrice &&
          otherOption.buyingOption.delta >= option.buyingOption.delta) ||
          (otherOption.effectivePrice <= option.effectivePrice &&
            otherOption.buyingOption.delta > option.buyingOption.delta);
      }) && !options_.some((otherOption) => {
        return (otherOption.effectivePrice === option.effectivePrice &&
          otherOption.buyingOption.delta === option.buyingOption.delta);
      })
    ) {
      options_.push(option);
    }
  });
  return [options_, performance.now() - start];
};
