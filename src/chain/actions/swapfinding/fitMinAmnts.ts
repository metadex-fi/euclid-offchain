// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import { bestMultiplicationsAhead, updatedAmnts } from "./helpers.ts";
// import { maxInteger } from "../../../utils/constants.ts";
// import { AssetArgs, PostFitAmnts } from "./assetArgs.ts";

// interface PreFitAmnts {
//   readonly adhereMaxInteger: boolean;
//   readonly tmpMinBuying: bigint | null;
//   readonly expLimit: number | null;
//   readonly buying: AssetArgs;
//   readonly selling: AssetArgs;
// }

// export const fitMinAmnts = (args: PreFitAmnts): PostFitAmnts | null => {
//   let maxIntImpacted = false;
//   const minBuying = args.tmpMinBuying ?? args.buying.consts.min;
//   let maxBuyingA0 = -1n;
//   let maxSellingA0 = -1n;
//   let maxSwapA0 = -1n;
//   args.buying.vars.amnt = -1n;
//   args.selling.vars.amnt = -1n;
//   // let limitReached: "buying" | "selling" | "none" = "none";
//   let increaseSellingExp = (_by: bigint) => {};
//   let increaseBuyingExp = (_by: bigint) => {};
//   let loopAgain = false;

//   assert(
//     minBuying <= args.buying.vars.max,
//     `minBuying > maxBuying: ${minBuying} > ${args.buying.vars.max}`,
//   );
//   assert(
//     args.selling.consts.min <= args.selling.vars.max,
//     `minSelling > maxSelling: ${args.selling.consts.min} > ${args.selling.vars.max}`,
//   );

//   const updateAmounts = (
//     // expOptimization = false,
//     // direction = "unknown",
//   ): boolean => {
//     const newAmnts = updatedAmnts(
//       args.buying.vars.spot,
//       args.selling.vars.spot,
//       args.buying.vars.max,
//       args.selling.vars.max,
//     );

//     // logically only this one is confirmed, but the other one worked before
//     // if (direction === "sellingAmnt" && newAmnts.newMaxSwapA0 < maxSwapA0) {

//     //TODO FIXME (this works when using minSelling updatedAmnts)
//     if (newAmnts.newMaxSwapA0 < maxSwapA0) {
//       console.log(`maxSwapA0 was decreased:
//         ${newAmnts.newMaxSwapA0} < ${maxSwapA0}
//         diff: ${newAmnts.newMaxSwapA0 - maxSwapA0}
//         // maxBuyingA0: ${maxBuyingA0} -> ${newAmnts.newMaxBuyingA0}
//         // maxSellingA0: ${maxSellingA0} -> ${newAmnts.newMaxSellingA0}
//     `);
//       return false;
//     }

//     // // TODO why do those fail?
//     // // if (
//     // //   direction === "buyingAmnt" &&
//     // //   newAmnts.newBuyingAmnt < args.buying.vars.amnt
//     // // ) {
//     // //   console.log(
//     // //     `buyingAmnt was decreased: ${newAmnts.newBuyingAmnt} < ${args.buying.vars.amnt}`,
//     // //   );
//     // //   return false;
//     // // }

//     // if (
//     //   direction === "sellingAmnt" &&
//     //   newAmnts.newSellingAmnt < args.selling.vars.amnt
//     // ) {
//     //   console.log(
//     //     `sellingAmnt was decreased: ${newAmnts.newSellingAmnt} < ${args.selling.vars.amnt}`,
//     //   );
//     //   return false;
//     // }

//     assert(newAmnts.newMaxSellingA0 !== null, `newMaxSellingA0 is null`);
//     // if (newAmnts.newSellingAmnt < args.selling.consts.min) {
//     //   //TODO WIP, wild guess
//     //   console.log(
//     //     `newSellingAmnt < minSelling: ${newAmnts.newSellingAmnt} < ${args.selling.consts.min}`,
//     //   );
//     //   loopAgain = true;
//     //   return true;
//     // }
//     maxSwapA0 = newAmnts.newMaxSwapA0;
//     maxBuyingA0 = newAmnts.newMaxBuyingA0;
//     maxSellingA0 = newAmnts.newMaxSellingA0;
//     args.buying.vars.amnt = newAmnts.newBuyingAmnt;
//     args.selling.vars.amnt = newAmnts.newSellingAmnt;

//     return true;
//   };

//   assert(updateAmounts(), `updateAmounts() failed`);

//   if (
//     loopAgain ||
//     args.buying.vars.amnt < minBuying ||
//     args.selling.vars.amnt < args.selling.consts.min
//   ) {
//     console.log("looping");

//     const infiniteSellable = args.selling.consts.available === -1n;
//     if (
//       args.buying.consts.available <= 0n ||
//       (!infiniteSellable &&
//         args.selling.consts.available < args.selling.consts.min)
//     ) return null;

//     let buyingBestMults = args.expLimit
//       ? bestMultiplicationsAhead(Number(args.buying.vars.exp))
//       : null;
//     let sellingBestMults = args.expLimit
//       ? bestMultiplicationsAhead(Number(args.selling.vars.exp))
//       : null;

//     increaseSellingExp = (by: bigint) => {
//       args.selling.vars.exp += by;
//       if (sellingBestMults !== null) {
//         sellingBestMults = bestMultiplicationsAhead(
//           Number(args.selling.vars.exp),
//         );
//       }
//       args.selling.vars.spot = args.selling.funcs.calcSpot_(
//         args.selling.vars.exp,
//       );
//     };

//     increaseBuyingExp = (by: bigint) => {
//       args.buying.vars.exp += by;
//       if (buyingBestMults !== null) {
//         buyingBestMults = bestMultiplicationsAhead(
//           Number(args.buying.vars.exp),
//         );
//       }
//       args.buying.vars.spot = args.buying.funcs.calcSpot_(
//         args.buying.vars.exp,
//       );
//     };

//     let sellingLimit = false;
//     let buyingLimit = false;
//     let direction = "bothAmnts";
//     while (
//       loopAgain ||
//       args.buying.vars.amnt < minBuying ||
//       args.selling.vars.amnt < args.selling.consts.min
//     ) {
//       loopAgain = false;
//       if (
//         args.buying.vars.amnt < minBuying &&
//         args.selling.vars.amnt < args.selling.consts.min
//       ) {
//         assert(maxSellingA0 <= maxBuyingA0, `maxSellingA0 > maxBuyingA0`);
//         // assert(direction === "bothAmnts", `direction !== "both"`);
//         direction = "bothAmnts";
//       } else if (args.buying.vars.amnt < minBuying) {
//         assert(maxSellingA0 <= maxBuyingA0, `maxSellingA0 > maxBuyingA0`);
//         assert(direction !== "sellingAmnt", `direction === "sellingAmnt"`); // this fails when not using minSelling in updatedAmnts
//         direction = "buyingAmnt";
//       } else if (args.selling.vars.amnt < args.selling.consts.min) {
//         assert(maxSellingA0 > maxBuyingA0, `maxSellingA0 <= maxBuyingA0`);
//         assert(direction !== "buyingAmnt", `direction === "buyingAmnt"`);
//         direction = "sellingAmnt";
//       } else {
//         throw new Error(`should not happen`);
//       }

//       console.log(`
//         minBuying:    ${minBuying}
//         minSelling:   ${args.selling.consts.min}
//         maxBuying:    ${args.buying.vars.max}
//         maxSelling:   ${args.selling.vars.max}
//         maxBuyingA0:  ${maxBuyingA0}
//         maxSellingA0: ${maxSellingA0}
//         maxSwapA0:    ${maxSwapA0}
//         buyingSpot:   ${args.buying.vars.spot}
//         sellingSpot:  ${args.selling.vars.spot}
//         buyingExp:    ${args.buying.vars.exp}
//         sellingExp:   ${args.selling.vars.exp}
//         buyingAmnt:   ${args.buying.vars.amnt}
//         sellingAmnt:  ${args.selling.vars.amnt}
//         sellingLimit: ${sellingLimit}
//         buyingLimit:  ${buyingLimit}
//         direction:    ${direction}
//         `);
//       // limitReached: ${limitReached}
//       // limitReached = "none";
//       // const oldMaxSelling = args.selling.vars.max;
//       // const oldMaxBuying = args.buying.vars.max;

//       /*
//         we can increase buyingAmnt by increasing maxSwapA0 (can't decrease sellingSpot)
//         we can increase sellingAmnt by increasing maxSwapA0 and by decreasing buyingSpot.

//         we can potentially increase maxSwapA0 by
//           - if maxBuyingA0 is the smaller one: increasing maxBuying and increasing sellingSpot
//           - if maxSellingA0 is the smaller one: increasing maxSelling (can't increase buyingSpot)

//         we know empirically that the following always coincide:
//           - maxBuyingA0 is smaller <-> only sellingAmnt is below minSelling
//           - maxSellingA0 is smaller <-> buyingAmnt is below minBuying

//         -->

//         when only sellingAmnt is below minSelling, we can increase it by
//           - decreasing buyingSpot
//           - increasing maxSwapA0 by increasing maxBuying
//           - increasing maxSwapA0 by increasing sellingSpot

//         when buyingAmnt is below minBuying, we can increase it by
//           - increasing maxSwapA0 by increasing maxSelling

//         we have two moves:
//           - increasing sellingSpot -> increases maxSelling => increases buyingAmnt and sellingAmnt
//           - decreasing buyingSpot -> increases maxBuying => both increase sellingAmnt

//         but: increasing sellingSpot alsa decreases buyingAmnt
//         --> in general increasing sellingSpot increases buyingAmnt, but we might get some weird rounding edgecases

//         also: the move that mostly increases buyingAmnt always increases sellingAmnt, so while we need to increase buyingAmnt,
//         we do not care whether we need to increase sellingAmnt as well.
//       */

//       if (direction === "buyingAmnt" || direction === "bothAmnts") {
//         if (sellingLimit) return null;
//         increaseSellingExp(1n);
//         if (args.adhereMaxInteger && args.selling.vars.spot > maxInteger) {
//           console.log(
//             `sellingSpot > maxInteger: ${args.selling.vars.spot} > ${maxInteger}`,
//           );
//           increaseSellingExp(-1n);
//           sellingLimit = true;
//           // limitReached = "selling";
//           maxIntImpacted = true;
//         } else {
//           const delta = args.selling.funcs.calcDelta_(args.selling.vars.spot);
//           console.log(`deltaSelling: ${delta}`);
//           let newMaxSelling;
//           if (!infiniteSellable) {
//             if (args.selling.consts.available <= delta) {
//               newMaxSelling = args.selling.consts.available;
//               console.log(
//                 `sellingLimit reached - availableSelling <= d: ${args.selling.consts.available} <= ${delta}`,
//               );
//               sellingLimit = true;
//               // limitReached = "selling";
//             } else {
//               newMaxSelling = delta;
//             }
//           } else {
//             newMaxSelling = delta;
//           }
//           assert(
//             newMaxSelling >= args.selling.vars.max,
//             `maxSelling was decreased:
//             ${newMaxSelling} < ${args.selling.vars.max}
//             diff: ${newMaxSelling - args.selling.vars.max}`,
//           );
//           args.selling.vars.max = newMaxSelling;
//         }
//       } else {
//         assert(
//           direction === "sellingAmnt",
//           `strange direction: ${direction}`,
//         );
//         if (buyingLimit) return null;
//         increaseBuyingExp(-1n);
//         const delta = -args.buying.funcs.calcDelta_(args.buying.vars.spot);
//         console.log(`-deltaBuying: ${delta}`);
//         let newMaxBuying;
//         if (args.buying.consts.available <= delta) {
//           newMaxBuying = args.buying.consts.available;
//           console.log(
//             `buyingLimit reached - availableBuying <= d: ${args.buying.consts.available} <= ${delta}`,
//           );
//           buyingLimit = true;
//           // limitReached = "buying";
//         } else {
//           newMaxBuying = delta;
//         }
//         assert(
//           newMaxBuying >= args.buying.vars.max,
//           `maxBuying was decreased:
//           ${newMaxBuying} <= ${args.buying.vars.max}
//           diff: ${newMaxBuying - args.buying.vars.max}`,
//         );
//         args.buying.vars.max = newMaxBuying;
//       }

//       if (
//         args.expLimit !== null &&
//         buyingBestMults! + sellingBestMults! > args.expLimit
//       ) return null;

//       assert(updateAmounts(), `updateAmounts() failed`);
//       // assert(updateAmounts(false, direction), `updateAmounts() failed`);
//       // if (!updateAmounts(false, direction)) {
//       //   if (limitReached === "selling") {
//       //     increaseSellingExp(-1n);
//       //     selling.vars.max = oldMaxSelling;
//       //   } else if (limitReached === "buying") {
//       //     increaseBuyingExp(1n);
//       //     buying.vars.max = oldMaxBuying;
//       //   } else {
//       //     throw new Error(`limitReached === "none"`);
//       //   }
//       // }
//     }
//   } else console.log("not looping");

//   console.log(`
//         fitted minAmnts:
//     ---------------------------
//     buyingAmnt:   ${args.buying.vars.amnt}
//     sellingAmnt:  ${args.selling.vars.amnt}
//     buyingSpot:   ${args.buying.vars.spot}
//     sellingSpot:  ${args.selling.vars.spot}
//     maxBuyingA0:  ${maxBuyingA0}
//     maxSellingA0: ${maxSellingA0}
//     buyingExp:    ${args.buying.vars.exp}
//     sellingExp:   ${args.selling.vars.exp}
//     maxSwapA0:    ${maxSwapA0}
//     maxBuying:    ${args.buying.vars.max}
//     maxSelling:   ${args.selling.vars.max}
//     minBuying:    ${minBuying}
//     minSelling:   ${args.selling.consts.min}
//     ---------------------------
//   `);

//   return {
//     buyingVars: args.buying.vars,
//     sellingVars: args.selling.vars,
//     maxIntImpacted,
//   };
// };
