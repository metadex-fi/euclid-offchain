import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  abs,
  f,
  genNonNegative,
  maxInteger,
  min,
  PConstraint,
  randomChoice,
  t,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Assets } from "./asset.ts";
import { CurrencySymbol, TokenName } from "./primitive.ts";
import {
  addValues,
  JumpSizes,
  newCompareWith,
  newUnionWith,
  PPositiveValue,
  Value,
} from "./value.ts";

export const gMaxJumps = 3n;

export class Prices {
  constructor(public value: Value) {}
}

export class PPrices extends PConstraint<PPositiveValue> {
  constructor(
    public assets: Assets,
    public initialPrices: Prices,
    public jumpSizes: JumpSizes,
    public lowerBounds?: Prices,
    public upperBounds?: Prices,
  ) {
    const maxJumpsUp = maxJumps(
      initialPrices,
      jumpSizes,
      maxInteger,
      upperBounds,
    );
    const maxJumpsDown = maxJumps(
      initialPrices,
      jumpSizes,
      1n,
      lowerBounds,
    );
    super(
      new PPositiveValue(
        assets,
        lowerBounds?.value,
        upperBounds?.value,
      ),
      [newAssertPricesCongruent(initialPrices, jumpSizes)],
      newGenPrices(
        initialPrices,
        jumpSizes,
        maxJumpsUp,
        maxJumpsDown,
      ),
    );
    this.population = Number(
      addValues(initialPrices.value.unit(), addValues(maxJumpsUp, maxJumpsDown))
        .mulAmounts(),
    );
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    return `Prices (
${ttf}population: ${this.population}, 
${ttf}assets = ${this.assets.show(ttf)}, 
${ttf}initialPrices = ${this.initialPrices.value.show(ttf)}, 
${ttf}jumpSizes = ${this.jumpSizes.value.show(ttf)}, 
${ttf}lowerBounds? = ${this.lowerBounds?.value.show(ttf)}, 
${ttf}upperBounds? =  ${this.upperBounds?.value.show(ttf)}
${tt})`;
  };

  static genPType(): PConstraint<PPositiveValue> {
    const pvalue = PPositiveValue.genPType();
    const initialPrices = new Prices(new Value(pvalue.genData()));
    const jumpSizes = new JumpSizes(
      new Value(PPositiveValue.genOfAssets(pvalue.assets).genData()),
    ); // TODO not sure about congruency here

    return new PPrices(
      pvalue.assets,
      initialPrices,
      jumpSizes,
      pvalue.lowerBounds ? new Prices(pvalue.lowerBounds) : undefined,
      pvalue.upperBounds ? new Prices(pvalue.upperBounds) : undefined,
    );
  }
}

// this also implicitly checks that assets match
const newAssertPricesCongruent =
  (initPs: Prices, jumpSizes: JumpSizes) =>
  (currentPs: Map<CurrencySymbol, Map<TokenName, bigint>>): void => {
    const singlePriceCongruent = (
      initP: bigint,
      currentP: bigint,
      jumpSize: bigint,
    ): boolean => {
      return (currentP - initP) % jumpSize === 0n;
    };
    const allPricesCongruent = newCompareWith(singlePriceCongruent);
    assert(
      allPricesCongruent(initPs.value, new Value(currentPs), jumpSizes.value),
      "prices out of whack",
    );
  };

const maxJumps = (
  initialPrices: Prices,
  jumpSizes: JumpSizes,
  gBoundary: bigint,
  bounds?: Prices,
): Value => {
  // jump the price of each asset from initial price,
  // a random number of times,
  // with the respective jump size,
  // while respecting the bounds
  const maxSingleAsset = (
    boundary: bigint,
    initialPrice: bigint,
    jumpSize: bigint,
  ): bigint =>
    min(
      gMaxJumps,
      abs(initialPrice - boundary) / jumpSize,
    );
  const maxAllAssets = newUnionWith(
    maxSingleAsset,
    0n,
    gBoundary,
  );
  return maxAllAssets(
    bounds?.value,
    initialPrices.value,
    jumpSizes.value,
  );
};

const newGenPrices = (
  initialPrices: Prices,
  jumpSizes: JumpSizes,
  maxJumpsUp: Value,
  maxJumpsDown: Value,
) =>
(): Map<CurrencySymbol, Map<TokenName, bigint>> => {
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
  return jumpAllAssets(
    maxJumpsUp,
    maxJumpsDown,
    initialPrices.value,
    jumpSizes.value,
  ).value;
};
