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
    this.effectivePrice = Number(buyingOption.delta) /
      Number(sellingOption.delta);
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

export class AssetOptions {
  private readonly available: bigint;
  private readonly liquidity: bigint;
  private readonly amm: bigint;
  private readonly maxDelta: bigint;
  private readonly minSpot: bigint;
  private readonly maxSpot: bigint;
  private readonly options: AssetOption[];
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
  ) {
    this.available = balance - locked;
    this.liquidity = virtual + balance;
    this.amm = this.liquidity * weight;

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
      return;
    }

    const logAnchor = Math.log(Number(anchor));
    const logJump = Math.log(1 + 1 / Number(jumpSize));

    const logMinSpot = Math.log(Number(this.minSpot));
    const minExp_ = (logMinSpot - logAnchor) / logJump;
    let minExp = BigInt(Math.ceil(minExp_));
    if (Math.abs(Number(minExp) - minExp_) < 1e-14) {
      minExp += 1n;
    }

    const logMaxSpot = Math.log(Number(this.maxSpot + 1n));
    const maxExp_ = (logMaxSpot - logAnchor) / logJump;
    let maxExp = BigInt(Math.floor(maxExp_));
    if (Number(maxExp) === maxExp_) maxExp -= 1n;

    const calcSpotFromExp = (exp: bigint): bigint =>
      exp < 0n
        ? (anchor * (jumpSize ** -exp)) / ((jumpSize + 1n) ** -exp)
        : (anchor * ((jumpSize + 1n) ** exp)) / (jumpSize ** exp);

    const calcDeltaCapacityFromSpot = (spot: bigint): bigint =>
      assetType === "buying"
        ? (this.amm - spot) / weight
        : (spot - this.amm) / weight;

    const calcOptionFromExp = (exp: bigint): AssetOption => {
      const spot = calcSpotFromExp(exp);
      assert(spot >= this.minSpot, `${spot} < ${this.minSpot}`);
      assert(spot <= this.maxSpot, `${spot} > ${this.maxSpot}`);

      const delta = calcDeltaCapacityFromSpot(spot);
      assert(delta >= minDelta, `${delta} < ${minDelta}`);
      assert(delta <= this.maxDelta, `${delta} > ${this.maxDelta}`);

      const a0 = Number(delta) / Number(spot);
      return { exp, spot, delta, a0 };
    };

    const options: AssetOption[] = [];
    let previousOption: AssetOption | undefined;
    let edgeExp: bigint;
    let excessEdgeExp: bigint;
    let otherEdgeExp: bigint;
    let skipped = 0;
    if (assetType === "buying") {
      for (let exp = maxExp; exp >= minExp; exp--) {
        const newOption = calcOptionFromExp(exp);
        if (previousOption) {
          // if (previousOption.delta === newOption.delta) {
          //   skipped++;
          //   continue;
          // }
          assert(previousOption.spot > newOption.spot);
          assert(previousOption.a0 < newOption.a0); // expecting this to fail, if not: this is not the most efficient implementation
          // assert(previousOption.delta !== newOption.delta, `${newOption.delta}`);
        }
        previousOption = newOption;
        options.push(newOption);
      }
      edgeExp = minExp - 1n;
      excessEdgeExp = minExp - 2n;
      otherEdgeExp = maxExp + 1n;
    } else {
      for (let exp = minExp; exp <= maxExp; exp++) {
        const newOption = calcOptionFromExp(exp);
        if (previousOption) {
          // if (previousOption.delta === newOption.delta) {
          //   skipped++;
          //   continue;
          // }
          // if (previousOption.a0 === newOption.a0) {
          //   assert(
          //     previousOption.spot === newOption.spot,
          //     `${previousOption.a0}\n${previousOption.spot} !== ${newOption.spot}\n${previousOption.delta} vs. ${newOption.delta}`,
          //   );
          //   assert(
          //     previousOption.delta === newOption.delta,
          //     `${previousOption.delta} !== ${newOption.delta}`,
          //   );
          //   skipped++;
          //   continue;
          // }
          assert(previousOption.delta <= newOption.delta);
          if (previousOption.spot === newOption.spot) {
            assert(
              previousOption.delta === newOption.delta,
              `${previousOption.delta} !== ${newOption.delta}`,
            );
            skipped++;
            continue;
          }
          assert(
            previousOption.spot < newOption.spot,
            `${previousOption.spot} >= ${newOption.spot} for ${previousOption.exp} and ${newOption.exp}`,
          );
          if (previousOption.a0 === newOption.a0) {
            assert(previousOption.delta < newOption.delta);
            skipped++;
            continue; // since we prefer a smaller selling-delta
          }
          // assert(
          //   previousOption.delta * newOption.spot <=
          //     newOption.delta * previousOption.spot,
          //   `${previousOption.delta} * ${newOption.spot} > ${newOption.delta} * ${previousOption.spot}\n${
          //     previousOption.delta * newOption.spot
          //   } > ${
          //     newOption.delta * previousOption.spot
          //   }\n${previousOption.a0} > ${newOption.a0}`,
          // ); // expecting this to fail, if not: this is not the most efficient implementation
        }
        previousOption = newOption;
        options.push(newOption);
      }
      edgeExp = maxExp + 1n;
      excessEdgeExp = maxExp + 2n;
      otherEdgeExp = minExp - 1n;
    }
    // if (skipped) {
    //   console.log(
    //     `${
    //       100 * skipped / Math.abs(Number(maxExp - minExp))
    //     }% skipped: ${skipped} / ${Math.abs(Number(maxExp - minExp))}`,
    //   );
    // }
    const edgeSpot = calcSpotFromExp(edgeExp);
    if (edgeSpot <= maxInteger) {
      const delta = this.maxDelta;
      const a0 = Number(delta) / Number(edgeSpot);
      options.push({ exp: edgeExp, spot: edgeSpot, delta, a0 });
    }
    try {
      calcOptionFromExp(excessEdgeExp);
      throw new Error(
        "excessEdgeOption should have failed, bounds not tight enough",
      );
    } catch (_e) {
      // expected
    }
    try {
      calcOptionFromExp(otherEdgeExp);
      throw new Error(
        "otherEdgeOption should have failed, bounds not tight enough",
      );
    } catch (_e) {
      // expected
    }
    // if (options.length) console.log(`${options.length} ${assetType}-options`);
    if (assetType === "selling") {
      options.sort((a, b) => a.a0 - b.a0); // buying is already asserted to be sorted on creation
      for (let i = 0; i < options.length - 1; i++) {
        if (options[i].a0 === options[i + 1].a0) {
          assert(options[i].spot < options[i + 1].spot);
          assert(options[i].delta < options[i + 1].delta);
          options.splice(i, 1);
          i--;
        }
      }
    } else if (options.length > 1) {
      assert(options[options.length - 2].a0 < options[options.length - 1].a0); // for the edge-option
    }

    this.options = options;
  }

  public get length(): number {
    return this.options.length - this.headIndex;
  }

  public get head(): AssetOption | undefined {
    if (this.options.length > this.headIndex) {
      return this.options[this.headIndex];
    } else return undefined;
  }

  public shift = (): AssetOption | undefined => {
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
    let start = this.headIndex;
    let end = this.options.length - 1;
    let index: number | undefined = undefined;
    let result: AssetOption | undefined = undefined;

    while (start <= end) {
      const mid = Math.ceil((start + end) / 2);
      const buyingOption = this.options[mid];

      if (buyingOption.a0 <= sellingOption.a0) {
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

// export const swapsForPair = (
//   buyingOptions: AssetOptions,
//   sellingOptions: AssetOptions,
// ): PairOption[] => {
//   const bs = buyingOptions.length;
//   const ss = sellingOptions.length;

//   let buyingOption: AssetOption | undefined = undefined;
//   let sellingOption: AssetOption | undefined = undefined;

//   const options: PairOption[] = [];
//   while (true) {
//     if (buyingOptions.length < sellingOptions.length) {
//       buyingOption = buyingOptions.shift();
//       if (!buyingOption) break;
//       sellingOption = sellingOptions.getCorrSellingOption(buyingOption);
//       if (!sellingOption) break;
//     } else {
//       sellingOption = sellingOptions.shift();
//       if (!sellingOption) break;
//       buyingOption = buyingOptions.getCorrBuyingOption(sellingOption);
//       if (!buyingOption) break;
//     }
//     options.push(new PairOption(buyingOption, sellingOption));
//   }
//   // if (options.length)
//   if (bs && ss) {
//     console.log(
//       `${bs}, ${ss} -> ${options.length} pair-options (A)`,
//     );
//   }
//   return options;
// };

export const swapsForPair = (
  buyingOptions: AssetOptions,
  sellingOptions: AssetOptions,
): PairOption[] => {
  const bs = buyingOptions.length;
  const ss = sellingOptions.length;
  let buyingOption = buyingOptions.shift();
  let sellingOption = sellingOptions.shift();

  const options: PairOption[] = [];
  while (buyingOption && sellingOption) {
    if (sellingOption.a0 < buyingOption.a0) {
      sellingOption = sellingOptions.getCorrSellingOption(
        buyingOption,
      );
      if (!sellingOption) break;
    } else if (
      sellingOption.a0 === buyingOption.a0 ||
      buyingOptions.head === undefined ||
      buyingOptions.head.a0 > sellingOption.a0
    ) {
      // match
    } else {
      assert(sellingOption.a0 > buyingOption.a0);
      buyingOption = buyingOptions.getCorrBuyingOption(sellingOption);
      if (!buyingOption) break;
    }
    options.push(new PairOption(buyingOption, sellingOption));
    buyingOption = buyingOptions.shift();
    sellingOption = sellingOptions.shift();
  }
  // if (options.length)
  if (bs && ss) {
    console.log(
      `${bs}, ${ss} -> ${options.length} pair-options (A)`,
    );
  }
  return options;
};

export const swapsForPair_ = (
  buyingOptions: AssetOptions,
  sellingOptions: AssetOptions,
): PairOption[] => {
  const bs = buyingOptions.length;
  const ss = sellingOptions.length;
  let buyingOption = buyingOptions.shift();
  let sellingOption = sellingOptions.shift();

  const options: PairOption[] = [];
  while (buyingOption && sellingOption) {
    if (sellingOption.a0 < buyingOption.a0) {
      sellingOption = sellingOptions.shift();
    } else if (
      sellingOption.a0 === buyingOption.a0 ||
      buyingOptions.head === undefined ||
      buyingOptions.head.a0 > sellingOption.a0
    ) {
      options.push(new PairOption(buyingOption, sellingOption));
      buyingOption = buyingOptions.shift();
      sellingOption = sellingOptions.shift();
    } else {
      buyingOption = buyingOptions.shift();
    }
  }
  // if (options.length)
  if (bs && ss) {
    console.log(
      `${bs}, ${ss} -> ${options.length} pair-options (B)`,
    );
  }
  return options;
};
