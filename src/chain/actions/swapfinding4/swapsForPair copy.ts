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

export class AssetOptionsStrict {
  private readonly available: bigint;
  private readonly liquidity: bigint;
  private readonly amm: bigint;
  private readonly jumpMultiplier: number;
  private readonly maxDelta: bigint | "oo";
  private readonly minSpot: bigint;
  private readonly maxSpot: bigint;
  private readonly minExp: bigint;
  private readonly maxExp: bigint;
  public readonly options: AssetOption[];
  private readonly buyingCache: Map<bigint, AssetOption[] | null> = new Map();
  private headIndex = 0;

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
      this.options = [];
      this.minExp = 0n;
      this.maxExp = 0n;
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
    // if (Number(maxExp) === maxExp_) maxExp -= 1n;
    if (Math.abs(Number(maxExp) - maxExp_) < 1e-14) {
      maxExp -= 1n;
    }
    this.maxExp = maxExp;

    let options: AssetOption[] = [];
    // let edgeExp: bigint;
    // let excessEdgeExp: bigint;
    // let otherEdgeExp: bigint;

    if (assetType === "buying") {
      if (strictBuying) options = this.calcBuyingOptions();
      // excessEdgeExp = minExp - 2n;
      // otherEdgeExp = maxExp + 1n;
    } else {
      options = this.calcSellingOptions();
      // excessEdgeExp = maxExp + 2n;
      // otherEdgeExp = minExp - 1n;
    }

    // TODO verify this once in a while
    // try {
    //   this.calcOptionFromExp(excessEdgeExp);
    //   throw new Error(
    //     "excessEdgeOption should have failed, bounds not tight enough",
    //   );
    // } catch (_e) {
    //   // expected
    // }
    // try {
    //   this.calcOptionFromExp(otherEdgeExp);
    //   throw new Error(
    //     "otherEdgeOption should have failed, bounds not tight enough",
    //   );
    // } catch (_e) {
    //   // expected
    // }
    if (assetType === "selling") {
      // options.sort((a, b) => a.a0 - b.a0); // don't need this anymore
      // for (let i = 0; i < options.length - 1; i++) {
      //   if (options[i].a0 === options[i + 1].a0) {
      //     assert(options[i].spot < options[i + 1].spot);
      //     assert(options[i].delta < options[i + 1].delta);
      //     // options.splice(i, 1); // TODO why did we do this again?
      //     // i--;
      //   }
      // }
    } else {
      for (let i = 0; i < options.length - 2; i++) {
        assert(options[i].a0 < options[i + 1].a0);
        // assert(options[i].spot < options[i + 1].spot); // TODO breaks with the new edgeOption that adheres to expLimit
        // assert(options[i].delta < options[i + 1].delta); // TODO breaks with the new edgeOption that adheres to expLimit
      }
    }

    this.options = options;
  }

  // gives inaccurate result
  // private calcSpotFromExp_ = (exp: bigint): bigint =>
  //   BigInt(
  //     Math.floor(Number(this.anchor) * this.jumpMultiplier ** Number(exp)),
  //   );

  private calcSpotFromExp = (exp: bigint): bigint =>
    0n <= exp
      ? (this.anchor * ((this.jumpSize + 1n) ** exp)) / (this.jumpSize ** exp)
      : (this.anchor * (this.jumpSize ** -exp)) /
        ((this.jumpSize + 1n) ** -exp);

  // for testing - actually it works better
  private calcBuyingOptions = (): AssetOption[] => {
    const optionsA = this.calcBuyingOptionsA();
    // const optionsB = this.calcBuyingOptionsB();

    // assert(
    //   optionsA.length === optionsB.length,
    //   `${optionsA.length} !== ${optionsB.length}`,
    // );
    // for (let i = 0; i < optionsA.length; i++) {
    //   assert(assetOptionsEqual(optionsA[i], optionsB[i]));
    // }

    return optionsA;
  };
  private calcBuyingOptionsA = (): AssetOption[] => {
    const options: AssetOption[] = [];
    let previousOption: AssetOption | null = null;
    let fromDelta = this.minDelta;
    for (let exp = this.maxExp; exp >= this.minExp; exp--) {
      const mults = countMults(exp);
      if (mults > this.expLimit) {
        continue;
      }
      const spot = this.calcSpotFromExp(exp);
      const newOption = this.calcOptionFromSpot(exp, spot, mults);
      if (previousOption) {
        assert(previousOption.spot > newOption.spot);
        assert(previousOption.a0 <= newOption.a0);
        assert(previousOption.delta <= newOption.delta);
      }
      previousOption = newOption;
      options.push(...this.spreadOption(fromDelta, newOption));
      fromDelta = newOption.delta + 1n;
    }
    const edgeOption = this.findBuyingEdgeOption();
    if (edgeOption) options.push(...this.spreadOption(fromDelta, edgeOption));

    return options;
  };

  // private calcBuyingOptionsB = (): AssetOption[] => {
  //   const options: AssetOption[] = [];
  //   if (this.minExp > this.maxExp) return options;
  //   const jumpSizePlusOne = this.jumpSize + 1n;
  //   let numerator = this.anchor;
  //   let denominator = 1n;
  //   if (this.minExp < 0n) {
  //     numerator *= this.jumpSize ** -this.minExp;
  //     denominator *= jumpSizePlusOne ** -this.minExp;
  //   } else {
  //     numerator *= jumpSizePlusOne ** this.minExp;
  //     denominator *= this.jumpSize ** this.minExp;
  //   }
  //   let spot = numerator / denominator;
  //   let previousOption: AssetOption | null = null;
  //   if (countMults(this.minExp) <= this.expLimit) {
  //     previousOption = this.calcOptionFromSpot(this.minExp, spot);
  //     options.push(previousOption);
  //   }

  //   for (let exp = this.minExp + 1n; exp <= this.maxExp; exp++) {
  //     numerator *= jumpSizePlusOne;
  //     denominator *= this.jumpSize;
  //     if (countMults(exp) > this.expLimit) {
  //       if (bestMultsAhead(exp) > this.expLimit) break;
  //       continue;
  //     }

  //     spot = numerator / denominator;
  //     // const spot_ = this.calcSpotFromExp(exp);
  //     // assert(spot === spot_, `${spot} !== ${spot_}`);
  //     const newOption = this.calcOptionFromSpot(exp, spot);

  //     if (previousOption) {
  //       assert(previousOption.a0 >= newOption.a0);
  //     }
  //     previousOption = newOption;
  //     options.push(newOption);
  //   }
  //   options.reverse();
  //   const edgeOption = this.findBuyingEdgeOption();
  //   if (edgeOption) options.push(edgeOption);

  //   return options;
  // };

  private calcSellingOptions = (): AssetOption[] => {
    const options: AssetOption[] = [];
    if (this.minExp > this.maxExp) return options;
    const jumpSizePlusOne = this.jumpSize + 1n;
    let numerator = this.anchor;
    let denominator = 1n;
    if (this.minExp < 0n) {
      numerator *= this.jumpSize ** -this.minExp;
      denominator *= jumpSizePlusOne ** -this.minExp;
    } else {
      numerator *= jumpSizePlusOne ** this.minExp;
      denominator *= this.jumpSize ** this.minExp;
    }
    let spot = numerator / denominator;
    let previousOption: AssetOption | null = null;
    let fromDelta = this.minDelta;
    const mults = countMults(this.minExp);
    if (mults <= this.expLimit) {
      previousOption = this.calcOptionFromSpot(this.minExp, spot, mults);
      options.push(...this.spreadOption(fromDelta, previousOption));
      fromDelta = previousOption.delta + 1n;
    }

    for (let exp = this.minExp + 1n; exp <= this.maxExp; exp++) {
      numerator *= jumpSizePlusOne;
      denominator *= this.jumpSize;
      const mults = countMults(exp);
      if (mults > this.expLimit) {
        // if (bestMultsAhead(exp) > this.expLimit) break; // TODO FIXME
        continue;
      }

      spot = numerator / denominator;
      // const spot_ = this.calcSpotFromExp(exp);
      // assert(spot === spot_, `${spot} !== ${spot_}`);
      const newOption = this.calcOptionFromSpot(exp, spot, mults);

      if (previousOption) {
        assert(previousOption.delta <= newOption.delta);
        if (previousOption.spot === newOption.spot) {
          assert(
            previousOption.delta === newOption.delta,
            `${previousOption.delta} !== ${newOption.delta}`,
          );
          continue;
        }
        assert(
          previousOption.spot < newOption.spot,
          `${previousOption.spot} >= ${newOption.spot} for ${previousOption.exp} and ${newOption.exp}`,
        );
        if (previousOption.a0 === newOption.a0) {
          assert(previousOption.delta < newOption.delta);
          // continue; // since we prefer a smaller selling-delta TODO try this again
        }

        // const a0Ratio = newOption.a0 / previousOption.a0;
        // console.log(a0Ratio);
      }
      previousOption = newOption;
      options.push(...this.spreadOption(fromDelta, newOption));
      fromDelta = newOption.delta + 1n;
    }
    let edgeExp = this.maxExp + 1n;
    numerator *= jumpSizePlusOne;
    denominator *= this.jumpSize;
    let edgeSpot = numerator / denominator;
    if (edgeSpot <= maxInteger && bestMultsAhead(edgeExp) <= this.expLimit) {
      let edgeMults = countMults(edgeExp);
      while (edgeMults > this.expLimit) {
        // console.log(edgeExp, countMults(edgeExp), bestMultsAhead(edgeExp));
        numerator *= jumpSizePlusOne;
        denominator *= this.jumpSize;
        edgeSpot = numerator / denominator;
        if (edgeSpot > maxInteger) return options;
        edgeExp++;
        edgeMults = countMults(edgeExp);
      }
      const edgeOption = this.calcEdgeOptionFromSpot(
        edgeExp,
        edgeSpot,
        edgeMults,
      );
      if (edgeOption) options.push(...this.spreadOption(fromDelta, edgeOption));
      else assert(this.maxDelta === "oo");
    }
    return options;
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

  private spreadOption = (
    fromDelta: bigint,
    option: AssetOption,
  ): AssetOption[] => {
    assert(
      fromDelta <= option.delta + 1n,
      `${fromDelta} > ${option.delta} + 1`,
    );
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

  // private calcOptionFromExp = (exp: bigint): AssetOption => {
  //   const spot = this.calcSpotFromExp(exp);
  //   return this.calcOptionFromSpot(exp, spot);
  // };

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

  private calcEdgeOptionFromExp = (exp: bigint): AssetOption | null => {
    if (bestMultsAhead(exp) > this.expLimit) return null;
    let mults = countMults(exp);
    while (mults > this.expLimit) {
      exp++;
      mults = countMults(exp);
    }
    const spot = this.calcSpotFromExp(exp);
    assert(spot > 0n);
    return this.calcEdgeOptionFromSpot(exp, spot, mults);
  };

  private findBuyingEdgeOption = (): AssetOption | null => {
    if (this.maxDelta === "oo") return null;
    let edgeExp = this.minExp;
    // if (bestMultsAhead(edgeExp) <= this.expLimit) {
    let edgeOption: AssetOption | null = null;
    while (!edgeOption) {
      edgeExp--;
      if (edgeExp < 0n && bestMultsAhead(edgeExp) > this.expLimit) {
        return null;
      }
      while (countMults(edgeExp) > this.expLimit) {
        edgeExp--;
      }
      edgeOption = this.calcEdgeOptionFromExp(edgeExp);
    }
    return edgeOption;
    // } else return null;
  };

  // public getCorrSellingOption = (
  //   buyingOption: AssetOption,
  // ): AssetOption | undefined => {
  //   assert(this.assetType === "selling");
  //   let start = 0; //this.headIndex;
  //   let end = this.options.length - 1;
  //   let result: AssetOption | undefined = undefined;

  //   while (start <= end) {
  //     const mid = Math.floor((start + end) / 2);
  //     const sellingOption = this.options[mid];

  //     if (buyingOption.a0 <= sellingOption.a0) {
  //       // Store the potential answer and search in the left half for an even better one
  //       result = sellingOption;
  //       end = mid - 1;
  //     } else {
  //       // Search in the right half
  //       start = mid + 1;
  //     }
  //   }
  //   return result;
  // };

  public getCorrBuyingOption = (
    sellingOption: AssetOption,
  ): AssetOption | undefined =>
    this.strictBuying
      ? this.getCorrBuyingOptionStrict(sellingOption)
      : this.getCorrBuyingOptionLazy(sellingOption);

  private getCorrBuyingOptionStrict = (
    sellingOption: AssetOption,
    expLimit = this.expLimit - sellingOption.mults,
    start = 0,
    end = this.options.length - 1,
  ): AssetOption | undefined => {
    assert(this.assetType === "buying");
    assert(expLimit >= 0);
    let result: AssetOption | undefined = undefined;

    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const buyingOption = this.options[mid];

      if (buyingOption.a0 <= sellingOption.a0) {
        if (buyingOption.mults > expLimit) {
          // if our potential solution violates the expLimit, try to find a better one in the right half
          const better = this.getCorrBuyingOptionStrict(
            sellingOption,
            expLimit,
            mid + 1,
            end,
          );
          if (better) {
            // if we find one, return it
            return better;
          } else {
            // otherwise continue in the left half
            end = mid - 1;
          }
        } else {
          // Store the potential answer and search in the right half for an even better one
          result = buyingOption;
          start = mid + 1;
        }
      } else {
        // Search in the left half
        end = mid - 1;
      }
    }
    return result;
  };

  /*
  we can generate those dynamically for a given sellingOption:

  -
 */
  private getCorrBuyingOptionLazy = (
    sellingOption: AssetOption,
    expLimit = this.expLimit - sellingOption.mults,
    start = 0,
    end = this.options.length - 1,
  ): AssetOption | undefined => {
    throw new Error("not implemented");
  };
}

// for some reason this fails, while the variant iterating over sellingOptions works (with explimit Infinity)
// export const swapsForPairBinary = (
//   buyingOptions: AssetOptions,
//   sellingOptions: AssetOptions,
//   expLimit: number,
// ): [PairOption[], number] => { //PairOption[] => {
//   const start = performance.now();

//   const options: PairOption[] = [];
//   for (const buyingOption of buyingOptions.options) {
//     const sellingOption = sellingOptions.getCorrSellingOption(buyingOption);
//     if (!sellingOption) continue;
//     if (
//       countMults(buyingOption.exp) + countMults(sellingOption.exp) <= expLimit
//     ) {
//       options.push(new PairOption(buyingOption, sellingOption));
//     }
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

export const swapsForPairBinary = (
  buyingOptions: AssetOptionsStrict,
  sellingOptions: AssetOptionsStrict,
  // expLimit: number,
): [PairOption[], number] => { //PairOption[] => {
  const start = performance.now();

  const options: PairOption[] = [];
  for (const sellingOption of sellingOptions.options) {
    const buyingOption = buyingOptions.getCorrBuyingOption(sellingOption);
    if (!buyingOption) continue;
    options.push(new PairOption(buyingOption, sellingOption));
  }

  const duration = performance.now() - start;
  // const options_ = options;
  // const duration_ = 0;
  const [options_, duration_] = paretoOptionsSort(options);

  if (options_.length) {
    console.log(
      ` -> ${options_.length} pair-options (binary)`,
    );
  }
  return [options_, duration + duration_];
  // return options_;
};

// export const swapsForPairBinary_ = (
//   buyingOptions: AssetOptions,
//   sellingOptions: AssetOptions,
//   expLimit: number,
// ): [PairOption[], number] => { //PairOption[] => {
//   const start = performance.now();
//   let buyingOption = buyingOptions.shift();
//   let sellingOption = sellingOptions.shift();

//   const options: PairOption[] = [];
//   while (buyingOption && sellingOption) {
//     if (sellingOption.a0 < buyingOption.a0) {
//       sellingOption = sellingOptions.getCorrSellingOption(buyingOption);
//       continue;
//     } else if (
//       sellingOption.a0 === buyingOption.a0 ||
//       !buyingOptions.head ||
//       buyingOptions.head.a0 > sellingOption.a0
//     ) {
//       // match
//     } else {
//       assert(sellingOption.a0 > buyingOption.a0);
//       buyingOption = buyingOptions.getCorrBuyingOption(sellingOption);
//       if (!buyingOption) break;
//     }
//     if (
//       countMults(buyingOption.exp) + countMults(sellingOption.exp) <= expLimit
//     ) {
//       options.push(new PairOption(buyingOption, sellingOption));
//     }
//     buyingOption = buyingOptions.shift();
//     sellingOption = sellingOptions.shift();
//   }

//   // const options_ = options;
//   const duration = performance.now() - start;
//   const [options_, duration_] = paretoOptionsSort(options);

//   if (options_.length) {
//     console.log(
//       ` -> ${options_.length} pair-options (binary)`,
//     );
//   }
//   return [options_, duration + duration_];
//   // return options_;
// };

// export const swapsForPairLinear = (
//   buyingOptions: AssetOptions,
//   sellingOptions: AssetOptions,
//   expLimit: number,
// ): [PairOption[], number] => {
//   const start = performance.now();
//   let buyingOption = buyingOptions.shift();
//   let sellingOption = sellingOptions.shift();

//   const options: PairOption[] = [];
//   while (buyingOption && sellingOption) {
//     if (sellingOption.a0 < buyingOption.a0) {
//       sellingOption = sellingOptions.shift();
//     } else if (
//       sellingOption.a0 === buyingOption.a0 ||
//       !buyingOptions.head ||
//       buyingOptions.head.a0 > sellingOption.a0
//     ) {
//       if (
//         countMults(buyingOption.exp) + countMults(sellingOption.exp) <= expLimit
//       ) {
//         options.push(new PairOption(buyingOption, sellingOption));
//       }
//       buyingOption = buyingOptions.shift();
//       sellingOption = sellingOptions.shift();
//     } else {
//       buyingOption = buyingOptions.shift();
//     }
//   }

//   const duration = performance.now() - start;
//   const options_ = options;
//   // const [options_, _duration_] = paretoOptionsSort(options);

//   if (options_.length) {
//     console.log(
//       ` -> ${options_.length} pair-options (linear)`,
//     );
//   }
//   return [options_, duration];
// };

export const swapsForPairExhaustiveStrict = (
  buyingOptions: AssetOptionsStrict,
  sellingOptions: AssetOptionsStrict,
  expLimit: number,
): [PairOption[], number] => {
  const start = performance.now();
  const options: PairOption[] = [];
  buyingOptions.options.forEach((buyingOption) => {
    sellingOptions.options.forEach((sellingOption) => {
      if (
        buyingOption.a0 <= sellingOption.a0 &&
        buyingOption.mults + sellingOption.mults <= expLimit
      ) {
        const newOption = new PairOption(buyingOption, sellingOption);
        options.push(newOption);
      }
    });
  });
  const duration = performance.now() - start;
  const [options_, duration_] = paretoOptionsSort(options);
  if (options_.length) {
    console.log(
      ` -> ${options_.length} pair-options (exhaustive strict)`,
    );
  }
  return [options_, duration + duration_];
};

const paretoOptionsSort = (
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
const paretoOptionsStraight = (
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
      // if (
      //   !options.some((otherOption) => {
      //     return (otherOption.effectivePrice < option.effectivePrice &&
      //       otherOption.buyingOption.delta > option.buyingOption.delta);
      //   })
      // ) {
      options_.push(option);
    }
  });
  return [options_, performance.now() - start];
};

// export const deduplicate = (options: PairOption[]): PairOption[] => {
//   return options.filter((option, index) => {
//     return !options.some((otherOption, otherIndex) => {
//       return (
//         otherIndex !== index &&
//         option.buyingOption.delta === otherOption.buyingOption.delta &&
//         option.effectivePrice === otherOption.effectivePrice
//       );
//     });
//   });
// };
