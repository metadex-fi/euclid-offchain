import { genNumber } from "../../utils/testing/generators.ts";
import {
  Amount,
  Asset,
  Assets,
  assetsOf,
  PConstraint,
  PPositiveValue,
  PPrices,
  Prices,
  Value,
} from "../mod.ts";

export type Amounts = Value;
export type PAmounts = PConstraint<PPositiveValue>;
export const newPAmounts = (
  assets: Assets,
  baseAmountA0: bigint,
  pprices: PPrices,
): PAmounts => {
  const pinner = newPPositiveValue(assets);

  return new PConstraint(
    pinner,
    [], //[newAssertAmountsCongruent(baseAmountA0, pprices)], // TODO only looking at Datums, add Values
    newGenAmounts(baseAmountA0, pprices),
  );
};

const newGenAmounts = (
  baseAmountA0: Amount,
  pprices: PPrices,
) =>
(): Value => genAmounts(baseAmountA0, pprices.genData());

export const genAmounts = (baseAmountA0: Amount, prices: Prices): Amounts => {
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
