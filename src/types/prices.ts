import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genPositive,
  maxInteger,
  min,
  PConstraint,
  randomChoice,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Assets } from "./asset.ts";
import { Amount, CurrencySymbol, TokenName } from "./primitive.ts";
import {
  JumpSizes,
  newCompareWith,
  newUnionWith,
  PPositiveValue,
  PValue,
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
        lowerBounds,
        upperBounds,
      ),
    );
  }

  genPType(): PPrices {
    const pvalue = PValue.genPType();

    return new PPrices(
      pvalue.assets,
      this.initialPrices,
      this.jumpSizes,
      this.lowerBounds,
      this.upperBounds,
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

const newGenPrices = (
  initialPrices: Prices,
  jumpSizes: JumpSizes,
  lowerBounds?: Prices,
  upperBounds?: Prices,
) =>
(): Map<CurrencySymbol, Map<TokenName, bigint>> => {
  // jump the price of each asset from initial price,
  // a random number of times,
  // with the respective jump size,
  // while respecting the bounds
  const jumpSingleAsset = (
    lowerBound: Amount,
    upperBound: Amount,
    initP: Amount,
    jumpSize: Amount,
  ): Amount => {
    function jumps(): Amount {
      const direction = randomChoice([-1n, 0n, 1n]);
      switch (direction) {
        case 1n: {
          const maxJumps = min(
            gMaxJumps,
            (upperBound - initP) / jumpSize,
          );
          return BigInt(genPositive(maxJumps));
        }
        case -1n: {
          const maxJumps = min(
            gMaxJumps,
            (initP - lowerBound) / jumpSize,
          );
          return -BigInt(genPositive(maxJumps));
        }
        default:
          return 0n;
      }
    }
    return initP + jumpSize * jumps();
  };

  const jumpAllAssets = newUnionWith(
    jumpSingleAsset,
    undefined,
    1n,
    BigInt(maxInteger),
  );

  return jumpAllAssets(
    lowerBounds?.value,
    upperBounds?.value,
    initialPrices.value,
    jumpSizes.value,
  ).value;
};
