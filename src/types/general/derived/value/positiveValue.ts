import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../../../lucid.mod.ts";
import { genPositive, IdNFT, max } from "../../../../mod.ts";
import { AssocMap, PObject, PRecord } from "../../mod.ts";
import { Asset, Assets, PCurrency, PPositive, PToken } from "../mod.ts";
import { PValue, Value } from "./value.ts";

export class PositiveValue {
  constructor(
    private value = new Value(),
  ) {
    assert(value.positive, "value must be positive");
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
  public get toMap() {
    return this.value.toMap;
  }
  public get assets(): Assets {
    return this.value.assets;
  }
  public get unsigned(): Value {
    return new Value(this.value.toMap);
  }
  public get unit(): Value {
    return this.value.unit;
  }
  public get zeroed(): Value {
    return this.value.zeroed;
  }
  public get size(): bigint {
    return this.value.size;
  }
  public get headAsset(): Asset {
    return this.value.headAsset;
  }
  public amountOf = (asset: Asset, defaultAmnt?: bigint): bigint =>
    this.value.amountOf(asset, defaultAmnt);
  // TODO this does not really belong here, entangles the non-DEX-stuff with DEX-stuff
  public popIdNFT = (nft: IdNFT) => this.value.popIdNFT(nft);
  public drop = (asset: Asset): void => this.value.drop(asset);
  public setAmountOf = (asset: Asset, amount: bigint): void =>
    this.value.setAmountOf(asset, amount);
  public get clone(): PositiveValue {
    return new PositiveValue(this.value.clone);
  }
  public has = (asset: Asset): boolean => this.value.has(asset);

  public fill = (assets: Assets, amount: bigint): PositiveValue => {
    assert(amount > 0n, `fill: amount must be positive, got ${amount}`);
    return new PositiveValue(this.value.fill(assets, amount));
  };

  public addAmountOf = (asset: Asset, amount: bigint): void => {
    if (this.has(asset)) this.increaseAmountOf(asset, amount);
    else this.initAmountOf(asset, amount);
  };

  public increaseAmountOf = (asset: Asset, amount: bigint): void => {
    const newAmount = this.amountOf(asset) + amount;
    assert(
      newAmount >= 0n,
      `addAmountOf: newAmount must be positive, got ${newAmount}`,
    );
    if (newAmount === 0n) {
      this.value.drop(asset);
    } else {
      this.value.setAmountOf(asset, amount);
    }
  };

  public minSizedSubValue = (minSize: bigint): PositiveValue => {
    const assets = this.assets.minSizedSubset(minSize);
    const value = new PositiveValue();
    assets.forEach((asset) => {
      const amount = this.amountOf(asset);
      value.initAmountOf(asset, genPositive(amount));
    });
    return value;
  };

  public plus = (other: PositiveValue): PositiveValue => {
    return new PositiveValue(Value.add(this.unsigned, other.unsigned));
  };
  public normedPlus = (other: PositiveValue): PositiveValue => {
    return new PositiveValue(Value.normedAdd(this.unsigned, other.unsigned));
  };
  public minus = (other: PositiveValue): PositiveValue => {
    return new PositiveValue(Value.subtract(this.unsigned, other.unsigned));
  };
  public normedMinus = (other: PositiveValue): PositiveValue => {
    return new PositiveValue(
      Value.normedSubtract(this.unsigned, other.unsigned),
    );
  };
  // public hadamard = (other: PositiveValue): PositiveValue => {
  //   return new PositiveValue(Value.hadamard(this.unsigned, other.unsigned));
  // };
  // reverse hadamard product
  public divideBy = (other: PositiveValue): PositiveValue => {
    return new PositiveValue(Value.divide(this.unsigned, other.unsigned));
  };

  public leq = (other: PositiveValue): boolean => {
    return Value.leq(this.unsigned, other.unsigned);
  };

  public halfRandomAmount = (): void => {
    const asset = this.assets.randomChoice();
    this.value.setAmountOf(
      asset,
      max(1n, this.value.amountOf(asset) / 2n),
    );
  };

  // public divideByScalar = (scalar: bigint): PositiveValue => {
  //   return new PositiveValue(this.value.divideByScalar(scalar));
  // }

  public get toLucid(): Lucid.Assets {
    const assets: Lucid.Assets = {};
    this.assets.forEach((asset) => {
      assets[asset.toLucid()] = this.amountOf(asset);
    });
    return assets;
  }

  static fromLucid(assets: Lucid.Assets): PositiveValue {
    try {
      const value = new Value();
      Object.entries(assets).forEach(([name, amount]) => {
        const asset = Asset.fromLucid(name);
        value.initAmountOf(asset, amount);
      });
      return new PositiveValue(value);
    } catch (e) {
      throw new Error(
        `Amounts.fromLucid ${
          Object.entries(assets).map(([ass, amnt]) => `${ass}: ${amnt}\n`)
        }:${e}`,
      );
    }
  }

  static maybeFromMap = (
    m?: AssocMap<PCurrency, AssocMap<PToken, bigint>>,
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

  static normed(value: Value): PositiveValue {
    return new PositiveValue(value.normed);
  }
}

export const boundPositive = Value.newBoundedWith(new PPositive());

export class PPositiveValue extends PObject<PositiveValue> {
  constructor() {
    super(
      new PRecord({
        value: new PValue(new PPositive()),
      }),
      PositiveValue,
    );
  }

  static ptype = new PPositiveValue();
  static genPType(): PPositiveValue {
    return PPositiveValue.ptype;
  }
}
