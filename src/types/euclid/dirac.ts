import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNonNegative, genPositive } from "../../utils/generators.ts";
import { Currency } from "../general/derived/asset/currency.ts";
import { KeyHash, PKeyHash } from "../general/derived/hash/keyHash.ts";
import { PConstraint } from "../general/fundamental/container/constraint.ts";
import { PLiteral } from "../general/fundamental/container/literal.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";
import { f, t } from "../general/fundamental/type.ts";
import { gMaxHashes, IdNFT, PIdNFT } from "./idnft.ts";
import { Param, PParam } from "./param.ts";
import { EuclidValue, PEuclidValue } from "./euclidValue.ts";
import { Assets } from "../general/derived/asset/assets.ts";

export class Dirac {
  constructor(
    public readonly owner: KeyHash,
    public readonly threadNFT: IdNFT,
    public readonly paramNFT: IdNFT,
    public readonly anchorPrices: EuclidValue,
  ) {}

  public get assets(): Assets {
    return this.anchorPrices.assets;
  }

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
    const anchorPrices = dirac.anchorPrices;
    const minAnchorPrices = param.minAnchorPrices;
    // const maxAnchorPrices = minAnchorPrices.plus(param.jumpSizes); TODO update this to multiplicative
    // leq_/lt_ assert assets are subsets too (in one (different) direction, resp.)
    // NOTE we are relying on this in various places, triple-check before altering it
    // assert( // TODO revisit this
    //   minAnchorPrices.leq(anchorPrices),
    //   `anchorPrices must be at least minAnchorPrices, but ${anchorPrices.concise()}\nis not at least ${minAnchorPrices.concise()}`,
    // );
    // assert(
    //   anchorPrices.lt(maxAnchorPrices),
    //   `anchorPrices must be strictly less than maxAnchorPrices, but ${anchorPrices.concise()}\nis not strictly less than ${maxAnchorPrices.concise()}`,
    // );
  };

  static generateWith =
    (param: Param, paramNFT: IdNFT, threadNFT: IdNFT) => (): Dirac => {
      const minAnchorPrices = param.minAnchorPrices;
      // const maxAnchorPrices = minAnchorPrices.hadamard(param.jumpSizes.increment()); // TODO update this to multiplicative
      // const anchorPrices = EuclidValue.fromValue(
      //   Value.genBetween(minAnchorPrices.unsigned, maxAnchorPrices.unsigned),
      // );

      return new Dirac(
        param.owner,
        threadNFT,
        paramNFT,
        minAnchorPrices, //anchorPrices,
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
        anchorPrices: PEuclidValue.ptype,
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
          anchorPrices: PEuclidValue.ptype,
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
