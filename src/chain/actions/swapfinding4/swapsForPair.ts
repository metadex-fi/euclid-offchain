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

interface AssetOption {
  exp: bigint;
  spot: bigint;
  delta: bigint;
  a0: number;
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
  private readonly maxDelta: bigint;
  private readonly minSpot: bigint;
  private readonly maxSpot: bigint;
  private readonly minExp: bigint;
  private readonly maxExp: bigint;
  public readonly options: AssetOption[];
  private readonly buyingOptions: Map<number, AssetOption | null> = new Map();
  private headIndex = 0;

  constructor(
    private readonly assetType: "buying" | "selling",
    private readonly virtual: bigint,
    private readonly locked: bigint,
    private readonly balance: bigint,
    private readonly weight: bigint,
    private readonly jumpSize: bigint,
    private readonly anchor: bigint,
    private readonly minDelta: bigint,
    private readonly sellingMaxDeltaOrWeight: bigint, // selling-maxDelta if selling, selling-weight if buying
    private readonly expLimit = Infinity,
    private readonly precomputeBuying = true, 
  ) {
    assert(precomputeBuying)
    this.available = balance - locked;
    this.liquidity = virtual + balance;
    this.amm = this.liquidity * weight;
    this.jumpMultiplier = 1 + 1 / Number(jumpSize);

    if (assetType === "buying") {
      this.maxDelta = min(
        this.available,
        strictDiv(weight * this.liquidity, weight + sellingMaxDeltaOrWeight),
      );
      this.minSpot = min(maxInteger, weight * (this.liquidity - this.maxDelta));
      this.maxSpot = min(maxInteger, weight * (this.liquidity - minDelta));
    } else {
      this.maxDelta = sellingMaxDeltaOrWeight;
      this.minSpot = min(maxInteger, weight * (this.liquidity + minDelta));
      this.maxSpot = min(maxInteger, weight * (this.liquidity + this.maxDelta));
    }
    if (this.maxDelta < minDelta) {
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
    if (Math.abs(Number(minExp) - minExp_) < 1e-14) {
      minExp += 1n;
    }
    this.minExp = minExp;

    const logMaxSpot = Math.log(Number(this.maxSpot + 1n));
    const maxExp_ = (logMaxSpot - logAnchor) / logJump;
    let maxExp = BigInt(Math.floor(maxExp_));
    if (Number(maxExp) === maxExp_) maxExp -= 1n;
    this.maxExp = maxExp;

    let options: AssetOption[] = [];
    // let edgeExp: bigint;
    // let excessEdgeExp: bigint;
    // let otherEdgeExp: bigint;

    if (assetType === "buying") {
      if (precomputeBuying) options = this.calcBuyingOptions();
      // excessEdgeExp = minExp - 2n;
      // otherEdgeExp = maxExp + 1n;
    } else {
      options = this.calcSellingOptions();
      // excessEdgeExp = maxExp + 2n;
      // otherEdgeExp = minExp - 1n;
    }

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
      options.sort((a, b) => a.a0 - b.a0);
      for (let i = 0; i < options.length - 1; i++) {
        if (options[i].a0 === options[i + 1].a0) {
          // assert(options[i].spot < options[i + 1].spot); // TODO breaks with the new edgeOption that adheres to expLimit
          // assert(options[i].delta < options[i + 1].delta); // TODO breaks with the new edgeOption that adheres to expLimit
          options.splice(i, 1);
          i--;
        }
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
    exp < 0n
      ? (this.anchor * (this.jumpSize ** -exp)) / ((this.jumpSize + 1n) ** -exp)
      : (this.anchor * ((this.jumpSize + 1n) ** exp)) / (this.jumpSize ** exp);

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
    for (let exp = this.maxExp; exp >= this.minExp; exp--) {
      if (countMults(exp) > this.expLimit) {
        continue;
      }
      const spot = this.calcSpotFromExp(exp);
      const newOption = this.calcOptionFromSpot(exp, spot);
      options.push(newOption);
    }
    const edgeOption = this.findBuyingEdgeOption();
    if (edgeOption) options.push(edgeOption);

    return options;
  };

  private calcBuyingOptionsB = (): AssetOption[] => {
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
    if (countMults(this.minExp) <= this.expLimit) {
      previousOption = this.calcOptionFromSpot(this.minExp, spot);
      options.push(previousOption);
    }

    for (let exp = this.minExp + 1n; exp <= this.maxExp; exp++) {
      numerator *= jumpSizePlusOne;
      denominator *= this.jumpSize;
      if (countMults(exp) > this.expLimit) {
        if (bestMultsAhead(exp) > this.expLimit) break;
        continue;
      }

      spot = numerator / denominator;
      // const spot_ = this.calcSpotFromExp(exp);
      // assert(spot === spot_, `${spot} !== ${spot_}`);
      const newOption = this.calcOptionFromSpot(exp, spot);

      if (previousOption) {
        assert(previousOption.a0 >= newOption.a0);
      }
      previousOption = newOption;
      options.push(newOption);
    }
    options.reverse();
    const edgeOption = this.findBuyingEdgeOption();
    if (edgeOption) options.push(edgeOption);

    return options;
  };

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
    if (countMults(this.minExp) <= this.expLimit) {
      previousOption = this.calcOptionFromSpot(this.minExp, spot);
      options.push(previousOption);
    }

    for (let exp = this.minExp + 1n; exp <= this.maxExp; exp++) {
      numerator *= jumpSizePlusOne;
      denominator *= this.jumpSize;
      if (countMults(exp) > this.expLimit) {
        if (bestMultsAhead(exp) > this.expLimit) break;
        continue;
      }

      spot = numerator / denominator;
      // const spot_ = this.calcSpotFromExp(exp);
      // assert(spot === spot_, `${spot} !== ${spot_}`);
      const newOption = this.calcOptionFromSpot(exp, spot);

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
          continue; // since we prefer a smaller selling-delta
        }

        // const a0Ratio = newOption.a0 / previousOption.a0;
        // console.log(a0Ratio);
      }
      previousOption = newOption;
      options.push(newOption);
    }
    let edgeExp = this.maxExp + 1n;
    let edgeSpot = numerator / denominator;
    if (edgeSpot <= maxInteger && bestMultsAhead(edgeExp) <= this.expLimit) {
      while (countMults(edgeExp) > this.expLimit) {
        numerator *= jumpSizePlusOne;
        denominator *= this.jumpSize;
        edgeSpot = numerator / denominator;
        if (edgeSpot > maxInteger) return options;
        edgeExp++;
      }
      const edgeOption = this.calcEdgeOptionFromSpot(edgeExp, edgeSpot);
      assert(edgeOption);
      options.push(edgeOption);
    }
    return options;
  };

  private calcDeltaCapacityFromSpot = (spot: bigint): bigint =>
    this.assetType === "buying"
      ? (this.amm - spot) / this.weight
      : (spot - this.amm) / this.weight;

  private calcOptionFromSpot = (exp: bigint, spot: bigint): AssetOption => {
    assert(spot >= this.minSpot, `${spot} < ${this.minSpot}`);
    assert(spot <= this.maxSpot, `${spot} > ${this.maxSpot}`);

    const delta = this.calcDeltaCapacityFromSpot(spot);
    assert(delta >= this.minDelta, `${delta} < ${this.minDelta}`);
    assert(delta <= this.maxDelta, `${delta} > ${this.maxDelta}`);

    const a0 = Number(delta) / Number(spot);
    return { exp, spot, delta, a0 };
  };

  private calcOptionFromExp = (exp: bigint): AssetOption => {
    const spot = this.calcSpotFromExp(exp);
    return this.calcOptionFromSpot(exp, spot);
  };

  private calcEdgeOptionFromSpot = (
    exp: bigint,
    spot: bigint,
  ): AssetOption | null => {
    if (spot <= maxInteger) {
      const delta = this.maxDelta;
      const a0 = Number(delta) / Number(spot);
      return { exp, spot, delta, a0 };
    } else return null;
  };

  private calcEdgeOptionFromExp = (exp: bigint): AssetOption | null => {
    if (bestMultsAhead(exp) > this.expLimit) return null;
    while (countMults(exp) > this.expLimit) exp++;
    const spot = this.calcSpotFromExp(exp);
    return this.calcEdgeOptionFromSpot(exp, spot);
  };

  private findBuyingEdgeOption = (): AssetOption | null => {
    let edgeExp = this.minExp;
    if (bestMultsAhead(edgeExp) <= this.expLimit) {
      let edgeOption: AssetOption | null = null;
      while (!edgeOption) {
        edgeExp--;
        while (countMults(edgeExp) > this.expLimit) {
          edgeExp--;
        }
        edgeOption = this.calcEdgeOptionFromExp(edgeExp);
      }
      return edgeOption;
    } else return null;
  };

  private getBuyingOptionAt = (
    index: number,
  ): AssetOption | null | undefined => {
    assert(this.assetType === "buying");

    const exp = this.maxExp - BigInt(index);
    if (this.minExp >= this.maxExp) return undefined;
    if (exp < this.minExp - 1n) return undefined;
    let buyingOption = this.buyingOptions.get(index);
    if (!buyingOption) {
      buyingOption = exp < this.minExp
        ? this.findBuyingEdgeOption()
        : this.calcOptionFromExp(exp);
      this.buyingOptions.set(index, buyingOption);
    }
    return buyingOption;
  };

  public get head(): AssetOption | null | undefined {
    if (!this.precomputeBuying && this.assetType === "buying") {
      return this.getBuyingOptionAt(this.headIndex);
    }
    if (this.options.length > this.headIndex) {
      return this.options[this.headIndex];
    } else return undefined;
  }

  public shift = (): AssetOption | null | undefined => {
    const head = this.head;
    this.headIndex++;
    return head;
  };

  public getCorrSellingOption = (
    buyingOption: AssetOption,
  ): AssetOption | undefined => {
    assert(this.assetType === "selling");
    let start = this.headIndex;
    let end = this.options.length - 1;
    let index: number | undefined = undefined;
    let result: AssetOption | undefined = undefined;

    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const sellingOption = this.options[mid];

      if (buyingOption.a0 <= sellingOption.a0) {
        // Store the potential answer and search in the left half
        index = mid;
        result = sellingOption;
        end = mid - 1;
      } else {
        // Search in the right half
        start = mid + 1;
      }
    }
    if (index) this.headIndex = index + 1;
    return result;
  };

  public getCorrBuyingOption = (
    sellingOption: AssetOption,
  ): AssetOption | undefined => {
    assert(this.assetType === "buying");
    assert(!this.precomputeBuying);
    let start = this.headIndex;
    let end = Number(this.maxExp - this.minExp + 1n);
    // console.log(`${start} -> ${end} (${this.options.length - 1}))`);
    // assert(end === this.options.length - 1);
    let index: number | undefined = undefined;
    let result: AssetOption | undefined = undefined;

    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      const buyingOption = this.getBuyingOptionAt(mid);
      assert(buyingOption !== undefined);

      if (buyingOption && buyingOption.a0 <= sellingOption.a0) {
        // Store the potential answer and search in the right half
        index = mid;
        result = buyingOption;
        start = mid + 1;
      } else {
        // Search in the left half
        end = mid - 1;
      }
    }
    if (index) this.headIndex = index + 1;
    return result;
  };
}

export const swapsForPair = (
  buyingOptions: AssetOptions,
  sellingOptions: AssetOptions,
  expLimit = 11,
): [PairOption[], number] => { //PairOption[] => {
  const start = performance.now();
  let buyingOption = buyingOptions.shift();
  let sellingOption = sellingOptions.shift();

  const options: PairOption[] = [];
  while (buyingOption && sellingOption) {
    if (sellingOption.a0 < buyingOption.a0) {
      sellingOption = sellingOptions.getCorrSellingOption(buyingOption);
      continue;
    } else if (
      sellingOption.a0 === buyingOption.a0 ||
      !buyingOptions.head ||
      buyingOptions.head.a0 > sellingOption.a0
    ) {
      // match
    } else {
      assert(sellingOption.a0 > buyingOption.a0);
      buyingOption = buyingOptions.getCorrBuyingOption(sellingOption);
      if (!buyingOption) break;
    }
    if (
      countMults(buyingOption.exp) + countMults(sellingOption.exp) <= expLimit
    ) {
      options.push(new PairOption(buyingOption, sellingOption));
    }
    buyingOption = buyingOptions.shift();
    sellingOption = sellingOptions.shift();
  }

  const options_ = paretoOptionsStraight(options);

  if (options_.length) {
    console.log(
      ` -> ${options_.length} pair-options (A)`,
    );
  }
  const duration = performance.now() - start;
  return [options_, duration];
  // return options_;
};

// seems to equal exhaustive version
export const swapsForPair_ = (
  buyingOptions: AssetOptions,
  sellingOptions: AssetOptions,
  expLimit = 11,
): [PairOption[], number] => { //: PairOption[] => {
  const start = performance.now();
  let buyingOption = buyingOptions.shift();
  let sellingOption = sellingOptions.shift();

  const options: PairOption[] = [];
  while (buyingOption && sellingOption) {
    if (sellingOption.a0 < buyingOption.a0) {
      sellingOption = sellingOptions.shift();
    } else if (
      sellingOption.a0 === buyingOption.a0 ||
      !buyingOptions.head ||
      buyingOptions.head.a0 > sellingOption.a0
    ) {
      if (
        countMults(buyingOption.exp) + countMults(sellingOption.exp) <= expLimit
      ) {
        options.push(new PairOption(buyingOption, sellingOption));
      }
      buyingOption = buyingOptions.shift();
      sellingOption = sellingOptions.shift();
    } else {
      buyingOption = buyingOptions.shift();
    }
  }

  const options_ = paretoOptionsStraight(options);

  if (options_.length) {
    console.log(
      ` -> ${options_.length} pair-options (B)`,
    );
  }
  const duration = performance.now() - start;
  return [options_, duration];
  // return options_;
};

export const swapsForPairExhaustiveSort = (
  buyingOptions: AssetOptions,
  sellingOptions: AssetOptions,
  expLimit = Infinity,
): [PairOption[], number] => {
  const start = performance.now();
  const options: PairOption[] = [];
  buyingOptions.options.forEach((buyingOption) => {
    sellingOptions.options.forEach((sellingOption) => {
      if (
        buyingOption.a0 <= sellingOption.a0 &&
        countMults(buyingOption.exp) + countMults(sellingOption.exp) <= expLimit
      ) {
        const newOption = new PairOption(buyingOption, sellingOption);
        let add = true;
        for (const oldOption of options) {
          if (
            oldOption.effectivePrice <= newOption.effectivePrice &&
            oldOption.buyingOption.delta >= newOption.buyingOption.delta
          ) {
            add = false;
            break;
          }
        }
        if (add) options.push(newOption);
      }
    });
  });
  const options_ = paretoOptionsSort(options);

  if (options_.length) {
    console.log(
      ` -> ${options_.length} pair-options (C)`,
    );
  }
  const duration = performance.now() - start;
  return [options_, duration];
  // return options_;
};

export const swapsForPairExhaustiveStraight = (
  buyingOptions: AssetOptions,
  sellingOptions: AssetOptions,
  expLimit = Infinity,
): [PairOption[], number] => {
  const start = performance.now();
  const options: PairOption[] = [];
  buyingOptions.options.forEach((buyingOption) => {
    sellingOptions.options.forEach((sellingOption) => {
      if (
        buyingOption.a0 <= sellingOption.a0 &&
        countMults(buyingOption.exp) + countMults(sellingOption.exp) <= expLimit
      ) {
        const newOption = new PairOption(buyingOption, sellingOption);
        let add = true;
        for (const oldOption of options) {
          if (
            oldOption.effectivePrice <= newOption.effectivePrice &&
            oldOption.buyingOption.delta >= newOption.buyingOption.delta
          ) {
            add = false;
            break;
          }
        }
        if (add) options.push(newOption);
      }
    });
  });
  const options_ = paretoOptionsStraight(options);

  if (options_.length) {
    console.log(
      ` -> ${options_.length} pair-options (C)`,
    );
  }
  const duration = performance.now() - start;
  return [options_, duration];
  // return options_;
};

const paretoOptionsSort = (options: PairOption[]): PairOption[] => {
  options.sort((a, b) => a.effectivePrice - b.effectivePrice);
  const options_: PairOption[] = [];
  let currentMaxDelta: bigint | null = null;

  for (const option of options) {
    if (
      currentMaxDelta === null || option.buyingOption.delta > currentMaxDelta
    ) {
      options_.push(option);
      currentMaxDelta = option.buyingOption.delta;
    }
  }
  return options_;
};

const paretoOptionsStraight = (options: PairOption[]): PairOption[] => {
  const options_: PairOption[] = [];
  options.forEach((option) => {
    if (
      !options.some((otherOption) => {
        return (otherOption.effectivePrice < option.effectivePrice &&
          otherOption.buyingOption.delta >= option.buyingOption.delta) ||
          (otherOption.effectivePrice <= option.effectivePrice &&
            otherOption.buyingOption.delta > option.buyingOption.delta);
      })
    ) {
      options_.push(option);
    }
  });
  return options_;
};
