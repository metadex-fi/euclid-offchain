import {
  Assets,
  KeyHash,
  PKeyHash,
  PositiveValue,
  PPositiveValue,
  PRecord,
} from "../mod.ts";
import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PObject } from "../general/fundamental/container/object.ts";

export class Param {
  constructor(
    public readonly owner: KeyHash,
    public readonly jumpSizes: PositiveValue,
    public readonly weights: PositiveValue,
    public readonly lowestPrices: PositiveValue,
  ) {
    Param.assertAssets(this);
  }

  static assertAssets(param: Param): void {
    const assets = param.jumpSizes.assets();
    assert(
      assets.equals(param.weights.assets()),
      "assets of jumpSizes and weights must match",
    );
    assert(
      assets.equals(param.lowestPrices.assets()),
      "assets of jumpSizes and lowestPrices must match",
    );
    assert(assets.size >= 2n, "at least two assets are required");
  }
}

export class PParam extends PObject<Param> {
  private constructor() {
    super(
      new PRecord({
        owner: PKeyHash.ptype,
        jumpSizes: PPositiveValue.ptype,
        highestPrices: PPositiveValue.ptype,
        weights: PPositiveValue.ptype,
      }),
      Param,
    );
  }

  public genData = (): Param => {
    const assets = Assets.generate(2n);
    const jumpSizes = PositiveValue.genOfAssets(assets);
    const weights = PositiveValue.genOfAssets(assets);
    const lowestPrices = PositiveValue.genOfAssets(assets);
    return new Param(
      PKeyHash.ptype.genData(),
      jumpSizes,
      weights,
      lowestPrices,
    );
  };

  static ptype = new PParam();
  static genPtype(): PParam {
    return PParam.ptype;
  }
}
