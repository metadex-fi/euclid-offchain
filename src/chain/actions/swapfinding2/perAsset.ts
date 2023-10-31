import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { maxInteger } from "../../../utils/constants.ts";
import { PairBounds } from "./perPair.ts";
import {
  ceilDiv,
  genNonNegative,
  genPositive,
} from "../../../utils/generators.ts";
import { Param } from "../../../types/euclid/param.ts";
import { maxSmallInteger } from "../../../types/euclid/smallValue.ts";

const compareBigInts = (a: bigint, b: bigint): -1 | 0 | 1 =>
  a === b ? 0 : a < b ? -1 : 1;

const compareAssignments = (
  a: AssetAssignment | "any",
  b: AssetAssignment | "any",
): -1 | 0 | 1 => {
  if (a === "any" && b === "any") return 0; // if both are basically infinite, they are equal
  if (a === "any") return 1; // if a is basically infinite, b is smaller
  if (b === "any") return -1; // if b is basically infinite, a is smaller
  return a.compare(b);
};

const getBetterAssignment = (
  a: AssetAssignment | "none" | "any",
  b: AssetAssignment | "none" | "any",
  which: "smaller" | "larger",
): AssetAssignment | "none" | "any" => {
  if (a === "none" || b === "none") return "none";
  if (a === "any") return b;
  if (b === "any") return a;
  return a.compare(b) < 0 && which === "smaller" ? a : b;
};

export class AssetBounds {
  private constructor(
    private readonly lowerBound: AssetAssignment | "any",
    private readonly upperBound: AssetAssignment | "any",
    public readonly constants: AssetConstants,
  ) {
    if (lowerBound !== "any" && upperBound !== "any") {
      assert(lowerBound.compare(upperBound) <= 0);
    }
    if (lowerBound !== "any") {
      assert(lowerBound.constants.equals(constants));
    }
    if (upperBound !== "any") {
      assert(upperBound.constants.equals(constants));
    }
  }

  public toString = (): string => {
    return `AssetBounds (
      lowerBound: ${this.lowerBound.toString()},
      upperBound: ${this.upperBound.toString()},
      constants: ${this.constants.toString()}
    )`;
  };

  // we assume one is "tighter" regarding deltas than the other, hence the flipped comparisons
  // -1 means this is the tighter one
  // also we assume it's the same asset
  public compare = (other: AssetBounds): -1 | 0 | 1 => {
    assert(this.constants.equals(other.constants));
    const compareLowerBounds = compareAssignments(
      other.lowerBound,
      this.lowerBound,
    );
    const compareUpperBounds = compareAssignments(
      this.upperBound,
      other.upperBound,
    );
    let result: -1 | 0 | 1 = 0;
    for (const comparison of [compareLowerBounds, compareUpperBounds]) {
      if (comparison === 0) continue;
      else if (result === 0) result = comparison;
      else {assert(
          result === comparison,
          `compare(): ${result} != ${comparison}`,
        );}
    }
    return result;
  };

  static fromAssetConstants = (
    constants: AssetConstants,
  ): AssetBounds | null => {
    const fromExpBound = AssetAssignment.fromExpBound(constants);
    const fromMaxSpot = AssetAssignment.fromMaxSpot(constants);
    const fromMinDelta = AssetAssignment.fromMinDelta(constants);
    const fromMaxDelta = AssetAssignment.fromMaxDelta(constants);

    const lowerSelling = [fromExpBound, fromMinDelta];
    const upperSelling = [fromMaxDelta, fromMaxSpot];
    const lowerBuying = [fromExpBound, fromMinDelta, fromMaxSpot];
    const upperBuying = [fromMaxDelta];

    const lowerBounds = constants.direction === "buying"
      ? lowerBuying
      : lowerSelling;
    const upperBounds = constants.direction === "buying"
      ? upperBuying
      : upperSelling;

    let lowerBound: AssetAssignment | "none" | "any" = "any";
    let upperBound: AssetAssignment | "none" | "any" = "any";

    for (const bound of lowerBounds) {
      if (bound instanceof AssetAssignment) assert(bound.boundary === "lower");
      lowerBound = getBetterAssignment(lowerBound, bound, "smaller");
    }
    for (const bound of upperBounds) {
      if (bound instanceof AssetAssignment) assert(bound.boundary === "upper");
      upperBound = getBetterAssignment(upperBound, bound, "larger");
    }

    if (lowerBound === "none") return null; // means we can't swap.
    if (upperBound === "none") {
      assert(constants.direction === "selling");
      return null;
    } // means we can't swap. Comes from fromMaxSpot, selling case

    return new AssetBounds(lowerBound, upperBound, constants);
  };

  public toPairBounds = (otherConstants: AssetConstants): PairBounds => {
    const otherBounds = this.otherDirectionEquivalent(otherConstants);
    if (this.constants.direction === "buying") {
      assert(otherConstants.direction === "selling");
      return new PairBounds(this, otherBounds);
    } else {
      assert(otherConstants.direction === "buying");
      return new PairBounds(otherBounds, this);
    }
  };

  private otherDirectionEquivalent = (
    otherConstants: AssetConstants,
  ): AssetBounds => {
    const otherLowerBound = this.upperBound === "any"
      ? "any"
      : this.upperBound.otherDirectionEquivalent(
        otherConstants,
      );
    const otherUpperBound = this.lowerBound === "any"
      ? "any"
      : this.lowerBound.otherDirectionEquivalent(
        otherConstants,
      );

    assert(
      otherLowerBound !== "none",
      `no other lower bound found for ${this.toString()}`,
    );
    assert(
      otherUpperBound !== "none",
      `no other upper bound found for ${this.toString()}`,
    );

    return new AssetBounds(otherLowerBound, otherUpperBound, this.constants);
  };
}

export class AssetAssignment {
  private constructor(
    public readonly boundary: "lower" | "upper",
    public readonly constants: AssetConstants,
    private readonly exp: bigint,
    private readonly spot: bigint,
    private readonly delta: bigint,
  ) {
    assert(
      this.spot > 0n,
      `spot must be positive: ${this.spot} of ${this.toString()}`,
    );
    assert(
      this.spot <= maxInteger,
      `spot > maxInteger: ${this.spot} > ${maxInteger} of ${this.toString()}`,
    );

    assert(
      this.delta >= constants.minDelta,
      `delta must be >= min: ${this.delta} < ${constants.minDelta} of ${this.toString()}`,
    );
    assert(
      this.delta <= constants.maxDelta,
      `delta must be <= max: ${this.delta} < ${constants.maxDelta} of ${this.toString()}`,
    );
  }

  public toString = (): string => {
    return `AssetAssignment (
      boundary: ${this.boundary},
      constants: ${this.constants.toString()},
      exp: ${this.exp},
      spot: ${this.spot},
      delta: ${this.delta}
    )`;
  };

  public equals = (other: AssetAssignment): boolean =>
    this.compare(other) === 0;

  // we order by deltas
  public compare = (other: AssetAssignment): -1 | 0 | 1 => {
    assert(this.constants.equals(other.constants));
    const compareExps = this.constants.direction === "buying"
      ? compareBigInts(other.exp, this.exp)
      : compareBigInts(this.exp, other.exp);
    const compareSpots = this.constants.direction === "buying"
      ? compareBigInts(other.spot, this.spot)
      : compareBigInts(this.spot, other.spot);
    const compareDeltas = compareBigInts(this.delta, other.delta);
    let result: -1 | 0 | 1 = 0;
    for (const comparison of [compareExps, compareSpots, compareDeltas]) {
      if (comparison === 0) continue;
      else if (result === 0) result = comparison;
      else {assert(
          result === comparison,
          `compare(): ${this.toString()} vs. ${other.toString()} of ${this.constants.toString()}`,
        );}
    }
    return result;
  };

  // This should be the only one calling the constructor, as, due to rounding,
  // conversions between exp, spot and delta are not always reversible.
  // Exp should be that bottleneck, as that's what we ultimately send to the contract.
  static fromExp(
    boundary: "lower" | "upper",
    constants: AssetConstants,
    exp: bigint,
    checkMinSpot: null | "none" | "any",
    checkMaxSpot: null | "none" | "any",
    checkMinDelta: null | "none" | "any",
    checkMaxDelta: null | "fit" | "any",
  ): AssetAssignment | "none" | "any" {
    const spot = constants.calcSpotFromExp(exp);
    if (checkMinSpot && spot < 1n) return checkMinSpot;
    if (checkMaxSpot && spot > maxInteger) return checkMaxSpot;
    let delta = constants.calcDeltaFromSpot(spot);
    if (checkMinDelta && delta < constants.minDelta) return checkMinDelta;
    if (checkMaxDelta && delta > constants.maxDelta) {
      if (checkMaxDelta === "fit") delta = constants.maxDelta;
      else return checkMaxDelta;
    }
    return new AssetAssignment(boundary, constants, exp, spot, delta);
  }

  // lower bound for both deltas
  static fromExpBound = (
    constants: AssetConstants,
  ): AssetAssignment | "none" | "any" => {
    const amm = constants.calcAmm();
    if (amm > maxInteger) return "any"; // already captured by fromMaxSpot in this case
    assert(amm > 0n, `amm should always be positive: ${amm}`);
    const exp_ = constants.calcExpFromSpot(amm);
    const exp = BigInt(
      constants.direction === "buying" ? Math.floor(exp_) : Math.ceil(exp_),
    );
    return AssetAssignment.fromExp(
      "lower",
      constants,
      exp,
      null, // NOTE not investigated yet
      "none", // if the spot closest to the amm exceeds maxInteger: we can't swap
      "any", // if the spot closest to the amm does not enable minimum delta: we defer to fromMinDelta
      "fit", // if the spot closest to the amm already exceeds maximum delta: we have to swap less than the maximum
    );
  };

  // lower bound for for buying-delta, upper bound for selling-delta
  static fromMaxSpot = (
    constants: AssetConstants,
  ): AssetAssignment | "none" | "any" => {
    let exp = BigInt(Math.ceil(constants.calcExpFromSpot(maxInteger)));
    let spot: bigint;
    while (true) {
      spot = constants.calcSpotFromExp(exp);
      if (spot >= maxInteger) exp--;
      else break;
    }
    assert(spot > 0n, `spot must be positive: ${spot}`); // NOTE not investigated yet
    return AssetAssignment.fromExp(
      constants.direction === "buying" ? "lower" : "upper",
      constants,
      exp,
      null, // we assert it above
      null, // we lower exp until this fits
      constants.direction === "buying" // (hint: increase selling-delta by increasing selling-price)
        ? "any" // buying case: if the largest spot does not enable minimum delta: we might find a lower one that does
        : "none", // selling case: if even the largest spot does not enable minimum delta: we can't swap
      constants.direction === "buying" // (hint: decrease buying-delta by increasing buying-price)
        ? "fit" // buying case: if even the largest spot exceeds maximum delta: we have to swap less than the maximum
        : "any", // selling case: if the largest spot exceeds maximum delta: we might find a lower one that doesn't
    );
  };

  // lower bound for both deltas
  static fromMinDelta = (
    constants: AssetConstants,
  ): AssetAssignment | "none" => {
    let spot = constants.calcSpotFromDelta(constants.minDelta);
    let exp = BigInt(Math.ceil(constants.calcExpFromSpot(spot)));
    while (true) {
      spot = constants.calcSpotFromExp(exp);
      const delta = constants.calcDeltaFromSpot(spot);
      if (delta >= constants.minDelta) break;
      else if (constants.direction === "buying") exp--;
      else exp++;
    }
    const assignment = AssetAssignment.fromExp(
      "lower",
      constants,
      exp,
      null, // NOTE not investigated yet
      "none", // if the smallest delta requires too large a spot price: we can't swap
      null, // we adjust exp above until this fits
      "fit", // if the exp for the minimum delta exceeds the maximum delta: we cut the delta at its maximum
    );
    assert(assignment !== "any"); // implied by the parameters above
    return assignment;
  };

  // upper bound for both deltas
  static fromMaxDelta = (
    constants: AssetConstants,
  ): AssetAssignment | "any" => {
    let spot = constants.calcSpotFromDelta(constants.maxDelta);
    // we round towards the amm price, such that maxDelta won't be exceeded
    let exp = constants.direction === "buying"
      ? BigInt(Math.ceil(constants.calcExpFromSpot(spot)))
      : BigInt(Math.floor(constants.calcExpFromSpot(spot)));
    while (true) {
      spot = constants.calcSpotFromExp(exp);
      const delta = constants.calcDeltaFromSpot(spot);
      if (delta >= constants.minDelta) break;
      if (constants.direction === "buying") exp--;
      else exp++;
    }
    const assignment = AssetAssignment.fromExp(
      "upper",
      constants,
      exp,
      null, // NOTE not investigated yet
      "any", // if the spot for maximum delta exceeds maxInteger: we defer to fromMaxSpot
      null, // we adjust exp above until this fits
      "fit", // if the exp for the minimum or maximum delta exceeds the maximum delta: we cut the delta at its maximum
    );
    assert(assignment !== "none"); // implied by the parameters above
    return assignment;
  };

  public otherDirectionEquivalent = (
    otherConstants: AssetConstants,
  ): AssetAssignment | "none" | "any" => {
    if (this.constants.direction === "buying") {
      assert(otherConstants.direction === "selling");
    } else {
      assert(otherConstants.direction === "buying");
    }
    const otherDelta = otherConstants.calcEquivalentDelta(
      this.delta,
      this.constants.liquidity,
      this.constants.weight,
    );
    if (otherDelta === "oo") return "any";
    const otherSpot = otherConstants.calcSpotFromDelta(otherDelta);
    const otherExp = BigInt(
      Math.ceil(otherConstants.calcExpFromSpot(otherSpot)),
    );
    if (this.boundary === "lower") {
      return AssetAssignment.fromExp(
        "upper",
        otherConstants,
        otherExp,
        null, // NOTE not investigated yet
        null, // NOTE not investigated yet
        null, // if the equivalent delta is less than the other direction's minimum, we TODO
        null, // NOTE not investigated yet
      );
    } else {
      return AssetAssignment.fromExp(
        "lower",
        otherConstants,
        otherExp,
        null, // NOTE not investigated yet
        null, // NOTE not investigated yet
        null, // NOTE not investigated yet
        null, // NOTE not investigated yet
      );
    }
  };
}

export class AssetConstants {
  constructor(
    public readonly direction: "buying" | "selling",
    public readonly minDelta: bigint,
    public readonly maxDelta: bigint,
    public readonly liquidity: bigint,
    public readonly weight: bigint,
    private readonly jumpSize: bigint,
    private readonly anchor: bigint,
  ) {
    assert(minDelta > 0n);
    assert(maxDelta >= minDelta);
    assert(liquidity > 0n);
    assert(weight > 0n);
    assert(jumpSize > 0n);
    assert(anchor > 0n);
  }

  public toString = (): string => {
    return `AssetConstants (
      direction: ${this.direction},
      minDelta: ${this.minDelta},
      maxDelta: ${this.maxDelta},
      liquidity: ${this.liquidity},
      weight: ${this.weight},
      jumpSize: ${this.jumpSize},
      anchor: ${this.anchor}
    )`;
  };

  static generateFor = (direction: "buying" | "selling"): AssetConstants => {
    const jumpSize = genPositive(maxSmallInteger);
    const virtual = genPositive(ceilDiv(jumpSize + 1n, maxSmallInteger));
    const [minWeight, maxWeight] = Param.weightBounds(jumpSize, virtual);
    const weight = minWeight + genNonNegative(maxWeight - minWeight);
    const balance = direction === "buying"
      ? genPositive(maxInteger - virtual)
      : genNonNegative(maxInteger - virtual);
    const liquidity = virtual + balance;
    const maxDelta = direction === "buying" ? balance : genPositive();
    const minDelta = genPositive(maxDelta);
    const anchor = genPositive();
    return new AssetConstants(
      direction,
      minDelta,
      maxDelta,
      liquidity,
      weight,
      jumpSize,
      anchor,
    );
  };

  public equals = (other: AssetConstants): boolean =>
    this.direction === other.direction &&
    this.minDelta === other.minDelta &&
    this.maxDelta === other.maxDelta &&
    this.liquidity === other.liquidity &&
    this.weight === other.weight &&
    this.jumpSize === other.jumpSize &&
    this.anchor === other.anchor;

  public calcDeltaFromSpot = (spot: bigint): bigint =>
    // rounding towards zero in both cases, as we are interested
    // in the maximum delta-capacity of a given spot price
    this.direction === "buying"
      ? this.liquidity + ((-spot) / this.weight)
      : -this.liquidity + (spot / this.weight);

  public calcSpotFromDelta = (delta: bigint): bigint =>
    this.direction === "buying"
      ? this.weight * (this.liquidity - delta)
      : this.weight * (this.liquidity + delta);

  // mainly for testing, but should have implications for the code as well
  public roundSpot = (spot: bigint): bigint =>
    this.direction === "buying"
      ? -(-spot / this.weight) * this.weight
      : (spot / this.weight) * this.weight;

  public calcSpotFromExp = (exp: bigint): bigint =>
    (0 <= exp)
      ? (this.anchor * ((this.jumpSize + 1n) ** exp)) / (this.jumpSize ** exp)
      : (this.anchor * (this.jumpSize ** -exp)) /
        ((this.jumpSize + 1n) ** -exp);

  public calcExpFromSpot = (spot: bigint): number => {
    const spotLog = Math.log(Number(spot));
    const anchorLog = Math.log(Number(this.anchor));
    const jsLog = Math.log(1 + (1 / Number(this.jumpSize)));
    const exp = (spotLog - anchorLog) / jsLog;
    if (isNaN(exp)) {
      console.log("spot", spot);
      console.log("spotLog", spotLog);
      console.log("anchorLog", anchorLog);
      console.log("jsLog", jsLog);
    }
    return exp;
  };

  public calcEquivalentDelta = (
    otherDelta: bigint,
    otherLiquidity: bigint,
    otherWeight: bigint,
  ): bigint | "oo" => {
    const w_delta_1 = this.weight * otherDelta;
    const w_delta_2 = otherDelta * otherWeight;
    const w_l = otherWeight * otherLiquidity;
    const numerator = w_delta_1 * this.liquidity;
    if (this.direction === "buying") {
      const denominator = w_delta_1 + w_delta_2 + w_l;
      return numerator / denominator;
    } else {
      const denominator = -w_delta_1 - w_delta_2 + w_l;
      if (denominator === 0n) return "oo";
      return ceilDiv(numerator, denominator);
    }
  };

  public calcAmm = (): bigint => this.liquidity * this.weight;
}
