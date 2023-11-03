import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  ceilDiv,
  genNonNegative,
  genPositive,
  min,
} from "../../../utils/generators.ts";
import { maxSmallInteger } from "../../../types/euclid/smallValue.ts";
import { Param } from "../../../types/euclid/param.ts";
import { maxInteger } from "../../../utils/constants.ts";

export class AssetConstants {
  public readonly liquidity: bigint;
  private constructor(
    public readonly direction: "buying" | "selling",
    public readonly minDelta: bigint,
    public readonly maxDelta: bigint,
    public readonly virtual: bigint,
    public readonly balance: bigint,
    public readonly weight: bigint,
    public readonly jumpSize: bigint,
    public readonly anchor: bigint,
  ) {
    this.liquidity = balance + virtual;

    assert(minDelta > 0n);
    assert(maxDelta >= minDelta);
    assert(virtual > 0n);
    assert(balance >= 0n);
    assert(jumpSize > 0n);
    assert(anchor > 0n);
    assert(weight > 0n);
  }

  static new = (
    direction: "buying" | "selling",
    minDelta: bigint,
    maxDelta: bigint,
    virtual: bigint,
    balance: bigint,
    jumpSize: bigint,
    anchor: bigint,
    weight: bigint,
    sellingWeight?: bigint,
  ): AssetConstants => {
    if (direction === "buying") {
      assert(maxDelta <= balance);
      assert(sellingWeight !== undefined);
    } else assert(sellingWeight === undefined);

    maxDelta = AssetConstants.fitMaxDelta(
      maxDelta,
      direction,
      balance + virtual,
      weight,
      sellingWeight,
    );

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

  static generateBuying = (sellingWeight: bigint): AssetConstants =>
    AssetConstants.generateFor("buying", sellingWeight);

  static generateSelling = (): AssetConstants =>
    AssetConstants.generateFor("selling");

  // TODO synchronize this with Param
  private static generateFor = (
    direction: "buying" | "selling",
    sellingWeight?: bigint,
  ): AssetConstants => {
    if (direction === "buying") assert(sellingWeight !== undefined);
    else assert(sellingWeight === undefined);

    while (true) {
      const jumpSize = genPositive(maxSmallInteger);
      const virtual = genPositive(ceilDiv(jumpSize + 1n, maxSmallInteger));
      const [minWeight, maxWeight] = Param.weightBounds(jumpSize, virtual);
      const weight = minWeight + genNonNegative(maxWeight - minWeight);

      const balance = direction === "buying"
        ? genPositive(maxInteger - virtual)
        : genNonNegative(maxInteger - virtual);

      const liquidity = balance + virtual;
      const maxDelta = AssetConstants.fitMaxDelta(
        direction === "buying" ? balance : genPositive(),
        direction,
        liquidity,
        weight,
        sellingWeight,
      );

      if (maxDelta < 1n) continue;
      const minDelta = genPositive(maxDelta);
      const anchor = genPositive(); // TODO minAnchorPrices?
      return AssetConstants.new(
        direction,
        minDelta,
        maxDelta,
        virtual,
        balance,
        jumpSize,
        anchor,
        weight,
        sellingWeight,
      );
    }
  };

  public toString = (): string => `
    AssetConstants (
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

  public equals = (other: AssetConstants): boolean =>
    this.direction === other.direction &&
    this.minDelta === other.minDelta &&
    this.maxDelta === other.maxDelta &&
    this.virtual === other.virtual &&
    this.balance === other.balance &&
    this.weight === other.weight &&
    this.jumpSize === other.jumpSize &&
    this.anchor === other.anchor;

  private static fitMaxDelta = (
    maxDelta: bigint,
    direction: "buying" | "selling",
    liquidity: bigint,
    weight: bigint,
    sellingWeight?: bigint,
  ): bigint => {
    if (direction === "buying") assert(sellingWeight !== undefined);
    else assert(sellingWeight === undefined);

    maxDelta = direction === "buying"
      ? min(
        maxDelta,
        AssetConstants.calcMaxDeltaBuying(liquidity, weight, sellingWeight!),
      )
      : maxDelta;

    const maxIntegerSpotDelta = AssetConstants.calcMaxIntegerSpotDelta(
      direction,
      liquidity,
      weight,
    );
    maxDelta = maxIntegerSpotDelta
      ? min(maxDelta, maxIntegerSpotDelta)
      : maxDelta;

    return maxDelta;
  };

  private static calcMaxIntegerSpotDelta = (
    direction: "buying" | "selling",
    liquidity: bigint,
    weight: bigint,
  ): bigint | null => {
    const delta = AssetConstants.calcDeltaFromSpot_(
      direction,
      liquidity,
      weight,
      maxInteger,
    );
    if (delta < 0n) return null; // when amm > maxInteger
    else return delta;
  };

  private static calcDeltaFromSpot_ = (
    direction: "buying" | "selling",
    liquidity: bigint,
    weight: bigint,
    spot: bigint,
  ): bigint => {
    let numerator = spot - liquidity * weight;
    if (direction === "buying") numerator = -numerator;
    // rounding towards zero in both cases, as we are interested
    // in the maximum delta-capacity of a given spot price
    return numerator / weight;
  };

  public calcDeltaFromSpot = (spot: bigint): bigint =>
    AssetConstants.calcDeltaFromSpot_(
      this.direction,
      this.liquidity,
      this.weight,
      spot,
    );

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

  public calcEquivalentDelta = (
    otherDelta: bigint,
    otherConstants: AssetConstants,
  ): bigint => {
    const w_delta_1 = this.weight * otherDelta;
    const w_delta_2 = otherDelta * otherConstants.weight;
    const w_l = otherConstants.weight * otherConstants.liquidity;
    const numerator = w_delta_1 * this.liquidity;
    let delta: bigint;
    if (this.direction === "buying") {
      const denominator = w_delta_1 + w_delta_2 + w_l;
      delta = numerator / denominator;
    } else {
      const denominator = -w_delta_1 - w_delta_2 + w_l;
      assert(denominator > 0n, denominator.toString());
      delta = ceilDiv(numerator, denominator);
    }
    // console.log(`${otherDelta} -> ${delta}`);
    return delta;
  };

  public calcAmm = (): bigint => this.liquidity * this.weight;

  private static calcMaxDeltaBuying = (
    buyingLiquidity: bigint,
    buyingWeight: bigint,
    sellingWeight: bigint,
  ): bigint => {
    const numerator = buyingLiquidity * buyingWeight;
    const denominator = buyingWeight + sellingWeight;
    const fraction = numerator / denominator;
    if (numerator % denominator === 0n) return fraction - 1n;
    else return fraction;
  };
}
