import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Assets } from "../general/derived/asset/assets.ts";
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
    const assets = Assets.generate(2n);
    const owner = PKeyHash.ptype.genData();
    return Param.genOf(owner, assets);
  }

  static genOf(owner: KeyHash, assets: Assets): Param {
    const weights = EuclidValue.genOfAssets(assets);
    const maxLowestPrices = EuclidValue.genOfAssets(assets);
    const jumpSizes = EuclidValue.genBelow(maxLowestPrices.bounded(2n));
    const minLowestPrices = maxLowestPrices.normedMinus(jumpSizes);
    const virtual = minLowestPrices.normedDivideBy(weights.unsized);

    return new Param(
      owner,
      virtual,
      weights,
      jumpSizes,
    );
  }
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
