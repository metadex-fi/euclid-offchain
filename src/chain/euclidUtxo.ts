import { Data, UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Dirac, Param, PDiracDatum, PParamDatum } from "../mod.ts";

export class ParamUtxo {
  public readonly param: Param;
  public readonly owner: string;
  constructor(
    public readonly utxo: UTxO,
    public readonly fields: Data[],
  ) {
    this.param = PParamDatum.ptype.plift(fields)._0;
    this.owner = this.param.owner;
  }
}

export class DiracUtxo {
  public readonly owner: string;
  public dirac?: Dirac;
  constructor(
    public readonly utxo: UTxO,
    public readonly fields: Data[],
  ) {
    this.owner = "TODO";
  }

  public parseWith = (param: Param): DiracUtxo => {
    const pdiracDatum = PDiracDatum.fromParam(param);
    this.dirac = pdiracDatum.plift(this.fields)._0;
    // number of reachable prices * baseAmountA0 <= total value of amounts.
    // TODO Do we check this? where?
    return this;
  };
}
