// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import {
//   AssetOption,
//   genTightAssetParams,
//   PairOptions,
// } from "../src/chain/actions/swapfinding6/swapsForPair.ts";
// // import { maxSmallInteger } from "../src/types/euclid/smallValue.ts";
// // import { maxInteger } from "../src/utils/constants.ts";
// import {
//   genNonNegative,
//   genPositive,
//   randomChoice,
// } from "../src/utils/generators.ts";
// import { webappExpLimit } from "../src/mod.ts";

// const maxIntegerLocal = 1000000n; // NOTE this

// Deno.test("swapfinding tight", () => {
//   const iterations = 1000;
//   let durationExact = 0;
//   let durationPerExpMaxDelta = 0;
//   let durationImperfectMaxDelta = 0;
//   let durationExactRounding = 0;
//   let durationPerExpMaxDeltaRounding = 0;
//   let durationImperfectMaxDeltaRounding = 0;

//   for (let i = 0; i < iterations; i++) {
//     let buyingParams;
//     let sellingParams;
//     let buyingOption: AssetOption;
//     let sellingOption: AssetOption;

//     while (true) {
//       while (true) {
//         buyingParams = genTightAssetParams(maxIntegerLocal);
//         if (
//           buyingParams.minDelta <= buyingParams.available
//         ) {
//           break;
//         }
//       }
//       sellingParams = genTightAssetParams(maxIntegerLocal);

//       buyingOption = AssetOption.initial(
//         "buying",
//         buyingParams.virtual,
//         buyingParams.balance,
//         buyingParams.weight,
//         buyingParams.anchor,
//         buyingParams.jumpSize,
//         buyingParams.minDelta,
//         buyingParams.available,
//       );

//       sellingOption = AssetOption.initial(
//         "selling",
//         sellingParams.virtual,
//         sellingParams.balance,
//         sellingParams.weight,
//         sellingParams.anchor,
//         buyingParams.jumpSize,
//         sellingParams.minDelta,
//         randomChoice([
//           "oo",
//           sellingParams.minDelta +
//           genNonNegative(maxIntegerLocal - sellingParams.minDelta),
//         ]),
//       );

//       break;
//     }
//     console.log("iteration", i);

//     const runAsserts = true;

//     let start = performance.now();
//     let pairOptions = new PairOptions(
//       buyingOption,
//       sellingOption,
//       webappExpLimit, // TODO test different ones, and fix infinite loop that sometimes happens. And test the maxIntImpacted thing with it
//       maxIntegerLocal,
//       runAsserts,
//       "exact",
//     );
//     let end = performance.now();
//     durationExact += end - start;

//     // start = performance.now();
//     // pairOptions = new PairOptions(
//     //   buyingOption,
//     //   sellingOption,
//     //   webappExpLimit, // TODO test different ones, and fix infinite loop that sometimes happens. And test the maxIntImpacted thing with it
//     //   maxIntegerLocal,
//     //   runAsserts,
//     //   "perExpMaxDelta",
//     // );
//     // end = performance.now();
//     // durationPerExpMaxDelta += end - start;

//     // start = performance.now();
//     // pairOptions = new PairOptions(
//     //   buyingOption,
//     //   sellingOption,
//     //   webappExpLimit, // TODO test different ones, and fix infinite loop that sometimes happens. And test the maxIntImpacted thing with it
//     //   maxIntegerLocal,
//     //   runAsserts,
//     //   "imperfectMaxDelta",
//     // );
//     // end = performance.now();
//     // durationImperfectMaxDelta += end - start;

//     // start = performance.now();
//     // pairOptions = new PairOptions(
//     //   buyingOption,
//     //   sellingOption,
//     //   webappExpLimit, // TODO test different ones, and fix infinite loop that sometimes happens. And test the maxIntImpacted thing with it
//     //   maxIntegerLocal,
//     //   runAsserts,
//     //   "exact",
//     //   100n,
//     // );
//     // end = performance.now();
//     // durationExactRounding += end - start;

//     // start = performance.now();
//     // pairOptions = new PairOptions(
//     //   buyingOption,
//     //   sellingOption,
//     //   webappExpLimit, // TODO test different ones, and fix infinite loop that sometimes happens. And test the maxIntImpacted thing with it
//     //   maxIntegerLocal,
//     //   runAsserts,
//     //   "perExpMaxDelta",
//     //   100n,
//     // );
//     // end = performance.now();
//     // durationPerExpMaxDeltaRounding += end - start;

//     // start = performance.now();
//     // pairOptions = new PairOptions(
//     //   buyingOption,
//     //   sellingOption,
//     //   webappExpLimit, // TODO test different ones, and fix infinite loop that sometimes happens. And test the maxIntImpacted thing with it
//     //   maxIntegerLocal,
//     //   runAsserts,
//     //   "imperfectMaxDelta",
//     //   100n,
//     // );
//     // end = performance.now();
//     // durationImperfectMaxDeltaRounding += end - start;

//     // console.log(
//     //   pairOptions.maxIntegerImpacted,
//     //   pairOptions.bestAdheringOption?.effectivePrice,
//     //   // pairOptions.bestOverallOption?.effectivePrice,
//     // );

//     // let bestPrice: number | undefined = undefined;
//     // for (let i = 0n; i <= 0n; i++) {
//     //   const pairOptions = new PairOptions(
//     //     buyingOption,
//     //     sellingOption,
//     //     11,
//     //     10n ** i,
//     //   );
//     //   if (bestPrice === undefined) {
//     //     bestPrice = pairOptions.bestAdheringOption?.effectivePrice;
//     //     console.log(
//     //       "intially",
//     //       i,
//     //       pairOptions.maxIntegerImpacted,
//     //       pairOptions.bestAdheringOption?.effectivePrice,
//     //       pairOptions.bestOverallOption?.effectivePrice,
//     //     );
//     //   } else {
//     //     assert(pairOptions.bestAdheringOption);
//     //     if (pairOptions.bestAdheringOption.effectivePrice < bestPrice) {
//     //       console.log(
//     //         "improved after",
//     //         i,
//     //         pairOptions.maxIntegerImpacted,
//     //         pairOptions.bestAdheringOption?.effectivePrice,
//     //         pairOptions.bestOverallOption?.effectivePrice,
//     //       );
//     //       bestPrice = pairOptions.bestAdheringOption.effectivePrice;
//     //     } else {
//     //       console.log(
//     //         "same after",
//     //         i,
//     //         pairOptions.maxIntegerImpacted,
//     //         pairOptions.bestAdheringOption?.effectivePrice,
//     //         pairOptions.bestOverallOption?.effectivePrice,
//     //       );
//     //     }
//     //   }
//     //   // console.log(i, pairOptions.bestPriceOption?.effectivePrice);
//     // }
//     // if (bestPrice !== undefined) console.log("\tbestPrice", bestPrice);
//   }

//   console.log("durationExact:", durationExact / iterations);
//   console.log("durationPerExpMaxDelta:", durationPerExpMaxDelta / iterations);
//   console.log(
//     "durationImperfectMaxDelta:",
//     durationImperfectMaxDelta / iterations,
//   );
//   console.log(
//     "durationExactRounding:",
//     durationExactRounding / iterations,
//   );
//   console.log(
//     "durationPerExpMaxDeltaRounding:",
//     durationPerExpMaxDeltaRounding / iterations,
//   );
//   console.log(
//     "durationImperfectMaxDeltaRounding:",
//     durationImperfectMaxDeltaRounding / iterations,
//   );
// });
