import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  AssetOptions,
  genTightAssetParams,
  genWildAssetParams,
  pairOptionsEqual,
  swapsForPair,
  swapsForPair_,
  // swapsForPairExhaustive,
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
    const pairOptions_ = swapsForPair_(
      buyingOptions_,
      sellingOptions_,
    );
    if (pairOptions.length !== pairOptions_.length) {
      console.log(
        `missed ${pairOptions.length - pairOptions_.length}`,
      );
      pairOptions.forEach((pairOption) => console.log(pairOption));
      console.log("vs");
      pairOptions_.forEach((pairOption) => console.log(pairOption));
      // break;
    } else {
      for (let i = 0; i < pairOptions.length; i++) {
        if (pairOptions[i].effectivePrice < pairOptions_[i].effectivePrice) {
          throw new Error("better price");
          for (let j = 0; j < pairOptions.length; j++) {
            if (i === j) console.log("============= (here)");
            else console.log("=============");
            console.log(pairOptions[j]);
            console.log("-------------");
            console.log(pairOptions_[j]);
          }
        } else if (
          pairOptions[i].effectivePrice > pairOptions_[i].effectivePrice
        ) {
          console.log("worse price");
          for (let j = 0; j < pairOptions.length; j++) {
            if (i === j) console.log("============= (here)");
            else console.log("=============");
            console.log(pairOptions[j]);
            console.log("-------------");
            console.log(pairOptions_[j]);
          }
          throw new Error("worse price");
        } else {
          assert(pairOptionsEqual(pairOptions[i], pairOptions_[i]));
        }
        // assert(pairOptions[i].effectivePrice <= pairOptions_[i].effectivePrice);
      }
    }
    assert(
      pairOptions.length >= pairOptions_.length,
      `${pairOptions.length} < ${pairOptions_.length}`,
    );
  }
});

// Deno.test("swapfinding wild", () => {
//   for (let i = 0; i < 10000; i++) {
//     const buyingParams = genWildAssetParams();
//     const sellingParams = genWildAssetParams();

//     const buyingOptions = new AssetOptions(
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

//     const maxSellingDelta = sellingParams.minDelta +
//       genNonNegative(maxInteger - sellingParams.minDelta);
//     const sellingOptions = new AssetOptions(
//       "selling",
//       sellingParams.virtual,
//       sellingParams.locked,
//       sellingParams.balance,
//       sellingParams.weight,
//       sellingParams.jumpSize,
//       sellingParams.anchor,
//       sellingParams.minDelta,
//       maxSellingDelta,
//     );

//     const pairOptions = swapsForPair(buyingOptions, sellingOptions);

//     const buyingOptions_ = new AssetOptions(
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

//     const sellingOptions_ = new AssetOptions(
//       "selling",
//       sellingParams.virtual,
//       sellingParams.locked,
//       sellingParams.balance,
//       sellingParams.weight,
//       sellingParams.jumpSize,
//       sellingParams.anchor,
//       sellingParams.minDelta,
//       maxSellingDelta,
//     );
//     const pairOptions_ = swapsForPair_(buyingOptions_, sellingOptions_);
//     if (pairOptions.length !== pairOptions_.length) {
//       console.log(
//         `missed ${pairOptions.length - pairOptions_.length}`,
//       );
//       pairOptions.forEach((pairOption) =>
//         console.log(pairOption.effectivePrice)
//       );
//       console.log("vs");
//       pairOptions_.forEach((pairOption) =>
//         console.log(pairOption.effectivePrice)
//       );
//       // break;
//     } else {
//       for (let i = 0; i < pairOptions.length; i++) {
//         if (pairOptions[i].effectivePrice < pairOptions_[i].effectivePrice) {
//           console.log("better price");
//           console.log("=============");
//           console.log(pairOptions[i]);
//           console.log("-------------");
//           console.log(pairOptions_[i]);
//         } else {
//           assert(pairOptionsEqual(pairOptions[i], pairOptions_[i]));
//         }
//         // assert(pairOptions[i].effectivePrice <= pairOptions_[i].effectivePrice);
//       }
//     }
//     assert(
//       pairOptions.length >= pairOptions_.length,
//       `${pairOptions.length} < ${pairOptions_.length}`,
//     );
//   }
// });
