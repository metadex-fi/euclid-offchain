import {
  ActiveAssets,
  Amount,
  Amounts,
  Asset,
  CurrencySymbol,
  Dirac,
  DiracDatum,
  IdNFT,
  JumpSizes,
  Param,
  ParamDatum,
  Prices,
  PSum,
  TokenName,
  Value,
} from "../mod.ts";

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
