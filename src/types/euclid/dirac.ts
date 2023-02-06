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
  Param,
  PKeyHash,
  PObject,
  PRecord,
  t,
} from "../mod.ts";
import { EuclidValue, PEuclidValue } from "./euclidValue.ts";
import { IdNFT, PIdNFT } from "./idnft.ts";

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

  static generateFrom = (
    param: Param,
    paramNFT: IdNFT,
    numDiracs: bigint,
  ): Dirac => {
    const threadNFT = PIdNFT.pthreadNFT(
      paramNFT,
      numDiracs,
    ).genData();

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
  constructor() {
    super(
      new PRecord({
        owner: PKeyHash.ptype,
        threadNFT: PAsset.ptype,
        paramNFT: PAsset.ptype,
        lowestPrices: PEuclidValue.ptype,
      }),
      Dirac,
    );
  }

  static ptype = new PPreDirac();
  static genPType(): PObject<Dirac> {
    return PPreDirac.ptype;
  }
}

export class PDirac extends PObject<Dirac> {
  constructor(
    public readonly param: Param,
    public readonly paramNFT: IdNFT,
    public readonly numDiracs: bigint,
  ) {
    assert(numDiracs > 0n, "PDirac.numDiracs must be positive");
    const pparamNFT = PIdNFT.pparamNFT(paramNFT);
    const pthreadNFT = PIdNFT.pthreadNFT(paramNFT, numDiracs);
    super(
      new PRecord({
        owner: new PLiteral<PKeyHash>(PKeyHash.ptype, param.owner),
        threadNFT: pthreadNFT,
        paramNFT: pparamNFT,
        lowestPrices: PEuclidValue.ptype,
      }),
      Dirac,
    );
  }

  public genData = (): Dirac => {
    return Dirac.generateFrom(this.param, this.paramNFT, this.numDiracs);
  };

  static genPType(): PDirac {
    const param = Param.generate();
    const paramNFT = new IdNFT(
      Currency.dummy,
      param.owner.hash().hash(genNonNegative()),
    );
    return new PDirac(param, paramNFT, genPositive());
  }
}
