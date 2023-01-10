// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import {
//   Dirac,
//   gMaxHashes,
//   IdNFT,
//   newGenActiveAssets,
//   PActiveAssets,
//   PAmounts,
//   Param,
//   PConstraint,
//   PDirac,
//   PIdNFT,
//   PList,
//   PObject,
//   POwner,
//   PParam,
//   PPositive,
//   PPrices,
//   PRecord,
//   Prices,
// } from "../mod.ts";

// export class PAllDiracs extends PConstraint<PList<PObject<Dirac>>> {
//   constructor(
//     public param: Param,
//   ) {
//     const pprices = PPrices.fromParam(param);
//     const pinner = new PList(
//       new PObject(
//         new PRecord({
//           "owner": POwner.pliteral(param.owner),
//           "threadNFT": PIdNFT.newPThreadNFT(param.owner),
//           "paramNFT": PIdNFT.newPParamNFT(param.owner),
//           "prices": pprices,
//           "activeAmnts": new PAmounts(param.baseAmountA0, prices),
//           "jumpStorage": new PActiveAssets(pprices),
//         }),
//         Dirac,
//       ),
//     );
//     super(
//       pinner,
//       [], // TODO asserts
//       newGenAllDiracs(param),
//     );
//   }

//   static genPType(): PConstraint<PList<PDirac>> {
//     const param = PParam.genPType().genData();
//     return new PAllDiracs(param);
//   }
// }

export const minTicks = 1n; // per dimension
export const maxTicks = 5n; // per dimension
// const PTicks = new PPositive(minTicks, maxTicks);

// const newGenAllDiracs = (param: Param) => (): Dirac[] => {
//   const assets = param.initialPrices.assets();
//   const paramNFT = new IdNFT(param.owner);
//   const numTicks = PTicks.genData();

//   const numDiracs = Number(numTicks) ** assets.size();
//   assert(numDiracs <= gMaxHashes, "too many diracs");

//   let threadNFT = paramNFT.next();
//   function genDiracForPrices(prices: Prices): Dirac {
//     const pprices = PPrices.fromParam(param);
//     const genActiveAssets = newGenActiveAssets(pprices);
//     return new Dirac(
//       param.owner,
//       threadNFT.asset(),
//       paramNFT.asset(),
//       prices,
//       new PAmounts(param.baseAmountA0, prices).genData(),
//       genActiveAssets(),
//     );
//   }

//   const prices = param.initialPrices;
//   let diracs = [
//     genDiracForPrices(prices),
//   ];
//   // for each asset and for each existing dirac, "spread" that dirac
//   // in that asset's dimension. "spread" means: add all other tick
//   // offsets for that asset's price.
//   for (const asset of assets.toList()) {
//     const jumpSize = param.jumpSizes.amountOf(asset);
//     const tickSize = jumpSize / numTicks;
//     const diracs_ = new Array<Dirac>();
//     diracs.forEach((dirac) => {
//       for (let offset = tickSize; offset < jumpSize; offset += tickSize) {
//         threadNFT = threadNFT.next();
//         const prices = dirac.prices.addAmountOf(asset, offset);
//         diracs_.push(
//           genDiracForPrices(prices),
//         );
//       }
//     });
//     diracs = diracs.concat(diracs_);
//   }

//   return diracs;
// };
