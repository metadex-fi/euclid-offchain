import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genPositive,
  max,
  randomChoice,
} from "../src/utils/generators.ts";
import { maxInteger } from "../src/utils/constants.ts";
import { AssetConstants } from "../src/chain/actions/swapfinding3/assetConstants.ts";
import { SwappingBounds } from "../src/chain/actions/swapfinding3/boundaries.ts";

const outerTrials = 100;
const innerTrials = 100;

Deno.test("swapfinding", () => {
  for (let i = 0; i < outerTrials; i++) {
    for (let j = 0; j < innerTrials; j++) {
      const constants = AssetConstants.generatePair();

      const swappingBoundaries = SwappingBounds.new(
        constants.buying,
        constants.selling,
      );
      // const buyingPairBounds = AssetBounds.fromAssetConstants(buyingConstants)
      //   .toPairBounds(sellingConstants);
      // const sellingPairBounds = AssetBounds.fromAssetConstants(
      //   sellingConstants,
      // ).toPairBounds(buyingConstants);

      // const comparison = buyingPairBounds.compare(sellingPairBounds);
      // const finalBounds = comparison === -1
      //   ? buyingPairBounds
      //   : sellingPairBounds;
    }
  }
});

// this is the only one that's reversible
// Deno.test("swapfinding_delta_spot", () => {
//   for (let i = 0; i < outerTrials; i++) {
//     const direction = randomChoice(["buying", "selling"]);
//     const constants = AssetConstants.generateFor(
//       direction as "buying" | "selling",
//     );
//     for (let j = 0; j < innerTrials; j++) {
//       const delta = constants.minDelta +
//         genNonNegative(constants.maxDelta - constants.minDelta);
//       const spot = constants.calcSpotFromDelta(delta);
//       assert(
//         spot >= 1n,
//         `spot too small: ${spot} of ${constants.toString()}, delta: ${delta}`,
//       );
//       const delta_ = constants.calcDeltaFromSpot(spot);
//       assert(
//         delta === delta_,
//         `delta: ${delta} != ${delta_} of ${constants.toString()}, spot: ${spot}`,
//       );
//     }
//   }
// });

// note that this is not generally true, because of the rounding
// Deno.test("swapfinding_spot_delta", () => {
//   for (let i = 0; i < outerTrials; i++) {
//     const direction = randomChoice(["buying", "selling"]);
//     const constants = AssetConstants.generateFor(
//       direction as "buying" | "selling",
//     );
//     for (let j = 0; j < innerTrials; j++) {
//       const spot = genPositive();
//       const delta = constants.calcDeltaFromSpot(spot);
//       if (delta < 1n) continue;
//       const spot_ = constants.calcSpotFromDelta(delta);
//       const spot__ = constants.roundSpot(spot);
//       assert(
//         spot__ === spot_,
//         `spot: ${spot__} != ${spot_} of ${constants.toString()}, delta: ${delta}`,
//       );
//     }
//   }
// });
