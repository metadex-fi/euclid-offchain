import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { AssetConstants, OtherAssetType } from "./assetConstants.ts";
import { min } from "../../../utils/generators.ts";
import { maxInteger } from "../../../utils/constants.ts";

export class AssetBoundary<
  SpotExpType extends null | bigint,
  BoundType extends "lower" | "upper",
  AssetType extends "buying" | "selling",
> {
  private constructor(
    public readonly boundType: BoundType,
    public readonly constants: AssetConstants<AssetType>,
    public readonly delta: bigint,
    public readonly spot: SpotExpType,
    public readonly exp: SpotExpType,
  ) {
    assert(delta >= constants.minDelta);
    assert(delta <= constants.maxDelta);
    assert(typeof spot === typeof exp);
    if (spot !== null) {
      assert(spot > 0n);
      assert(spot <= maxInteger); // because we are updating the anchorprices
    }
  }

  static raw = <
    BoundType extends "lower" | "upper",
    AssetType extends "buying" | "selling",
  >(
    boundType: BoundType,
    delta: bigint,
    constants: AssetConstants<AssetType>,
  ): AssetBoundary<null, BoundType, AssetType> | bigint => {
    if (delta < constants.minDelta) {
      return delta - constants.minDelta;
    } else if (delta > constants.maxDelta) {
      return delta - constants.maxDelta;
    }
    return new AssetBoundary(boundType, constants, delta, null, null);
  };

  // public toString = (): string => `delta: ${this.delta}`;
  public toString = (): string => `
    RawAssetBoundary (
      boundType: ${this.boundType},
      constants: ${this.constants.toString()},
      delta: ${this.delta},
      spot: ${this.spot},
      exp: ${this.exp}
    )`;

  public otherRawEquivalent = (
    otherConstants: AssetConstants<OtherAssetType<AssetType>>,
  ):
    | AssetBoundary<null, BoundType, OtherAssetType<AssetType>>
    | bigint => {
    assert(this.constants.assetType !== otherConstants.assetType);
    const otherDelta = otherConstants.calcEquivalentDelta(
      this.delta,
      this.constants.weight,
      this.constants.liquidity,
    );
    return AssetBoundary.raw(
      this.boundType,
      otherDelta,
      otherConstants,
    );
  };

  // increasing delta to maximum capacity of the spot required to fit minimal delta
  public fitToExp = (): AssetBoundary<bigint, BoundType, AssetType> => {
    const spot = this.constants.calcSpotFromDelta(this.delta);
    const exp = this.constants.calcExpFromSpot(spot);
    let exp_ = this.constants.assetType === "buying"
      ? BigInt(Math.floor(exp))
      : BigInt(Math.ceil(exp));
    let spot_ = this.constants.calcSpotFromExp(exp_);
    if (this.constants.assetType === "buying") {
      if (spot_ > spot) {
        exp_--; // assuming rounding errors
        spot_ = this.constants.calcSpotFromExp(exp_);
        assert(spot_ <= spot);
      }
    } else if (spot_ < spot && spot_ < maxInteger) {
      exp_++; // assuming rounding errors
      spot_ = this.constants.calcSpotFromExp(exp_);
      assert(spot_ >= spot);
    }
    let maxIntegerCrossed = false;
    if (spot_ > maxInteger) { // <- NEXT UP: this should only be required once; 
      // we need it more often when we have a lower bound that's actually higher than the upper one.
      // so the question becomes in what order to smash the bounds against each other resp. fit them to exp
      maxIntegerCrossed = true;
      exp_--;
      spot_ = this.constants.calcSpotFromExp(exp_);
    }
    const delta = this.constants.calcDeltaFromSpot(spot_);
    if (!maxIntegerCrossed) assert(delta >= this.delta);
    const delta_ = min(delta, this.constants.maxDelta);
    return new AssetBoundary(
      this.boundType, // TODO this was upper before
      this.constants,
      delta_,
      spot_,
      exp_,
    );
  };

  public withFitFrom = (
    fitAssetBoundary: AssetBoundary<bigint, BoundType, AssetType>,
  ): AssetBoundary<bigint, BoundType, AssetType> => {
    assert(this.boundType === fitAssetBoundary.boundType);
    assert(this.constants.equals(fitAssetBoundary.constants));
    assert(this.spot === null);
    assert(this.exp === null);
    const withFit = new AssetBoundary(
      this.boundType,
      this.constants,
      this.delta,
      fitAssetBoundary.spot,
      fitAssetBoundary.exp,
    );
    return withFit;
  };
}

export class PairBounds<BoundType extends "lower" | "upper"> {
  public readonly boundType: BoundType;
  private constructor(
    public readonly buying: AssetBoundary<bigint, BoundType, "buying">,
    public readonly selling: AssetBoundary<bigint, BoundType, "selling">,
  ) {
    this.boundType = buying.boundType;
    assert(selling.boundType === buying.boundType);
    assert(typeof buying.spot === typeof selling.spot);
    assert(typeof buying.exp === typeof selling.exp);
  }

  static new = <
    BoundType extends "lower" | "upper",
    FromAssetType extends "buying" | "selling",
  >(
    rawAssetBoundary: AssetBoundary<null, BoundType, FromAssetType>,
    otherConstants: AssetConstants<OtherAssetType<FromAssetType>>,
  ): PairBounds<BoundType> | bigint => {
    /*
    given an unfitted boundary for a single asset, we
      - calculate the unfitted equivalent for the other asset
        - if this is not possible, we return the difference to the nearest delta
      - fit both to exp, which likely increases delta (except if we are hitting spot > maxInteger)
        - there are good reasons for postponing this until here
      - determine the smaller aka limiting one
      - calculate the equivalent delta for the other asset
      - assert this would still result in the same exps/spots for that other asset
      - create a new boundary for the other asset with the found delta, spot and exp
    */

    const rawOtherBoundary = rawAssetBoundary.otherRawEquivalent(
      otherConstants,
    );
    if (typeof rawOtherBoundary === "bigint") return rawOtherBoundary;

    let fitAssetBoundary = rawAssetBoundary.fitToExp();
    let fitOtherBoundary = rawOtherBoundary.fitToExp();
    if (fitAssetBoundary.delta < fitOtherBoundary.delta) {
      const rawOther = fitAssetBoundary.otherRawEquivalent(
        otherConstants,
      );
      assert(typeof rawOther !== "bigint");
      fitOtherBoundary = rawOther.withFitFrom(fitOtherBoundary);
    } else if (fitAssetBoundary.delta > fitOtherBoundary.delta) {
      const raw = fitOtherBoundary.otherRawEquivalent(
        //@ts-ignore typechecker can't into double AssetType flips
        rawAssetBoundary.constants,
      );
      assert(typeof raw !== "bigint");
      //@ts-ignore typechecker can't into double AssetType flips
      fitAssetBoundary = raw.withFitFrom(fitAssetBoundary);
    }

    if (rawAssetBoundary.constants.assetType === "buying") {
      assert(rawOtherBoundary.constants.assetType === "selling");
      // @ts-ignore we check this in the if above
      return new PairBounds(rawAssetBoundary, rawOtherBoundary);
    } else {
      assert(rawOtherBoundary.constants.assetType === "buying");
      // @ts-ignore we check this in the if above
      return new PairBounds(rawOtherBoundary, rawAssetBoundary);
    }
  };

  public toString = (): string => `
    PairBounds (
      boundType: ${this.boundType},
      buying: ${this.buying.toString()},
      selling: ${this.selling.toString()}
    )`;

  public leq = (other: PairBounds<"upper">): boolean => {
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
}

const betterBounds = <BoundType extends "lower" | "upper">(
  a: PairBounds<BoundType> | bigint,
  b: PairBounds<BoundType> | bigint,
  which: "smaller" | "larger",
): PairBounds<BoundType> | null => {
  if (typeof a === "bigint") {
    if (typeof b === "bigint") {
      assert((a < 0n && b > 0n) || (a > 0n && b < 0n), `${a}, ${b}`); // the delta-to-delta-lines should never cross
      return null; // this means no overlap
    }
    return b;
  }
  if (typeof b === "bigint") return a;
  return (which === "larger") === (a.buying.delta > b.buying.delta) ? a : b;
};

export class SwappingBounds {
  private constructor(
    public readonly lowerBounds: PairBounds<"lower">,
    public readonly upperBounds: PairBounds<"upper">,
  ) {
    assert(lowerBounds.boundType === "lower");
    assert(upperBounds.boundType === "upper");
    assert(lowerBounds.leq(upperBounds));
  }

  static new = (
    buyingConstants: AssetConstants<"buying">,
    sellingConstants: AssetConstants<"selling">,
  ): SwappingBounds | PairBounds<"upper" | "lower"> | null => {
    const minBuying = AssetBoundary.raw(
      "lower",
      buyingConstants.minDelta,
      buyingConstants,
    );
    assert(typeof minBuying !== "bigint");
    const lowerFromBuying = PairBounds.new(
      minBuying,
      sellingConstants,
    );

    const minSelling = AssetBoundary.raw(
      "lower",
      sellingConstants.minDelta,
      sellingConstants,
    );
    assert(typeof minSelling !== "bigint");
    const lowerFromSelling = PairBounds.new(
      minSelling,
      buyingConstants,
    );

    const lowerBounds = betterBounds(
      lowerFromBuying,
      lowerFromSelling,
      "larger",
    );
    if (lowerBounds === null) return null; // no overlap -> no valid swap

    const maxBuying = AssetBoundary.raw(
      "upper",
      buyingConstants.maxDelta,
      buyingConstants,
    );
    assert(typeof maxBuying !== "bigint");
    const upperFromBuying = PairBounds.new(
      maxBuying,
      sellingConstants,
    );

    const maxSelling = AssetBoundary.raw(
      "upper",
      sellingConstants.maxDelta,
      sellingConstants,
    );
    assert(typeof maxSelling !== "bigint");
    const upperFromSelling = PairBounds.new(
      maxSelling,
      buyingConstants,
    );

    const upperBounds = betterBounds(
      upperFromBuying,
      upperFromSelling,
      "smaller",
    );
    if (upperBounds === null) { // TODO consider fixing this
      // if we have lowerBounds, we should have upperBounds;
      // this here should only happen due to rounding issues:
      assert(upperFromSelling === 1n); // (the other side just didn't come up yet)
      return null;
    }

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
      upperBounds.selling.exp - lowerBounds.selling.exp,
    );
    console.log(
      "buying range:",
      upperBounds.buying.exp - lowerBounds.buying.exp,
    );

    return new SwappingBounds(
      lowerBounds,
      upperBounds,
    );
  };
}
