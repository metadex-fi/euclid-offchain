import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PLiteral, PObject, PRecord } from "../../mod.ts";
import { Asset, Assets, CurrencySymbol, TokenName } from "../asset.ts";
import { PPositive } from "../bounded.ts";
import { newAmountsCheck, PValue, Value } from "./value.ts";

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
  public size = (): bigint => this.value.size();
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);

  static maybeFromMap = (
    m?: Map<CurrencySymbol, Map<TokenName, bigint>>,
  ): PositiveValue | undefined => {
    if (m === undefined) return undefined;
    else return new PositiveValue(new Value(m));
  };
}

export class PPositiveValue extends PObject<PositiveValue> {
  constructor(
    public assets: Assets,
    public lowerBounds?: PositiveValue,
    public upperBounds?: PositiveValue,
  ) {
    super(
      new PRecord({
        value: new PValue(
          PPositive,
          assets,
          lowerBounds?.unsigned(),
          upperBounds?.unsigned(),
        ),
      }),
      PositiveValue,
    );
  }

  // public genPositiveValue = (): PositiveValue => {
  //   return new PositiveValue(this.genValue());
  // };

  static genOfAssets(assets: Assets): PPositiveValue {
    const pvalue = PValue.newGenPValue(PPositive, assets)();
    return new PPositiveValue(
      assets,
      pvalue.lowerBounds ? new PositiveValue(pvalue.lowerBounds) : undefined,
      pvalue.upperBounds ? new PositiveValue(pvalue.upperBounds) : undefined,
    );
  }

  static genPType(): PPositiveValue {
    const pvalue = PValue.newGenPValue(PPositive)();
    return new PPositiveValue(
      pvalue.assets,
      pvalue.lowerBounds ? new PositiveValue(pvalue.lowerBounds) : undefined,
      pvalue.upperBounds ? new PositiveValue(pvalue.upperBounds) : undefined,
    );
  }

  static maybePLiteral(
    value?: PositiveValue,
  ): PLiteral<PPositiveValue> | undefined {
    if (value === undefined) return undefined;
    else {return new PLiteral(
        new PPositiveValue(value.assets(), value, value),
        value,
      );}
  }
}
