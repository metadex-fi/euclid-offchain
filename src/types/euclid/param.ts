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
import { CurrencySymbol, POwner, TokenName } from "./primitive.ts";
import {
  JumpSizes,
  leq,
  PJumpSizes,
  PositiveValue,
  PPositiveValue,
  PValue,
  Value,
} from "./value.ts";

export class Param {
  public jumpSizes: JumpSizes;
  public initPs: Prices;
  public lowerBounds: PositiveValue | undefined;
  public upperBounds: PositiveValue | undefined;
  constructor(
    public owner: PaymentKeyHash,
    jumpSizes_: Map<CurrencySymbol, Map<TokenName, bigint>>,
    initialPrices: Map<CurrencySymbol, Map<TokenName, bigint>>,
    lowerPriceBounds: Map<CurrencySymbol, Map<TokenName, bigint>> | undefined,
    upperPriceBounds: Map<CurrencySymbol, Map<TokenName, bigint>> | undefined,
    public baseAmountA0: Amount,
  ) {
    this.jumpSizes = JumpSizes.fromMap(jumpSizes_);
    this.initPs = Prices.fromMap(initialPrices);
    this.lowerBounds = PositiveValue.maybeFromMap(lowerPriceBounds);
    this.upperBounds = PositiveValue.maybeFromMap(upperPriceBounds);

    assert(
      leq(this.lowerBounds?.unsigned(), this.initPs.unsigned()),
      `${this.lowerBounds?.unsigned()} > ${this.initPs.unsigned()}`,
    );
    assert(
      leq(this.initPs.unsigned(), this.upperBounds?.unsigned()),
      `${this.initPs.unsigned()} > ${this.upperBounds?.unsigned()}`,
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
      pprices.jumpSizes.toMap(),
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
