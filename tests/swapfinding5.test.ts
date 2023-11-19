import {
  AssetConstants,
  genTightAssetParams,
  PairOptions,
} from "../src/chain/actions/swapfinding5/swapsForPair.ts";
import { maxSmallInteger } from "../src/types/euclid/smallValue.ts";
import { maxInteger } from "../src/utils/constants.ts";
import {
  genNonNegative,
  genPositive,
  min,
  randomChoice,
} from "../src/utils/generators.ts";

Deno.test("swapfinding tight", () => {
  const iterations = 1000;
  for (let i = 0; i < iterations; i++) {
    let buyingParams;
    let sellingParams;
    let jumpSize: bigint;
    let buyingConstants: AssetConstants;
    let sellingConstants: AssetConstants;

    while (true) {
      jumpSize = genPositive(maxSmallInteger);
      while (true) {
        buyingParams = genTightAssetParams(jumpSize);
        if (
          buyingParams.minDelta <= buyingParams.available
        ) {
          break;
        }
      }
      sellingParams = genTightAssetParams(jumpSize);

      buyingConstants = new AssetConstants(
        "buying",
        buyingParams.virtual,
        buyingParams.available,
        buyingParams.balance,
        buyingParams.weight,
        buyingParams.anchor,
        buyingParams.minDelta,
        buyingParams.available,
      );

      sellingConstants = new AssetConstants(
        "selling",
        sellingParams.virtual,
        sellingParams.available,
        sellingParams.balance,
        sellingParams.weight,
        sellingParams.anchor,
        sellingParams.minDelta,
        randomChoice([
          "oo",
          sellingParams.minDelta +
          genNonNegative(maxInteger - sellingParams.minDelta),
        ]),
      );

      break;
    }
    const pairOptions = new PairOptions(
      buyingConstants,
      sellingConstants,
      jumpSize,
      Infinity,
    );
    console.log(pairOptions.options.length);
  }
});
