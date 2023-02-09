import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genPositive,
  maxInteger,
  PLiteral,
} from "../../mod.ts";
import {
  Currency,
  f,
  KeyHash,
  Param,
  PConstraint,
  PKeyHash,
  PObject,
  PositiveValue,
  PParam,
  PPositiveValue,
  PRecord,
  t,
  Value,
} from "../mod.ts";
import { gMaxHashes, IdNFT, PIdNFT } from "./idnft.ts";

export class Dirac {
  constructor(
    public readonly owner: KeyHash,
    public readonly threadNFT: IdNFT,
    public readonly paramNFT: IdNFT,
    public readonly lowestPrices: PositiveValue,
  ) {}

  public concise = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Dirac(
${ttf}owner: ${this.owner},
${ttf}threadNFT: ${this.threadNFT.show()},
${ttf}paramNFT: ${this.paramNFT.show()},
${ttf}lowestPrices: ${this.lowestPrices.concise(ttf)},
${tt})`;
  };

  static assertWith = (param: Param) => (dirac: Dirac): void => {
    const lowestPrices = dirac.lowestPrices.unsigned;
    const minLowestPrices = param.minLowestPrices;
    const maxLowestPrices = Value.add(
      minLowestPrices,
      param.jumpSizes.unsigned,
    );
    // leq_/lt_ assert assets are subsets too (in one (different) direction, resp.)
    assert(
      Value.leq_(minLowestPrices, lowestPrices),
      `lowestPrices must be at least minLowestPrices, but ${lowestPrices.show()}\nis not at least ${minLowestPrices.show()}`,
    );
    assert(
      Value.lt_(lowestPrices, maxLowestPrices),
      `lowestPrices must be strictly less than maxLowestPrices, but ${lowestPrices.show()}\nis not strictly less than ${maxLowestPrices.show()}`,
    );
  };

  static generateWith =
    (param: Param, paramNFT: IdNFT, threadNFT: IdNFT) => (): Dirac => {
      const minLowestPrices = param.minLowestPrices;
      const maxLowestPrices = Value.add(
        minLowestPrices,
        param.jumpSizes.unsigned,
      );
      const lowestPrices = PositiveValue.normed(
        Value.genBetween(minLowestPrices, maxLowestPrices),
      );
      return new Dirac(
        param.owner,
        threadNFT,
        paramNFT,
        lowestPrices,
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
        lowestPrices: PPositiveValue.ptype,
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
          lowestPrices: PPositiveValue.ptype,
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
