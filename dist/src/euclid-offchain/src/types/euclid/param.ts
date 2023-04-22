import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Assets } from "../general/derived/asset/assets.js";
import { PPositive } from "../general/derived/bounded/positive.js";
import { KeyHash, PKeyHash } from "../general/derived/hash/keyHash.js";
import { PositiveValue } from "../general/derived/value/positiveValue.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { f, t } from "../general/fundamental/type.js";
import { EuclidValue, PEuclidValue } from "./euclidValue.js";
import { PInteger } from "../general/fundamental/primitive/integer.js";
import { min } from "../../utils/generators.js";

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

  public get minAnchorPrices(): EuclidValue {
    return this.virtual.hadamard(this.weights);
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
    const maxAnchorPrices = minAnchorPrices.plus(param.jumpSizes);

    assert(
      maxAnchorPrices.leqMaxInteger,
      `max anchor price must be leq max integer, but is ${maxAnchorPrices.concise()}`,
    );
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
    const virtual = new PositiveValue();

    allAssets.forEach((asset) => {
      const maxLowestPrice = new PPositive(2n).genData();
      const maxJumpSize_ = min(maxLowestPrice - 1n, maxJumpSize);
      const jumpSize = new PPositive(1n, maxJumpSize_).genData();
      // const jumpSize = new PPositive(1n, maxLowestPrice - 1n).genData();
      const minLowestPrice = maxLowestPrice - jumpSize;
      const weight = new PPositive(1n, minLowestPrice).genData();

      virtual.initAmountOf(asset, minLowestPrice / weight);
      jumpSizes.initAmountOf(asset, jumpSize);
      weights.initAmountOf(asset, weight);
    });

    return new Param(
      owner,
      new EuclidValue(virtual),
      new EuclidValue(weights),
      new EuclidValue(jumpSizes),
      1n, // TODO include active-status in testing
    );
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
