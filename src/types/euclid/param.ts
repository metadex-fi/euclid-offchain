import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Assets } from "../general/derived/asset/assets.ts";
import { PPositive } from "../general/derived/bounded/positive.ts";
import { KeyHash, PKeyHash } from "../general/derived/hash/keyHash.ts";
import { PositiveValue } from "../general/derived/value/positiveValue.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";
import { f, t } from "../general/fundamental/type.ts";
import { EuclidValue, PEuclidValue } from "./euclidValue.ts";
import { PInteger } from "../general/fundamental/primitive/integer.ts";
import { maxInteger } from "../../utils/generators.ts";
import { Value } from "../general/derived/value/value.ts";

// TODO somewhere, take care of sortedness where it applies (not only for PParam)

// export const minLiquidityJumpSize = 1n;//100n; // TODO/NOTE should never be less than 1n
export const maxJumpSize = 100n;

export class Param {
  constructor(
    public readonly owner: KeyHash,
    public readonly virtual: EuclidValue, // NOTE need those to be nonzero for multiplicative ticks
    public readonly weights: EuclidValue, // NOTE those are actually inverted
    public readonly jumpSizes: EuclidValue,
    public readonly active: bigint,
  ) {
    Param.asserts(this);
  }

  static minAnchorPrice = (
    virtual: bigint,
    weight: bigint,
    jumpSize: bigint,
  ) => (virtual * weight * jumpSize) / (jumpSize + 1n);

  public get minAnchorPrices(): EuclidValue {
    const f = Value.newUnionWith(Param.minAnchorPrice);

    return EuclidValue.fromValue(
      f(this.virtual.unsigned, this.weights.unsigned, this.jumpSizes.unsigned),
    );
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
    // const minAnchorPrices = param.maxAnchorPrices;
    // const maxAnchorPrices = minAnchorPrices.plus(param.jumpSizes);

    /* TODO update to multiplicative ticks - for example this:

    (virtual * weight * jumpSize) / (jumpSize + 1n)) >= 1n
    => virtual * weight * jumpSize >= jumpSize + 1n
    => weight >= (jumpSize + 1n) / (virtual * jumpSize)
    => jumpSize >= 1n / (virtual * weight - 1n)

    and:

    (virtual * weight * jumpSize) / (jumpSize + 1n)) <= maxInteger
    => virtual * weight * jumpSize <= maxInteger * (jumpSize + 1n)
    => weight <= (maxInteger * (jumpSize + 1n)) / (virtual * jumpSize)
    */

    // assert(
    //   maxAnchorPrices.leqMaxInteger,
    //   `max anchor price must be leq max integer, but is ${maxAnchorPrices.concise()}`,
    // );
  }

  static generate(): Param {
    const owner = PKeyHash.ptype.genData();
    const allAssets = Assets.generate(2n);
    return Param.genOf(owner, allAssets);
  }

  static genOf(
    owner: KeyHash,
    allAssets: Assets,
  ): Param {
    const jumpSizes = new PositiveValue();
    const weights = new PositiveValue();
    const virtuals = new PositiveValue();

    allAssets.forEach((asset) => { // TODO update to multiplicative ticks
      // const maxLowestPrice = new PPositive(2n).genData();
      // const maxJumpSize_ = min(maxLowestPrice - 1n, maxJumpSize);
      // const jumpSize = new PPositive(1n, maxJumpSize_).genData();
      // // const jumpSize = new PPositive(1n, maxLowestPrice - 1n).genData();
      // const minLowestPrice = maxLowestPrice - jumpSize;
      // const weight = new PPositive(1n, minLowestPrice).genData();

      // virtual.initAmountOf(asset, minLowestPrice / weight);
      // jumpSizes.initAmountOf(asset, jumpSize);
      // weights.initAmountOf(asset, weight);

      const jumpSize = new PPositive(1n, maxJumpSize).genData();
      const virtual = new PPositive().genData();

      const [minWeight, maxWeight] = Param.weightBounds(jumpSize, virtual);
      const weight = new PPositive(minWeight, maxWeight).genData();

      jumpSizes.initAmountOf(asset, jumpSize);
      virtuals.initAmountOf(asset, virtual);
      weights.initAmountOf(asset, weight);
    });

    return new Param(
      owner,
      new EuclidValue(virtuals),
      new EuclidValue(weights),
      new EuclidValue(jumpSizes),
      1n, // TODO include active-status in testing
    );
  }

  static weightBounds(jumpSize: bigint, virtual: bigint): [bigint, bigint] {
    const tmp0 = virtual * jumpSize;
    const tmp1 = jumpSize + 1n;
    const ceil = tmp1 % tmp0 ? 1n : 0n;
    const minWeight = (tmp1 / tmp0) + ceil;
    const maxWeight = (maxInteger * tmp1) / (tmp0 + 1n); // TODO +1n is a hack to keep minAnchorPrices <= maxInteger

    return [minWeight, maxWeight];
  }
}

export class PParam extends PObject<Param> {
  private constructor() {
    super(
      new PRecord({
        owner: PKeyHash.ptype,
        virtual: PEuclidValue.ptype,
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
