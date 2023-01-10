import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Dirac,
  genAmounts,
  gMaxHashes,
  IdNFT,
  newGenActiveAssets,
  PActiveAssets,
  PAmounts,
  Param,
  PConstraint,
  PIdNFT,
  PList,
  PObject,
  POwner,
  PParam,
  PPositive,
  PPrices,
  PRecord,
  Prices,
} from "../mod.ts";
import { newAssertAmountsCongruent } from "./dirac.ts";

export class PAllDiracs extends PConstraint<PList<PObject<Dirac>>> {
  private constructor(
    public param: Param,
  ) { // TODO issue is that we're manually offsetting below, that't of course incongruent from PPrices-perspective
    const pprices = PPrices.fromParam(param); 
    const pinner = new PList(
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
    );
    super(
      pinner,
      [newAssertDiracsCongruent(param), newAssertAllDiracs(param)], // TODO asserts
      newGenAllDiracs(param),
    );
  }

  static genPType(): PConstraint<PList<PObject<Dirac>>> {
    const param = PParam.genPType().genData();
    return new PAllDiracs(param);
  }
}

const newAssertDiracsCongruent = (param: Param) => (diracs: Dirac[]) => {
  for (const dirac of diracs) {
    newAssertAmountsCongruent(param.baseAmountA0, dirac.prices)(dirac);
  }
};

const newAssertAllDiracs = (param: Param) => (diracs: Dirac[]) => {
  // assert(diracs.length === TODO);
};

export const minTicks = 1n; // per dimension
export const maxTicks = 5n; // per dimension
const PTicks = new PPositive(minTicks, maxTicks);

const newGenAllDiracs = (param: Param) => (): Dirac[] => {
  const assets = param.initialPrices.assets();
  const paramNFT = new IdNFT(param.owner);
  const numTicks = PTicks.genData();

  const numDiracs = Number(numTicks) ** assets.size();
  assert(
    numDiracs <= gMaxHashes,
    `numDiracs: ${numDiracs} must be <= gMaxHashes: ${gMaxHashes}`,
  );

  let threadNFT = paramNFT.next();
  function genDiracForPrices(prices: Prices): Dirac {
      const pprices = PPrices.fromParam(param, prices);
      const genActiveAssets = newGenActiveAssets(pprices);
      return new Dirac(
        param.owner,
        threadNFT.asset(),
        paramNFT.asset(),
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
    assert(
      diracs.length <= gMaxHashes,
      `diracs.length: ${diracs.length} must be <= gMaxHashes: ${gMaxHashes}`,
    );
  }

  return diracs;
};
