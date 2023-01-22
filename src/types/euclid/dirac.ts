import { maybeNdef } from "../../mod.ts";
import { genNonNegative, gMaxLength } from "../../utils/generators.ts";
import {
  Amounts,
  Asset,
  Assets,
  Currency,
  f,
  PAmounts,
  Param,
  PConstraint,
  placeholderCcy,
  PObject,
  PPrices,
  PRecord,
  Prices,
  t,
} from "../mod.ts";
import { ActiveAssets, PActiveAssets } from "./activeAssets.ts";
import { Hash, KeyHash, PKeyHash, POwner } from "./hash.ts";
import { gMaxHashesPerPool, PIdNFT } from "./mod.ts";

export class Dirac {
  constructor(
    public owner: KeyHash,
    public threadNFT: Asset,
    public paramNFT: Asset,
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

  // TODO consider fees here
  static assertWith = (param: Param) => (dirac: Dirac): void => {
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
  };

  static generateAny = (): Dirac => {
    const param = Param.generate();
    return Dirac.generateFresh(param)();
  };

  static generateFresh = (param: Param) => (): Dirac => {
    const owner = param.owner;

    const paramNFT = PIdNFT.fromOwner(
      genNonNegative(PDirac.maxPreviousPools),
      placeholderCcy,
      param.owner,
    ).genData();

    const threadNFT = PIdNFT.fromPrevious(
      placeholderCcy,
      paramNFT,
    ).genData();

    const prices = Prices.generateCurrent(param)();
    const activeAmnts = Amounts.fresh(param, prices);
    const jumpStorage = ActiveAssets.fresh();

    return new Dirac(
      owner,
      threadNFT,
      paramNFT,
      prices,
      activeAmnts,
      jumpStorage,
    );
  };
}

export class PDirac extends PConstraint<PObject<Dirac>> {
  private constructor(
    public readonly param?: Param,
    public readonly contractCurrency = placeholderCcy,
  ) {
    const powner = param ? POwner.pliteral(param.owner) : PKeyHash.ptype;
    const pprices = param ? PPrices.current(param) : PPrices.initial();
    const pthreadNFT = param
      ? PIdNFT.fromOwner(
        PDirac.maxPreviousPools + 1n,
        contractCurrency,
        param.owner,
      )
      : PIdNFT.unparsed(contractCurrency);
    const pparamNFT = param
      ? PIdNFT.fromOwner(
        PDirac.maxPreviousPools,
        contractCurrency,
        param.owner,
      )
      : PIdNFT.unparsed(contractCurrency);
    super(
      new PObject(
        new PRecord({
          "owner": powner,
          "threadNFT": pthreadNFT,
          "paramNFT": pparamNFT,
          "prices": pprices,
          "activeAmnts": PAmounts.ptype,
          "jumpStorage": new PActiveAssets(param),
        }),
        Dirac,
      ),
      param ? [Dirac.assertWith(param)] : [],
      param ? Dirac.generateFresh(param) : Dirac.generateAny,
    );
  }

  static unparsed(contractCurrency: Currency): PDirac {
    return new PDirac(undefined, contractCurrency);
  }

  static fromParam(param: Param, contractCurrency?: Currency): PDirac {
    return new PDirac(param, contractCurrency);
  }

  static genPType(): PConstraint<PObject<Dirac>> {
    const param = maybeNdef(Param.generate)?.();
    return new PDirac(param);
  }

  static maxPreviousPools = 10n; // TODO get this from user later
}

export class DiracDatum {
  constructor(
    public readonly _0: Dirac,
  ) {}
}

export class PDiracDatum extends PObject<DiracDatum> {
  private constructor(
    public readonly pdirac: PDirac,
  ) {
    super(
      new PRecord({
        "_0": pdirac,
      }),
      DiracDatum,
    );
  }

  static unparsed(contractCurrency: Currency): PDiracDatum {
    const pdirac = PDirac.unparsed(contractCurrency);
    return new PDiracDatum(pdirac);
  }

  static fromParam(
    param: Param,
    contractCurrency?: Currency,
  ): PDiracDatum {
    const pdirac = PDirac.fromParam(param, contractCurrency);
    return new PDiracDatum(pdirac);
  }

  static genPType(): PObject<DiracDatum> {
    const pdirac = PDirac.genPType() as PDirac;
    return new PDiracDatum(pdirac);
  }
}
