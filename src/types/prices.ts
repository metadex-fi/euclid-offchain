import {
  PConstraint,
  randomChoice,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Assets } from "./asset.ts";
import { Amount } from "./primitive.ts";
import {

divStrict,
divValues,
JumpSizes,
lSubValues,
minValues,
negate,
newValue,
PValue,
  setAmounts,
  subValues,
  Value,
} from "./value.ts";

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
export const gMaxJumps = 3n;
const newGenPrices = (
  pinner: PValue,
  initialPrices?: Prices,
  jumpSizes?: JumpSizes,
) =>
(): Prices => {
  if (initialPrices && jumpSizes) {
    const max = setAmounts(initialPrices, gMaxJumps);
    const init = divStrict(initialPrices, jumpSizes);

    let up = divValues(pinner.upperBounds ?? newValue(), jumpSizes);
    up = lSubValues(up, init);
    up = minValues(up, max);

    let down = divValues(pinner.lowerBounds ?? newValue(), jumpSizes);
    down = negate(lSubValues(down, init));
    down = minValues(down, max);

    //TODO continue here

  } else return pinner.genData();
};
