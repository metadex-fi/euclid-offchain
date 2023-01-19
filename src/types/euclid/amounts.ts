import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNonNegative, maxInteger } from "../../mod.ts";
import {
  Asset,
  Assets,
  mulValues,
  Param,
  PObject,
  PRecord,
  Value,
} from "../mod.ts";
import { Prices } from "./prices.ts";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.ts";
import { Assets as LucidAssets } from "https://deno.land/x/lucid@0.8.6/mod.ts";

export class Amounts {
  constructor(
    private value: PositiveValue,
  ) {}

  public unsigned = (): Value => this.value.unsigned();
  public concise = (tabs = ""): string => `Amounts ${this.value.concise(tabs)}`;
  public size = (): bigint => this.value.size();
  public assets = (): Assets => this.value.assets();
  public firstAmount = (): bigint => this.value.firstAmount();

  public minSizedSubAmounts = (minSize: bigint): Amounts => {
    return new Amounts(this.value.minSizedSubValue(minSize));
  };

  public equivalentA0 = (prices: PositiveValue): bigint => {
    return mulValues(this.unsigned(), prices.unsigned()).mulAmounts();
  };

  static generateFresh = (param: Param) => (prices: Prices): Amounts => {
    const currentPs = prices.unsigned();
    const activeAsset = currentPs.firstAsset() //prices.defaultActiveAsset(param);
    const amount = param.baseAmountA0 * currentPs.firstAmount() /
      currentPs.amountOf(activeAsset);
    const amounts = new PositiveValue();
    amounts.initAmountOf(activeAsset, amount); // TODO this will probably crash out of the box, because when 0es
    return new Amounts(amounts);
  };

  static generateUsed = (param: Param) => (prices: Prices): Amounts => {
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

  static fromLucid(assets: LucidAssets): Amounts {
    const value = new Value();
    Object.entries(assets).forEach(([name, amount]) => {
      const asset = Asset.fromLucid(name);
      value.initAmountOf(asset, amount);
    });
    return new Amounts(new PositiveValue(value));
  }
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
