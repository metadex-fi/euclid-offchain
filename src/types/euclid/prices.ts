import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { abs, genNonNegative, min, randomChoice } from "../../mod.ts";
import {
  Asset,
  Assets,
  CurrencySymbol,
  newUnionWith,
  PAssets,
  PConstraint,
  PObject,
  PRecord,
  TokenName,
  Value,
} from "../mod.ts";
import { JumpSizes } from "./jumpSizes.ts";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.ts";

export const gMaxJumps = 3n;

export class Prices {
  constructor(private value: PositiveValue) {
    Prices.assert(this);
  }

  public signed = (): PositiveValue => new PositiveValue(this.unsigned());
  public unsigned = (): Value => this.value.unsigned();
  public assets = (): Assets => this.value.assets();
  public unit = (): Value => this.value.unit();
  public concise = (tabs = ""): string => `Prices ${this.value.concise(tabs)}`;
  public show = (tabs = ""): string => `Prices (\n${this.value.show(tabs)}\n)`;
  public size = (): bigint => this.value.size();
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public addAmountOf = (asset: Asset, amount: bigint): Prices =>
    new Prices(this.value.addAmountOf(asset, amount));
  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> =>
    this.value.toMap();

  static fromValue = (prices: Value): Prices => {
    return new Prices(new PositiveValue(prices));
  };
  static fromMap = (
    prices: Map<CurrencySymbol, Map<TokenName, bigint>>,
  ): Prices => {
    return Prices.fromValue(new Value(prices));
  };

  static assert(prices: Prices): void {
    assert(
      prices.size() >= 2n,
      `assertTwoAssets: less than two assets in ${prices.show()}`,
    );
  }

  static generate(): Prices {
    const assets = Assets.generate(2n);
    assert(assets.size);
    const value = PositiveValue.genOfAssets(assets);
    return new Prices(value);
  }
}

export class PPrices extends PConstraint<PObject<Prices>> {
  private constructor() {
    super(
      new PObject(
        new PRecord({
          value: new PPositiveValue(),
        }),
        Prices,
      ),
      [Prices.assert],
      Prices.generate,
    );
  }

  static ptype = new PPrices();
  static genPType(): PConstraint<PObject<Prices>> {
    return PPrices.ptype;
  }
}

const maxJumps = (
  initialPrices: Prices,
  jumpSizes: JumpSizes,
  bounds: PositiveValue,
): Value => {
  // jump the price of each asset from initial price,
  // a random number of times,
  // with the respective jump size,
  // while respecting the bounds
  const maxSingleAsset = (
    initialPrice: bigint,
    jumpSize: bigint,
    boundary: bigint,
  ): bigint =>
    jumpSize === 0n ? 0n : min(
      gMaxJumps,
      abs(initialPrice - boundary) / jumpSize,
    );
  const maxAllAssets = newUnionWith(
    maxSingleAsset,
    0n,
  );
  return maxAllAssets(
    initialPrices.unsigned(),
    jumpSizes.unsigned(),
    bounds.unsigned(),
  );
};

export const newGenPrices = (
  initialPrices: Prices,
  jumpSizes: JumpSizes,
  maxJumpsUp: Value,
  maxJumpsDown: Value,
) =>
(): Prices => {
  assert(
    initialPrices.assets().equals(jumpSizes.assets()),
    `newGenPrices: assets don't match in ${initialPrices.concise()} and ${jumpSizes.concise()}`,
  );
  assert(
    initialPrices.size() >= 2n,
    `newGenPrices: less than two assets in ${initialPrices.concise()}`,
  );
  // jump the price of each asset from initial price,
  // a random number of times,
  // with the respective jump size,
  // while respecting the bounds
  const jumpSingleAsset = (
    maxJumpsUp: bigint,
    maxJumpsDown: bigint,
    initP: bigint,
    jumpSize: bigint,
  ): bigint => {
    const direction = randomChoice([-1n, 1n]);
    const maxJumps = direction === 1n ? maxJumpsUp : maxJumpsDown;
    return initP + jumpSize * direction * genNonNegative(maxJumps);
  };

  const jumpAllAssets = newUnionWith(
    jumpSingleAsset,
    undefined,
    0n,
    0n,
  );
  const jumped = jumpAllAssets(
    maxJumpsUp,
    maxJumpsDown,
    initialPrices.unsigned(),
    jumpSizes.unsigned(),
  );
  assert(
    jumped.assets().equals(initialPrices.assets()),
    `newGenPrices: assets don't match in ${jumped.show()}
    and ${initialPrices.concise()}
    with 
    jumpSizes ${jumpSizes.concise()}
    maxJumpsUp ${maxJumpsUp.show()}
    maxJumpsDown ${maxJumpsDown.show()}`,
  );
  return Prices.fromValue(jumped);
};
