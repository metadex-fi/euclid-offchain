import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNumber, genPositive } from "../../utils/testing/generators.ts";
import {
  Amount,
  Asset,
  assetsOf,
  PConstraint,
  PositiveValue,
  PPositiveValue,
  PPrices,
  Prices,
} from "../mod.ts";
import { Assets, PAssets } from "./asset.ts";

export type Amounts = PositiveValue;
export class PAmounts extends PConstraint<PPositiveValue> {
  private constructor(
    public assets: Assets,
    public baseAmountA0: bigint,
    public pprices: PPrices,
  ) {
    super(
      new PPositiveValue(assets),
      [], // TODO only looking at datums, include values
      newGenAmounts(baseAmountA0, pprices),
    );
  }

  static genPType(): PConstraint<PPositiveValue> {
    const baseAmountA0 = genPositive();
    const pprices = PPrices.genPType() as PPrices;
    const assets = pprices.assets;

    return new PAmounts(assets, baseAmountA0, pprices);
  }
}

const newGenAmounts = (
  baseAmountA0: Amount,
  pprices: PPrices,
) =>
() => genAmounts(baseAmountA0, pprices.genPrices()).toMap();

const genAmounts = (baseAmountA0: Amount, prices: Prices): Amounts => {
  if (prices.value.size() === 0) {
    return new PositiveValue();
  }
  const assets = assetsOf(prices.value);
  const denom = assets.head()!;
  const nonzero = assets.randomSubset();
  const p0 = prices.value.amountOf(denom);
  const amounts = new PositiveValue();
  let amountA0 = baseAmountA0;
  for (const [ccy, tkns] of nonzero.tail().toMap()) {
    for (const tkn of tkns) {
      const asset = new Asset(ccy, tkn);
      const tradedA0 = BigInt(genNumber(amountA0));
      amountA0 -= tradedA0;
      const p = prices.value.amountOf(asset);
      amounts.initAmountOf(asset, (tradedA0 * p) / p0);
    }
  }
  const p = prices.value.amountOf(nonzero.head())!;
  amounts.initAmountOf(nonzero.head(), (amountA0 * p) / p0);
  return amounts;
};
