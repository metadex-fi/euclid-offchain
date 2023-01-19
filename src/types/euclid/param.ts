import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
abs,
  addValues,
  gMaxHashes,
  maxInteger,
  min,
  Prices,
} from "../../mod.ts";
import {
  Amount,
  Amounts,
  Assets,
  boundPositive,
  f,
  JumpSizes,
  lSubValues_,
  newUnionWith,
  PByteString,
  PConstraint,
  PObject,
  PositiveValue,
  PPositive,
  PPositiveValue,
  PPrices,
  PRecord,
  t,
Value,
} from "../mod.ts";
import { PJumpSizes } from "./jumpSizes.ts";
import { PPaymentKeyHash } from "./owner.ts";

// TODO a flag somewhere to deactivate it, so owner can start closing.
// or can we just "break" it?

const gMaxJumps = 3n;

export class Param {
  constructor(
    public owner: PaymentKeyHash,
    public jumpSizes: JumpSizes,
    public initialPrices: Prices,
    public lowerPriceBounds: PositiveValue,
    public upperPriceBounds: PositiveValue,
    public baseAmountA0: Amount,
  ) {
    const assets = jumpSizes.assets();
    this.lowerPriceBounds = this.lowerPriceBounds.fill(assets, 1n);
    Param.assert(this);
  }

  public concise = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Param(
${ttf}owner: ${this.owner}, 
${ttf}jumpSizes: ${this.jumpSizes.concise(ttf)}, 
${ttf}initialPrices: ${this.initialPrices.concise(ttf)}, 
${ttf}lowerPriceBounds: ${this.lowerPriceBounds.concise(ttf)}, 
${ttf}upperPriceBounds: ${this.upperPriceBounds.concise(ttf)}, 
${ttf}baseAmountA0: ${this.baseAmountA0}
${tt})`;
  };

  private maxJumps = (
    from: PositiveValue,
    to: PositiveValue,
    maxJumps = gMaxJumps,
  ): Value => {
    // jump the price of each asset from initial price,
    // a random number of times,
    // with the respective jump size,
    // while respecting the bounds
    const maxSingleAsset = (
      from: bigint,
      to: bigint,
      jumpSize: bigint,
    ): bigint =>
      // jumpSize === 0n ? 0n :
      min(
        maxJumps,
        abs(from - to) / jumpSize,
      );
    const maxAllAssets = newUnionWith(maxSingleAsset);
    return maxAllAssets(
      from.unsigned(),
      to.unsigned(),
      this.jumpSizes.unsigned(),
    );
  };

  private maxDiracs = (): bigint => {
    const lowerBounds = addValues(
      this.lowerPriceBounds.unsigned(),
      this.jumpSizes.unsigned().zeroed(),
    );
    const maxJumps = this.maxJumps(
      new PositiveValue(lowerBounds),
      this.upperPriceBounds,
      maxInteger,
    );
    return maxJumps.increment().mulAmounts();
  };

  public boundedMaxDiracs = (): bigint => {
    return min(gMaxHashes, this.maxDiracs());
  };

  static assert(param: Param): void {
    const assets = param.jumpSizes.assets();
    assert(
      param.lowerPriceBounds.assets().equals(assets),
      `assets must match, got ${param.lowerPriceBounds.concise()}, expected ${assets.show()}`,
    );
    assert(
      param.upperPriceBounds.assets().equals(assets),
      `assets must match, got ${param.upperPriceBounds.concise()}, expected ${assets.show()}`,
    );
    // TODO assert leq
  }

  static generate(): Param {
    const owner = PPaymentKeyHash.genData();

    const initialPrices = Prices.generateInitial();
    const assets = initialPrices.assets();
    const jumpSizes = JumpSizes.genOfAssets(assets);

    const upperBounds = PositiveValue.genOfAssets(assets);
    const lowerOffset = PositiveValue.genOfAssets(assets.randomSubset())
      .unsigned();

    const lowerBounds = new PositiveValue(
      boundPositive(lSubValues_(upperBounds.unsigned(), lowerOffset)),
    );

    const baseAmountA0 = new PPositive().genData();

    return new Param(
      owner,
      jumpSizes,
      initialPrices,
      lowerBounds,
      upperBounds,
      baseAmountA0,
    );
  }
}
export class PParam extends PConstraint<PObject<Param>> {
  private constructor() {
    super(
      new PObject(
        new PRecord({
          "owner": new PByteString(1n),
          "jumpSizes": PJumpSizes.ptype,
          "initialPrices": PPrices.initial(),
          "lowerPriceBounds": new PPositiveValue(),
          "upperPriceBounds": new PPositiveValue(),
          "baseAmountA0": new PPositive(),
        }),
        Param,
      ),
      [Param.assert],
      Param.generate,
    );
  }

  static ptype = new PParam();
  static genPType(): PConstraint<PObject<Param>> {
    return PParam.ptype;
  }
}

export class ParamDatum {
  constructor(
    public readonly _0: Param,
  ) {}
}
export class PParamDatum extends PObject<ParamDatum> {
  private constructor(
    public readonly pparam: PParam,
  ) {
    super(
      new PRecord({
        "_0": pparam,
      }),
      ParamDatum,
    );
  }

  static ptype = new PParamDatum(PParam.ptype);
  static genPType(): PObject<ParamDatum> {
    return PParamDatum.ptype;
  }
}