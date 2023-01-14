import {
  Generators,
  PByteString,
  PConstr,
  PConstraint,
  PEnum,
  PInteger,
  PList,
  PLiteral,
  PMap,
  // PMapRecord,
  PObject,
  PRecord,
  proptestPTypes,
} from "../src/mod.ts";

// import { PActiveAssets } from "../src/types/euclid/activeAssets.ts";
// import { PDirac, PDiracDatum } from "../src/types/euclid/dirac.ts";

Deno.test("euclid data/types tests", () => {
  const gen = new Generators(
    [
      ...fundamentalPrimitiveGenerators,
      // ...derivedPrimitiveGenerators,
      // ...euclidPrimitiveGenerators,
    ],
    [
      ...fundamentalContainerGenerators,
      // ...derivedContainerGenerators,
    ],
  );
  proptestPTypes(gen, 5000);
});

const fundamentalPrimitiveGenerators = [
  // PAny.genPType,
  PInteger.genPType,
  PByteString.genPType,
];

const fundamentalContainerGenerators = [
  PLiteral.genPType,
  PEnum.genPType,
  PConstraint.genPType,
  PList.genPType,
  PMap.genPType,
  // PMapRecord.genPType,
  PRecord.genPType,
  PConstr.genPType,
  PObject.genPType,
  // PSum.genPType,
];

// const derivedPrimitiveGenerators = [
//   PBounded.genPType,
//   PPositive.genPType,
//   PAsset.genPType,
//   PAssets.genPType,
//   PValue.genPType,
//   PPositiveValue.genPType,
// ];

// const derivedContainerGenerators = [
//   PNonEmptyList.genPType,
// ];

// const euclidPrimitiveGenerators = [
//   POwner.genPType,
//   PIdNFT.genPType,
//   PJumpSizes.genPType,
//   PPrices.genPType,
//   PParam.genPType,
//   PParamDatum.genPType,
//   PAmounts.genPType,
//   PActiveAssets.genPType,
//   PDirac.genPType,
//   PDiracDatum.genPType,
//   // PAllDiracs.genPType,
//   // PEuclidDatum.genPType,
// ];
