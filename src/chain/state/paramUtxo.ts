import { Data } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { IdNFT, Param, PParamDatum } from "../../mod.ts";

export class ParamUtxo {
  static parse(fields: Data[]): [string, Param] {
    const param = PParamDatum.ptype.plift(fields)._0;
    const idNFT = IdNFT.newParamNFT(param.owner).show();
    return [idNFT, param];
  }
}
