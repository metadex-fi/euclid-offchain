import {
  genNonNegative,
  genNumber,
  genPositive,
  maxInteger,
  PConstraint,
  randomChoice,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Assets } from "./asset.ts";
import { Amount } from "./primitive.ts";
import { JumpSizes, newUnionWith, newValue, PValue, Value } from "./value.ts";

export const gMaxJumps = 3;

export type Prices = Value;
export type PPrices = PConstraint<PValue>;
export const newPPrices = (
  assets: Assets,
  lowerBounds?: Prices,
  upperBounds?: Prices,
  initialPrices?: Prices,
  jumpSizes?: JumpSizes,
): PPrices => {
  const pinner = new PValue(assets, lowerBounds, upperBounds, 1n);

  return new PConstraint<PValue>(
    pinner,
    [], // TODO asserts
    newGenPrices(
      pinner,
      initialPrices,
      jumpSizes,
    ),
  );
};

const newGenPrices = (
  pinner: PValue,
  initialPrices?: Prices,
  jumpSizes?: JumpSizes,
) =>
(): Prices => {
  return (initialPrices && jumpSizes)
    ? jumpPrices(
      pinner.lowerBounds ?? newValue(),
      pinner.upperBounds ?? newValue(),
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
  const jumpOne = (
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

  const jumpAll = newUnionWith(jumpOne, undefined, 1n, BigInt(maxInteger));

  return jumpAll(
    lowerBounds,
    upperBounds,
    initialPrices,
    jumpSizes,
  );
};
