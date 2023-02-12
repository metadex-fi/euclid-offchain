import { Currency } from "../general/derived/asset/currency.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";
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
    pparam: PParam,
  ) {
    super(
      new PRecord({
        "param": pparam,
      }),
      ParamDatum,
    );
  }

  static ptype = new PParamDatum(PParam.ptype);
  static genPType(): PParamDatum {
    return PParamDatum.ptype;
  }
}

export class DiracDatum {
  constructor(
    public readonly dirac: Dirac,
  ) {}
}

export class PPreDiracDatum extends PObject<DiracDatum> {
  constructor(
    policy: Currency,
  ) {
    super(
      new PRecord({
        "dirac": new PPreDirac(policy),
      }),
      DiracDatum,
    );
  }

  static genPType(): PPreDiracDatum {
    return new PPreDiracDatum(Currency.dummy);
  }
}

export class PDiracDatum extends PObject<DiracDatum> {
  constructor(
    param: Param,
    paramNFT: IdNFT,
    threadNFT: IdNFT,
  ) {
    super(
      new PRecord({
        "dirac": new PDirac(param, paramNFT, threadNFT),
      }),
      DiracDatum,
    );
  }

  static genPType(): PDiracDatum {
    const pdirac = PDirac.genPType() as PDirac;
    return new PDiracDatum(pdirac.param, pdirac.paramNFT, pdirac.threadNFT);
  }
}
