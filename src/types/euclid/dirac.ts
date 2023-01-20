import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { maxInteger, randomChoice } from "../../mod.ts";
import {
  Amounts,
  Asset,
  f,
  gMaxHashes,
  newUnionWith,
  PAmounts,
  Param,
  ParamNFT,
  PConstraint,
  placeholderCcy,
  PObject,
  PParamNFT,
  PPrices,
  PRecord,
  Prices,
  PThreadNFT,
  t,
  ThreadNFT,
} from "../mod.ts";
import { ActiveAssets, PActiveAssets } from "./activeAssets.ts";
import { POwner } from "./owner.ts";

export class Dirac {
  constructor(
    public owner: PaymentKeyHash,
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

  // TODO consider fees here
  static assertWith = (param: Param) => (dirac: Dirac): void => {
    const prices = dirac.prices.unsigned();
    const worth = newUnionWith(
      (amnt: bigint, price: bigint) => price * amnt,
      0n,
      0n,
    );
    const total = worth(
      dirac.activeAmnts.unsigned(),
      prices,
    ).sumAmounts();
    const lower = param.baseAmountA0 * prices.firstAmount();
    const upper = lower + prices.firstAmount();
    assert(
      lower <= total && total <= upper,
      `expected ${lower} <= ${total} <= ${upper} with
baseAmountA0: ${param.baseAmountA0},
baseAsset: ${prices.firstAsset().show()},
prices: ${dirac.prices.concise()},
activeAmnts: ${dirac.activeAmnts.concise()}`,
    );
  };

  static generateUsed = (param: Param) =>
    Dirac.generateInner(
      param,
      Amounts.generateUsed(param),
      ActiveAssets.generateUsed(param),
    );

  private static generateInner = (
    param: Param,
    generateAmounts: (prices: Prices) => Amounts,
    generateActiveAssets: () => ActiveAssets,
  ) =>
  (): Dirac => {
    const owner = param.owner;

    const paramNFT = ParamNFT.generateWith(
      placeholderCcy,
      param.owner,
      gMaxHashes,
    );
    const threadNFT = ThreadNFT.generateWith(
      paramNFT,
      param.boundedMinDiracs(),
    );

    const prices = Prices.generateCurrent(param)();
    const activeAmnts = generateAmounts(prices);
    const jumpStorage = generateActiveAssets();

    return new Dirac(
      owner,
      threadNFT.asset,
      paramNFT.asset,
      prices,
      activeAmnts,
      jumpStorage,
    );
  };
}
export class PDirac extends PConstraint<PObject<Dirac>> {
  private constructor(
    public readonly param: Param,
  ) {
    super(
      new PObject(
        new PRecord({
          "owner": POwner.pliteral(param.owner),
          "threadNFT": new PThreadNFT(
            placeholderCcy,
            param.owner,
            maxInteger,
          ),
          "paramNFT": new PParamNFT(
            placeholderCcy,
            param.owner,
            maxInteger,
          ),
          "prices": PPrices.current(param),
          "activeAmnts": PAmounts.ptype,
          "jumpStorage": new PActiveAssets(param),
        }),
        Dirac,
      ),
      [Dirac.assertWith(param)],
      Dirac.generateUsed(param),
    );
  }

  static fromParam(param: Param): PDirac {
    return new PDirac(param);
  }

  static genPType(): PConstraint<PObject<Dirac>> {
    const param = Param.generate();
    return new PDirac(param);
  }
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

  static fromParam(param: Param): PDiracDatum {
    const pdirac = PDirac.fromParam(param);
    return new PDiracDatum(pdirac);
  }

  static genPType(): PObject<DiracDatum> {
    const pdirac = PDirac.genPType() as PDirac;
    return new PDiracDatum(pdirac);
  }
}
