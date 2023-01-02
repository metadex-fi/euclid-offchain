import {
  PaymentKeyHash,
  PObject,
  PRecord,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { PAssets, randomAssetsOf } from "./asset.ts";
import { newPPrices, Prices } from "./prices.ts";
import {
  Amount,
  newPAmount,
  newPPaymentKeyHashLiteral,
  PPaymentKeyHash,
} from "./primitive.ts";
import { JumpSizes, newPJumpSizes, newPPositiveValue } from "./value.ts";

// TODO assertions about lower < initial < upper prices
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
export type PParam = PObject<Param>;
export const genPParam = (): PParam => {
  const assets = PAssets.genData();
  const lowerBoundedAssets = randomAssetsOf(assets);
  const upperBoundedAssets = randomAssetsOf(assets);

  const powner = newPPaymentKeyHashLiteral(PPaymentKeyHash.genData());
  const pjumpSizes = newPJumpSizes(assets);
  const plowerPriceBounds = newPPositiveValue(lowerBoundedAssets);
  const pupperPriceBounds = newPPositiveValue(upperBoundedAssets);

  const lowerPriceBounds = plowerPriceBounds.genData();
  const upperPriceBounds = pupperPriceBounds.genData();

  const pinitialPrices = newPPrices(assets, lowerPriceBounds, upperPriceBounds);
  const pbaseAmountA0 = newPAmount();

  return new PObject(
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
};

export class ParamDatum {
  constructor(
    public _0: Param,
  ) {}
}
export type PParamDatum = PObject<ParamDatum>;
export const genPParamDatum = (): PParamDatum => {
  return new PObject(
    new PRecord({
      "_0": genPParam(),
    }),
    ParamDatum,
  );
};
