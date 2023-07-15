import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Assets } from "../general/derived/asset/assets.ts";
import { PWrapped } from "../general/fundamental/container/wrapped.ts";
import { EuclidValue, PEuclidValue } from "./euclidValue.ts";
import { PositiveValue } from "../general/derived/value/positiveValue.ts";
import { PPositive } from "../general/derived/bounded/positive.ts";
import { Value } from "../general/derived/value/value.ts";
import { Asset } from "../general/derived/asset/asset.ts";
import { Lucid } from "../../../lucid.mod.ts";

export const maxSmallInteger = 100n;

export class SmallValue {
  constructor(
    private readonly value: EuclidValue,
  ) {}

  public get assets(): Assets {
    return this.value.assets;
  }
  public get euclidean(): EuclidValue {
    return this.value.clone;
  }
  public get unsized(): PositiveValue {
    return this.value.unsized;
  }
  public get unsigned(): Value {
    return this.value.unsigned;
  }
  public get unit(): Value {
    return this.value.unit;
  }

  public get clone(): SmallValue {
    return new SmallValue(this.value.clone);
  }

  public concise = (tabs = ""): string => this.value.concise(tabs);
  public amountOf = (asset: Asset, defaultAmnt?: bigint): bigint =>
    this.value.amountOf(asset, defaultAmnt);
  public get toLucid(): Lucid.Assets {
    return this.value.toLucid;
  }

  public addAmountOf = (asset: Asset, amount: bigint): void => {
    this.value.addAmountOf(asset, amount);
  };

  public setAmountOf = (asset: Asset, amount: bigint): void => {
    this.value.setAmountOf(asset, amount);
  };

  static generate(): SmallValue {
    const assets = Assets.generate(2n);
    const value = PositiveValue.genOfAssets(
      assets,
      new PPositive(1n, maxSmallInteger),
    );
    return new SmallValue(new EuclidValue(value));
  }
}

export class PSmallValue extends PWrapped<SmallValue> {
  constructor() {
    super(
      PEuclidValue.ptype,
      SmallValue,
    );
  }

  public genData = SmallValue.generate;

  static ptype = new PSmallValue();
  static genPType(): PSmallValue {
    return PSmallValue.ptype;
  }
}
