import { PObject, PRecord } from "../mod.ts";
import { Dirac, PDirac, PPreDirac } from "./dirac.ts";
import { IdNFT } from "./idnft.ts";
import { Param, PParam } from "./param.ts";

export class ParamDatum {
  constructor(
    public readonly param: Param,
  ) {}
}
export class PParamDatum extends PObject<ParamDatum> {
  private constructor(
    public readonly pparam: PParam,
  ) {
    super(
      new PRecord({
        "param": pparam,
      }),
      ParamDatum,
    );
  }

  static ptype = new PParamDatum(PParam.ptype);
  static genPType(): PObject<ParamDatum> {
    return PParamDatum.ptype;
  }
}

export class DiracDatum {
  constructor(
    public readonly dirac: Dirac,
  ) {}
}

export class PDiracDatum extends PObject<DiracDatum> {
  private constructor(
    public readonly pdirac: PDirac | PPreDirac,
  ) {
    super(
      new PRecord({
        "dirac": pdirac,
      }),
      DiracDatum,
    );
  }

  static pre: PDiracDatum = new PDiracDatum(PPreDirac.ptype);

  static parse(
    param: Param,
    paramNFT: IdNFT,
    numDiracs: bigint,
  ): PDiracDatum {
    return new PDiracDatum(new PDirac(param, paramNFT, numDiracs));
  }

  static genPType(): PObject<DiracDatum> {
    const pdirac = PDirac.genPType() as PDirac;
    return new PDiracDatum(pdirac);
  }
}
