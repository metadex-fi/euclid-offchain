import {
  Assets,
  CurrencySymbol,
  PositiveValue,
  TokenName,
  Value,
} from "../mod.ts";
import { Asset, PObject, PPositiveValue, PRecord } from "../general/mod.ts";
import { maxInteger, min } from "../../mod.ts";

export class JumpSizes {
  constructor(private value: PositiveValue) {}

  public assets = (): Assets => this.value.assets();
  public unsigned = (): Value => this.value.unsigned();
  public concise = (tabs = ""): string => this.value.concise(tabs);
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public scaledWith = (factor: bigint): JumpSizes =>
    new JumpSizes(this.value.scaledWith(factor));
  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> =>
    this.value.toMap();

  public doubleRandomAmount = (): void => {
    const asset = this.assets().randomChoice();
    this.value.setAmountOf(
      asset,
      min(maxInteger, this.value.amountOf(asset) * 2n),
    );
  };

  static genOfAssets(assets: Assets): JumpSizes {
    return new JumpSizes(
      PositiveValue.genOfAssets(assets),
    );
  }

  static fromMap(m: Map<CurrencySymbol, Map<TokenName, bigint>>): JumpSizes {
    return new JumpSizes(new PositiveValue(new Value(m)));
  }
}

export class PJumpSizes extends PObject<JumpSizes> {
  private constructor() {
    super(
      new PRecord({
        value: new PPositiveValue(),
      }),
      JumpSizes,
    );
  }

  static ptype = new PJumpSizes();
  static genPType(): PJumpSizes {
    return PJumpSizes.ptype;
  }
}
