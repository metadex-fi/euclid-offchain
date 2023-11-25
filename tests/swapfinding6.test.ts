import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  AssetOption,
  genTightAssetParams,
  PairOptions,
} from "../src/chain/actions/swapfinding6/swapsForPair.ts";
import { maxSmallInteger } from "../src/types/euclid/smallValue.ts";
import { maxInteger } from "../src/utils/constants.ts";
import {
  genNonNegative,
  genPositive,
  randomChoice,
} from "../src/utils/generators.ts";

Deno.test("swapfinding tight", () => {
  const iterations = 1000;
  for (let i = 0; i < iterations; i++) {
    let buyingParams;
    let sellingParams;
    let buyingOption: AssetOption;
    let sellingOption: AssetOption;

    while (true) {
      while (true) {
        buyingParams = genTightAssetParams();
        if (
          buyingParams.minDelta <= buyingParams.available
        ) {
          break;
        }
      }
      sellingParams = genTightAssetParams();

      buyingOption = new AssetOption(
        "buying",
        buyingParams.virtual,
        buyingParams.available,
        buyingParams.balance,
        buyingParams.weight,
        buyingParams.anchor,
        buyingParams.jumpSize,
        buyingParams.minDelta,
        buyingParams.available,
      );

      sellingOption = new AssetOption(
        "selling",
        sellingParams.virtual,
        sellingParams.available,
        sellingParams.balance,
        sellingParams.weight,
        sellingParams.anchor,
        buyingParams.jumpSize,
        sellingParams.minDelta,
        randomChoice([
          "oo",
          sellingParams.minDelta +
          genNonNegative(maxInteger - sellingParams.minDelta),
        ]),
      );

      break;
    }
    console.log("iteration", i);

    let bestPrice: number | undefined = undefined;
    for (let i = 0n; i <= 7n; i++) {
      const pairOptions = new PairOptions(
        buyingOption,
        sellingOption,
        11,
        10n ** i,
      );
      if (bestPrice === undefined) {
        bestPrice = pairOptions.bestPriceOption?.effectivePrice;
      } else {
        assert(pairOptions.bestPriceOption);
        if (pairOptions.bestPriceOption.effectivePrice < bestPrice) {
          console.log(
            "improved after",
            i,
            pairOptions.bestPriceOption?.effectivePrice,
          );
          bestPrice = pairOptions.bestPriceOption.effectivePrice;
        }
      }
      // console.log(i, pairOptions.bestPriceOption?.effectivePrice);
    }
    if (bestPrice !== undefined) console.log("bestPrice", bestPrice);
  }
});
