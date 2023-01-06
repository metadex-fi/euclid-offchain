// import {
//   fromHex,
//   genNonNegative,
//   genNumber,
//   PType,
//   randomChoice,
//   sha256,
//   toHex,
// } from "../../refactor_parse/lucid/src/mod.ts";
// import { Asset, PAsset } from "../src/types/asset.ts";
// import {
//   ActiveAssets,
//   Dirac,
//   DiracDatum,
//   PActiveAssets,
//   PDirac,
// } from "../src/types/dirac.ts";
// import { Param, ParamDatum, PParam, PParamDatum } from "../src/types/param.ts";
// import {
//   PCurrencySymbol,
//   PPaymentKeyHash,
//   PTokenName,
// } from "../src/types/primitive.ts";
// import { PValue, Value } from "../src/types/value.ts";
// import { contains } from "../src/utils.ts";
// import {
//   addAssetAmount,
//   addValues,
//   amountOf,
//   amountOfAsset,
//   assetSingleton,
//   assetsOf,
//   mapAmounts,
//   newValue,
//   setAssetAmount,
// } from "../src/value.ts";

// const maxNumAssets = 5;
// const maxJumpStores = 10;
// const maxThreadNFTs = 10;
// const maxJumps = 2n; // per direction, so 1 + 2 * maxJumps per dimension

// export function genEuclidData(ptype: PType): EuclidData {
//   if (ptype === PAmount) {
//     return genAmount();
//   } else if (ptype === PCurrencySymbol) {
//     return genCurrencySymbol();
//   } else if (ptype === PTokenName) {
//     return genTokenName();
//   } else if (ptype === PPaymentKeyHash) {
//     return genPaymentKeyHash();
//   } else if (ptype === PAsset) {
//     return genAsset();
//   } else if (ptype === PIdNFT) {
//     return genIdNFT();
//   } else if (ptype === PValue) {
//     const assets = genAssets();
//     return genValue(assets);
//   } else if (ptype === PPrices) {
//     const assets = genAssets();
//     return genPrices(assets);
//   } else if (ptype === PAmounts) {
//     const amountA0 = genInteger();
//     const assets = genAssets();
//     const prices = genPrices(assets);
//     return genAmounts(amountA0, prices);
//   } else if (ptype === PJumpSizes) {
//     const assets = genAssets();
//     return genJumpSizes(assets);
//   } else if (ptype === PActiveAssets) {
//     const assets = genAssets();
//     const initialPrices = genPrices(assets);
//     const jumpSizes = genPrices(assets);
//     return genActiveAssets(initialPrices, jumpSizes);
//   } else if (ptype === PDirac) {
//     return genDirac();
//   } else if (ptype === PParam) {
//     return genParam();
//   } else if (ptype === PDiracDatum) {
//     return genDiracDatum();
//   } else if (ptype === PParamDatum) {
//     return genParamDatum();
//   } else if (ptype === PEuclidDatum) {
//     return genEuclidDatum();
//   } else {
//     throw new Error("unknown ptype");
//   }
// }

// export function genPoolDatums(): EuclidDatum[] {
//   const param = genParam();
//   const diracs = genDiracs(param);
//   return [
//     genParamDatum(param),
//     ...diracs.map(genDiracDatum),
//   ];
// }

// export function genAssets(): Asset[] {
//   const numAssets = genNumber(maxNumAssets);
//   const assets: Asset[] = [];
//   while (assets.length < numAssets) {
//     const asset = genAsset();
//     if (!contains(assets, asset)) assets.push(asset);
//   }
//   return assets;
// }

// // export function genDirac(): Dirac {
// //   const owner = genPaymentKeyHash();
// //   const paramNFT = genIdNFT(owner);
// //   const numThreadNFTs = genNumber(maxThreadNFTs);
// //   let threadNFT = nextThreadNFT(paramNFT);
// //   for (let i = 0; i < numThreadNFTs; i++) {
// //     threadNFT = nextThreadNFT(paramNFT);
// //   }
// //   const assets = genAssets();
// //   const prices = genPrices(assets);
// //   const jumpSizes = genJumpSizes(assets);
// //   const baseAmountA0 = genInteger();
// //   const activeAmnts = genAmounts(baseAmountA0, prices);
// //   const jumpStorage = genActiveAssets(prices, jumpSizes);

// //   return new Dirac(
// //     owner,
// //     threadNFT,
// //     paramNFT,
// //     prices,
// //     activeAmnts,
// //     jumpStorage,
// //   );
// // }

// export function genEuclidDatum(): EuclidDatum {
//   return randomChoice([
//     genDiracDatum,
//     genParamDatum,
//   ])();
// }