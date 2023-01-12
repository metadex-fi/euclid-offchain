import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  addValues,
  Amount,
  boundPositive,
  JumpSizes,
  leq,
  lSubValues,
  lSubValues_,
  newCompareWith,
  PByteString,
  PConstraint,
  PObject,
  PositiveValue,
  PPositive,
  PPositiveValue,
  PRecord,
} from "../mod.ts";
import { PJumpSizes } from "./jumpSizes.ts";
import { PPaymentKeyHash } from "./owner.ts";
import { PPrices, Prices } from "./prices.ts";

export class Param {
  public assertPricesCongruent;
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
    this.assertPricesCongruent = (currentPrices: Prices): void => {
      const singlePriceCongruent = (
        initP: bigint,
        currentP: bigint,
        jumpSize: bigint,
        lowerBound: bigint,
        upperBound: bigint,
      ): boolean => {
        return (currentP - initP) % jumpSize === 0n &&
          currentP >= lowerBound &&
          currentP <= upperBound;
      };
      const allPricesCongruent = newCompareWith(singlePriceCongruent);
      assert(
        allPricesCongruent(
          this.initialPrices.unsigned(),
          currentPrices.unsigned(),
          jumpSizes.unsigned(),
          this.lowerPriceBounds.unsigned(),
          this.upperPriceBounds.unsigned(),
        ),
        `newAssertPricesCongruent: prices not congruent:
    initPs: ${this.initialPrices.concise()}
    currentPs: ${currentPrices.concise()}
    jumpSizes: ${this.jumpSizes.concise()}`,
      );
    };
  }

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
          "initialPrices": PPrices.ptype,
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

  static genPType(): PConstraint<PObject<Param>> {
    return new PParam();
  }
}

export class ParamDatum {
  constructor(
    public _0: Param,
  ) {}
}
export class PParamDatum extends PObject<ParamDatum> {
  private constructor(
    public pparam: PParam,
  ) {
    super(
      new PRecord({
        "_0": pparam,
      }),
      ParamDatum,
    );
  }

  static genPType(): PObject<ParamDatum> {
    const pparam = PParam.genPType() as PParam;
    return new PParamDatum(pparam);
  }
}
