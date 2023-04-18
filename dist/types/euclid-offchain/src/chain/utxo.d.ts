import { Lucid } from "../../lucid.mod.js";
import { Dirac } from "../types/euclid/dirac.js";
import { PEuclidDatum } from "../types/euclid/euclidDatum.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { Param } from "../types/euclid/param.js";
import { Asset } from "../types/general/derived/asset/asset.js";
import { Assets } from "../types/general/derived/asset/assets.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
import { Value } from "../types/general/derived/value/value.js";
import { PConstanted } from "../types/general/fundamental/type.js";
import { Swapping } from "./actions/swapping.js";
import { Contract } from "./contract.js";
import { User } from "./user.js";
export declare class ParamUtxo {
  readonly param: Param;
  readonly paramNFT: IdNFT;
  readonly utxo?: Lucid.UTxO | undefined;
  private constructor();
  static parse(utxo: Lucid.UTxO, param: Param): ParamUtxo;
  static open(param: Param, paramNFT: IdNFT): ParamUtxo;
  openingTx: (tx: Lucid.Tx, contract: Contract) => Lucid.Tx;
  sharedAssets: (assets: Assets) => Assets;
  show: (tabs?: string) => string;
}
export declare class PreDiracUtxo {
  readonly utxo: Lucid.UTxO;
  readonly datum: PConstanted<PEuclidDatum>;
  readonly preDirac: Dirac;
  readonly balance: PositiveValue;
  constructor(
    utxo: Lucid.UTxO,
    datum: PConstanted<PEuclidDatum>,
    preDirac: Dirac,
  );
  parse: (param: Param) => DiracUtxo | undefined;
  show: (tabs?: string) => string;
}
export declare class DiracUtxo {
  readonly peuclidDatum: PEuclidDatum;
  readonly dirac: Dirac;
  readonly balance: PositiveValue;
  readonly utxo?: Lucid.UTxO | undefined;
  private constructor();
  static parse(from: PreDiracUtxo, param: Param): DiracUtxo;
  static open(param: Param, dirac: Dirac, balance: PositiveValue): DiracUtxo;
  show: (tabs?: string) => string;
  openingTx: (tx: Lucid.Tx, contract: Contract) => Lucid.Tx;
  applySwapping: (swapping: Swapping) => DiracUtxo;
  swappingsFor: (
    user: User,
    paramUtxo: ParamUtxo,
    sellable_: Value,
    buyingAsset?: Asset,
  ) => Swapping[];
}
