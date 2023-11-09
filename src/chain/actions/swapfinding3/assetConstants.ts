import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  ceilDiv,
  genNonNegative,
  genPositive,
  max,
  min,
} from "../../../utils/generators.ts";
import { maxSmallInteger } from "../../../types/euclid/smallValue.ts";
import { Param } from "../../../types/euclid/param.ts";
import { maxInteger } from "../../../utils/constants.ts";

export type OtherAssetType<AssetType extends "buying" | "selling"> =
  AssetType extends "buying" ? "selling"
    : "buying";

export class AssetConstants<AssetType extends "buying" | "selling"> {
  public readonly liquidity: bigint;
  public readonly amm: bigint;
  private constructor(
    public readonly assetType: AssetType,
    public readonly minDelta: bigint,
    public readonly maxDelta: bigint,
    public readonly virtual: bigint,
    public readonly balance: bigint,
    public readonly weight: bigint,
    public readonly jumpSize: bigint,
    public readonly anchor: bigint,
  ) {
    this.liquidity = balance + virtual;
    this.amm = this.liquidity * weight;

    assert(minDelta > 0n);
    assert(maxDelta >= minDelta, `${maxDelta} < ${minDelta}`);
    assert(virtual > 0n);
    assert(balance >= 0n);
    assert(jumpSize > 0n);
    assert(anchor > 0n);
    assert(weight > 0n);
  }

  static new = <AssetType extends "buying" | "selling">(
    assetType: AssetType,
    minDelta: bigint,
    maxDelta: bigint,
    virtual: bigint,
    balance: bigint,
    jumpSize: bigint,
    anchor: bigint,
    weight: bigint,
    sellingWeight?: bigint,
  ): AssetConstants<AssetType> => {
    if (assetType === "buying") {
      assert(maxDelta <= balance);
      assert(sellingWeight !== undefined);
    } else assert(sellingWeight === undefined);

    const amm = (balance + virtual) * weight;
    maxDelta = AssetConstants.fitMaxDelta(
      maxDelta,
      assetType,
      amm,
      weight,
      sellingWeight,
    );

    return new AssetConstants(
      assetType,
      minDelta,
      maxDelta,
      virtual,
      balance,
      weight,
      jumpSize,
      anchor,
    );
  };

  static generatePair = (): {
    buying: AssetConstants<"buying">;
    selling: AssetConstants<"selling">;
  } => {
    while (true) {
      const selling = AssetConstants.generateFor("selling");
      if (selling === null) continue;
      const buying = AssetConstants.generateFor("buying", selling.weight);
      if (buying !== null) return { buying, selling };
    }
  };

  // TODO synchronize this with Param
  private static generateFor = <AssetType extends "buying" | "selling">(
    assetType: AssetType,
    sellingWeight?: bigint,
  ): AssetConstants<AssetType> | null => {
    if (assetType === "buying") assert(sellingWeight !== undefined);
    else assert(sellingWeight === undefined);

    const jumpSize = genPositive(maxSmallInteger);
    const virtual = genPositive(ceilDiv(jumpSize + 1n, maxSmallInteger));
    const [minWeight, maxWeight] = Param.weightBounds(jumpSize, virtual);
    const weight = minWeight + genNonNegative(maxWeight - minWeight);

    const balance = assetType === "buying"
      ? genPositive(maxInteger - virtual)
      : genNonNegative(maxInteger - virtual);

    const amm = (balance + virtual) * weight;
    const maxDelta = AssetConstants.fitMaxDelta(
      assetType === "buying" ? balance : genPositive(),
      assetType,
      amm,
      weight,
      sellingWeight,
    );

    if (maxDelta < 1n) return null;
    const minDelta = genPositive(maxDelta);
    const anchor = genPositive(); // TODO minAnchorPrices?
    return AssetConstants.new(
      assetType,
      minDelta,
      maxDelta,
      virtual,
      balance,
      jumpSize,
      anchor,
      weight,
      sellingWeight,
    );
  };

  public toString = (): string => `
    AssetConstants (
      assetType: ${this.assetType},
      minDelta: ${this.minDelta},
      maxDelta: ${this.maxDelta},
      virtual: ${this.virtual},
      balance: ${this.balance},
      liquidity: ${this.liquidity},
      weight: ${this.weight},
      jumpSize: ${this.jumpSize},
      anchor: ${this.anchor}
    )`;

  public equals = (other: AssetConstants<AssetType>): boolean =>
    this.assetType === other.assetType &&
    this.minDelta === other.minDelta &&
    this.maxDelta === other.maxDelta &&
    this.virtual === other.virtual &&
    this.balance === other.balance &&
    this.weight === other.weight &&
    this.jumpSize === other.jumpSize &&
    this.anchor === other.anchor;

  private static fitMaxDelta = <AssetType extends "buying" | "selling">(
    maxDelta: bigint,
    assetType: AssetType,
    amm: bigint,
    weight: bigint,
    sellingWeight?: bigint,
  ): bigint => {
    if (assetType === "buying") assert(sellingWeight !== undefined);
    else assert(sellingWeight === undefined);

    maxDelta = assetType === "buying"
      ? min(
        maxDelta,
        AssetConstants.calcMaxDeltaBuying(amm, weight, sellingWeight!),
      )
      : maxDelta;

    const maxIntegerSpotDelta = AssetConstants.calcDeltaFromSpot_(
      assetType,
      amm,
      weight,
      maxInteger,
    );
    return min(maxDelta, maxIntegerSpotDelta);
  };

  private static calcDeltaFromSpot_ = <AssetType extends "buying" | "selling">(
    assetType: AssetType,
    amm: bigint,
    weight: bigint,
    spot: bigint,
  ): bigint => {
    let numerator = spot - amm;
    if (assetType === "buying") numerator = -numerator;

    // if the spot price is already on the wrong side of the amm,
    // we can do nothing. This can happen when i.e. amm > maxInteger
    numerator = max(numerator, 0n);

    // rounding towards zero in both cases, as we are interested
    // in the maximum delta-capacity of a given spot price
    return numerator / weight;
  };

  public calcDeltaFromSpot = (spot: bigint): bigint =>
    AssetConstants.calcDeltaFromSpot_(
      this.assetType,
      this.amm,
      this.weight,
      spot,
    );

  public calcSpotFromDelta = (delta: bigint): bigint =>
    this.assetType === "buying"
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
    otherWeight: bigint,
    otherLiquidity: bigint,
  ): bigint => {
    const w_delta_1 = this.weight * otherDelta;
    const w_delta_2 = otherDelta * otherWeight;
    const w_l = otherWeight * otherLiquidity;
    const numerator = w_delta_1 * this.liquidity;
    let delta: bigint;
    if (this.assetType === "buying") {
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

  private static calcMaxDeltaBuying = (
    buyingAmm: bigint,
    buyingWeight: bigint,
    sellingWeight: bigint,
  ): bigint => {
    const denominator = buyingWeight + sellingWeight;
    const fraction = buyingAmm / denominator;
    if (buyingAmm % denominator === 0n) return fraction - 1n;
    else return fraction;
  };
}
