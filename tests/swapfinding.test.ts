// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import {
//   AssetOptions,
//   countMults,
//   // deduplicate,
//   genTightAssetParams,
//   genWildAssetParams,
//   pairOptionsEqual,
//   paretoOptionsSort,
//   paretoOptionsStraight,
//   swapsForPairBinary,
//   swapsForPairExhaustive,
//   // swapsForPairLinear,
//   // swapsForPairExhaustive,
// } from "../src/chain/actions/swapfinding4/swapsForPair.ts";
// import { maxInteger } from "../src/utils/constants.ts";
// import { genNonNegative } from "../src/utils/generators.ts";

// // Deno.test("swapfinding previous", () => {
// //   let genBuying = 0;
// //   let genSelling = 0;
// //   let durations = 0;
// //   let durations_ = 0;
// //   // while(true) {
// //   const iterations = 10000;
// //   for (let i = 0; i < iterations; i++) {

// //   }
// //   console.log("genBuying:", genBuying / iterations);
// //   console.log("genSelling:", genSelling / iterations);
// //   console.log("durations:", durations / iterations);
// //   console.log("durations_:", durations_ / iterations);
// // });

// Deno.test("swapfinding tight", () => {
//   let genBuying = 0;
//   let genSelling = 0;
//   let binary = 0;
//   let exhaustiveSort = 0;
//   let exhaustiveStraight = 0;
//   const expLimit = 11;
//   // const expLimit = Infinity;
//   const iterations = 500;
//   const maxOptions = 500;
//   for (let i = 0; i < iterations; i++) {
//     let buyingParams;
//     let sellingParams;
//     let maxSellingDelta;
//     let buyingOptions: AssetOptions;
//     let sellingOptions: AssetOptions;

//     while (true) {
//       buyingParams = genTightAssetParams();
//       sellingParams = genTightAssetParams();

//       buyingOptions = new AssetOptions(
//         "buying",
//         buyingParams.virtual,
//         buyingParams.locked,
//         buyingParams.balance,
//         buyingParams.weight,
//         buyingParams.jumpSize,
//         buyingParams.anchor,
//         buyingParams.minDelta,
//         sellingParams.weight,
//         expLimit,
//         true,
//       );

//       if (buyingOptions.options.length > maxOptions) continue;

//       maxSellingDelta = sellingParams.minDelta +
//         genNonNegative(maxInteger - sellingParams.minDelta);
//       // const maxSellingDelta = maxInteger;
//       sellingOptions = new AssetOptions(
//         "selling",
//         sellingParams.virtual,
//         sellingParams.locked,
//         sellingParams.balance,
//         sellingParams.weight,
//         sellingParams.jumpSize,
//         sellingParams.anchor,
//         sellingParams.minDelta,
//         maxSellingDelta,
//         expLimit,
//       );

//       if (sellingOptions.options.length > maxOptions) continue;

//       if (
//         buyingOptions.options.length > 0 && sellingOptions.options.length > 0
//       ) break;
//     }

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
//       expLimit,
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
//       expLimit,
//     );
//     genSelling += performance.now() - start;

//     console.log(buyingOptions.options.length, sellingOptions.options.length);

//     buyingOptions.options.forEach((buyingOption) => {
//       assert(buyingOption.mults === countMults(buyingOption.exp));
//       sellingOptions.options.forEach((sellingOption) => {
//         assert(sellingOption.mults === countMults(sellingOption.exp));
//         if (buyingOption.a0 === sellingOption.a0) {
//           assert(
//             buyingOption.delta * sellingOption.spot ===
//               sellingOption.delta * buyingOption.spot,
//           );
//         } else if (buyingOption.a0 < sellingOption.a0) {
//           assert(
//             buyingOption.delta * sellingOption.spot <
//               sellingOption.delta * buyingOption.spot,
//           );
//         } else {
//           assert(
//             buyingOption.delta * sellingOption.spot >
//               sellingOption.delta * buyingOption.spot,
//           );
//         }
//       });
//     });

//     const [optionsBinary, durationBinary] = swapsForPairBinary(
//       buyingOptions_,
//       sellingOptions_,
//       // Infinity, //expLimit,
//     );
//     binary += durationBinary;

//     const [optionsExhaustive, durationExhaustive] = swapsForPairExhaustive(
//       buyingOptions,
//       sellingOptions,
//       expLimit,
//     );
//     exhaustiveSort += durationExhaustive;
//     exhaustiveStraight += durationExhaustive;

//     const [optionsExhaustiveSort, durationSort] = paretoOptionsSort(
//       optionsExhaustive,
//     );
//     exhaustiveSort += durationSort;
//     // const [optionsExhaustiveStraight, durationStraight] = paretoOptionsStraight(
//     //   optionsExhaustive,
//     // );
//     // exhaustiveStraight += durationStraight;

//     // This fails, which means we have to indeed look at all the spread options
//     // optionsExhaustiveSort.forEach((option) =>
//     //   assert(option.buyingOption.maximized || option.sellingOption.maximized)
//     // );

//     // optionsExhaustiveSort = deduplicate(optionsExhaustiveSort);

//     const baseOptions = optionsExhaustiveSort;
//     // console.log("exhaustive Options", baseOptions.length);
//     for (const otherOptions of [optionsBinary]) {
//       // console.log("other Options", otherOptions.length);
//       const extraBase = baseOptions.filter((baseOption) =>
//         !otherOptions.some((otherOption) =>
//           baseOption.effectivePrice === otherOption.effectivePrice &&
//           baseOption.buyingOption.delta === otherOption.buyingOption.delta
//         )
//       );
//       const extraOther = otherOptions.filter((otherOption) =>
//         !baseOptions.some((baseOption) =>
//           baseOption.effectivePrice === otherOption.effectivePrice &&
//           baseOption.buyingOption.delta === otherOption.buyingOption.delta
//         )
//       );
//       const match = baseOptions.filter((baseOption) =>
//         otherOptions.some((otherOption) =>
//           baseOption.effectivePrice === otherOption.effectivePrice &&
//           baseOption.buyingOption.delta === otherOption.buyingOption.delta
//         )
//       );
//       if (extraBase.length > 0 || extraOther.length > 0) {
//         console.log("\nextra exhaustive:", extraBase);
//         console.log("\nextra other:", extraOther);
//         console.log("\nmatch:", match);
//         assert(extraBase.length === 0);
//         assert(extraOther.length === 0);
//       }
//     }
//   }
//   console.log("genBuying:", genBuying / iterations);
//   console.log("genSelling:", genSelling / iterations);
//   console.log("binary + sort:", binary / iterations);
//   console.log("exhaustive + sort:", exhaustiveSort / iterations);
//   console.log("exhaustive + straight:", exhaustiveStraight / iterations);
// });
