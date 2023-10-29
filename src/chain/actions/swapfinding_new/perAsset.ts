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
// import { Delta, Spot } from "./values.ts";

const compareAssignments = (
  a: AssetAssignment | null,
  b: AssetAssignment | null,
  which: "smaller" | "larger",
): AssetAssignment | null => {
  if (!a) return b;
  if (!b) return a;
  return a.compare(b) < 0 && which === "smaller" ? a : b;
};

const compareBigInts = (a: bigint, b: bigint): -1 | 0 | 1 =>
  a === b ? 0 : a < b ? -1 : 1;

export class AssetBounds {
  public readonly constants: AssetConstants;

  private constructor(
    private readonly lowerBound: AssetAssignment,
    private readonly upperBound: AssetAssignment,
  ) {
    assert(lowerBound.constants.equals(upperBound.constants));
    assert(lowerBound.compare(upperBound) <= 0);
    this.constants = lowerBound.constants;
  }

  public show = (): string => {
    return `AssetBounds (
  lowerBound: ${this.lowerBound.show()},
  upperBound: ${this.upperBound.show()},
  constants: ${this.constants.show()}
    )`;
  };

  // we assume one is tighter than the other, hence the flipped comparisons
  // -1 means this is the tighter one
  // also we assume it's the same asset
  public compare = (other: AssetBounds): -1 | 0 | 1 => {
    assert(this.constants.equals(other.constants));
    const compareLowerBounds = other.lowerBound.compare(this.lowerBound);
    const compareUpperBounds = this.upperBound.compare(other.upperBound);
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

    let lowerBound: AssetAssignment | null = fromMinDelta;
    let upperBound: AssetAssignment | null = compareAssignments(
      fromMaxSpot,
      fromMaxDelta,
      "smaller",
    );
    if (fromExpBound) {
      if (constants.direction === "buying") {
        upperBound = compareAssignments(upperBound, fromExpBound, "smaller");
      } else {
        lowerBound = compareAssignments(upperBound, fromExpBound, "larger");
      }
    }

    if (lowerBound === null) return null;
    assert(upperBound, `no upper bound found for ${constants.show()}`);

    return new AssetBounds(lowerBound, upperBound);
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
    const otherLowerBound = this.upperBound.otherDirectionEquivalent(
      otherConstants,
    );
    const otherUpperBound = this.lowerBound.otherDirectionEquivalent(
      otherConstants,
    );

    assert(otherLowerBound, `no other lower bound found for ${this.show()}`);
    assert(otherUpperBound, `no other upper bound found for ${this.show()}`);

    return new AssetBounds(otherLowerBound, otherUpperBound);
  };
}

export class AssetAssignment {
  private constructor(
    public readonly constants: AssetConstants,
    private readonly exp: bigint,
    private readonly spot: bigint,
    private readonly delta: bigint,
    testEquivalence: boolean,
  ) {
    assert(
      delta >= constants.minDelta,
      `delta must be >= min: ${delta} > ${constants.minDelta}`,
    );
    assert(
      delta <= constants.maxDelta,
      `delta must be <= max: ${delta} < ${constants.maxDelta}`,
    );
    assert(spot > 0n, `spot must be positive: ${spot}`);
    assert(spot <= maxInteger, `spot > maxInteger: ${spot} > ${maxInteger}`);

    if (testEquivalence) {
      const fromExp = AssetAssignment.fromExp(constants, exp, false);
      assert(
        fromExp && fromExp.equals(this),
        `fromExp: ${fromExp?.show()} != ${this.show()}`,
      );

      const fromSpot = AssetAssignment.fromSpot(constants, spot, false);
      assert(
        fromSpot && fromSpot.equals(this),
        `fromSpot: ${fromSpot?.show()} != ${this.show()}`,
      );

      const fromDelta = AssetAssignment.fromDelta(constants, delta, false);
      assert(
        fromDelta && fromDelta.equals(this),
        `fromDelta: ${fromDelta?.show()} != ${this.show()}`,
      );
    }
  }

  public show = (): string => {
    return `AssetAssignment (
  exp: ${this.exp},
  spot: ${this.spot},
  delta: ${this.delta}
    )`;
  };

  public equals = (other: AssetAssignment): boolean =>
    this.compare(other) === 0;

  public compare = (other: AssetAssignment): -1 | 0 | 1 => {
    assert(this.constants.equals(other.constants));
    const compareExps = compareBigInts(this.exp, other.exp);
    const compareSpots = compareBigInts(this.spot, other.spot);
    const compareDeltas = compareBigInts(this.delta, other.delta);
    let result: -1 | 0 | 1 = 0;
    for (const comparison of [compareExps, compareSpots, compareDeltas]) {
      if (comparison === 0) continue;
      else if (result === 0) result = comparison;
      else {assert(
          result === comparison,
          `compare(): ${this.show()} vs. ${other.show()} of ${this.constants.show()}`,
        );}
    }
    return result;
  };

  private static fromExp = (
    constants: AssetConstants,
    exp: bigint,
    testEquivalence: boolean,
  ): AssetAssignment | null => {
    const spot = constants.calcSpotFromExp(exp);
    if (spot <= 0n || spot > maxInteger) return null;
    const delta = constants.calcDeltaFromSpot(spot);
    if (delta < constants.minDelta || delta > constants.maxDelta) return null;
    return new AssetAssignment(constants, exp, spot, delta, testEquivalence);
  };

  private static fromSpot = (
    constants: AssetConstants,
    spot: bigint,
    testEquivalence: boolean,
  ): AssetAssignment | null => {
    const exp = BigInt(Math.ceil(constants.calcExpFromSpot(spot)));
    return AssetAssignment.fromExp(constants, exp, testEquivalence);
  };

  private static fromDelta = (
    constants: AssetConstants,
    delta: bigint,
    testEquivalence: boolean,
  ): AssetAssignment | null => {
    const spot = constants.calcSpotFromDelta(delta);
    if (spot <= 0n || spot > maxInteger) return null;
    return AssetAssignment.fromSpot(constants, spot, testEquivalence);
  };

  static fromExpBound = (constants: AssetConstants): AssetAssignment | null => {
    const amm = constants.calcAmm();
    if (amm > maxInteger) return null; // already captured by fromMaxSpot in this case
    const exp_ = constants.calcExpFromSpot(BigInt(amm));
    const exp = BigInt(
      constants.direction === "buying" ? Math.floor(exp_) : Math.ceil(exp_),
    );
    return AssetAssignment.fromExp(constants, exp, true);
  };

  static fromMaxSpot = (constants: AssetConstants): AssetAssignment | null => {
    const spot = maxInteger;
    return AssetAssignment.fromSpot(constants, spot, true);
  };

  static fromMinDelta = (constants: AssetConstants): AssetAssignment | null => {
    const delta = constants.minDelta;
    return AssetAssignment.fromDelta(constants, delta, true);
  };

  static fromMaxDelta = (constants: AssetConstants): AssetAssignment | null => {
    const delta = constants.maxDelta;
    return AssetAssignment.fromDelta(constants, delta, true);
  };

  public otherDirectionEquivalent = (
    otherConstants: AssetConstants,
  ): AssetAssignment | null => {
    if (this.constants.direction === "buying") {
      assert(otherConstants.direction === "selling");
    } else {
      assert(otherConstants.direction === "buying");
    }
    const equivalentA0 = Number(this.delta) / Number(this.spot);
    const otherDelta = otherConstants.calcDeltaFromA0(equivalentA0);
    return AssetAssignment.fromDelta(
      otherConstants,
      otherDelta,
      true,
    );
  };
}

export class AssetConstants {
  constructor(
    public readonly direction: "buying" | "selling",
    public readonly minDelta: bigint,
    public readonly maxDelta: bigint,
    private readonly liquidity: bigint,
    private readonly weight: bigint,
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

  public show = (): string => {
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

  public calcDeltaFromSpot = (spot: bigint): bigint => {
    let numerator = spot - this.liquidity * this.weight;
    if (this.direction === "buying") numerator = -numerator;
    return numerator / this.weight;
  };

  public calcSpotFromDelta = (delta: bigint): bigint =>
    this.direction === "buying"
      ? this.weight * (this.liquidity - delta)
      : this.weight * (this.liquidity + delta);

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

  public calcDeltaFromA0 = (a0: number): bigint => {
    const a0w = a0 * Number(this.weight);
    const delta_ = (a0w * Number(this.liquidity)) / (1 - a0w);
    let delta = BigInt(Math.ceil(delta_));
    if (this.direction === "buying") {
      delta = -delta;
    }
    return delta;
  };

  public calcAmm = (): bigint => this.liquidity * this.weight;
}
