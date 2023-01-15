import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { maxInteger } from "../../mod.ts";
import {
  addValues,
  Amount,
  boundPositive,
  f,
  JumpSizes,
  leq,
  lSubValues_,
  PByteString,
  PConstraint,
  PObject,
  PositiveValue,
  PPositive,
  PPositiveValue,
  PRecord,
  t,
} from "../mod.ts";
import { PJumpSizes } from "./jumpSizes.ts";
import { PPaymentKeyHash } from "./owner.ts";
import { maxJumps, PPrices, Prices } from "./prices.ts";

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

  // the number of reachable price-locations
  public numPrices = (): bigint => {
    const maxJumpsUp = maxJumps(
      this.initialPrices,
      this.jumpSizes,
      this.upperPriceBounds,
      maxInteger,
    );
    const maxJumpsDown = maxJumps(
      this.initialPrices,
      this.jumpSizes,
      this.lowerPriceBounds,
      maxInteger,
    );
    return addValues(maxJumpsUp, maxJumpsDown).sumAmounts();
  };

  public concise = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Param(
${ttf}owner: ${this.owner}, 
${ttf}jumpSizes: ${this.jumpSizes.concise()}, 
${ttf}initialPrices: ${this.initialPrices.concise()}, 
${ttf}lowerPriceBounds: ${this.lowerPriceBounds.concise()}, 
${ttf}upperPriceBounds: ${this.upperPriceBounds.concise()}, 
${ttf}baseAmountA0: ${this.baseAmountA0}
${tt})`;
  };

  static assert(param: Param): void {
    const assets = param.jumpSizes.assets();
    assert(
      param.initialPrices.assets().equals(assets),
      `assets must match, got ${param.initialPrices.concise()}, expected ${assets.show()}`,
    );
    assert(
      param.lowerPriceBounds.assets().equals(assets),
      `assets must match, got ${param.lowerPriceBounds.concise()}, expected ${assets.show()}`,
    );
    assert(
      param.upperPriceBounds.assets().equals(assets),
      `assets must match, got ${param.upperPriceBounds.concise()}, expected ${assets.show()}`,
    );
    assert(
      leq(param.lowerPriceBounds.unsigned(), param.initialPrices.unsigned()),
      `lower bounds ${param.lowerPriceBounds.concise()} must be less than or equal to initial prices ${param.initialPrices.concise()}`,
    );
    assert(
      leq(param.initialPrices.unsigned(), param.upperPriceBounds.unsigned()),
      `upper bounds ${param.upperPriceBounds.concise()} must be greater than or equal to initial prices ${param.initialPrices.concise()}`,
    );
  }

  static generate(): Param {
    const owner = PPaymentKeyHash.genData();

    const initialPrices = Prices.generate();

    const assets = initialPrices.assets();
    const jumpSizes = JumpSizes.genOfAssets(assets);

    const lowerOffset = PositiveValue.genOfAssets(assets.randomSubset())
      .unsigned();
    const upperOffset = PositiveValue.genOfAssets(assets).unsigned();

    const initialPricesValue = initialPrices.unsigned();
    const lowerBounds = new PositiveValue(
      boundPositive(lSubValues_(initialPricesValue, lowerOffset)),
    );
    const upperBounds = new PositiveValue(
      boundPositive(addValues(initialPricesValue, upperOffset)),
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
          "initialPrices": new PPrices(),
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
