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
    public prices: Prices,
  ) {
    super(
      new PPositiveValue(prices.assets()),
      [newAssertAmountsCongruent(baseAmountA0, prices)], // TODO only looking at datums, include values
      newGenAmounts(baseAmountA0, prices),
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
${ttf}prices: ${this.prices.concise(ttf)}
${tt})`;
  };

  static genPType(): PConstraint<PPositiveValue> {
    const baseAmountA0 = genPositive();
    const pprices = PPrices.genPType();
    const prices = pprices.genData();

    return new PAmounts(baseAmountA0, prices);
  }
}

// TODO consider fees here
const newAssertAmountsCongruent =
  (baseAmountA0: bigint, prices: Prices) => (amounts: Amounts): void => {
    const prices_ = prices.unsigned();
    const worth = newUnionWith(
      (amnt: bigint, price: bigint) => price * amnt,
      0n,
      0n,
    );
    const total = worth(
      amounts.unsigned(),
      prices_,
    ).sumAmounts();
    const lower = baseAmountA0 * prices_.firstAmount();
    const upper = lower + prices_.firstAmount();
    assert(
      lower <= total && total <= upper,
      `expected ${lower} <= ${total} <= ${upper} with
baseAmountA0: ${baseAmountA0},
baseAsset: ${prices_.firstAsset().show()},
prices: ${prices.concise()},
activeAmnts: ${amounts.concise()}`,
    );
  };

const newGenAmounts = (
  baseAmountA0: Amount,
  prices: Prices,
) =>
() => {
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
