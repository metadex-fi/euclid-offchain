import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Amount,
  JumpSizes,
  leq,
  PAmount,
  PLiteral,
  PObject,
  PositiveValue,
  PPositive,
  PPositiveValue,
  PRecord,
} from "../mod.ts";
import { PJumpSizes } from "./jumpSizes.ts";
import { POwner } from "./owner.ts";
import { PPrices, Prices } from "./prices.ts";

export class Param {
  constructor(
    public owner: PaymentKeyHash,
    public jumpSizes: JumpSizes,
    public initialPrices: Prices,
    public lowerPriceBounds: PositiveValue | undefined,
    public upperPriceBounds: PositiveValue | undefined,
    public baseAmountA0: Amount,
  ) {
    assert(
      leq(this.lowerPriceBounds?.unsigned(), this.initialPrices.unsigned()),
      `${this.lowerPriceBounds?.unsigned()} > ${this.initialPrices.unsigned()}`,
    );
    assert(
      leq(this.initialPrices.unsigned(), this.upperPriceBounds?.unsigned()),
      `${this.initialPrices.unsigned()} > ${this.upperPriceBounds?.unsigned()}`,
    );
  }
}
export class PParam extends PObject<Param> {
  private constructor(
    public powner: POwner,
    public pjumpSizes: PLiteral<PJumpSizes>,
    public pinitialPrices: PPrices,
    public plowerPriceBounds: PLiteral<PPositiveValue> | undefined,
    public pupperPriceBounds: PLiteral<PPositiveValue> | undefined,
    public pbaseAmountA0: PAmount,
  ) {
    super(
      new PRecord({
        "owner": powner,
        "jumpSizes": pjumpSizes,
        "initialPrices": pinitialPrices,
        "lowerPriceBounds": plowerPriceBounds,
        "upperPriceBounds": pupperPriceBounds,
        "baseAmountA0": pbaseAmountA0,
      }),
      Param,
    );
  }

  static genPType(): PObject<Param> {
    const powner = POwner.genPType();

    const pprices = PPrices.genPType() as PPrices;
    const assets = pprices.assets;
    const pjumpSizes = new PLiteral(
      new PJumpSizes(assets),
      pprices.jumpSizes,
    );

    const plowerPriceBounds = PPositiveValue.maybePLiteral(
      pprices.lowerBounds?.value(),
    );
    const pupperPriceBounds = PPositiveValue.maybePLiteral(
      pprices.upperBounds?.value(),
    );

    const pbaseAmountA0 = new PPositive();

    return new PObject(
      new PRecord({
        "owner": powner,
        "jumpSizes": pjumpSizes,
        "initialPrices": pprices,
        "lowerPriceBounds": plowerPriceBounds,
        "upperPriceBounds": pupperPriceBounds,
        "baseAmountA0": pbaseAmountA0,
      }),
      Param,
    );
  }
}

export class ParamDatum {
  constructor(
    public _0: Param,
  ) {}
}
// export class PParamDatum extends PObject<ParamDatum> {
//   private constructor(
//     public _0: PParam,
//   ) {
//     super(
//       new PRecord({
//         "_0": _0,
//       }),
//       ParamDatum,
//     );
//   }

//   static genPType(): PObject<ParamDatum> {
//     return new PObject(
//       new PRecord({
//         "_0": PParam.genPType(),
//       }),
//       ParamDatum,
//     );
//   }
// }
