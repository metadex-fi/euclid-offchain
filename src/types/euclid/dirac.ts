import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  addAmount,
  Amount,
  Amounts,
  Asset,
  assetsOf,
  gMaxHashes,
  IdNFT,
  newIdNFT,
  newPParamNFT,
  newPPaymentKeyHashLiteral,
  newPThreadNFT,
  nextThreadNFT,
  Param,
  PConstraint,
  PList,
  PObject,
  PRecord,
  Prices,
} from "../mod.ts";

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
export type PDirac = PConstraint<PObject<Dirac>>;
export const newPDirac = (param: Param): PDirac => {
  const assets = assetsOf(param.initialPrices);
  const pprices = newPPrices(
    assets,
    param.lowerPriceBounds,
    param.upperPriceBounds,
  );

  const pinner = new PObject(
    new PRecord({
      "owner": newPPaymentKeyHashLiteral(param.owner),
      "threadNFT": newPThreadNFT(param.owner),
      "paramNFT": newPParamNFT(param.owner),
      "prices": pprices,
      "activeAmnts": newPAmounts(assets, param.baseAmountA0, pprices),
      "jumpStorage": newPActiveAssets(param.initialPrices, pprices),
    }),
    Dirac,
  );

  return new PConstraint(
    pinner,
    [newAssertAmountsCongruent(param.baseAmountA0)],
    pinner.genData,
  );
};

// TODO consider fees here
const newAssertAmountsCongruent =
  (baseAmountA0: Amount) => (dirac: Dirac): void => {
    const total = sumAmounts(mulValues(dirac.prices, dirac.activeAmnts));
    assert(
      total === baseAmountA0,
      `total ${total} !== baseAmountA0 ${baseAmountA0}`,
    );
  };

export type PDiracs = PConstraint<PList<PDirac>>;
export const newPDiracs = (param: Param): PDiracs => {
  const pinner = new PList(newPDirac(param));
  return new PConstraint(
    pinner,
    [], // TODO asserts
    newGenAllDiracs(param),
  );
};

export const minTicks = 1n; // per dimension
export const maxTicks = 5n; // per dimension
const PTicks = newPAmount(minTicks, maxTicks);

const newGenAllDiracs = (param: Param) => (): Dirac[] => {
  const assets = assetsOf(param.initialPrices);
  const paramNFT = newIdNFT(param.owner);
  const numTicks = PTicks.genData();

  const numDiracs = Number(numTicks) ** numAssets(assets);
  assert(numDiracs <= gMaxHashes, "too many diracs");

  function genDiracForPrices(prices: Prices): Dirac {
    const pprices = newPPrices(
      assets,
      param.lowerPriceBounds,
      param.upperPriceBounds,
      prices,
      param.jumpSizes,
    );
    const genActiveAssets = newGenActiveAssets(prices, pprices);
    return new Dirac(
      param.owner,
      nextThreadNFT(paramNFT),
      paramNFT,
      prices,
      genAmounts(param.baseAmountA0, prices),
      genActiveAssets(),
    );
  }

  let threadNFT = nextThreadNFT(paramNFT);
  const prices = param.initialPrices;
  let diracs = [
    genDiracForPrices(prices),
  ];
  // for each asset and for each existing dirac, "spread" that dirac
  // in that asset's dimension. "spread" means: add all other tick
  // offsets for that asset's price.
  for (const [ccy, tkns] of assets) {
    for (const tkn of tkns) {
      const asset = new Asset(ccy, tkn);
      const jumpSize = amountOf(param.jumpSizes, asset);
      const tickSize = jumpSize / numTicks;
      const diracs_ = new Array<Dirac>();
      diracs.forEach((dirac) => {
        for (let offset = tickSize; offset < jumpSize; offset += tickSize) {
          threadNFT = nextThreadNFT(threadNFT);
          const prices = addAmount(dirac.prices, asset, offset);
          diracs_.push(
            genDiracForPrices(prices),
          );
        }
      });
      diracs = diracs.concat(diracs_);
    }
  }

  return diracs;
};

export class DiracDatum {
  constructor(
    public _0: Dirac,
  ) {}
}
export type PDiracDatum = PObject<DiracDatum>;
export const newPDiracDatum = (param: Param) => {
  new PObject(
    new PRecord({
      "_0": newPDirac(param),
    }),
    DiracDatum,
  );
};
