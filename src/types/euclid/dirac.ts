import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  ActiveAssets,
  Amount,
  Amounts,
  genAmounts,
  gMaxHashes,
  IdNFT,
  mulValues,
  newGenActiveAssets,
  PActiveAssets,
  PAmounts,
  Param,
  PConstraint,
  PIdNFT,
  PList,
  PObject,
  PParam,
  PPositive,
  PPrices,
  PRecord,
  Prices,
} from "../mod.ts";
import { POwner } from "./owner.ts";

export class Dirac {
  constructor(
    public owner: PaymentKeyHash,
    public threadNFT: IdNFT,
    public paramNFT: IdNFT,
    public prices: Prices,
    public activeAmnts: Amounts,
    public jumpStorage: ActiveAssets,
  ) {}
}
export class PDirac extends PConstraint<PObject<Dirac>> {
  constructor(
    public param: Param,
  ) {
    const pprices = PPrices.fromParam(param);
    const pinner = new PObject(
      new PRecord({
        "owner": POwner.pliteral(param.owner),
        "threadNFT": PIdNFT.newPThreadNFT(param.owner),
        "paramNFT": PIdNFT.newPParamNFT(param.owner),
        "prices": pprices,
        "activeAmnts": new PAmounts(param.baseAmountA0, pprices),
        "jumpStorage": new PActiveAssets(pprices),
      }),
      Dirac,
    );

    super(
      pinner,
      [newAssertAmountsCongruent(param.baseAmountA0)], // <- the only reason for PConstraint
      pinner.genData,
    );
  }

  static genPType(): PConstraint<PObject<Dirac>> {
    const param = PParam.genPType().genData();
    return new PDirac(param);
  }
}

// TODO consider fees here
const newAssertAmountsCongruent =
  (baseAmountA0: Amount) => (dirac: Dirac): void => {
    const total = mulValues(
      dirac.prices.unsigned(),
      dirac.activeAmnts.unsigned(),
    ).sumAmounts();
    assert(
      total === baseAmountA0,
      `total ${total} !== baseAmountA0 ${baseAmountA0}`,
    );
  };

export class PAllDiracs extends PConstraint<PList<PDirac>> {
  constructor(
    public param: Param,
  ) {
    const pinner = new PList(new PDirac(param));
    super(
      pinner,
      [], // TODO asserts
      newGenAllDiracs(param),
    );
  }

  static genPType(): PConstraint<PList<PDirac>> {
    const param = PParam.genPType().genData();
    return new PAllDiracs(param);
  }
}

export const minTicks = 1n; // per dimension
export const maxTicks = 5n; // per dimension
const PTicks = new PPositive(minTicks, maxTicks);

const newGenAllDiracs = (param: Param) => (): Dirac[] => {
  const assets = param.initialPrices.assets();
  const paramNFT = new IdNFT(param.owner);
  const numTicks = PTicks.genData();

  const numDiracs = Number(numTicks) ** assets.size();
  assert(numDiracs <= gMaxHashes, "too many diracs");

  let threadNFT = paramNFT.next();
  function genDiracForPrices(prices: Prices): Dirac {
    const pprices = PPrices.fromParam(param);
    const genActiveAssets = newGenActiveAssets(pprices);
    return new Dirac(
      param.owner,
      threadNFT,
      paramNFT,
      prices,
      genAmounts(param.baseAmountA0, prices),
      genActiveAssets(),
    );
  }

  const prices = param.initialPrices;
  let diracs = [
    genDiracForPrices(prices),
  ];
  // for each asset and for each existing dirac, "spread" that dirac
  // in that asset's dimension. "spread" means: add all other tick
  // offsets for that asset's price.
  for (const asset of assets.toList()) {
    const jumpSize = param.jumpSizes.amountOf(asset);
    const tickSize = jumpSize / numTicks;
    const diracs_ = new Array<Dirac>();
    diracs.forEach((dirac) => {
      for (let offset = tickSize; offset < jumpSize; offset += tickSize) {
        threadNFT = threadNFT.next();
        const prices = dirac.prices.addAmountOf(asset, offset);
        diracs_.push(
          genDiracForPrices(prices),
        );
      }
    });
    diracs = diracs.concat(diracs_);
  }

  return diracs;
};

export class DiracDatum {
  constructor(
    public _0: Dirac, // should this be _1?
  ) {}
}
export class PDiracDatum extends PObject<DiracDatum> {
  constructor(
    public param: Param,
  ) {
    super(
      new PRecord({
        "_0": new PDirac(param), // should this be _1?
      }),
      DiracDatum,
    );
  }

  static genPType(): PObject<DiracDatum> {
    const param = PParam.genPType().genData();
    return new PDiracDatum(param);
  }
}
