import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Amounts,
  Asset,
  newUnionWith,
  PAmounts,
  Param,
  PConstraint,
  PIdNFT,
  PObject,
  PPrices,
  PRecord,
  Prices,
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

  // TODO consider fees here
  static assertWith = (param: Param) => (dirac: Dirac): void => {
    Prices.assertWith(param)(dirac.prices);

    const prices_ = dirac.prices.unsigned();
    const worth = newUnionWith(
      (amnt: bigint, price: bigint) => price * amnt,
      0n,
      0n,
    );
    const total = worth(
      dirac.activeAmnts.unsigned(),
      prices_,
    ).sumAmounts();
    const lower = param.baseAmountA0 * prices_.firstAmount();
    const upper = lower + prices_.firstAmount();
    assert(
      lower <= total && total <= upper,
      `expected ${lower} <= ${total} <= ${upper} with
baseAmountA0: ${param.baseAmountA0},
baseAsset: ${prices_.firstAsset().show()},
prices: ${dirac.prices.concise()},
activeAmnts: ${dirac.activeAmnts.concise()}`,
    );
  };

  static generateWith = (param: Param) => (): Dirac => {
    const owner = param.owner;
    const threadNFT = PIdNFT.newPThreadNFT(owner).genData();
    const paramNFT = PIdNFT.newPParamNFT(owner).genData();
    const prices = Prices.generateWith(param)();
    const activeAmnts = Amounts.generateWith(param, prices)();
    const jumpStorage = ActiveAssets.generateWith(param)();

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
    public readonly param: Param,
  ) {
    super(
      new PObject(
        new PRecord({
          "owner": POwner.pliteral(param.owner),
          "threadNFT": PIdNFT.newPThreadNFT(param.owner),
          "paramNFT": PIdNFT.newPParamNFT(param.owner),
          "prices": new PPrices(param),
          "activeAmnts": PAmounts.ptype,
          "jumpStorage": new PActiveAssets(param),
        }),
        Dirac,
      ),
      [Dirac.assertWith(param)],
      Dirac.generateWith(param),
    );
  }

  static genPType(): PConstraint<PObject<Dirac>> {
    const param = Param.generate();
    return new PDirac(param);
  }
}

export class DiracDatum {
  constructor(
    public _0: Dirac,
  ) {}
}
export class PDiracDatum extends PObject<DiracDatum> {
  constructor(
    public pdirac: PDirac,
  ) {
    super(
      new PRecord({
        "_0": pdirac,
      }),
      DiracDatum,
    );
  }

  static genPType(): PObject<DiracDatum> {
    const pdirac = PDirac.genPType() as PDirac;
    return new PDiracDatum(pdirac);
  }
}
