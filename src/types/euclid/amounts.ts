import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genPositive,
  maxInteger,
} from "../../utils/testing/generators.ts";
import {
  Amount,
  Asset,
  f,
  PConstraint,
  PositiveValue,
  PPositiveValue,
  PPrices,
  Prices,
  t,
} from "../mod.ts";

export type Amounts = PositiveValue;
export class PAmounts extends PConstraint<PPositiveValue> {
  private constructor(
    public baseAmountA0: bigint,
    public pprices: PPrices,
  ) {
    super(
      new PPositiveValue(pprices.assets),
      [], // TODO only looking at datums, include values
      newGenAmounts(baseAmountA0, pprices),
    );
    this.population = 1; //probably far too conservative, but nonissue
  }

  public showData = (
    data: PositiveValue,
    tabs = "",
  ): string => {
    return `Amount ${data.concise(tabs)}`;
  };

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `PAmounts (
${ttf}population: ${this.population},
${ttf}baseAmountA0: ${this.baseAmountA0},
${ttf}pprices: ${this.pprices.showPType(ttf)}
${tt})`;
  };

  static genPType(): PConstraint<PPositiveValue> {
    const baseAmountA0 = genPositive();
    const pprices = PPrices.genPType() as PPrices;

    return new PAmounts(baseAmountA0, pprices);
  }
}

const newGenAmounts = (
  baseAmountA0: Amount,
  pprices: PPrices,
) =>
() => genAmounts(baseAmountA0, pprices.genData());

const genAmounts = (baseAmountA0: Amount, prices: Prices): Amounts => {
  assert(
    prices.size() >= 2n,
    `genAmounts: less than two assets in ${prices.concise()}`,
  );
  const assets = prices.assets();
  const denom = assets.head();
  const nonzero = assets.nonEmptySubset();
  const p0 = prices.amountOf(denom);
  const amounts = new PositiveValue();
  let amountA0 = baseAmountA0;
  for (const [ccy, tkns] of nonzero.tail().toMap()) {
    for (const tkn of tkns) {
      const asset = new Asset(ccy, tkn);
      const p = prices.amountOf(asset);
      const tradedA0 = genNonNegative(amountA0);
      const received = (tradedA0 * p) / p0;
      if (received <= maxInteger && received > 0n) {
        amountA0 -= tradedA0;
        amounts.initAmountOf(asset, received);
      }
    }
  }
  const p = prices.amountOf(nonzero.head())!;
  const firstAmnt = (amountA0 * p) / p0;
  // if the amount of the first asset is too large, use the
  // base amount, as we know that to be within global bounds
  if (firstAmnt <= maxInteger && firstAmnt > 0n) {
    amounts.initAmountOf(nonzero.head(), firstAmnt);
  } else if (amountA0 > 0n) {
    amounts.initAmountOf(denom, amountA0);
  }
  return amounts;
};
