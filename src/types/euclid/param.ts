import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Assets } from "../general/derived/asset/assets.ts";
import { PPositive } from "../general/derived/bounded/positive.ts";
import { KeyHash, PKeyHash } from "../general/derived/hash/keyHash.ts";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.ts";
import { Value } from "../general/derived/value/value.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";
import { f, t } from "../general/fundamental/type.ts";
import { EuclidValue, PEuclidValue } from "./euclidValue.ts";
import { PInteger } from "../general/fundamental/primitive/integer.ts";
import { min } from "../../utils/generators.ts";

// TODO somewhere, take care of sortedness where it applies (not only for PParam)

export const minLiquidityJumpSize = 100n; // TODO/NOTE should never be less than 1n

export class Param {
  constructor(
    public readonly owner: KeyHash,
    public readonly virtual: PositiveValue,
    public readonly weights: EuclidValue, // NOTE those are actually inverted
    public readonly jumpSizes: EuclidValue,
    public readonly active: bigint,
  ) {
    Param.asserts(this);
  }

  // filled with zeroes for assets without virtual liquidity
  public get minAnchorPrices(): Value {
    return Value.hadamard_(this.virtual.unsigned, this.weights.unsigned);
  }

  public get assets(): Assets {
    return this.weights.assets;
  }

  public get switched(): Param {
    return new Param(
      this.owner,
      this.virtual,
      this.weights,
      this.jumpSizes,
      this.active ? 0n : 1n,
    );
  }

  public sharedAssets = (assets: Assets): Assets =>
    this.assets.intersect(assets);

  public concise = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Param (
${ttf}owner: ${this.owner.toString()}, 
${ttf}virtual: ${this.virtual.concise(ttf)}, 
${ttf}weights: ${this.weights.concise(ttf)}
${ttf}jumpSizes: ${this.jumpSizes.concise(ttf)}, 
${ttf}active: ${this.active.toString()}
${tt})`;
  };

  static asserts(param: Param): void {
    const assets = param.jumpSizes.assets;
    assert(
      assets.equals(param.weights.assets),
      "assets of jumpSizes and weights must match",
    );
    assert(
      param.virtual.assets.subsetOf(assets),
      `assets of virtual must be a subset of assets of jumpSizes and weights, but ${param.virtual.assets.show()}\nis not a subset of ${assets.show()}`,
    );
    const minAnchorPrices = param.minAnchorPrices;
    const maxAnchorPrices = Value.add(
      minAnchorPrices,
      param.jumpSizes.unsigned,
    );
    assert(
      maxAnchorPrices.leqMaxInteger,
      `max anchor price must be leq max integer, but is ${maxAnchorPrices.concise()}`,
    );
    assert(
      param.weights.leq(param.jumpSizes.divideByScalar(minLiquidityJumpSize)),
      `weights must be leq jumpSizes / ${minLiquidityJumpSize.toString()}, but are ${param.weights.concise()} and ${param.jumpSizes.concise()}`,
    )
  }

  static generate(): Param {
    const owner = PKeyHash.ptype.genData();
    const allAssets = Assets.generate(2n);
    const virtualAssets = allAssets.randomSubset();
    return Param.genOf(owner, allAssets, virtualAssets);
  }

  static genOf(
    owner: KeyHash,
    allAssets: Assets,
    virtualAssets: Assets,
  ): Param {
    assert(
      virtualAssets.subsetOf(allAssets),
      `Param.genOf: virtual assets must be a subset of all assets, but ${virtualAssets.show()} is not a subset of ${allAssets.show()}`,
    );
    const jumpSizes = new PositiveValue();
    const weights = new PositiveValue();
    const virtual = new PositiveValue();

    allAssets.forEach((asset) => {
      if (virtualAssets.has(asset)) {
        const maxLowestPrice = new PPositive(minLiquidityJumpSize + 1n).genData();
        const jumpSize = new PPositive(minLiquidityJumpSize, maxLowestPrice - 1n).genData();
        const minLowestPrice = maxLowestPrice - jumpSize;
        const weight = new PPositive(1n, min(minLowestPrice, jumpSize / minLiquidityJumpSize)).genData();
        
        virtual.initAmountOf(asset, minLowestPrice / weight);
        jumpSizes.initAmountOf(asset, jumpSize);
        weights.initAmountOf(asset, weight);
      } else {
        const maxLowestPrice = new PPositive(minLiquidityJumpSize).genData();
        const jumpSize = new PPositive(minLiquidityJumpSize, maxLowestPrice).genData();
        const minLowestPrice = maxLowestPrice - jumpSize;
        const weight = new PPositive(1n, jumpSize / minLiquidityJumpSize).genData();

        if (weight <= minLowestPrice) {
          virtual.initAmountOf(asset, minLowestPrice / weight);
        }
        jumpSizes.initAmountOf(asset, jumpSize);
        weights.initAmountOf(asset, weight);
      }
    });

    return new Param(
      owner,
      virtual,
      new EuclidValue(weights),
      new EuclidValue(jumpSizes),
      1n, // TODO include active-status in testing
    );
  }

  // static genOf(owner: KeyHash, assets: Assets): Param {
  //   const weights = EuclidValue.genOfAssets(assets);
  //   const maxAnchorPrices = EuclidValue.genOfAssets(assets);
  //   const jumpSizes = EuclidValue.genBelow(maxAnchorPrices.bounded(2n));
  //   const minAnchorPrices = maxAnchorPrices.normedMinus(jumpSizes);
  //   const virtual = minAnchorPrices.normedDivideBy(weights.unsized);

  //   return new Param(
  //     owner,
  //     virtual,
  //     weights,
  //     jumpSizes,
  //   );
  // }
}

export class PParam extends PObject<Param> {
  private constructor() {
    super(
      new PRecord({
        owner: PKeyHash.ptype,
        virtual: PPositiveValue.ptype,
        weights: PEuclidValue.ptype,
        jumpSizes: PEuclidValue.ptype,
        active: PInteger.ptype,
      }),
      Param,
    );
  }

  public genData = Param.generate;

  static ptype = new PParam();
  static genPType(): PParam {
    return PParam.ptype;
  }
}
