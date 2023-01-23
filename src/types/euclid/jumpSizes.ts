import { Assets, Currency, PositiveValue, Token, Value } from "../mod.ts";
import { Asset, PObject, PPositiveValue, PRecord } from "../general/mod.ts";
import { AssocMap, maxInteger, min } from "../../mod.ts";

export class JumpSizes {
  constructor(private value: PositiveValue) {}

  public assets = (): Assets => this.value.assets();
  public unsigned = (): Value => this.value.unsigned();
  public concise = (tabs = ""): string => this.value.concise(tabs);
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public scaledWith = (factor: bigint): JumpSizes =>
    new JumpSizes(this.value.scaledWith(factor));
  public toMap = (): AssocMap<Currency, AssocMap<Token, bigint>> =>
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

  static fromMap(m: AssocMap<Currency, AssocMap<Token, bigint>>): JumpSizes {
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
