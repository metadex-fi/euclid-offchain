import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  PaymentKeyHash,
  PConstraint,
  PList,
  PObject,
  PRecord,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { genActiveAssets } from "../../tests/generators.ts";
import { ActiveAssets, newPActiveAssets } from "./activeAssets.ts";
import { Asset, numAssets } from "./asset.ts";
import {
  gMaxHashes,
  IdNFT,
  newIdNFT,
  newPParamNFT,
  newPThreadNFT,
  nextThreadNFT,
} from "./idnft.ts";
import { Param } from "./param.ts";
import { Amount, newPAmount, newPPaymentKeyHashLiteral } from "./primitive.ts";
import {
  addAmount,
  amountOf,
  Amounts,
  assetsOf,
  genAmounts,
  newPAmounts,
  newPPrices,
  PPrices,
  Prices,
} from "./value.ts";

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
      "activeAmnts": newPAmounts(param.baseAmountA0, pprices),
      "jumpStorage": newPActiveAssets(
        assets,
        param.initialPrices,
        param.lowerPriceBounds,
        param.upperPriceBounds,
        param.jumpSizes,
      ),
    }),
    Dirac,
  );

  return new PConstraint(
    pinner,
    [], // TODO asserts
    newGenDirac(param, pinner),
  );
};

const newGenDirac = (param: Param, pinner: PObject<Dirac>) => (): Dirac => {
  const inner = pinner.genData();

  return new Dirac(
    inner.owner,
    inner.threadNFT,
    inner.paramNFT,
    inner.prices,
    genAmounts(param.baseAmountA0, inner.prices),
    genActiveAssets(inner.prices, param.jumpSizes),
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

  let threadNFT = nextThreadNFT(paramNFT);
  const prices = param.initialPrices;
  let diracs = [
    new Dirac(
      param.owner,
      threadNFT,
      paramNFT,
      prices,
      genAmounts(param.baseAmountA0, prices),
      genActiveAssets(prices, param.jumpSizes),
    ),
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
            new Dirac(
              param.owner,
              threadNFT,
              paramNFT,
              prices,
              genAmounts(param.baseAmountA0, prices),
              genActiveAssets(prices, param.jumpSizes),
            ),
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
