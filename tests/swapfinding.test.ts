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
  // swapsForPairBinary,
  swapsForPairExhaustive,
  // swapsForPairLinear,
  // swapsForPairExhaustive,
} from "../src/chain/actions/swapfinding4/swapsForPair.ts";
import { maxInteger } from "../src/utils/constants.ts";
import { genNonNegative } from "../src/utils/generators.ts";
import {
  AssetOptionsStrict,
  swapsForPairBinary,
  swapsForPairExhaustiveStrict,
} from "../src/chain/actions/swapfinding4/swapsForPair%20copy.ts";

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
  let exhaustive = 0;
  let exhaustiveStrict = 0;
  const expLimit = 11;
  // const expLimit = Infinity;
  const iterations = 1000;
  const maxOptions = 500;
  for (let i = 0; i < iterations; i++) {
    let buyingParams;
    let sellingParams;
    let maxSellingDelta;
    let buyingOptions: AssetOptions;
    let sellingOptions: AssetOptions;

    while (true) {
      buyingParams = genTightAssetParams();
      sellingParams = genTightAssetParams();

      // console.log("genBuying");
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

      // if (buyingOptions.options.length > maxOptions) continue;

      maxSellingDelta = sellingParams.minDelta +
        genNonNegative(maxInteger - sellingParams.minDelta);
      // const maxSellingDelta = maxInteger;
      // console.log("genSelling");
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
      // console.log("done");

      // if (sellingOptions.options.length > maxOptions) continue;

      // if (
      //   buyingOptions.options.length > 0 && sellingOptions.options.length > 0
      // ) break;
      break;
    }

    let start = performance.now();
    // console.log("genBuying_");
    const buyingOptions_ = new AssetOptionsStrict(
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

    // console.log("genSelling_");
    const sellingOptions_ = new AssetOptionsStrict(
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
    // console.log("done_");
    genSelling += performance.now() - start;

    // console.log(buyingOptions.options.length, sellingOptions.options.length);

    // buyingOptions.options.forEach((buyingOption) => {
    //   assert(buyingOption.mults === countMults(buyingOption.exp));
    //   sellingOptions.options.forEach((sellingOption) => {
    //     assert(sellingOption.mults === countMults(sellingOption.exp));
    //     if (buyingOption.a0 === sellingOption.a0) {
    //       assert(
    //         buyingOption.delta * sellingOption.spot ===
    //           sellingOption.delta * buyingOption.spot,
    //       );
    //     } else if (buyingOption.a0 < sellingOption.a0) {
    //       assert(
    //         buyingOption.delta * sellingOption.spot <
    //           sellingOption.delta * buyingOption.spot,
    //       );
    //     } else {
    //       assert(
    //         buyingOption.delta * sellingOption.spot >
    //           sellingOption.delta * buyingOption.spot,
    //       );
    //     }
    //   });
    // });

    // console.log("binary");
    // const [optionsBinary, durationBinary] = swapsForPairBinary(
    //   buyingOptions_,
    //   sellingOptions_,
    //   expLimit,
    // );
    // binary += durationBinary;

    // console.log("exhaustive");
    const [optionsExhaustive, durationExhaustive] = swapsForPairExhaustive(
      buyingOptions,
      sellingOptions,
      expLimit,
    );
    exhaustive += durationExhaustive;

    const [optionsExhaustiveStrict, durationExhaustiveStrict] =
      swapsForPairExhaustiveStrict(
        buyingOptions_,
        sellingOptions_,
        expLimit,
      );
    exhaustiveStrict += durationExhaustiveStrict;

    // console.log("comparing");
    const baseOptions = optionsExhaustive;
    // console.log("exhaustive Options", baseOptions.length);
    for (const otherOptions of [optionsExhaustiveStrict]) {
      // console.log("other Options", otherOptions.length);
      const extraBase = baseOptions.filter((baseOption) =>
        !otherOptions.some((otherOption) =>
          baseOption.effectivePrice === otherOption.effectivePrice &&
          baseOption.buyingOption.delta === otherOption.buyingOption.delta
        )
      );
      const extraOther = otherOptions.filter((otherOption) =>
        !baseOptions.some((baseOption) =>
          baseOption.effectivePrice === otherOption.effectivePrice &&
          baseOption.buyingOption.delta === otherOption.buyingOption.delta
        )
      );
      const match = baseOptions.filter((baseOption) =>
        otherOptions.some((otherOption) =>
          baseOption.effectivePrice === otherOption.effectivePrice &&
          baseOption.buyingOption.delta === otherOption.buyingOption.delta
        )
      );
      if (extraBase.length > 0 || extraOther.length > 0) {
        console.log("\nextra exhaustive:", extraBase);
        console.log("\nextra other:", extraOther);
        console.log("\nmatch:", match);
        assert(extraBase.length === 0);
        assert(extraOther.length === 0);
      }
    }
  }
  console.log("genBuying:", genBuying / iterations);
  console.log("genSelling:", genSelling / iterations);
  console.log("binary:", binary / iterations);
  console.log("exhaustive:", exhaustive / iterations);
  console.log("exhaustiveStrict:", exhaustiveStrict / iterations);
});
