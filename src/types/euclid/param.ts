import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Amount,
  PAmount,
  PLiteral,
  PObject,
  PPositive,
  PRecord,
} from "../mod.ts";
import { PPrices, Prices } from "./prices.ts";
import { POwner } from "./primitive.ts";
import { JumpSizes, leq, PJumpSizes } from "./value.ts";

export class Param {
  constructor(
    public owner: PaymentKeyHash,
    public jumpSizes: JumpSizes,
    public initialPrices: Prices,
    public lowerPriceBounds: Prices | undefined,
    public upperPriceBounds: Prices | undefined,
    public baseAmountA0: Amount,
  ) {
    assert(
      leq(lowerPriceBounds?.value, initialPrices.value),
      `${lowerPriceBounds?.value} > ${initialPrices.value}`,
    );
    assert(
      leq(initialPrices.value, upperPriceBounds?.value),
      `${initialPrices.value} > ${upperPriceBounds?.value}`,
    );
  }
}
export class PParam extends PObject<Param> {
  private constructor(
    public powner: POwner,
    public pjumpSizes: PLiteral<PJumpSizes>,
    public pinitialPrices: PPrices,
    public plowerPriceBounds: PLiteral<PPrices> | undefined,
    public pupperPriceBounds: PLiteral<PPrices> | undefined,
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
      pprices.jumpSizes.value.toMap(),
    );

    const lowerBounds = pprices.lowerBounds;
    const plowerPriceBounds = lowerBounds
      ? PPrices.literal(lowerBounds)
      : undefined;
    // throw new Error("TODO: PParam.genPType");
    const upperBounds = pprices.upperBounds;
    const pupperPriceBounds = upperBounds
      ? PPrices.literal(upperBounds)
      : undefined;

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
