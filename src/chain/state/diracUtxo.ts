import { Data, UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Dirac, Param, PDiracDatum } from "../../mod.ts";

export class DiracUtxo {
  private constructor(
    public readonly utxo: UTxO,
    public readonly fields: Data[],
  ) {
  }

  static preparse(utxo: UTxO, fields: Data[]): [string, DiracUtxo] {
    const idNFT = "TODO";
    return [idNFT, new DiracUtxo(utxo, fields)];
  }

  public parseWith = (param: Param): Dirac => {
    const pdiracDatum = PDiracDatum.fromParam(param);
    const dirac = pdiracDatum.plift(this.fields)._0;
    // number of reachable prices * baseAmountA0 <= total value of amounts.
    // TODO Do we check this? where?
    return dirac;
  };
}
