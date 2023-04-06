import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { genNonNegative, genPositive } from "../../utils/generators.js";
import { Currency } from "../general/derived/asset/currency.js";
import { KeyHash, PKeyHash } from "../general/derived/hash/keyHash.js";
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
import { Param, PParam } from "./param.js";

export class Dirac {
  constructor(
    public readonly owner: KeyHash,
    public readonly threadNFT: IdNFT,
    public readonly paramNFT: IdNFT,
    public readonly anchorPrices: PositiveValue,
  ) {}

  public concise = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Dirac(
${ttf}owner: ${this.owner},
${ttf}threadNFT: ${this.threadNFT.show()},
${ttf}paramNFT: ${this.paramNFT.show()},
${ttf}anchorPrices: ${this.anchorPrices.concise(ttf)},
${tt})`;
  };

  static assertWith = (param: Param) => (dirac: Dirac): void => {
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
  };

  static generateWith =
    (param: Param, paramNFT: IdNFT, threadNFT: IdNFT) => (): Dirac => {
      const minAnchorPrices = param.minAnchorPrices;
      const maxAnchorPrices = Value.add(
        minAnchorPrices,
        param.jumpSizes.unsigned,
      );
      const anchorPrices = PositiveValue.normed(
        Value.genBetween(minAnchorPrices, maxAnchorPrices),
      );
      return new Dirac(
        param.owner,
        threadNFT,
        paramNFT,
        anchorPrices,
      );
    };
}

export class PPreDirac extends PObject<Dirac> {
  constructor(
    policy: Currency,
  ) {
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

  static genPType(): PPreDirac {
    return new PPreDirac(Currency.dummy);
  }
}

export class PDirac extends PConstraint<PObject<Dirac>> {
  constructor(
    public readonly param: Param,
    public readonly paramNFT: IdNFT,
    public readonly threadNFT: IdNFT,
  ) {
    const pidNFT = new PIdNFT(paramNFT.currency);
    super(
      new PObject(
        new PRecord({
          owner: new PLiteral<PKeyHash>(PKeyHash.ptype, param.owner),
          threadNFT: new PLiteral(pidNFT, threadNFT),
          paramNFT: new PLiteral(pidNFT, paramNFT),
          anchorPrices: PPositiveValue.ptype,
        }),
        Dirac,
      ),
      [Dirac.assertWith(param)],
      Dirac.generateWith(param, paramNFT, threadNFT),
    );
  }

  static genPType(): PConstraint<PObject<Dirac>> {
    const param = PParam.ptype.genData();
    const paramNFT = new IdNFT(
      Currency.dummy,
      param.owner.hash().hash(genNonNegative(gMaxHashes - 1n)),
    );
    const threadNFT = paramNFT.next(genPositive(gMaxHashes));
    return new PDirac(param, paramNFT, threadNFT);
  }
}
