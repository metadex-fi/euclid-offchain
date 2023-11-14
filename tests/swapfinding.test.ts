// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import {
//   AssetOptions,
//   countMults,
//   genTightAssetParams,
//   genWildAssetParams,
//   pairOptionsEqual,
//   swapsForPair,
//   swapsForPair_,
//   swapsForPairExhaustiveSort,
//   swapsForPairExhaustiveStraight,
//   // swapsForPairExhaustive,
// } from "../src/chain/actions/swapfinding4/swapsForPair.ts";
// import { maxInteger } from "../src/utils/constants.ts";
// import { genNonNegative } from "../src/utils/generators.ts";

// Deno.test("swapfinding previous", () => {
//   let genBuying = 0;
//   let genSelling = 0;
//   let durations = 0;
//   let durations_ = 0;
//   // while(true) {
//   const iterations = 10000;
//   for (let i = 0; i < iterations; i++) {

//   }
//   console.log("genBuying:", genBuying / iterations);
//   console.log("genSelling:", genSelling / iterations);
//   console.log("durations:", durations / iterations);
//   console.log("durations_:", durations_ / iterations);
// });

// Deno.test("swapfinding tight", () => {
//   let genBuying = 0;
//   let genSelling = 0;
//   let durations = 0;
//   let durations_ = 0;
//   // while(true) {
//   const iterations = 10000;
//   for (let i = 0; i < iterations; i++) {
//     const buyingParams = genTightAssetParams();
//     const sellingParams = genTightAssetParams();

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
//       11,
//       true,
//     );

//     const maxSellingDelta = sellingParams.minDelta +
//       genNonNegative(maxInteger - sellingParams.minDelta);
//     // const maxSellingDelta = maxInteger;
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
//       11,
//     );

//     let start = performance.now();
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
//       11,
//       true,
//     );
//     genBuying += performance.now() - start;
//     start = performance.now();

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
//       11,
//     );
//     genSelling += performance.now() - start;

//     const [pairOptions, duration] = swapsForPairExhaustiveStraight(
//       buyingOptions,
//       sellingOptions,
//       Infinity,
//     );
//     durations += duration;

//     const [pairOptions_, duration_] = swapsForPairExhaustiveSort(
//       buyingOptions_,
//       sellingOptions_,
//       Infinity,
//     );
//     durations_ += duration_;

//     if (pairOptions.length !== pairOptions_.length) {
//       console.log(
//         `missed ${pairOptions.length - pairOptions_.length}`,
//       );
//       // pairOptions.forEach((pairOption) =>
//       //   console.log(
//       //     pairOption,
//       //     countMults(pairOption.buyingOption.exp),
//       //     countMults(pairOption.sellingOption.exp),
//       //   )
//       // );
//       // console.log("vs");
//       // pairOptions_.forEach((pairOption) =>
//       //   console.log(
//       //     pairOption,
//       //     countMults(pairOption.buyingOption.exp),
//       //     countMults(pairOption.sellingOption.exp),
//       //   )
//       // );
//       // throw new Error(`missed ${pairOptions.length - pairOptions_.length}`);
//       // break;
//     } else {
//       for (let i = 0; i < pairOptions.length; i++) {
//         if (pairOptions[i].effectivePrice < pairOptions_[i].effectivePrice) {
//           console.log("better price");
//           for (let j = 0; j < pairOptions.length; j++) {
//             if (i === j) console.log("============= (here)");
//             else console.log("=============");
//             console.log(pairOptions[j]);
//             console.log("-------------");
//             console.log(pairOptions_[j]);
//           }
//           // throw new Error("better price");
//         } else if (
//           pairOptions[i].effectivePrice > pairOptions_[i].effectivePrice
//         ) {
//           console.log("worse price");
//           for (let j = 0; j < pairOptions.length; j++) {
//             if (i === j) console.log("============= (here)");
//             else console.log("=============");
//             console.log(pairOptions[j]);
//             console.log("-------------");
//             console.log(pairOptions_[j]);
//           }
//           // throw new Error("worse price");
//         } else {
//           // assert(pairOptionsEqual(pairOptions[i], pairOptions_[i]));
//         }
//         // assert(pairOptions[i].effectivePrice <= pairOptions_[i].effectivePrice);
//       }
//     }
//     assert(
//       pairOptions.length >= pairOptions_.length,
//       `${pairOptions.length} < ${pairOptions_.length}`,
//     );
//   }
//   console.log("genBuying:", genBuying / iterations);
//   console.log("genSelling:", genSelling / iterations);
//   console.log("durations:", durations / iterations);
//   console.log("durations_:", durations_ / iterations);
// });

// Deno.test("swapfinding wild", () => {
//   let genBuying = 0;
//   let genSelling = 0;
//   let durations = 0;
//   let durations_ = 0;
//   // while(true) {
//   const iterations = 10000;
//   for (let i = 0; i < iterations; i++) {
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
//       11,
//       true,
//     );

//     const maxSellingDelta = sellingParams.minDelta +
//       genNonNegative(maxInteger - sellingParams.minDelta);
//     // const maxSellingDelta = maxInteger;
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
//       11,
//     );

//     let start = performance.now();
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
//       11,
//       true,
//     );
//     genBuying += performance.now() - start;
//     start = performance.now();

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
//       11,
//     );
//     genSelling += performance.now() - start;

//     const [pairOptions, duration] = swapsForPairExhaustiveStraight(
//       buyingOptions,
//       sellingOptions,
//       11,
//     );
//     durations += duration;

//     const [pairOptions_, duration_] = swapsForPairExhaustiveSort(
//       buyingOptions_,
//       sellingOptions_,
//       11,
//     );
//     durations_ += duration_;

//     if (pairOptions.length !== pairOptions_.length) {
//       console.log(
//         `missed ${pairOptions.length - pairOptions_.length}`,
//       );
//       // pairOptions.forEach((pairOption) =>
//       //   console.log(
//       //     pairOption,
//       //     countMults(pairOption.buyingOption.exp),
//       //     countMults(pairOption.sellingOption.exp),
//       //   )
//       // );
//       // console.log("vs");
//       // pairOptions_.forEach((pairOption) =>
//       //   console.log(
//       //     pairOption,
//       //     countMults(pairOption.buyingOption.exp),
//       //     countMults(pairOption.sellingOption.exp),
//       //   )
//       // );
//       // throw new Error(`missed ${pairOptions.length - pairOptions_.length}`);
//       // break;
//     } else {
//       for (let i = 0; i < pairOptions.length; i++) {
//         if (pairOptions[i].effectivePrice < pairOptions_[i].effectivePrice) {
//           console.log("better price");
//           for (let j = 0; j < pairOptions.length; j++) {
//             if (i === j) console.log("============= (here)");
//             else console.log("=============");
//             console.log(pairOptions[j]);
//             console.log("-------------");
//             console.log(pairOptions_[j]);
//           }
//           // throw new Error("better price");
//         } else if (
//           pairOptions[i].effectivePrice > pairOptions_[i].effectivePrice
//         ) {
//           console.log("worse price");
//           for (let j = 0; j < pairOptions.length; j++) {
//             if (i === j) console.log("============= (here)");
//             else console.log("=============");
//             console.log(pairOptions[j]);
//             console.log("-------------");
//             console.log(pairOptions_[j]);
//           }
//           // throw new Error("worse price");
//         } else {
//           // assert(pairOptionsEqual(pairOptions[i], pairOptions_[i]));
//         }
//         // assert(pairOptions[i].effectivePrice <= pairOptions_[i].effectivePrice);
//       }
//     }
//     assert(
//       pairOptions.length >= pairOptions_.length,
//       `${pairOptions.length} < ${pairOptions_.length}`,
//     );
//   }
//   console.log("genBuying:", genBuying / iterations);
//   console.log("genSelling:", genSelling / iterations);
//   console.log("durations:", durations / iterations);
//   console.log("durations_:", durations_ / iterations);
// });
