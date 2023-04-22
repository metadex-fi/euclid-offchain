import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { PWrapped } from "../general/fundamental/container/wrapped.js";
import { Lucid } from "../../../lucid.mod.js";
import { maxInteger } from "../../utils/generators.js";
import { Asset } from "../general/derived/asset/asset.js";
import { Assets } from "../general/derived/asset/assets.js";
import { PBounded } from "../general/derived/bounded/bounded.js";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.js";
import { Value } from "../general/derived/value/value.js";

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
  public get unsized(): PositiveValue {
    return this.value.clone;
  }
  public get unit(): Value {
    return this.value.unit;
  }

  public get clone(): EuclidValue {
    return new EuclidValue(this.value.clone);
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

  // public normedDivideBy = (other: EuclidValue): PositiveValue => {
  //   return new PositiveValue(Value.normedDivide(this.unsigned, other.unsigned));
  // };

  public divideByScalar = (scalar: bigint): EuclidValue => {
    return EuclidValue.fromValue(this.unsigned.divideByScalar(scalar));
  };

  public lt = (other: EuclidValue): boolean => {
    return Value.lt(this.unsigned, other.unsigned);
  };

  public leq = (other: EuclidValue): boolean => {
    return Value.leq(this.unsigned, other.unsigned);
  };

  public get leqMaxInteger(): boolean {
    return this.unsigned.leqMaxInteger;
  }

  public bounded = (lower = 1n, upper = maxInteger): EuclidValue => {
    return EuclidValue.fromValue(
      Value.newBoundedWith(new PBounded(lower, upper))(this.unsigned),
    );
  };

  // public halfRandomAmount = (): void => this.value.halfRandomAmount();

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

  static genBelow(upper: EuclidValue): EuclidValue {
    return EuclidValue.fromValue(
      Value.genBetween(upper.unit, upper.unsigned),
    );
  }

  static fromValue = (value: Value): EuclidValue =>
    new EuclidValue(new PositiveValue(value));

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
