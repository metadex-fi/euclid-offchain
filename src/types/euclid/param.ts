import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { PLiteral, PPositive } from "../general/mod.ts";
import { Amount, PAmount, PObject, PRecord } from "../mod.ts";
import { PPrices, Prices } from "./prices.ts";
import { newPPaymentKeyHashLiteral, PPaymentKeyHash } from "./primitive.ts";
import { JumpSizes, leq, PJumpSizes, Value } from "./value.ts";

export class Param {
  constructor(
    public owner: PaymentKeyHash,
    public jumpSizes: JumpSizes,
    public initialPrices: Prices,
    public lowerPriceBounds: Prices,
    public upperPriceBounds: Prices,
    public baseAmountA0: Amount,
  ) {
    assert(
      leq(lowerPriceBounds.value, initialPrices.value),
      `${lowerPriceBounds.value} > ${initialPrices.value}`,
    );
    assert(
      leq(initialPrices.value, upperPriceBounds.value),
      `${initialPrices.value} > ${upperPriceBounds.value}`,
    );
  }
}
export class PParam extends PObject<Param> {
  private constructor(
    public powner: PPaymentKeyHash,
    public pjumpSizes: PJumpSizes,
    public pinitialPrices: PPrices,
    public plowerPriceBounds: PPrices,
    public pupperPriceBounds: PPrices,
    public pbaseAmountA0: PAmount,
  ) {
    super(
      new PRecord({
        "owner": PPaymentKeyHash,
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
    const powner = newPPaymentKeyHashLiteral(PPaymentKeyHash.genData());

    const pprices = PPrices.genPType() as PPrices;
    const assets = pprices.assets;
    const pjumpSizes = new PLiteral(
      new PJumpSizes(assets),
      pprices.jumpSizes.value.toMap(),
    );

    const lowerBounds = pprices.lowerBounds?.value ?? new Value();
    const plowerPriceBounds = new PLiteral(pprices, lowerBounds.toMap());
    const upperBounds = pprices.upperBounds?.value ?? new Value();
    const pupperPriceBounds = new PLiteral(pprices, upperBounds.toMap());

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
