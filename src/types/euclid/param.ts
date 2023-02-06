import { Assets, f, KeyHash, PKeyHash, PRecord, t } from "../mod.ts";
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
  public sharedAssets = (assets: Assets): Assets =>
    this.assets.intersect(assets);

  public concise = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Param (
${ttf}owner: ${this.owner.toString()}, 
${ttf}jumpSizes: ${this.jumpSizes.concise(ttf)}, 
${ttf}highestPrices: ${this.highestPrices.concise(ttf)}, 
${ttf}weights: ${this.weights.concise(ttf)}
${tt})`;
  };

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

  // static generateForUser(user: User): [Param, PositiveValue] {
  //   assert(user.balance, `user balance not initialized for ${user.address}`);
  //   assert(
  //     user.balance.size() >= 2,
  //     `balance must be at least 2, got ${user.balance.concise()}`,
  //   );
  //   const deposit = user.balance.minSizedSubValue(2n);
  //   const assets = deposit.assets();

  //   const jumpSizes = EuclidValue.genOfAssets(assets);
  //   const highestPrices = EuclidValue.genOfAssets(assets);
  //   const weights = EuclidValue.genOfAssets(assets);

  //   const param = new Param(
  //     user.paymentKeyHash,
  //     jumpSizes,
  //     highestPrices,
  //     weights,
  //   );
  //   let minDiracs = param.locationsPerDirac();
  //   while (minDiracs > deposit.smallestAmount()) {
  //     param.jumpSizes.doubleRandomAmount(); // this should decrease diracs
  //     minDiracs = param.locationsPerDirac();
  //   }
  //   return [param, deposit];
  // }
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
