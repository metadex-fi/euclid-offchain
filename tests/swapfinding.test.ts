import {
  calcAssetOptions,
  genAssetParams,
  swapsForPair,
} from "../src/chain/actions/swapfinding4/swapsForPair.ts";
import { maxInteger } from "../src/utils/constants.ts";
import { genNonNegative } from "../src/utils/generators.ts";

Deno.test("swapfinding", () => {
  for (let i = 0; i < 10000; i++) {
    const buyingParams = genAssetParams();
    const sellingParams = genAssetParams();

    const buyingOptions = calcAssetOptions(
      "buying",
      buyingParams.virtual,
      buyingParams.locked,
      buyingParams.balance,
      buyingParams.weight,
      buyingParams.jumpSize,
      buyingParams.anchor,
      buyingParams.minDelta,
      sellingParams.weight,
    );

    const sellingOptions = calcAssetOptions(
      "selling",
      sellingParams.virtual,
      sellingParams.locked,
      sellingParams.balance,
      sellingParams.weight,
      sellingParams.jumpSize,
      sellingParams.anchor,
      sellingParams.minDelta,
      sellingParams.minDelta +
        genNonNegative(maxInteger - sellingParams.minDelta),
    );

    const pairOptions = swapsForPair(buyingOptions, sellingOptions);
  }
});
