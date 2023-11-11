import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { maxInteger } from "../../../utils/constants.ts";
import {
  genNonNegative,
  genPositive,
  min,
  strictDiv,
} from "../../../utils/generators.ts";
import { maxSmallInteger } from "../../../types/euclid/smallValue.ts";

interface AssetOption {
  exp: bigint;
  spot: bigint;
  delta: bigint;
  a0: number;
}

interface PairOption {
  buyingOption: AssetOption;
  sellingOption: AssetOption;
}

export const genAssetParams = () => {
  const virtual = genPositive(maxInteger);
  const balance = genNonNegative(maxInteger - virtual);
  const locked = genNonNegative(balance);
  const weight = genPositive(maxInteger);
  const jumpSize = genPositive(maxSmallInteger);
  const anchor = genPositive(maxInteger);
  const minDelta = genPositive(maxInteger);
  return { virtual, balance, locked, weight, jumpSize, anchor, minDelta };
};

export const calcAssetOptions = (
  assetType: "buying" | "selling",
  virtual: bigint,
  locked: bigint,
  balance: bigint,
  weight: bigint,
  jumpSize: bigint,
  anchor: bigint,
  minDelta: bigint,
  sellingMaxDeltaOrWeight: bigint, // selling-maxDelta if selling, selling-weight if buying
): AssetOption[] => {
  const available = balance - locked;
  const liquidity = virtual + balance;
  const amm = liquidity * weight;
  let maxDelta: bigint;
  let minSpot: bigint;
  let maxSpot: bigint;

  if (assetType === "buying") {
    maxDelta = min(
      available,
      strictDiv(weight * liquidity, weight + sellingMaxDeltaOrWeight),
    );
    if (maxDelta < minDelta) return [];
    minSpot = min(maxInteger, weight * (liquidity - maxDelta));
    maxSpot = min(maxInteger, weight * (liquidity - minDelta));
  } else {
    maxDelta = sellingMaxDeltaOrWeight;
    if (maxDelta < minDelta) return [];
    minSpot = min(maxInteger, weight * (liquidity + minDelta));
    maxSpot = min(maxInteger, weight * (liquidity + maxDelta));
  }

  const logAnchor = Math.log(Number(anchor));
  const logJump = Math.log(1 + 1 / Number(jumpSize));

  const logMinSpot = Math.log(Number(minSpot));
  const minExp_ = (logMinSpot - logAnchor) / logJump;
  let minExp = BigInt(Math.ceil(minExp_));
  if (Math.abs(Number(minExp) - minExp_) < 1e-14) {
    minExp += 1n;
  }

  const logMaxSpot = Math.log(Number(maxSpot + 1n));
  const maxExp_ = (logMaxSpot - logAnchor) / logJump;
  let maxExp = BigInt(Math.floor(maxExp_));
  if (Number(maxExp) === maxExp_) maxExp -= 1n;

  const calcSpotFromExp = (exp: bigint): bigint =>
    exp < 0n
      ? (anchor * (jumpSize ** -exp)) / ((jumpSize + 1n) ** -exp)
      : (anchor * ((jumpSize + 1n) ** exp)) / (jumpSize ** exp);

  const calcDeltaCapacityFromSpot = (spot: bigint): bigint =>
    assetType === "buying" ? (amm - spot) / weight : (spot - amm) / weight;

  const calcOptionFromExp = (exp: bigint): AssetOption => {
    const spot = calcSpotFromExp(exp);
    assert(spot >= minSpot, `${spot} < ${minSpot}`);
    assert(spot <= maxSpot, `${spot} > ${maxSpot}`);

    const delta = calcDeltaCapacityFromSpot(spot);
    assert(delta >= minDelta, `${delta} < ${minDelta}`);
    assert(delta <= maxDelta, `${delta} > ${maxDelta}`);

    const a0 = Number(delta) / Number(spot);
    return { exp, spot, delta, a0 };
  };

  const options: AssetOption[] = [];
  let previousOption: AssetOption | undefined;
  let edgeExp: bigint;
  let excessEdgeExp: bigint;
  let otherEdgeExp: bigint;
  if (assetType === "buying") {
    for (let exp = maxExp; exp >= minExp; exp--) {
      const newOption = calcOptionFromExp(exp);
      if (previousOption) {
        assert(
          previousOption.delta <= newOption.delta,
          `${previousOption.delta} > ${newOption.delta}`,
        );
        assert(previousOption.a0 < newOption.a0); // expecting this to fail, if not: this is not the most efficient implementation
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
        assert(
          previousOption.delta <= newOption.delta,
          `${previousOption.delta} > ${newOption.delta}`,
        );
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
  const edgeSpot = calcSpotFromExp(edgeExp);
  if (edgeSpot <= maxInteger) {
    const delta = maxDelta;
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
  if (options.length) console.log(`${options.length} ${assetType}-options`);
  return options.sort((a, b) => a.a0 - b.a0);
};

export const swapsForPair = (
  buyingOptions: AssetOption[],
  sellingOptions: AssetOption[],
): PairOption[] => {
  let buyingOption = buyingOptions.shift();
  let sellingOption = sellingOptions.shift();

  const options: PairOption[] = [];
  while (true) {
    if (!buyingOption || !sellingOption) break;
    if (sellingOption.a0 < buyingOption.a0) {
      sellingOption = sellingOptions.shift();
    } else if (
      sellingOption.a0 === buyingOption.a0 ||
      buyingOptions.length === 0 ||
      buyingOptions[0].a0 > sellingOption.a0
    ) {
      options.push({ buyingOption, sellingOption });
      buyingOption = buyingOptions.shift();
      sellingOption = sellingOptions.shift();
    } else {
      buyingOption = buyingOptions.shift();
    }
  }
  if (options.length) console.log(`-> ${options.length} pair-options`);
  return options;
};
