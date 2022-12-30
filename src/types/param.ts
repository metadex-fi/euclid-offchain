import {
  PaymentKeyHash,
  PlutusOf,
  PObject,
  PRecord,
  PType,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Amount, PAmount, PPaymentKeyHash } from "./primitive.ts";
import {
  JumpSizes,
  mkPJumpSizes,
  PJumpSizes,
  PPrices,
  Prices,
} from "./value.ts";

export class Param {
  constructor(
    public owner: PaymentKeyHash,
    public jumpSizes: JumpSizes,
    public initialPrices: Prices,
    public lowerPriceBounds: Prices,
    public upperPriceBounds: Prices,
    public baseAmountA0: Amount,
  ) {}
}

export class PParam
  implements PType<Array<PlutusOf<Param[keyof Param]>>, Param> {
  plift(data: string | Value | Map<Value, string>): Param {
    throw new Error("Method not implemented.");
  }
  pconstant(data: Param): string | Value | Map<Value, string> {
    throw new Error("Method not implemented.");
  }
  genData(): Param {
    throw new Error("Method not implemented.");
  }
  genPlutusData(): string | Value | Map<Value, string> {
    throw new Error("Method not implemented.");
  }
}

export const mkPParam = (assets: Assets) => {
  return new PObject(
    new PRecord({
      "owner": PPaymentKeyHash,
      "jumpSizes": mkPJumpSizes,
      "initialPrices": PPrices,
      "lowerPriceBounds": PPrices,
      "upperPriceBounds": PPrices,
      "baseAmountA0": PAmount,
    }),
    Param,
  );
};

export class ParamDatum {
  constructor(
    public _0: Param,
  ) {}
}

export const PParamDatum = new PObject(
  new PRecord({
    "_0": PParam,
  }),
  ParamDatum,
);
