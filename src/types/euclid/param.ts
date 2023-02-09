import {
  Assets,
  f,
  KeyHash,
  PKeyHash,
  PositiveValue,
  PPositiveValue,
  PRecord,
  t,
  Value,
} from "../mod.ts";
import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { EuclidValue, PEuclidValue } from "./euclidValue.ts";
import { randomChoice } from "../../mod.ts";

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

    const virtual = PositiveValue.genOfAssets(assets.randomSubset());
    const weights = EuclidValue.genOfAssets(assets);
    const jumpSizes = EuclidValue.genOfAssets(assets);

    let minLowestPrices = Value.hadamard_(virtual.unsigned, weights.unsigned);
    let maxLowestPrices = Value.add(
      minLowestPrices,
      jumpSizes.unsigned,
    );
    while (!maxLowestPrices.leqMaxInteger) {
      // this is a bit sloppy vs. clean and/or dirty reduce, but sloppy feels correct here
      randomChoice([virtual, weights, jumpSizes]).halfRandomAmount();

      minLowestPrices = Value.hadamard_(virtual.unsigned, weights.unsigned);
      maxLowestPrices = Value.add(
        minLowestPrices,
        jumpSizes.unsigned,
      );
    }

    return new Param(
      PKeyHash.ptype.genData(),
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
