import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Assets,
  genNonNegative,
  genPositive,
  PAsset,
  PLiteral,
} from "../../mod.ts";
import {
  Currency,
  f,
  generateWithin,
  KeyHash,
  leq,
  Param,
  PConstraint,
  PKeyHash,
  PObject,
  PParam,
  PRecord,
  t,
} from "../mod.ts";
import { EuclidValue, PEuclidValue } from "./euclidValue.ts";
import { gMaxHashes, IdNFT, PIdNFT } from "./idnft.ts";

export class Dirac {
  constructor(
    public readonly owner: KeyHash,
    public readonly threadNFT: IdNFT,
    public readonly paramNFT: IdNFT,
    public readonly lowestPrices: EuclidValue,
  ) {}

  public get assets(): Assets {
    return this.lowestPrices.assets();
  }
  public sharedAssets = (assets: Assets): Assets =>
    this.assets.intersect(assets);

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
    // leq asserts assets match as well
    assert(leq(dirac.lowestPrices.unsigned(), param.highestPrices.unsigned()));
  };

  static generateWith =
    (param: Param, paramNFT: IdNFT, threadNFT: IdNFT) => (): Dirac => {
      const lowestPrices = EuclidValue.fromValue(
        generateWithin(
          param.highestPrices.unit(),
          param.highestPrices.unsigned(),
        ),
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
        lowestPrices: PEuclidValue.ptype,
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
          lowestPrices: PEuclidValue.ptype,
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
