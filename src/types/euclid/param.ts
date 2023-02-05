import { Assets, KeyHash, PKeyHash, PRecord } from "../mod.ts";
import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { EuclidValue, PEuclidValue } from "./euclidValue.ts";

// TODO somewhere, take care of sortedness where it applies (not only for PParam)

export class Param {
  constructor(
    public readonly owner: KeyHash,
    public readonly jumpSizes: EuclidValue,
    public readonly highestPrices: EuclidValue,
    public readonly weights: EuclidValue,
  ) {
    Param.asserts(this);
  }

  public get assets(): Assets {
    return this.jumpSizes.assets();
  }

  static asserts(param: Param): void {
    const assets = param.jumpSizes.assets();
    assert(
      assets.equals(param.weights.assets()),
      "assets of jumpSizes and weights must match",
    );
    assert(
      assets.equals(param.highestPrices.assets()),
      "assets of jumpSizes and lowestPrices must match",
    );
  }

  static generate(): Param {
    const assets = Assets.generate(2n);
    const jumpSizes = EuclidValue.genOfAssets(assets);
    const highestPrices = EuclidValue.genOfAssets(assets);
    const weights = EuclidValue.genOfAssets(assets);
    return new Param(
      PKeyHash.ptype.genData(),
      jumpSizes,
      highestPrices,
      weights,
    );
  }
}

export class PParam extends PObject<Param> {
  private constructor() {
    super(
      new PRecord({
        owner: PKeyHash.ptype,
        jumpSizes: PEuclidValue.ptype,
        highestPrices: PEuclidValue.ptype,
        weights: PEuclidValue.ptype,
      }),
      Param,
    );
  }

  public genData = Param.generate;

  static ptype = new PParam();
  static genPtype(): PParam {
    return PParam.ptype;
  }
}
