import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { abs, genNonNegative, leq, min, randomChoice } from "../../mod.ts";
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
    assert(
      value.size() >= 2n,
      `Prices: less than two assets in ${value.show()}`,
    );
  }

  public signed = (): PositiveValue => new PositiveValue(this.unsigned());
  public unsigned = (): Value => this.value.unsigned();
  public assets = (): Assets => this.value.assets();
  public unit = (): Value => this.value.unit();
  public concise = (tabs = ""): string => `Prices ${this.value.concise(tabs)}`;
  public show = (tabs = ""): string => `Prices (\n${this.value.show(tabs)}\n)`;
  public size = (): bigint => this.value.size();
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public setAmountOf = (asset: Asset, amount: bigint): void =>
    this.value.setAmountOf(asset, amount);
  public clone = (): Prices => new Prices(this.value.clone());
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

  static assertInitial = (param: Param) => (initialPrices: Prices): void => {
    assert(
      leq(param.lowerPriceBounds.unsigned(), initialPrices.unsigned()),
      `lower bounds ${param.lowerPriceBounds.concise()} must be less than or equal to initial prices ${initialPrices.concise()}`,
    );
    assert(
      leq(initialPrices.unsigned(), param.upperPriceBounds.unsigned()),
      `upper bounds ${param.upperPriceBounds.concise()} must be greater than or equal to initial prices ${initialPrices.concise()}`,
    );
  };

  static assertCurrent =
    (param: Param, initialPrices: Prices) => (currentPrices: Prices): void => {
      Prices.assertInitial(param)(initialPrices);
      Prices.assertInitial(param)(currentPrices);
      const singlePriceCongruent = (
        initP: bigint,
        currentP: bigint,
        jumpSize: bigint,
      ): boolean => {
        return (currentP - initP) % jumpSize === 0n;
      };
      const allPricesCongruent = newCompareWith(singlePriceCongruent);
      assert(
        allPricesCongruent(
          initialPrices.unsigned(),
          currentPrices.unsigned(),
          param.jumpSizes.unsigned(),
        ),
        `Dirac.assertWith: prices not congruent`,
      );
    };

  // static generateAny(): Prices {
  //   const assets = Assets.generate(2n);
  //   assert(assets.size);
  //   const value = PositiveValue.genOfAssets(assets);
  //   return new Prices(value);
  // }

  static generateInitial = (param: Param) => (): Prices => {
    const generateSingleAsset = (
      lowerBound: bigint,
      upperBound: bigint,
    ): bigint => {
      return lowerBound + genNonNegative(upperBound - lowerBound);
    };
    const generateAllAssets = newUnionWith(generateSingleAsset);
    const value = generateAllAssets(
      param.lowerPriceBounds.unsigned(),
      param.upperPriceBounds.unsigned(),
    );
    return Prices.fromValue(value);
  };

  static generateCurrent =
    (param: Param, initialPrices: Prices) => (): Prices => {
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
        initialPrices,
        param.jumpSizes,
        param.upperPriceBounds,
      );
      const maxJumpsDown = maxJumps(
        initialPrices,
        param.jumpSizes,
        param.lowerPriceBounds,
      );

      const jumpAllAssets = newUnionWith(jumpSingleAsset);
      const jumped = jumpAllAssets(
        maxJumpsUp,
        maxJumpsDown,
        initialPrices.unsigned(),
        param.jumpSizes.unsigned(),
      );
      assert(
        jumped.assets().equals(initialPrices.assets()),
        `newGenPrices: assets don't match in ${jumped.show()}
      and ${initialPrices.concise()}
      with 
      jumpSizes ${param.jumpSizes.concise()}
      maxJumpsUp ${maxJumpsUp.show()}
      maxJumpsDown ${maxJumpsDown.show()}`,
      );
      return Prices.fromValue(jumped);
    };
}

export class PPrices extends PConstraint<PObject<Prices>> {
  private constructor(
    public readonly param: Param,
    public readonly initialPrices?: Prices,
  ) {
    super(
      new PObject(
        new PRecord({
          value: new PPositiveValue(),
        }),
        Prices,
      ),
      [
        initialPrices
          ? Prices.assertCurrent(param, initialPrices)
          : Prices.assertInitial(param),
      ],
      initialPrices
        ? Prices.generateCurrent(param, initialPrices)
        : Prices.generateInitial(param),
    );
  }

  static initial(param: Param): PPrices {
    return new PPrices(param);
  }

  static current(param: Param, initialPrices: Prices): PPrices {
    return new PPrices(param, initialPrices);
  }

  static genPType(): PConstraint<PObject<Prices>> {
    const param = Param.generate();
    return randomChoice([
      () => PPrices.initial(param),
      () => {
        const initialPrices = Prices.generateInitial(param)();
        return PPrices.current(param, initialPrices);
      },
    ])();
  }
}

export const maxJumps = (
  initialPrices: Prices,
  jumpSizes: JumpSizes,
  bounds: PositiveValue,
  maxJumps = gMaxJumps,
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
      maxJumps,
      abs(initialPrice - boundary) / jumpSize,
    );
  const maxAllAssets = newUnionWith(maxSingleAsset);
  return maxAllAssets(
    initialPrices.unsigned(),
    jumpSizes.unsigned(),
    bounds.unsigned(),
  );
};
