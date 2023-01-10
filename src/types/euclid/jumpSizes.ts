import {
  Assets,
  CurrencySymbol,
  PositiveValue,
  TokenName,
  Value,
} from "../mod.ts";
import { PObject, PPositiveValue, PRecord } from "../general/mod.ts";

export class JumpSizes {
  constructor(private value: PositiveValue) {}

  public assets = (): Assets => this.value.assets();
  public unsigned = (): Value => this.value.unsigned();
  public concise = (tabs = ""): string => this.value.concise(tabs);
  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> =>
    this.value.toMap();

  static genOfAssets(assets: Assets): JumpSizes {
    const ppositiveValue = PPositiveValue.genOfAssets(assets);
    const positiveValue = ppositiveValue.genData();
    return new JumpSizes(
      positiveValue,
    );
  }

  static nullOfAssets(assets: Assets): JumpSizes {
    return new JumpSizes(new PositiveValue(Value.nullOfAssets(assets)));
  }

  static fromMap(m: Map<CurrencySymbol, Map<TokenName, bigint>>): JumpSizes {
    return new JumpSizes(new PositiveValue(new Value(m)));
  }
}

export class PJumpSizes extends PObject<JumpSizes> {
  constructor(
    public assets: Assets,
    public lowerBounds?: Value,
    public upperBounds?: Value,
  ) {
    super(
      new PRecord({
        value: new PPositiveValue(assets, lowerBounds, upperBounds),
      }),
      JumpSizes,
    );
  }
}
