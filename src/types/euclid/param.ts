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
import { maxInteger, min } from "../../utils/generators.ts";
import { Value } from "../general/derived/value/value.ts";
import { maxSmallInteger, PSmallValue, SmallValue } from "./smallValue.ts";

// TODO somewhere, take care of sortedness where it applies (not only for PParam)

// export const minLiquidityJumpSize = 1n;//100n; // TODO/NOTE should never be less than 1n
// export const gMaxJumpSize = 100n;

export class Param {
  constructor(
    public readonly owner: KeyHash,
    public readonly virtual: EuclidValue, // NOTE need those to be nonzero for multiplicative ticks
    public readonly weights: SmallValue, // NOTE those are actually inverted
    public readonly jumpSizes: SmallValue,
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

    minAnchorPrice >= 1n

    => (virtual * weight * jumpSize) / (jumpSize + 1n)) >= 1n
    => virtual * weight * jumpSize >= jumpSize + 1n

    => weight >= (jumpSize + 1n) / (virtual * jumpSize)
    => virtual >= (jumpSize + 1n) / (weight * jumpSize)

    => 1 + (1 / jumpSize) <= (virtual * weight)
    => 1 / jumpSize <= (virtual * weight) - 1n
    => jumpSize >= 1n / ((virtual * weight) - 1n) ~~ >= 1n

    and:

    minAnchorPrice <= maxInteger

    => (virtual * weight * jumpSize) / (jumpSize + 1n)) <= maxInteger
    => virtual * weight * jumpSize <= maxInteger * (jumpSize + 1n)

    => weight <= (maxInteger * (jumpSize + 1n)) / (virtual * jumpSize)
    => virtual <= (maxInteger * (jumpSize + 1n)) / (weight * jumpSize)

    => 1 + (1 / jumpSize) >= (virtual * weight) / maxInteger
    => 1 / jumpSize >= ((virtual * weight) - maxInteger) / maxInteger  !!! rhs can be <= 0
    => if virtual * weight > maxInteger:
      jumpSize <= maxInteger / ((virtual * weight) - maxInteger)

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

    allAssets.forEach((asset) => {
      // const jumpSize = new PPositive(1n, gMaxJumpSize).genData();
      const jumpSize = new PPositive(1n, maxSmallInteger).genData();
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
      new SmallValue(new EuclidValue(weights)),
      new SmallValue(new EuclidValue(jumpSizes)),
      1n, // TODO include active-status in testing
    );
  }

  // => weight >= (jumpSize + 1n) / (virtual * jumpSize)
  // => weight <= (maxInteger * (jumpSize + 1n)) / (virtual * jumpSize)
  // weight >= (jumpSize + 1n) / virtual (NOTE: this comes from tickSize >= 1n)
  static weightBounds(jumpSize: bigint, virtual: bigint): [bigint, bigint] {
    // const vjs = virtual * jumpSize;
    const js1 = jumpSize + 1n;
    const jsv = jumpSize * virtual;
    const ceil = js1 % jsv ? 1n : 0n;
    const minWeight = (js1 / jsv) + ceil;
    let maxWeight = (maxInteger * js1) / (jsv + 1n); // TODO +1n is a hack to keep minAnchorPrices <= maxInteger
    maxWeight = min(maxWeight, maxSmallInteger); //gMaxJumpSize);

    assert(
      minWeight <= maxWeight,
      `minWeight (${minWeight}) must be <= maxWeight (${maxWeight}); jumpSize: ${jumpSize}; virtual: ${virtual}`,
    );
    assert(
      maxWeight <= maxSmallInteger,
      `maxWeight (${maxWeight}) must be <= maxSmallInteger (${maxSmallInteger}); jumpSize: ${jumpSize}; virtual: ${virtual}`,
    )
    return [minWeight, maxWeight]; // TODO check that maxWeight >= minWeight (after adding maxSmallInteger)
  }

  // => virtual >= (jumpSize + 1n) / (weight * jumpSize)
  // => virtual <= (maxInteger * (jumpSize + 1n)) / (weight * jumpSize)
  // virtual >= (jumpSize + 1n) / weight (NOTE: this comes from tickSize >= 1n)
  static virtualBounds(jumpSize: bigint, weight: bigint): [bigint, bigint] {
    // const wjs = weight * jumpSize;
    const js1 = jumpSize + 1n;
    const ceil = js1 % weight ? 1n : 0n;
    const minVirtual = (js1 / weight) + ceil;
    const maxVirtual = (maxInteger * js1) / (weight * jumpSize); // + 1n); // TODO +1n is a hack to keep minAnchorPrices <= maxInteger

    return [minVirtual, maxVirtual];
  }

  // => jumpSize >= 1n / (virtual * weight - 1n) ~~> 1n
  // => if virtual * weight > maxInteger:
  // jumpSize <= maxInteger / ((virtual * weight) - maxInteger)
  // jumpSize <= virtual * weight - 1n (NOTE: this comes from tickSize >= 1n)
  static jumpSizeBounds(virtual: bigint, weight: bigint): [bigint, bigint] {
    const minJumpSize = 1n;
    const vw = virtual * weight;
    let maxJumpSize = vw > maxInteger
      ? min(
        maxInteger / (vw - maxInteger),
        maxSmallInteger, //gMaxJumpSize,
      )
      : maxSmallInteger; //gMaxJumpSize;
    maxJumpSize = min(maxJumpSize, vw - 1n);
    // console.log("maxJumpSize", maxJumpSize.toString());
    return [minJumpSize, maxJumpSize];
  }
}

export class PParam extends PObject<Param> {
  private constructor() {
    super(
      new PRecord({
        owner: PKeyHash.ptype,
        virtual: PEuclidValue.ptype,
        weights: PSmallValue.ptype,
        jumpSizes: PSmallValue.ptype,
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
