import {
  Assets,
  CurrencySymbol,
  PositiveValue,
  TokenName,
  Value,
} from "../mod.ts";
import { Asset, PObject, PPositiveValue, PRecord } from "../general/mod.ts";

export class JumpSizes {
  constructor(private value: PositiveValue) {}

  public assets = (): Assets => this.value.assets();
  public unsigned = (): Value => this.value.unsigned();
  public concise = (tabs = ""): string => this.value.concise(tabs);
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> =>
    this.value.toMap();

  static genOfAssets(assets: Assets): JumpSizes {
    const ppositiveValue = PPositiveValue.genOfAssets(assets);
    const positiveValue = ppositiveValue.genData();
    return new JumpSizes(
      positiveValue,
    );
  }

  static fromMap(m: Map<CurrencySymbol, Map<TokenName, bigint>>): JumpSizes {
    return new JumpSizes(new PositiveValue(new Value(m)));
  }
}

export class PJumpSizes extends PObject<JumpSizes> {
  constructor(
    public assets: Assets,
    public lowerBounds?: PositiveValue,
    public upperBounds?: PositiveValue,
  ) {
    super(
      new PRecord({
        value: new PPositiveValue(assets, lowerBounds, upperBounds),
      }),
      JumpSizes,
    );
  }
}
