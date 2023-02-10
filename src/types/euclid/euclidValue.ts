import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Asset, Assets, PositiveValue, PPositiveValue, Value } from "../mod.ts";
import { PWrapped } from "../general/fundamental/container/wrapped.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { IdNFT } from "./idnft.ts";

export class EuclidValue {
  constructor(
    private readonly value: PositiveValue,
  ) {
    EuclidValue.asserts(this);
  }

  public get assets(): Assets {
    return this.value.assets;
  }
  public get unsigned(): Value {
    return this.value.unsigned;
  }
  public get unit(): Value {
    return this.value.unit;
  }
  public concise = (tabs = ""): string => this.value.concise(tabs);
  public amountOf = (asset: Asset, defaultAmnt?: bigint): bigint =>
    this.value.amountOf(asset, defaultAmnt);
  public popIdNFT = (nft: IdNFT) => this.value.popIdNFT(nft);
  public get toLucid(): Lucid.Assets {
    return this.value.toLucid;
  }

  public plus = (other: EuclidValue): EuclidValue => {
    return EuclidValue.fromValue(Value.add(this.unsigned, other.unsigned));
  };
  public minus = (other: EuclidValue): EuclidValue => {
    return EuclidValue.fromValue(Value.subtract(this.unsigned, other.unsigned));
  };
  public normedMinus = (other: EuclidValue): PositiveValue => {
    return new PositiveValue(
      Value.normedSubtract(this.unsigned, other.unsigned),
    );
  };
  public hadamard = (other: EuclidValue): EuclidValue => {
    return EuclidValue.fromValue(Value.hadamard(this.unsigned, other.unsigned));
  };
  // reverse hadamard product
  public divideBy = (other: EuclidValue): EuclidValue => {
    return EuclidValue.fromValue(Value.divide(this.unsigned, other.unsigned));
  };

  public leq = (other: EuclidValue): boolean => {
    return Value.leq(this.unsigned, other.unsigned);
  };

  public halfRandomAmount = (): void => this.value.halfRandomAmount();

  static asserts(euclidValue: EuclidValue): void {
    assert(euclidValue.assets.size >= 2n, "at least two assets are required");
  }

  static generate(): EuclidValue {
    const assets = Assets.generate(2n);
    const value = PositiveValue.genOfAssets(assets);
    return new EuclidValue(value);
  }

  static genOfAssets(assets: Assets): EuclidValue {
    return new EuclidValue(PositiveValue.genOfAssets(assets));
  }

  static fromValue = (value: Value): EuclidValue =>
    new EuclidValue(new PositiveValue(value));
  static fromLucid = (assets: Lucid.Assets): EuclidValue =>
    new EuclidValue(PositiveValue.fromLucid(assets));

  static filled = (
    value: PositiveValue,
    assets: Assets,
    amount: bigint,
  ): EuclidValue => {
    return new EuclidValue(value.fill(assets, amount));
  };
}

export class PEuclidValue extends PWrapped<EuclidValue> {
  constructor() {
    super(
      PPositiveValue.ptype,
      EuclidValue,
    );
  }

  public genData = EuclidValue.generate;

  static ptype = new PEuclidValue();
  static genPType(): PEuclidValue {
    return PEuclidValue.ptype;
  }
}
