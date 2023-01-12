import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  abs,
  genNonNegative,
  maybeNdef,
  min,
  randomChoice,
} from "../../mod.ts";
import {
  Asset,
  Assets,
  CurrencySymbol,
  newCompareWith,
  newUnionWith,
  Param,
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

  static assertWith = (param: Param) => (currentPrices: Prices): void => {
    Prices.assert(currentPrices);
    const singlePriceCongruent = (
      initP: bigint,
      currentP: bigint,
      jumpSize: bigint,
      lowerBound: bigint,
      upperBound: bigint,
    ): boolean => {
      return (currentP - initP) % jumpSize === 0n &&
        currentP >= lowerBound &&
        currentP <= upperBound;
    };
    const allPricesCongruent = newCompareWith(singlePriceCongruent);
    assert(
      allPricesCongruent(
        param.initialPrices.unsigned(),
        currentPrices.unsigned(),
        param.jumpSizes.unsigned(),
        param.lowerPriceBounds.unsigned(),
        param.upperPriceBounds.unsigned(),
      ),
      `Prices.assertWith: prices not congruent:
currentPs: ${currentPrices.concise()}
param: ${param.concise()}`,
    );
  };

  static generateWith = (param: Param) => (): Prices => {
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

    const maxJumpsUp = maxJumps(
      param.initialPrices,
      param.jumpSizes,
      param.upperPriceBounds,
    );
    const maxJumpsDown = maxJumps(
      param.initialPrices,
      param.jumpSizes,
      param.lowerPriceBounds,
    );

    const jumpAllAssets = newUnionWith(
      jumpSingleAsset,
      undefined,
      0n,
      0n,
    );
    const jumped = jumpAllAssets(
      maxJumpsUp,
      maxJumpsDown,
      param.initialPrices.unsigned(),
      param.jumpSizes.unsigned(),
    );
    assert(
      jumped.assets().equals(param.initialPrices.assets()),
      `newGenPrices: assets don't match in ${jumped.show()}
      and ${param.initialPrices.concise()}
      with 
      jumpSizes ${param.jumpSizes.concise()}
      maxJumpsUp ${maxJumpsUp.show()}
      maxJumpsDown ${maxJumpsDown.show()}`,
    );
    return Prices.fromValue(jumped);
  };
}

export class PPrices extends PConstraint<PObject<Prices>> {
  constructor(
    public readonly param?: Param, // need it undefined for param and defined for activeAssets' PMap.genKeys
  ) {
    super(
      new PObject(
        new PRecord({
          value: new PPositiveValue(),
        }),
        Prices,
      ),
      [param ? Prices.assertWith(param) : Prices.assert],
      param ? Prices.generateWith(param) : Prices.generate,
    );
  }

  static genPType(): PConstraint<PObject<Prices>> {
    const param = maybeNdef(Param.generate)?.();
    return new PPrices(param);
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
