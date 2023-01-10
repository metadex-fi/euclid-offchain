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
  newUnionWith,
  PConstraint,
  PositiveValue,
  PPositiveValue,
  PPrices,
  Prices,
  t,
} from "../mod.ts";

export type Amounts = PositiveValue;
export class PAmounts extends PConstraint<PPositiveValue> {
  constructor(
    public baseAmountA0: bigint,
    public pprices: PPrices,
  ) {
    super(
      new PPositiveValue(pprices.initialPrices.assets()),
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
    return `PObject: PAmounts (
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
() => {
  const prices = pprices.genData();
  return genAmounts(baseAmountA0, prices);
};

export const genAmounts = (
  baseAmountA0: Amount,
  prices: Prices,
) => {
  assert(
    prices.size() >= 2n,
    `genAmounts: less than two assets in ${prices.concise()}`,
  );
  const assets = prices.assets();
  const A0 = assets.head();
  const p0 = prices.amountOf(A0);
  let netWorth = baseAmountA0 * p0;
  const amounts = new PositiveValue();

  for (const asset of assets.tail().toList()) {
    const p = prices.amountOf(asset);
    const received = genNonNegative(netWorth / p);
    const spent = received * p;
    if (received <= maxInteger && received > 0n && spent > 0n) {
      netWorth -= spent;
      amounts.initAmountOf(asset, received);
    }
  }
  const remainingA0 = netWorth / p0 + (netWorth % p0 === 0n ? 0n : 1n);
  if (remainingA0 > 0n) amounts.initAmountOf(A0, remainingA0);
  return amounts;
};
