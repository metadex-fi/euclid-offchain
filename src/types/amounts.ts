import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNumber,
  PConstraint,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Asset, firstAsset, randomAssetsOf, tailAssets } from "./asset.ts";
import { PPrices, Prices } from "./prices.ts";
import { Amount } from "./primitive.ts";
import {
  amountOf,
  assetsOf,
  mulValues,
  newPPositiveValue,
  newValue,
  PPositiveValue,
  setAmountOf,
  sumAmounts,
  Value,
} from "./value.ts";

export type Amounts = Value;
export type PAmounts = PConstraint<PPositiveValue>;
export const genPAmounts = (
  baseAmountA0: bigint,
  pprices: PPrices,
): PAmounts => {
  const prices = pprices.genData();
  const assets = assetsOf(prices);
  const pinner = newPPositiveValue(assets);

  return new PConstraint(
    pinner,
    [newAssertAmountsCongruent(baseAmountA0, prices)], // TODO only looking at Datums, add Values
    newGenAmounts(baseAmountA0, prices),
  );
};

// TODO consider fees
const newAssertAmountsCongruent =
  (baseAmountA0: Amount, prices: Prices) => (amounts: Amounts): void => {
    const total = sumAmounts(mulValues(amounts, prices));
    assert(
      total === baseAmountA0,
      `total ${total} !== baseAmountA0 ${baseAmountA0}`,
    );
  };

const newGenAmounts = (
  baseAmountA0: Amount,
  prices: Prices,
) =>
(): Value => {
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
};
