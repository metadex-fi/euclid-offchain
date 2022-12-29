import { PSum } from "../../../refactor_parse/lucid/src/mod.ts";
import { Asset, IdNFT } from "./asset.ts";
import { ActiveAssets, Dirac, DiracDatum, PDiracDatum } from "./dirac.ts";
import { Param, ParamDatum, PParamDatum } from "./param.ts";
import { Amount, CurrencySymbol, TokenName } from "./primitive.ts";
import { Amounts, JumpSizes, Prices, Value } from "./value.ts";

export type EuclidData =
  | Amount
  | CurrencySymbol
  | TokenName
  | Asset
  | IdNFT
  | Value
  | Prices
  | Amounts
  | JumpSizes
  | ActiveAssets
  | Dirac
  | Param
  | DiracDatum
  | ParamDatum
  | EuclidDatum;

export type EuclidDatum = DiracDatum | ParamDatum;

export const PEuclidDatum = new PSum([
  PDiracDatum,
  PParamDatum,
]);
