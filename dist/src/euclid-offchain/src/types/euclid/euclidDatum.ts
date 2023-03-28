import { Currency } from "../general/derived/asset/currency.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { PSum } from "../general/fundamental/container/sum.js";
import { Dirac, PDirac, PPreDirac } from "./dirac.js";
import { IdNFT } from "./idnft.js";
import { Param, PParam } from "./param.js";

export class ParamDatum {
  constructor(
    public readonly param: Param,
  ) {}
}
class PParamDatum extends PObject<ParamDatum> {
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

class PPreDiracDatum extends PObject<DiracDatum> {
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

class PDiracDatum extends PObject<DiracDatum> {
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

export type EuclidDatum = ParamDatum | DiracDatum;

export class PPreEuclidDatum extends PSum<EuclidDatum> {
  constructor(
    policy: Currency,
  ) {
    super([new PPreDiracDatum(policy), PParamDatum.ptype]);
  }

  static genPType(): PPreEuclidDatum {
    return new PPreEuclidDatum(Currency.dummy);
  }
}

export class PEuclidDatum extends PSum<EuclidDatum> {
  constructor(
    param: Param,
    paramNFT: IdNFT,
    threadNFT: IdNFT,
  ) {
    super([new PDiracDatum(param, paramNFT, threadNFT), PParamDatum.ptype]);
  }

  static genPType(): PEuclidDatum {
    const pdirac = PDirac.genPType() as PDirac;
    return new PEuclidDatum(pdirac.param, pdirac.paramNFT, pdirac.threadNFT);
  }
}
