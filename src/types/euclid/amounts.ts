import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNonNegative, maxInteger } from "../../mod.ts";
import { Param, PObject, PRecord, Value } from "../mod.ts";
import { Prices } from "./prices.ts";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.ts";

export class Amounts {
  constructor(
    private value: PositiveValue,
  ) {}

  public unsigned = (): Value => this.value.unsigned();
  public concise = (tabs = ""): string => `Amounts ${this.value.concise(tabs)}`;

  static generateWith = (param: Param, prices: Prices) => (): Amounts => {
    assert(
      prices.size() >= 2n,
      `genAmounts: less than two assets in ${prices.concise()}`,
    );
    const assets = prices.assets();
    const A0 = assets.head();
    const p0 = prices.amountOf(A0);
    let netWorth = param.baseAmountA0 * p0;
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
    return new Amounts(amounts);
  };
}

export class PAmounts extends PObject<Amounts> {
  private constructor() {
    super(
      new PRecord({
        value: new PPositiveValue(),
      }),
      Amounts,
    );
    // this.population = 1; //probably far too conservative, but nonissue
  }

  static ptype = new PAmounts();
  static genPType(): PObject<Amounts> {
    return PAmounts.ptype;
  }
}
