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
  a === b ? 0 : (a < b ? -1 : 1);

const compareAssignments = (
  a: AssetAssignment | "Δ = 0" | "Δ = oo",
  b: AssetAssignment | "Δ = 0" | "Δ = oo",
): -1 | 0 | 1 => {
  if (a === "Δ = 0" && b === "Δ = 0") return 0;
  if (a === "Δ = oo" && b === "Δ = oo") return 0;
  if (a === "Δ = 0" || b === "Δ = oo") return 1;
  if (b === "Δ = 0" || a === "Δ = oo") return -1;
  return a.compare(b);
};

const getBetterAssignment = (
  a: AssetAssignment,
  b: AssetAssignment,
  which: "smaller delta" | "larger delta",
): AssetAssignment => {
  return (a.compare(b) < 0) === (which === "smaller delta") ? a : b;
};

export class AssetBounds {
  private constructor(
    private readonly lowerBound: AssetAssignment | "Δ = 0",
    private readonly upperBound: AssetAssignment | "Δ = oo" | undefined,
    public readonly constants: AssetConstants,
  ) {
    assert(
      compareAssignments(lowerBound, upperBound) <= 0,
      `${lowerBound.toString()} > ${upperBound.toString()}`,
    );
    if (lowerBound instanceof AssetAssignment) {
      assert(lowerBound.constants.equals(constants));
    }
    if (upperBound instanceof AssetAssignment) {
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
  ): AssetBounds => {
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

    let lowerBound: AssetAssignment | undefined;
    let upperBound: AssetAssignment | undefined;

    for (const bound of lowerBounds) {
      assert(bound.boundary === "lower");
      if (lowerBound) {
        lowerBound = getBetterAssignment(lowerBound, bound, "smaller delta");
      } else lowerBound = bound;
    }
    for (const bound of upperBounds) {
      assert(bound.boundary === "upper");
      if (upperBound) {
        upperBound = getBetterAssignment(upperBound, bound, "larger delta");
      } else upperBound = bound;
    }

    assert(lowerBound);
    assert(upperBound);
    // if (compareAssignments(lowerBound, upperBound) > 0) return null;
    // if (lowerBound.deltaValidity === "too big") return null;
    // if (upperBound.deltaValidity === "too small") return null;
    return new AssetBounds(lowerBound, upperBound, constants);
  };

  public toPairBounds = (
    otherConstants: AssetConstants,
  ): PairBounds | undefined => {
    const otherBounds = this.otherAssetEquivalent(otherConstants);
    if (this.constants.direction === "buying") {
      assert(otherConstants.direction === "selling");
      return new PairBounds(this, otherBounds);
    } else {
      assert(otherConstants.direction === "buying");
      return new PairBounds(otherBounds, this);
    }
  };

  private otherAssetEquivalent = (
    otherConstants: AssetConstants,
  ): AssetBounds | undefined => {
    console.log("this:", this.toString());
    console.log("otherConstants:", otherConstants.toString());

    const otherLowerBound = this.lowerBound === "Δ = 0"
      ? "Δ = 0"
      : this.lowerBound.otherAssetEquivalent(otherConstants);

    console.log("otherLowerBound:", otherLowerBound?.toString());

    const otherUpperBound = this.upperBound === "Δ = oo"
      ? "Δ = oo"
      : this.upperBound.otherAssetEquivalent(otherConstants);

    console.log("otherUpperBound:", otherUpperBound?.toString());

    assert(otherLowerBound !== undefined);
    assert(otherLowerBound !== "Δ = oo");
    assert(otherUpperBound !== "Δ = 0");

    return new AssetBounds(otherLowerBound, otherUpperBound, otherConstants);
  };
}

export class AssetAssignment {
  public readonly spotValidity: "valid" | "too big" | "too small"; // size does matter, after all
  public readonly deltaValidity: "valid" | "too big" | "too small"; // er könnte etwas größer sein

  private constructor(
    public readonly boundary: "lower" | "upper",
    public readonly constants: AssetConstants,
    private readonly exp: bigint,
    private readonly spot: bigint,
    private readonly delta: bigint,
  ) {
    if (spot <= 0n) this.spotValidity = "too small";
    else if (spot > maxInteger) this.spotValidity = "too big";
    else this.spotValidity = "valid";

    if (delta < constants.minDelta) this.deltaValidity = "too small";
    else if (delta > constants.maxDelta) this.deltaValidity = "too big";
    else this.deltaValidity = "valid";
  }

  // public get valid(): boolean {
  //   return this.spotValidity === "valid" && this.deltaValidity === "valid";
  // }

  public toString = (): string => {
    return `AssetAssignment (
      boundary: ${this.boundary},
      constants: ${this.constants.toString()},
      exp: ${this.exp},
      spot: ${this.spot} (${this.spotValidity}),
      delta: ${this.delta} (${this.deltaValidity}),
    )`;
  };

  public equals = (other: AssetAssignment): boolean =>
    this.compare(other) === 0;

  // we order by deltas. -1 means this has the smaller delta
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
  private static fromExp(
    boundary: "lower" | "upper",
    constants: AssetConstants,
    exp: bigint,
  ): AssetAssignment {
    const spot = constants.calcSpotFromExp(exp);
    const delta = constants.calcDeltaFromSpot(spot);
    return new AssetAssignment(boundary, constants, exp, spot, delta);
  }

  // lower bound for both deltas. Some issues with this:
  // - actually a bound on spot
  // - subsumed by the post-swap-amm-bound
  static fromExpBound = (
    constants: AssetConstants,
  ): AssetAssignment => {
    const amm = constants.calcAmm();
    assert(amm > 0n, `amm should always be positive: ${amm}`);
    const exp_ = constants.calcExpFromSpot(amm);
    const exp = BigInt(
      constants.direction === "buying" ? Math.floor(exp_) : Math.ceil(exp_),
    );
    return AssetAssignment.fromExp("lower", constants, exp);
  };

  // lower bound for for buying-delta, upper bound for selling-delta
  static fromMaxSpot = (
    constants: AssetConstants,
  ): AssetAssignment => {
    const exp = BigInt(Math.ceil(constants.calcExpFromSpot(maxInteger)));
    return AssetAssignment.fromExp(
      constants.direction === "buying" ? "lower" : "upper",
      constants,
      exp,
    );
  };

  private static fromDelta = (
    boundary: "lower" | "upper",
    constants: AssetConstants,
    delta: bigint,
  ): AssetAssignment => {
    const spot = constants.calcSpotFromDelta(delta);
    // we round away from the amm-price, such that the delta will be included
    const exp = constants.direction === "buying"
      ? BigInt(Math.floor(constants.calcExpFromSpot(spot)))
      : BigInt(Math.ceil(constants.calcExpFromSpot(spot)));
    return AssetAssignment.fromExp(boundary, constants, exp);
  };

  // lower bound for both deltas
  static fromMinDelta = (
    constants: AssetConstants,
  ): AssetAssignment => {
    return AssetAssignment.fromDelta("lower", constants, constants.minDelta);
  };

  // upper bound for both deltas
  static fromMaxDelta = (
    constants: AssetConstants,
  ): AssetAssignment => {
    return AssetAssignment.fromDelta("upper", constants, constants.maxDelta);
  };

  private get boundedDelta(): bigint {
    if (this.deltaValidity === "valid") return this.delta;
    else if (this.deltaValidity === "too small") return this.constants.minDelta;
    else return this.constants.maxDelta;
  }

  public otherAssetEquivalent = (
    otherConstants: AssetConstants,
  ): AssetAssignment | "Δ = 0" | "Δ = oo" | undefined => {
    if (this.constants.direction === "buying") {
      assert(otherConstants.direction === "selling");
    } else {
      assert(otherConstants.direction === "buying");
    }
    const otherDelta = otherConstants.calcEquivalentDelta(
      this.boundedDelta,
      this.constants.liquidity,
      this.constants.weight,
    );
    console.log("otherDelta:", otherDelta);
    if (otherDelta === undefined) return undefined;

    const otherSpot = otherConstants.calcSpotFromDelta(otherDelta);
    console.log("otherSpot:", otherSpot);
    const otherExp_ = Math.ceil(otherConstants.calcExpFromSpot(otherSpot));
    console.log("otherExp_:", otherExp_);
    if (!isFinite(otherExp_)) return otherExp_ < 0 ? "Δ = 0" : "Δ = oo";
    const otherExp = BigInt(otherExp_);
    return AssetAssignment.fromExp(
      this.boundary,
      otherConstants,
      otherExp,
    );
  };
}

export class AssetConstants {
  public readonly liquidity: bigint;
  constructor(
    public readonly direction: "buying" | "selling",
    public readonly minDelta: bigint,
    public readonly maxDelta: bigint,
    public readonly virtual: bigint,
    public readonly balance: bigint,
    public readonly weight: bigint,
    private readonly jumpSize: bigint,
    private readonly anchor: bigint,
  ) {
    assert(minDelta > 0n);
    assert(maxDelta >= minDelta);
    assert(virtual > 0n);
    assert(balance >= 0n);
    assert(weight > 0n);
    assert(jumpSize > 0n);
    assert(anchor > 0n);
    this.liquidity = balance + virtual;
  }

  public toString = (): string => {
    return `AssetConstants (
      direction: ${this.direction},
      minDelta: ${this.minDelta},
      maxDelta: ${this.maxDelta},
      virtual: ${this.virtual},
      balance: ${this.balance},
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
    const maxDelta = direction === "buying" ? balance : genPositive();
    const minDelta = genPositive(maxDelta);
    const anchor = genPositive();
    return new AssetConstants(
      direction,
      minDelta,
      maxDelta,
      virtual,
      balance,
      weight,
      jumpSize,
      anchor,
    );
  };

  public equals = (other: AssetConstants): boolean =>
    this.direction === other.direction &&
    this.minDelta === other.minDelta &&
    this.maxDelta === other.maxDelta &&
    this.virtual === other.virtual &&
    this.balance === other.balance &&
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
  // public roundSpot = (spot: bigint): bigint =>
  //   this.direction === "buying"
  //     ? -(-spot / this.weight) * this.weight
  //     : (spot / this.weight) * this.weight;

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
  ): bigint | undefined => {
    const w_delta_1 = this.weight * otherDelta;
    const w_delta_2 = otherDelta * otherWeight;
    const w_l = otherWeight * otherLiquidity;
    const numerator = w_delta_1 * this.liquidity;
    if (this.direction === "buying") {
      const denominator = w_delta_1 + w_delta_2 + w_l;
      return numerator / denominator;
    } else {
      const denominator = -w_delta_1 - w_delta_2 + w_l;
      if (denominator <= 0n) return undefined;
      return ceilDiv(numerator, denominator);
    }
  };

  public calcAmm = (): bigint => this.liquidity * this.weight;
}
