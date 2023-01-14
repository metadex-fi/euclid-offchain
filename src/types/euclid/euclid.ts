import {
  DiracDatum,
  ParamDatum,
  PDiracDatum,
  PParamDatum,
  PSum,
} from "../mod.ts";

export type EuclidDatum = ParamDatum | DiracDatum;

export class PEuclidDatum extends PSum<EuclidDatum> {
  private constructor(
    public pdiracDatum: PDiracDatum,
    public pparamDatum: PParamDatum,
  ) {
    super([
      pparamDatum,
      pdiracDatum,
    ]);
  }
}
