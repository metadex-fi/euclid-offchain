import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Assets } from "../general/derived/asset/assets.js";
import { PPositive } from "../general/derived/bounded/positive.js";
import { KeyHash, PKeyHash } from "../general/derived/hash/keyHash.js";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.js";
import { Value } from "../general/derived/value/value.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { f, t } from "../general/fundamental/type.js";
import { EuclidValue, PEuclidValue } from "./euclidValue.js";

// TODO somewhere, take care of sortedness where it applies (not only for PParam)

export class Param {
  constructor(
    public readonly owner: KeyHash,
    public readonly virtual: PositiveValue,
    public readonly weights: EuclidValue, // NOTE those are actually inverted
    public readonly jumpSizes: EuclidValue,
  ) {
    Param.asserts(this);
  }

  // filled with zeroes for assets without virtual liquidity
  public get minLowestPrices(): Value {
    return Value.hadamard_(this.virtual.unsigned, this.weights.unsigned);
  }

  public get assets(): Assets {
    return this.weights.assets;
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
    const minLowestPrices = param.minLowestPrices;
    const maxLowestPrices = Value.add(
      minLowestPrices,
      param.jumpSizes.unsigned,
    );
    assert(
      maxLowestPrices.leqMaxInteger,
      `max lowest price must be leq max integer, but is ${maxLowestPrices.concise()}`,
    );
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

    const ppositive = new PPositive();
    allAssets.forEach((asset) => {
      if (virtualAssets.has(asset)) {
        const maxLowestPrice = new PPositive(2n).genData();
        const jumpSize = new PPositive(1n, maxLowestPrice - 1n).genData();
        const minLowestPrice = maxLowestPrice - jumpSize;
        const weight = new PPositive(1n, minLowestPrice).genData();

        virtual.initAmountOf(asset, minLowestPrice / weight);
        jumpSizes.initAmountOf(asset, jumpSize);
        weights.initAmountOf(asset, weight);
      } else {
        const weight = ppositive.genData();
        const maxLowestPrice = ppositive.genData();
        const jumpSize = new PPositive(1n, maxLowestPrice).genData();
        const minLowestPrice = maxLowestPrice - jumpSize;

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
    );
  }

  // static genOf(owner: KeyHash, assets: Assets): Param {
  //   const weights = EuclidValue.genOfAssets(assets);
  //   const maxLowestPrices = EuclidValue.genOfAssets(assets);
  //   const jumpSizes = EuclidValue.genBelow(maxLowestPrices.bounded(2n));
  //   const minLowestPrices = maxLowestPrices.normedMinus(jumpSizes);
  //   const virtual = minLowestPrices.normedDivideBy(weights.unsized);

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
