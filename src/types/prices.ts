import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genPositive,
  maxInteger,
  PConstraint,
  randomChoice,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Assets } from "./asset.ts";
import { Amount } from "./primitive.ts";
import {
  exactAssetsOf,
  JumpSizes,
  leq,
  newCompareWith,
  newPPositiveValue,
  newUnionWith,
  newValue,
  PPositiveValue,
  Value,
} from "./value.ts";

export const gMaxJumps = 3;

export type Prices = Value;
export type PPrices = PConstraint<PPositiveValue>;
export const newPPrices = (
  assets: Assets,
  lowerBounds?: Prices,
  upperBounds?: Prices,
  initialPrices?: Prices,
  jumpSizes?: JumpSizes,
): PPrices => {
  if (initialPrices) {
    assert(
      !lowerBounds || leq(lowerBounds, initialPrices),
      "lowerBounds must be less than or equal to initialPrices",
    );
    assert(
      !upperBounds || leq(initialPrices, upperBounds),
      "initialPrices must be less than or equal to upperBounds",
    );
    assert(
      exactAssetsOf(assets, initialPrices),
      "initialPrices misaligned with assets",
    );
    assert(jumpSizes, "jumpSizes must be defined if initialPrices is defined");
    assert(
      exactAssetsOf(assets, jumpSizes),
      "jumpSizes misaligned with assets",
    );
  } else {
    assert(
      !jumpSizes,
      "jumpSizes must be undefined if initialPrices is undefined",
    );
  }

  const pinner = newPPositiveValue(assets, lowerBounds, upperBounds);

  return new PConstraint<PPositiveValue>(
    pinner,
    [newAssertPricesCongruent(initialPrices, jumpSizes)],
    newGenPrices(
      pinner,
      lowerBounds,
      upperBounds,
      initialPrices,
      jumpSizes,
    ),
  );
};

const newAssertPricesCongruent =
  (initPs?: Prices, jumpSizes?: JumpSizes) => (currentPs: Prices): void => {
    if (!initPs || !jumpSizes) {
      return;
    } else {
      const singlePriceCongruent = (
        initP: Amount,
        currentP: Amount,
        jumpSize: Amount,
      ): boolean => {
        return (currentP - initP) % jumpSize === 0n;
      };
      const allPricesCongruent = newCompareWith(singlePriceCongruent);
      assert(
        allPricesCongruent(initPs, currentPs, jumpSizes),
        "prices out of whack",
      );
    }
  };

const newGenPrices = (
  pinner: PPositiveValue,
  lowerBounds?: Prices,
  upperBounds?: Prices,
  initialPrices?: Prices,
  jumpSizes?: JumpSizes,
) =>
(): Prices => {
  return (initialPrices && jumpSizes)
    ? jumpPrices(
      lowerBounds ?? newValue(),
      upperBounds ?? newValue(),
      initialPrices,
      jumpSizes,
    )
    : pinner.genData();
};

const jumpPrices = (
  lowerBounds: Prices,
  upperBounds: Prices,
  initialPrices: Prices,
  jumpSizes: JumpSizes,
): Prices => {
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
          const maxJumps = Math.min(
            gMaxJumps,
            Number((upperBound - initP) / jumpSize),
          );
          return BigInt(genPositive(maxJumps));
        }
        case -1n: {
          const maxJumps = Math.min(
            gMaxJumps,
            Number((initP - lowerBound) / jumpSize),
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
    lowerBounds,
    upperBounds,
    initialPrices,
    jumpSizes,
  );
};
