import { Currency } from "../general/derived/asset/currency.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { PSum } from "../general/fundamental/container/sum.js";
import { PDirac, PPreDirac } from "./dirac.js";
import { PParam } from "./param.js";
export class ParamDatum {
  constructor(param) {
    Object.defineProperty(this, "param", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: param,
    });
  }
}
class PParamDatum extends PObject {
  constructor(pparam) {
    super(
      new PRecord({
        "param": pparam,
      }),
      ParamDatum,
    );
  }
  static genPType() {
    return PParamDatum.ptype;
  }
}
Object.defineProperty(PParamDatum, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PParamDatum(PParam.ptype),
});
export class DiracDatum {
  constructor(dirac) {
    Object.defineProperty(this, "dirac", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: dirac,
    });
  }
}
class PPreDiracDatum extends PObject {
  constructor(policy) {
    super(
      new PRecord({
        "dirac": new PPreDirac(policy),
      }),
      DiracDatum,
    );
  }
  static genPType() {
    return new PPreDiracDatum(Currency.dummy);
  }
}
class PDiracDatum extends PObject {
  constructor(param, paramNFT, threadNFT) {
    super(
      new PRecord({
        "dirac": new PDirac(param, paramNFT, threadNFT),
      }),
      DiracDatum,
    );
  }
  static genPType() {
    const pdirac = PDirac.genPType();
    return new PDiracDatum(pdirac.param, pdirac.paramNFT, pdirac.threadNFT);
  }
}
export class PPreEuclidDatum extends PSum {
  constructor(policy) {
    super([new PPreDiracDatum(policy), PParamDatum.ptype]);
  }
  static genPType() {
    return new PPreEuclidDatum(Currency.dummy);
  }
}
export class PEuclidDatum extends PSum {
  constructor(param, paramNFT, threadNFT) {
    super([new PDiracDatum(param, paramNFT, threadNFT), PParamDatum.ptype]);
  }
  static genPType() {
    const pdirac = PDirac.genPType();
    return new PEuclidDatum(pdirac.param, pdirac.paramNFT, pdirac.threadNFT);
  }
}
