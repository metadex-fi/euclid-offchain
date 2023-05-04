import { Currency } from "../general/derived/asset/currency.js";
import { PSum } from "../general/fundamental/container/sum.js";
import { Dirac } from "./dirac.js";
import { IdNFT } from "./idnft.js";
import { Param } from "./param.js";
export declare class ParamDatum {
  readonly param: Param;
  constructor(param: Param);
}
export declare class DiracDatum {
  readonly dirac: Dirac;
  constructor(dirac: Dirac);
}
export declare type EuclidDatum = ParamDatum | DiracDatum;
export declare class PPreEuclidDatum extends PSum<EuclidDatum> {
  constructor(policy: Currency);
  static genPType(): PPreEuclidDatum;
}
export declare class PEuclidDatum extends PSum<EuclidDatum> {
  constructor(param: Param, paramNFT: IdNFT, threadNFT: IdNFT);
  static genPType(): PEuclidDatum;
}
