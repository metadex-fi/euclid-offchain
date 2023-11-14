import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  AssetOptions,
  countMults,
  // deduplicate,
  genTightAssetParams,
  genWildAssetParams,
  pairOptionsEqual,
  paretoOptionsSort,
  paretoOptionsStraight,
  swapsForPairBinary,
  swapsForPairExhaustive,
  // swapsForPairLinear,
  // swapsForPairExhaustive,
} from "../src/chain/actions/swapfinding4/swapsForPair.ts";
import { maxInteger } from "../src/utils/constants.ts";
import { genNonNegative } from "../src/utils/generators.ts";

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

Deno.test("swapfinding tight", () => {
  let genBuying = 0;
  let genSelling = 0;
  let binary = 0;
  let exhaustiveSort = 0;
  let exhaustiveStraight = 0;
  const expLimit = 11;
  const iterations = 100;
  const maxOptions = 100;
  for (let i = 0; i < iterations; i++) {
    let buyingParams;
    let sellingParams;
    let maxSellingDelta;
    let buyingOptions: AssetOptions;
    let sellingOptions: AssetOptions;

    while (true) {
      buyingParams = genTightAssetParams();
      sellingParams = genTightAssetParams();

      buyingOptions = new AssetOptions(
        "buying",
        buyingParams.virtual,
        buyingParams.locked,
        buyingParams.balance,
        buyingParams.weight,
        buyingParams.jumpSize,
        buyingParams.anchor,
        buyingParams.minDelta,
        sellingParams.weight,
        expLimit,
        true,
      );

      if (buyingOptions.options.length > maxOptions) continue;

      maxSellingDelta = sellingParams.minDelta +
        genNonNegative(maxInteger - sellingParams.minDelta);
      // const maxSellingDelta = maxInteger;
      sellingOptions = new AssetOptions(
        "selling",
        sellingParams.virtual,
        sellingParams.locked,
        sellingParams.balance,
        sellingParams.weight,
        sellingParams.jumpSize,
        sellingParams.anchor,
        sellingParams.minDelta,
        maxSellingDelta,
        expLimit,
      );

      if (sellingOptions.options.length > maxOptions) continue;

      if (
        buyingOptions.options.length > 0 && sellingOptions.options.length > 0
      ) break;
    }

    let start = performance.now();
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
      expLimit,
      true,
    );
    genBuying += performance.now() - start;
    start = performance.now();

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
      expLimit,
    );
    genSelling += performance.now() - start;

    console.log(buyingOptions.options.length, sellingOptions.options.length);

    const [optionsBinary, durationBinary] = swapsForPairBinary(
      buyingOptions_,
      sellingOptions_,
      expLimit,
    );
    binary += durationBinary;

    const [optionsExhaustive, durationExhaustive] = swapsForPairExhaustive(
      buyingOptions,
      sellingOptions,
      expLimit,
    );
    exhaustiveSort += durationExhaustive;
    exhaustiveStraight += durationExhaustive;

    const [optionsExhaustiveSort, durationSort] = paretoOptionsSort(
      optionsExhaustive,
    );
    exhaustiveSort += durationSort;
    const [optionsExhaustiveStraight, durationStraight] = paretoOptionsStraight(
      optionsExhaustive,
    );
    exhaustiveStraight += durationStraight;

    // This fails, which means we have to indeed look at all the spread options
    // optionsExhaustiveSort.forEach((option) =>
    //   assert(option.buyingOption.maximized || option.sellingOption.maximized)
    // );

    // optionsExhaustiveSort = deduplicate(optionsExhaustiveSort);

    for (const otherOptions of [optionsExhaustiveStraight, optionsBinary]) {
      console.log("comparing");
      if (optionsExhaustiveSort.length !== otherOptions.length) {
        console.log(
          `missed ${optionsExhaustiveSort.length - otherOptions.length}`,
        );
        optionsExhaustiveSort.forEach((pairOption) =>
          console.log(
            pairOption,
            countMults(pairOption.buyingOption.exp),
            countMults(pairOption.sellingOption.exp),
          )
        );
        console.log("\nvs\n");
        otherOptions.forEach((pairOption) =>
          console.log(
            pairOption,
            countMults(pairOption.buyingOption.exp),
            countMults(pairOption.sellingOption.exp),
          )
        );
        // throw new Error(
        //   `missed ${optionsExhaustiveSort.length - optionsBinary.length}`,
        // );
        // break;
      } //else {
      //   for (let i = 0; i < pairOptionsSort.length; i++) {
      //     if (
      //       pairOptionsSort[i].effectivePrice <
      //         pairOptionsStraight[i].effectivePrice
      //     ) {
      //       console.log("better price");
      //       for (let j = 0; j < pairOptionsSort.length; j++) {
      //         if (i === j) console.log("============= (here)");
      //         else console.log("=============");
      //         console.log(pairOptionsSort[j]);
      //         console.log("-------------");
      //         console.log(pairOptionsStraight[j]);
      //       }
      //       // throw new Error("better price");
      //     } else if (
      //       pairOptionsSort[i].effectivePrice >
      //         pairOptionsStraight[i].effectivePrice
      //     ) {
      //       console.log("worse price");
      //       for (let j = 0; j < pairOptionsSort.length; j++) {
      //         if (i === j) console.log("============= (here)");
      //         else console.log("=============");
      //         console.log(pairOptionsSort[j]);
      //         console.log("-------------");
      //         console.log(pairOptionsStraight[j]);
      //       }
      //       // throw new Error("worse price");
      //     } else {
      //       // assert(pairOptionsEqual(pairOptionsSort[i], pairOptionsStraight[i]));
      //     }
      //     // assert(pairOptionsSort[i].effectivePrice <= pairOptionsStraight[i].effectivePrice);
      //   }
      // }
      assert(
        optionsExhaustiveSort.length === otherOptions.length,
        `${optionsExhaustiveSort.length} !== ${otherOptions.length}`,
      );
      console.log("match");
    }
  }
  console.log("genBuying:", genBuying / iterations);
  console.log("genSelling:", genSelling / iterations);
  console.log("binary + sort:", binary / iterations);
  console.log("exhaustive + sort:", exhaustiveSort / iterations);
  console.log("exhaustive + straight:", exhaustiveStraight / iterations);
});
