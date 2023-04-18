import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { genNonNegative, genPositive } from "../../utils/generators.js";
import { Currency } from "../general/derived/asset/currency.js";
import { PKeyHash } from "../general/derived/hash/keyHash.js";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.js";
import { Value } from "../general/derived/value/value.js";
import { PConstraint } from "../general/fundamental/container/constraint.js";
import { PLiteral } from "../general/fundamental/container/literal.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { f, t } from "../general/fundamental/type.js";
import { gMaxHashes, IdNFT, PIdNFT } from "./idnft.js";
import { PParam } from "./param.js";
export class Dirac {
  constructor(owner, threadNFT, paramNFT, anchorPrices) {
    Object.defineProperty(this, "owner", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: owner,
    });
    Object.defineProperty(this, "threadNFT", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: threadNFT,
    });
    Object.defineProperty(this, "paramNFT", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: paramNFT,
    });
    Object.defineProperty(this, "anchorPrices", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: anchorPrices,
    });
    Object.defineProperty(this, "concise", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tabs = "") => {
        const tt = tabs + t;
        const ttf = tt + f;
        return `Dirac(
${ttf}owner: ${this.owner},
${ttf}threadNFT: ${this.threadNFT.show()},
${ttf}paramNFT: ${this.paramNFT.show()},
${ttf}anchorPrices: ${this.anchorPrices.concise(ttf)},
${tt})`;
      },
    });
  }
}
Object.defineProperty(Dirac, "assertWith", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: (param) => (dirac) => {
    const anchorPrices = dirac.anchorPrices.unsigned;
    const minAnchorPrices = param.minAnchorPrices;
    const maxAnchorPrices = Value.add(
      minAnchorPrices,
      param.jumpSizes.unsigned,
    );
    // leq_/lt_ assert assets are subsets too (in one (different) direction, resp.)
    assert(
      Value.leq_(minAnchorPrices, anchorPrices),
      `anchorPrices must be at least minAnchorPrices, but ${anchorPrices.show()}\nis not at least ${minAnchorPrices.show()}`,
    );
    assert(
      Value.lt_(anchorPrices, maxAnchorPrices),
      `anchorPrices must be strictly less than maxAnchorPrices, but ${anchorPrices.show()}\nis not strictly less than ${maxAnchorPrices.show()}`,
    );
  },
});
Object.defineProperty(Dirac, "generateWith", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: (param, paramNFT, threadNFT) => () => {
    const minAnchorPrices = param.minAnchorPrices;
    const maxAnchorPrices = Value.add(
      minAnchorPrices,
      param.jumpSizes.unsigned,
    );
    const anchorPrices = PositiveValue.normed(
      Value.genBetween(minAnchorPrices, maxAnchorPrices),
    );
    return new Dirac(param.owner, threadNFT, paramNFT, anchorPrices);
  },
});
export class PPreDirac extends PObject {
  constructor(policy) {
    super(
      new PRecord({
        owner: PKeyHash.ptype,
        threadNFT: new PIdNFT(policy),
        paramNFT: new PIdNFT(policy),
        anchorPrices: PPositiveValue.ptype,
      }),
      Dirac,
    );
  }
  static genPType() {
    return new PPreDirac(Currency.dummy);
  }
}
export class PDirac extends PConstraint {
  constructor(param, paramNFT, threadNFT) {
    const pidNFT = new PIdNFT(paramNFT.currency);
    super(
      new PObject(
        new PRecord({
          owner: new PLiteral(PKeyHash.ptype, param.owner),
          threadNFT: new PLiteral(pidNFT, threadNFT),
          paramNFT: new PLiteral(pidNFT, paramNFT),
          anchorPrices: PPositiveValue.ptype,
        }),
        Dirac,
      ),
      [Dirac.assertWith(param)],
      Dirac.generateWith(param, paramNFT, threadNFT),
    );
    Object.defineProperty(this, "param", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: param,
    });
    Object.defineProperty(this, "paramNFT", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: paramNFT,
    });
    Object.defineProperty(this, "threadNFT", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: threadNFT,
    });
  }
  static genPType() {
    const param = PParam.ptype.genData();
    const paramNFT = new IdNFT(
      Currency.dummy,
      param.owner.hash().hash(genNonNegative(gMaxHashes - 1n)),
    );
    const threadNFT = paramNFT.next(genPositive(gMaxHashes));
    return new PDirac(param, paramNFT, threadNFT);
  }
}
