import { PSum } from "../general/sum.ts";
import { ActiveAssets } from "./activeAssets.ts";
import { Amounts } from "./amounts.ts";
import { Asset } from "./asset.ts";
import { Dirac, DiracDatum } from "./dirac.ts";
import { IdNFT } from "./idnft.ts";
import { Param, ParamDatum } from "./param.ts";
import { Prices } from "./prices.ts";
import { Amount, CurrencySymbol, TokenName } from "./primitive.ts";
import { JumpSizes, Value } from "./value.ts";

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
