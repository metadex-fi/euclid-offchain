import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNumber,
  PConstraint,
  PType,
} from "../../../refactor_parse/lucid/src/mod.ts";
import {
  Asset,
  Assets,
  firstAsset,
  randomAssetsOf,
  tailAssets,
} from "./asset.ts";
import { PPrices, Prices } from "./prices.ts";
import {
  Amount,
  CurrencySymbol,
  newPAmount,
  PAmount,
  TokenName,
} from "./primitive.ts";
import {
  amountOf,
  assetsOf,
  newValue,
  PValue,
  setAmountOf,
  Value,
} from "./value.ts";

export type Amounts = Value;
export type PAmounts = PConstraint<PValue>;
export const newPAmounts = (
  baseAmountA0: bigint,
  pprices: PPrices,
): PAmounts => {
  const assets = assetsOf(pprices.pamounts);
  const pinner = new PValue(assets, undefined, undefined, 1n);
  // const asserts = []; // TODO asserts, ideally inverse to the other stuff

  return new PConstraint(
    pinner,
    [],
    newGenAmounts(baseAmountA0, pprices),
  );
};

const newGenAmounts = (baseAmountA0: bigint, pprices: PPrices) => (): Value => {
  const prices = pprices.genData();
  return genAmounts(baseAmountA0, prices);
};

export function genAmounts(
  baseAmountA0: bigint,
  prices: Prices,
): Value {
  const assets = assetsOf(prices);
  const denom = firstAsset(assets)!;
  const nonzero = randomAssetsOf(assets);
  const p0 = amountOf(prices, denom)!;
  const amounts = newValue();
  let amountA0 = baseAmountA0;
  for (const [ccy, tkns] of tailAssets(nonzero)) {
    for (const tkn of tkns) {
      const asset = new Asset(ccy, tkn);
      const tradedA0 = BigInt(genNumber(Number(amountA0)));
      amountA0 -= tradedA0;
      const p = amountOf(prices, asset)!;
      setAmountOf(amounts, asset, (tradedA0 * p) / p0);
    }
  }
  const p = amountOf(prices, firstAsset(nonzero))!;
  setAmountOf(amounts, firstAsset(nonzero), (amountA0 * p) / p0);
  return amounts;
}

export type JumpSizes = Amounts;
export type PJumpSizes = PAmounts;
export const newPJumpSizes = newPAmounts;
