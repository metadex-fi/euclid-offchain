import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  ActiveAssets,
  Amounts,
  Asset,
  genAmounts,
  newUnionWith,
  PActiveAssets,
  PAmounts,
  Param,
  PConstraint,
  PIdNFT,
  PObject,
  PParam,
  PPrices,
  PRecord,
  Prices,
} from "../mod.ts";
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
}
export class PDirac extends PConstraint<PObject<Dirac>> {
  private constructor(
    public param: Param,
    public prices: Prices,
  ) {
    const pprices = PPrices.fromParam(param);
    super(
      new PObject(
        new PRecord({
          "owner": POwner.pliteral(param.owner),
          "threadNFT": PIdNFT.newPThreadNFT(param.owner),
          "paramNFT": PIdNFT.newPParamNFT(param.owner),
          "prices": pprices,
          "activeAmnts": new PAmounts(param.baseAmountA0, pprices),
          "jumpStorage": new PActiveAssets(pprices),
        }),
        Dirac,
      ),
      [newAssertAmountsCongruent(param.baseAmountA0, prices)],
      newGenDirac(param, prices),
    );
  }

  static genPType(): PConstraint<PObject<Dirac>> {
    const param = PParam.genPType().genData();
    const prices = PPrices.fromParam(param).genData();
    return new PDirac(param, prices);
  }
}

// TODO consider fees here
export const newAssertAmountsCongruent =
  (baseAmountA0: bigint, prices: Prices) => (dirac: Dirac): void => {
    const prices_ = prices.unsigned();
    const worth = newUnionWith(
      (amnt: bigint, price: bigint) => price * amnt,
      0n,
      0n,
    );
    const total = worth(
      dirac.activeAmnts.unsigned(),
      prices_,
    ).sumAmounts();
    const lower = baseAmountA0 * prices_.firstAmount();
    const upper = lower + prices_.firstAmount();
    assert(
      lower <= total && total <= upper,
      `expected ${lower} <= ${total} <= ${upper} with
baseAmountA0: ${baseAmountA0},
baseAsset: ${prices_.firstAsset().show()},
prices: ${prices.concise()},
activeAmnts: ${dirac.activeAmnts.concise()}`,
    );
  };

const newGenDirac = (param: Param, prices: Prices) => (): Dirac => {
  const pprices = PPrices.fromParam(param);
  return new Dirac(
    param.owner,
    PIdNFT.newPThreadNFT(param.owner).genData(),
    PIdNFT.newPParamNFT(param.owner).genData(),
    prices,
    genAmounts(param.baseAmountA0, prices),
    new PActiveAssets(pprices).genData(),
  );
};

export class DiracDatum {
  constructor(
    public _0: Dirac, // should this be _1?
  ) {}
}
export class PDiracDatum extends PObject<DiracDatum> {
  constructor(
    public pdirac: PDirac,
  ) {
    super(
      new PRecord({
        "_0": pdirac, // should this be _1?
      }),
      DiracDatum,
    );
  }

  static genPType(): PObject<DiracDatum> {
    const pdirac = PDirac.genPType() as PDirac;
    return new PDiracDatum(pdirac);
  }
}
