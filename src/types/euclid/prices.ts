import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  abs,
  genNonNegative,
  maxInteger,
  min,
  randomChoice,
} from "../../mod.ts";
import { f, PConstraint, PLiteral, t } from "../mod.ts";
import { Asset, Assets, PAssets } from "./asset.ts";
import { CurrencySymbol, TokenName } from "./primitive.ts";
import {
  addValues,
  JumpSizes,
  newCompareWith,
  newUnionWith,
  PositiveValue,
  PPositiveValue,
  Value,
} from "./value.ts";

export const gMaxJumps = 3n;

export class Prices {
  private constructor(private prices: PositiveValue) {}

  public value = (): PositiveValue => new PositiveValue(this.prices.unsigned());
  public unsigned = (): Value => this.prices.unsigned();
  public assets = (): Assets => this.prices.assets();
  public unit = (): Value => this.prices.unit();
  public concise = (tabs = ""): string => `Prices ${this.prices.concise(tabs)}`;
  public size = (): bigint => this.prices.size();
  public amountOf = (asset: Asset): bigint => this.prices.amountOf(asset);

  static fromValue = (prices: Value): Prices => {
    return new Prices(new PositiveValue(prices));
  };
  static fromMap = (
    prices: Map<CurrencySymbol, Map<TokenName, bigint>>,
  ): Prices => {
    return Prices.fromValue(new Value(prices));
  };
}

export class PPrices extends PConstraint<PPositiveValue> {
  private maxJumpsUp: Value;
  private maxJumpsDown: Value;
  public assets: Assets;
  private constructor(
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
        initialPrices.assets(),
        lowerBounds?.unsigned(),
        upperBounds?.unsigned(),
      ),
      [newAssertPricesCongruent(initialPrices, jumpSizes), assertTwoAssets],
      newGenPrices(
        initialPrices,
        jumpSizes,
        maxJumpsUp,
        maxJumpsDown,
      ),
    );
    this.assets = initialPrices.assets();
    assert(
      this.assets.size() >= 2n,
      `new PPrices: less than two assets in ${this.assets.show()}`,
    );
    assert(
      this.assets.equals(jumpSizes.assets()),
      `Assets not equal in ${this.showPType()}`,
    );

    this.population = Number(
      addValues(initialPrices.unit(), addValues(maxJumpsUp, maxJumpsDown))
        .mulAmounts(),
    );
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
    // for logging
    this.maxJumpsUp = maxJumpsUp;
    this.maxJumpsDown = maxJumpsDown;
  }

  public genPrices = (): Prices => {
    return Prices.fromMap(this.pinner.genData());
  };

  public showData = (
    data: Map<CurrencySymbol, Map<TokenName, bigint>>,
    tabs = "",
  ): string => {
    return new Value(data).concise(tabs);
  };

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    return `Prices (
${ttf}population: ${this.population}, 
${ttf}initialPrices = ${this.initialPrices.concise(ttf)}, 
${ttf}jumpSizes = ${this.jumpSizes.concise(ttf)}, 
${ttf}lowerBounds? = ${this.lowerBounds?.concise(ttf)}, 
${ttf}upperBounds? = ${this.upperBounds?.concise(ttf)},
${ttf}maxJumpsUp = ${this.maxJumpsUp?.concise(ttf)},
${ttf}maxJumpsDown = ${this.maxJumpsDown?.concise(ttf)}
${tt})`;
  };

  static genPType(): PConstraint<PPositiveValue> {
    const assets = PAssets.genAssets(2n);
    assert(assets.size() >= 2n, `less than two assets in ${assets.show()}`);
    const pvalue = PPositiveValue.genOfAssets(assets);
    const initialPrices = Prices.fromMap(pvalue.genData());
    const jumpSizes = JumpSizes.genOfAssets(assets); // TODO not sure about congruency here

    return new PPrices(
      initialPrices,
      jumpSizes,
      pvalue.lowerBounds ? Prices.fromValue(pvalue.lowerBounds) : undefined,
      pvalue.upperBounds ? Prices.fromValue(pvalue.upperBounds) : undefined,
    );
  }
}

const assertTwoAssets = (
  prices: Map<CurrencySymbol, Map<TokenName, bigint>>,
): void => {
  const value = new Value(prices);
  assert(
    value.size() >= 2n,
    `assertTwoAssets: less than two assets in ${value.show()}`,
  );
};

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
      allPricesCongruent(
        initPs.unsigned(),
        new Value(currentPs),
        jumpSizes.unsigned(),
      ),
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
    jumpSize === 0n ? 0n : min(
      gMaxJumps,
      abs(initialPrice - boundary) / jumpSize,
    );
  const maxAllAssets = newUnionWith(
    maxSingleAsset,
    0n,
    gBoundary,
  );
  return maxAllAssets(
    bounds?.unsigned(),
    initialPrices.unsigned(),
    jumpSizes.unsigned(),
  );
};

const newGenPrices = (
  initialPrices: Prices,
  jumpSizes: JumpSizes,
  maxJumpsUp: Value,
  maxJumpsDown: Value,
) =>
(): Map<CurrencySymbol, Map<TokenName, bigint>> => {
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
  return jumped.toMap();
};
