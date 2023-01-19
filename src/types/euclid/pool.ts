import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Amounts,
  Dirac,
  Param,
  PConstraint,
  PDirac,
  PList,
  PObject,
  PositiveValue,
  PParam,
  PRecord,
  Prices,
} from "../mod.ts";
import { ActiveAssets } from "./activeAssets.ts";
import { ParamNFT } from "./idnft.ts";

export class Pool {
  constructor(
    public readonly param: Param,
    public readonly diracs: Dirac[],
  ) {}

  static generateWith(
    owner: PaymentKeyHash,
    balance: Amounts,
    paramNFT: ParamNFT,
  ): Pool {
    assert(
      balance.size() > 1n,
      `Pool.generateWith: less than 2 assets in balance: ${balance.concise()}`,
    );
    const deposit = balance.minSizedSubAmounts(2n);
    const assets = deposit.assets();
    const initialPrices = PositiveValue.genOfAssets(assets);
    const firstDiracPrices = PositiveValue.genOfAssets(assets);
    const depositA0equivalent = deposit.equivalentA0(firstDiracPrices);
    const tickSizes = PositiveValue.genOfAssets(assets);

    let lowerPriceBounds = firstDiracPrices.clone();
    let upperPriceBounds = firstDiracPrices.clone();
    let threadNFT = paramNFT.next();

    const diracs = [
      new Dirac(
        owner,
        threadNFT.asset,
        paramNFT.asset,
        new Prices(firstDiracPrices),
        Amounts.fresh(),
        ActiveAssets.fresh(),
      ),
    ];

    const param = new Param(
      owner,
      jumpSizes,
      new Prices(initialPrices),
      lowerPriceBounds,
      upperPriceBounds,
      baseAmountA0,
    );

    return new Pool(param, diracs);
  }
}

// export class PPool extends PConstraint<PObject<Pool>>{
//     private constructor(
//     ) {
//         super(
//             new PObject(
//                 new PRecord({
//                     "param": PParam.ptype,
//                     "diracs": new PList(PDirac.ptype),
//                 }),
//                 Pool
//             ),
//             [],
//             () => {}
//         )
//     }
// }
