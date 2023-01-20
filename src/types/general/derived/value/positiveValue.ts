import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Assets as LucidAssets } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { genPositive } from "../../../../mod.ts";
import { PObject, PRecord } from "../../mod.ts";
import { Asset, Assets, CurrencySymbol, TokenName } from "../asset.ts";
import { PPositive } from "../bounded.ts";
import { newAmountsCheck, newBoundedWith, PValue, Value } from "./value.ts";

export const allPositive = newAmountsCheck((a) => a > 0n);

export class PositiveValue {
  constructor(
    private value = new Value(),
  ) {
    assert(allPositive(value), "value must be positive");
  }

  public initAmountOf = (asset: Asset, amount: bigint): void => {
    assert(
      amount >= 0n,
      `initAmountOf: amount must be positive, got ${amount} for asset ${asset.show()}`,
    );
    this.value?.initAmountOf(asset, amount);
  };

  public concise = (tabs = ""): string => `+${this.value.concise(tabs)}`;
  public show = (tabs = ""): string =>
    `PositiveValue (\n${this.value.show(tabs)}\n)`;
  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> =>
    this.value.toMap();
  public assets = (): Assets => this.value.assets();
  public unsigned = (): Value => new Value(this.value.toMap());
  public unit = (): Value => this.value.unit();
  public zeroed = (): Value => this.value.zeroed();
  public size = (): bigint => this.value.size();
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public firstAmount = (): bigint => this.value.firstAmount();
  public setAmountOf = (asset: Asset, amount: bigint): void =>
    this.value.setAmountOf(asset, amount);
  public clone = (): PositiveValue => new PositiveValue(this.value.clone());
  public scaledWith = (factor: bigint): PositiveValue =>
    new PositiveValue(this.value.scaledWith(factor));
  public fill = (assets: Assets, amount: bigint): PositiveValue => {
    assert(amount > 0n, `fill: amount must be positive, got ${amount}`);
    return new PositiveValue(this.value.fill(assets, amount));
  };

  public minSizedSubValue = (minSize: bigint): PositiveValue => {
    const assets = this.assets().minSizedSubset(minSize);
    const value = new PositiveValue();
    assets.forEach((asset) => {
      const amount = this.amountOf(asset);
      value.initAmountOf(asset, genPositive(amount));
    });
    return value;
  };

  static maybeFromMap = (
    m?: Map<CurrencySymbol, Map<TokenName, bigint>>,
  ): PositiveValue | undefined => {
    if (m === undefined) return undefined;
    else return new PositiveValue(new Value(m));
  };

  static genOfAssets = (
    assets: Assets,
    ppositive = new PPositive(),
  ): PositiveValue => {
    const value = new Value();
    assets.forEach((asset) => {
      value.initAmountOf(asset, ppositive.genData());
    });
    return new PositiveValue(value);
  };
}

export const boundPositive = newBoundedWith(new PPositive());

export class PPositiveValue extends PObject<PositiveValue> {
  constructor(
    public pnum = new PPositive(),
  ) {
    super(
      new PRecord({
        value: new PValue(pnum),
      }),
      PositiveValue,
    );
  }

  static genPType(): PPositiveValue {
    const pnum = PPositive.genPType();
    return new PPositiveValue(pnum);
  }

  // static pliteral(
  //   value: PositiveValue,
  // ): PLiteral<PPositiveValue> {
  //   return new PLiteral(
  //     new PPositiveValue(),
  //     value,
  //   );
  // }
}
