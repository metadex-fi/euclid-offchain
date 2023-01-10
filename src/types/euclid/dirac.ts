import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  ActiveAssets,
  Amount,
  Amounts,
  Asset,
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
export class PDirac extends PObject<Dirac> {
  constructor(
    public param: Param,
    public prices: Prices,
  ) {
    const pprices = PPrices.fromParam(param);
    super(
      new PRecord({
        "owner": POwner.pliteral(param.owner),
        "threadNFT": PIdNFT.newPThreadNFT(param.owner),
        "paramNFT": PIdNFT.newPParamNFT(param.owner),
        "prices": PPrices.pliteral(prices), // must be literal, to be congruent with activeAmnts
        "activeAmnts": new PAmounts(param.baseAmountA0, prices),
        "jumpStorage": new PActiveAssets(pprices),
      }),
      Dirac,
    );
  }

  static genPType(): PObject<Dirac> {
    const param = PParam.genPType().genData();
    const prices = PPrices.fromParam(param).genData();
    return new PDirac(param, prices);
  }
}

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
