import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNonNegative, genPositive } from "../../utils/generators.ts";
import {
  Amounts,
  Asset,
  Assets,
  Currency,
  f,
  PAmounts,
  Param,
  PAsset,
  PConstraint,
  PObject,
  PPrices,
  PRecord,
  Prices,
  t,
  Token,
} from "../mod.ts";
import { ActiveAssets, PActiveAssets } from "./activeAssets.ts";
import { KeyHash, PKeyHash, POwner } from "./hash.ts";
import { IdNFT } from "./idnft.ts";
import { PIdNFT } from "./mod.ts";

export class Dirac {
  constructor(
    public owner: KeyHash,
    public threadNFT: IdNFT,
    public paramNFT: IdNFT,
    public prices: Prices,
    public activeAmnts: Amounts,
    public jumpStorage: ActiveAssets,
  ) {}

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Dirac(
${ttf}owner: ${this.owner},
${ttf}threadNFT: ${this.threadNFT.show()},
${ttf}paramNFT: ${this.paramNFT.show()},
${ttf}currentPrices: ${this.prices.concise(ttf)},
${ttf}activeAmnts: ${this.activeAmnts.concise(ttf)},
${ttf}jumpStorage: ${this.jumpStorage.show(ttf)},
${tt})`;
  };

  public assets = (): Assets => this.prices.assets();
  public sharedAssets = (assets: Assets): Assets =>
    this.assets().intersect(assets);

  // TODO consider fees here
  // static assertWith = (param: Param) => (dirac: Dirac): void => {
  // TODO FIXME
  //     const prices = dirac.prices.signed();
  //     const equivalentA0 = dirac.activeAmnts.equivalentA0(prices);
  //     // const lower = param.baseAmountA0 * prices.firstAmount();
  //     // const upper = lower + prices.firstAmount();
  //     assert(
  //       // lower <= equivalentA0 && equivalentA0 <= upper,
  //       // `expected ${lower} <= ${equivalentA0} <= ${upper} with
  //       param.baseAmountA0 === equivalentA0,
  //       `expected ${param.baseAmountA0} === ${equivalentA0} with
  // baseAmountA0: ${param.baseAmountA0},
  // A1: ${prices.firstAsset().show()},
  // prices: ${dirac.prices.concise()},
  // activeAmnts: ${dirac.activeAmnts.concise()}`,
  //     );
  // };

  static generateFresh =
    (param: Param, paramNFT: IdNFT, numDiracs: bigint) => (): Dirac => {
      const threadNFT = PIdNFT.pthreadNFT(
        paramNFT,
        numDiracs,
      ).genData();
      const prices = Prices.generateCurrent(param)();
      const activeAmnts = Amounts.fresh(param, prices);
      const jumpStorage = ActiveAssets.fresh();

      return new Dirac(
        param.owner,
        threadNFT,
        paramNFT,
        prices,
        activeAmnts,
        jumpStorage,
      );
    };
}

export class PPreDirac extends PObject<Dirac> {
  constructor() {
    const pprices = PPrices.initial();
    super(
      new PRecord({
        "owner": PKeyHash.ptype,
        "threadNFT": PAsset.ptype,
        "paramNFT": PAsset.ptype,
        "prices": pprices,
        "activeAmnts": PAmounts.ptype,
        "jumpStorage": new PActiveAssets(pprices),
      }),
      Dirac,
    );
  }

  static ptype = new PPreDirac();
  static genPType(): PObject<Dirac> {
    return PPreDirac.ptype;
  }
}

export class PDirac extends PConstraint<PObject<Dirac>> {
  constructor(
    public readonly param: Param,
    public readonly paramNFT: IdNFT,
    public readonly numDiracs: bigint,
  ) {
    assert(numDiracs > 0n, "PDirac.numDiracs must be positive");
    const pparamNFT = PIdNFT.pparamNFT(paramNFT);
    const pthreadNFT = PIdNFT.pthreadNFT(paramNFT, numDiracs);
    const pprices = param ? PPrices.current(param) : PPrices.initial();
    super(
      new PObject(
        new PRecord({
          "owner": POwner.pliteral(param.owner),
          "threadNFT": pthreadNFT,
          "paramNFT": pparamNFT,
          "prices": pprices,
          "activeAmnts": PAmounts.ptype,
          "jumpStorage": new PActiveAssets(pprices),
        }),
        Dirac,
      ),
      [], // asserts for PConstraint<PObject<O>> belong in Constructor of O
      Dirac.generateFresh(param, paramNFT, numDiracs),
    );
  }

  static genPType(): PConstraint<PObject<Dirac>> {
    const param = Param.generate();
    const paramNFT = new IdNFT(
      Currency.dummy,
      param.owner.hash().hash(genNonNegative()),
    );
    return new PDirac(param, paramNFT, genPositive());
  }
}

export class DiracDatum {
  constructor(
    public readonly _0: Dirac,
  ) {}
}

export class PDiracDatum extends PObject<DiracDatum> {
  private constructor(
    public readonly pdirac: PDirac | PPreDirac,
  ) {
    super(
      new PRecord({
        "_0": pdirac,
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
