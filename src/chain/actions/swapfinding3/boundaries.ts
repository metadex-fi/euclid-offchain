import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { AssetConstants } from "./assetConstants.ts";
import { max, min } from "../../../utils/generators.ts";

export class AssetBoundary {
  private constructor(
    public readonly boundary: "minimized" | "maximized",
    public readonly delta: bigint,
    public readonly spot: bigint | null,
    public readonly exp: bigint | null,
    public readonly constants: AssetConstants,
  ) {
    assert(delta >= constants.minDelta);
    assert(delta <= constants.maxDelta);
  }

  static new = (
    boundary: "minimized" | "maximized",
    delta: bigint,
    constants: AssetConstants,
  ): AssetBoundary | bigint => {
    if (delta < constants.minDelta) {
      return delta - constants.minDelta;
    } else if (delta > constants.maxDelta) {
      return delta - constants.maxDelta;
    }
    return new AssetBoundary(boundary, delta, null, null, constants);
  };

  public toString = (): string => `delta: ${this.delta}`;
  // public toString = (): string => `
  //   AssetBoundary (
  //     delta: ${this.delta},
  //     constants: ${this.constants.toString()}
  //   )`;

  public otherDirectionEquivalent = (
    otherConstants: AssetConstants,
  ): AssetBoundary | bigint => {
    assert(this.constants.direction !== otherConstants.direction);

    const otherDelta = otherConstants.calcEquivalentDelta(
      this.delta,
      this.constants,
    );
    return AssetBoundary.new(this.boundary, otherDelta, otherConstants);
  };

  // increasing delta to maximum capacity of the spot required to fit minimal delta
  public maximize = (): AssetBoundary => {
    const spot = this.constants.calcSpotFromDelta(this.delta);
    const exp = this.constants.calcExpFromSpot(spot);
    let exp_ = this.constants.direction === "buying"
      ? BigInt(Math.floor(exp))
      : BigInt(Math.ceil(exp));
    let spot_ = this.constants.calcSpotFromExp(exp_);
    if (this.constants.direction === "buying") {
      if (spot_ > spot) { // assuming rounding errors
        exp_--;
        spot_ = this.constants.calcSpotFromExp(exp_);
        assert(spot_ <= spot);
      }
    } else if (spot_ < spot) { // assuming rounding errors
      exp_++;
      spot_ = this.constants.calcSpotFromExp(exp_);
      assert(spot_ >= spot);
    }
    const delta = this.constants.calcDeltaFromSpot(spot_);
    assert(delta >= this.delta);
    const delta_ = min(delta, this.constants.maxDelta);
    const maxxed = new AssetBoundary(
      "maximized",
      delta_,
      spot_,
      exp_,
      this.constants,
    );
    return maxxed;
  };
}

export class PairBounds {
  private constructor(
    public readonly boundary: "minimized" | "maximized",
    public readonly buying: AssetBoundary,
    public readonly selling: AssetBoundary,
  ) {
    assert(buying.constants.direction === "buying");
    assert(selling.constants.direction === "selling");
    assert(buying.boundary === boundary);
    assert(selling.boundary === boundary);
  }

  static new = (
    boundary: "minimized" | "maximized",
    assetBoundary: AssetBoundary,
    otherConstants: AssetConstants,
  ): PairBounds | bigint => {
    const otherBoundary = assetBoundary.otherDirectionEquivalent(
      otherConstants,
    );
    if (typeof otherBoundary === "bigint") return otherBoundary;
    if (assetBoundary.constants.direction === "buying") {
      return new PairBounds(boundary, assetBoundary, otherBoundary);
    } else {
      return new PairBounds(boundary, otherBoundary, assetBoundary);
    }
  };

  public toString = (): string => `
    PairBounds (
      boundary: ${this.boundary},
      buying: ${this.buying.toString()},
      selling: ${this.selling.toString()}
    )`;

  public leq = (other: PairBounds): boolean => {
    assert(other.boundary === "maximized");
    if (this.buying.delta == other.buying.delta) {
      return this.selling.delta <= other.selling.delta;
    } else if (this.buying.delta < other.buying.delta) {
      assert(this.selling.delta <= other.selling.delta);
      return true;
    } else {
      assert(this.selling.delta >= other.selling.delta);
      return false;
    }
  };

  public maximize = (): PairBounds => {
    const maxxedBuying = this.buying.maximize();
    const maxxedSelling = this.selling.maximize();

    const fromMaxxedBuying = PairBounds.new(
      "maximized",
      maxxedBuying,
      maxxedSelling.constants,
    );
    const fromMaxxedSelling = PairBounds.new(
      "maximized",
      maxxedSelling,
      maxxedBuying.constants,
    );
    // we need them to be boundary: "maximized" such that stricterBounds picks the lower one
    const maxxed = stricterBounds(fromMaxxedBuying, fromMaxxedSelling);
    assert(maxxed !== null);
    if (this.boundary === "maximized") {
      assert(this.buying.delta === maxxed.buying.delta);
      assert(this.selling.delta === maxxed.selling.delta);
    }
    return maxxed;
  };
}

const stricterBounds = (
  a: PairBounds | bigint,
  b: PairBounds | bigint,
): PairBounds | null => {
  if (typeof a === "bigint" && typeof b === "bigint") {
    assert((a < 0n && b > 0n) || (a > 0n && b < 0n), `${a}, ${b}`); // the delta-to-delta-lines should never cross
    return null;
  }
  if (!(a instanceof PairBounds)) return b as PairBounds;
  if (!(b instanceof PairBounds)) return a;
  assert(a.boundary === b.boundary);
  return (a.boundary === "minimized") === (a.buying.delta > b.buying.delta)
    ? a
    : b;
};

export class SwappingBounds {
  private constructor(
    public readonly lowerBounds: PairBounds,
    public readonly upperBounds: PairBounds,
  ) {
    assert(lowerBounds.boundary === "maximized"); // because they are maxxed
    assert(upperBounds.boundary === "maximized");
    assert(lowerBounds.leq(upperBounds));
  }

  static new = (
    buyingConstants: AssetConstants,
    sellingConstants: AssetConstants,
  ): SwappingBounds | PairBounds | null => {
    const minBuying = AssetBoundary.new(
      "minimized",
      buyingConstants.minDelta,
      buyingConstants,
    );
    assert(typeof minBuying !== "bigint");
    const lowerFromBuying = PairBounds.new(
      "minimized",
      minBuying,
      sellingConstants,
    );

    const minSelling = AssetBoundary.new(
      "minimized",
      sellingConstants.minDelta,
      sellingConstants,
    );
    assert(typeof minSelling !== "bigint");
    const lowerFromSelling = PairBounds.new(
      "minimized",
      minSelling,
      buyingConstants,
    );

    let lowerBounds = stricterBounds(lowerFromBuying, lowerFromSelling);
    if (lowerBounds === null) return null; // no overlap -> no valid swap

    const maxBuying = AssetBoundary.new(
      "maximized",
      buyingConstants.maxDelta,
      buyingConstants,
    );
    assert(typeof maxBuying !== "bigint");
    const upperFromBuying = PairBounds.new(
      "maximized",
      maxBuying,
      sellingConstants,
    );

    const maxSelling = AssetBoundary.new(
      "maximized",
      sellingConstants.maxDelta,
      sellingConstants,
    );
    assert(typeof maxSelling !== "bigint");
    const upperFromSelling = PairBounds.new(
      "maximized",
      maxSelling,
      buyingConstants,
    );

    let upperBounds = stricterBounds(upperFromBuying, upperFromSelling);
    if (upperBounds === null) { // TODO consider fixing this
      // if we have lowerBounds, we should have upperBounds;
      // this here should only happen due to rounding issues:
      assert(upperFromSelling === 1n); // (the other side just didn't come up yet)
      return null;
    }

    lowerBounds = lowerBounds.maximize();
    upperBounds = upperBounds.maximize();

    // console.log("lowerBounds", lowerBounds?.toString());
    // console.log("upperBounds", upperBounds?.toString());

    assert(lowerBounds.leq(upperBounds)); // this should be below, but trying it out here
    // assert(!upperBounds.leq(lowerBounds)); // this happens sometimes
    // if (upperBounds.leq(lowerBounds)) return upperBounds; // uncomment if moving this assert below

    // if both require the same deposit, we pick the one with the larger return
    if (upperBounds.selling.delta === lowerBounds.selling.delta) {
      console.log("same deposit, picking larger return");
      return upperBounds;
    }
    // if both give the same return, we pick the one with the smaller deposit
    if (upperBounds.buying.delta === lowerBounds.buying.delta) {
      console.log("same return, picking smaller deposit");
      return lowerBounds;
    }

    console.log(
      "selling range:",
      upperBounds.selling.delta - lowerBounds.selling.delta,
    );
    console.log(
      "buying range:",
      upperBounds.buying.delta - lowerBounds.buying.delta,
    );

    return new SwappingBounds(
      lowerBounds,
      upperBounds,
    );
  };
}
