import { Data, UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Dirac, IdNFT, Param, PDiracDatum, PParamDatum } from "../mod.ts";

export class ParamUtxo {
  public readonly param: Param;
  public readonly paramNFT: string;
  constructor(
    public readonly utxo: UTxO,
    public readonly fields: Data[],
  ) {
    this.param = PParamDatum.ptype.plift(fields)._0;
    this.paramNFT = IdNFT.newParamNFT(this.param.owner).show();
  }
}

export class DiracUtxo {
  public readonly paramNFT: string;
  public dirac?: Dirac;
  constructor(
    public readonly utxo: UTxO,
    public readonly fields: Data[],
  ) {
    this.paramNFT = "TODO";
  }

  public parseWith = (param: Param): DiracUtxo => {
    const pdiracDatum = PDiracDatum.fromParam(param);
    this.dirac = pdiracDatum.plift(this.fields)._0;
    // number of reachable prices * baseAmountA0 <= total value of amounts.
    // TODO Do we check this? where?
    return this;
  };
}
