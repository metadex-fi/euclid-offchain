import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  AssetOptions,
  genTightAssetParams,
  genWildAssetParams,
  swapsForPair,
  swapsForPair_,
} from "../src/chain/actions/swapfinding4/swapsForPair.ts";
import { maxInteger } from "../src/utils/constants.ts";
import { genNonNegative } from "../src/utils/generators.ts";

Deno.test("swapfinding tight", () => {
  for (let i = 0; i < 10000; i++) {
    const buyingParams = genTightAssetParams();
    const sellingParams = genTightAssetParams();

    const buyingOptions = new AssetOptions(
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

    const maxSellingDelta = sellingParams.minDelta +
      genNonNegative(maxInteger - sellingParams.minDelta);
    const sellingOptions = new AssetOptions(
      "selling",
      sellingParams.virtual,
      sellingParams.locked,
      sellingParams.balance,
      sellingParams.weight,
      sellingParams.jumpSize,
      sellingParams.anchor,
      sellingParams.minDelta,
      maxSellingDelta,
    );

    const pairOptions = swapsForPair(buyingOptions, sellingOptions);

    const buyingOptions_ = new AssetOptions(
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

    const sellingOptions_ = new AssetOptions(
      "selling",
      sellingParams.virtual,
      sellingParams.locked,
      sellingParams.balance,
      sellingParams.weight,
      sellingParams.jumpSize,
      sellingParams.anchor,
      sellingParams.minDelta,
      maxSellingDelta,
    );
    const pairOptions_ = swapsForPair_(buyingOptions_, sellingOptions_);
    assert(
      pairOptions.length >= pairOptions_.length,
      `${pairOptions.length} < ${pairOptions_.length}`,
    );
    if (pairOptions.length > pairOptions_.length) {
      console.log(
        `missed ${pairOptions.length - pairOptions_.length}`,
      );
      console.log(pairOptions);
      console.log(pairOptions_);
      break;
    } else {
      for (let i = 0; i < pairOptions.length; i++) {
        assert(
          pairOptions[i].equals(pairOptions_[i]),
          `${pairOptions[i]} != ${pairOptions_[i]}`,
        );
      }
    }
  }
});

// Deno.test("swapfinding wild", () => {
//   for (let i = 0; i < 10000; i++) {
//     const buyingParams = genWildAssetParams();
//     const sellingParams = genWildAssetParams();

//     const buyingOptions = calcAssetOptions(
//       "buying",
//       buyingParams.virtual,
//       buyingParams.locked,
//       buyingParams.balance,
//       buyingParams.weight,
//       buyingParams.jumpSize,
//       buyingParams.anchor,
//       buyingParams.minDelta,
//       sellingParams.weight,
//     );

//     const sellingOptions = calcAssetOptions(
//       "selling",
//       sellingParams.virtual,
//       sellingParams.locked,
//       sellingParams.balance,
//       sellingParams.weight,
//       sellingParams.jumpSize,
//       sellingParams.anchor,
//       sellingParams.minDelta,
//       sellingParams.minDelta +
//         genNonNegative(maxInteger - sellingParams.minDelta),
//     );

//     const pairOptions = swapsForPair(buyingOptions, sellingOptions);
//   }
// });
