import {
  PaymentKeyHash,
  PObject,
  PRecord,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Amount, PAmount, PPaymentKeyHash } from "./primitive.ts";
import { JumpSizes, PJumpSizes, PPrices, Prices } from "./value.ts";

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

// export type PParam = PObject<PPaymentKeyHash | PJumpSizes | PPrices | PAmount>

export const PParam = new PObject(
  new PRecord({
    "owner": PPaymentKeyHash,
    "jumpSizes": PJumpSizes,
    "initialPrices": PPrices,
    "lowerPriceBounds": PPrices,
    "upperPriceBounds": PPrices,
    "baseAmountA0": PAmount,
  }),
  Param,
);

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
