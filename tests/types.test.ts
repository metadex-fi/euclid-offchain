import {
  Generators,
  PAmounts,
  PAsset,
  PAssets,
  PBounded,
  PByteString,
  PConstr,
  PConstraint,
  PIdNFT,
  PInteger,
  PList,
  PLiteral,
  PMap,
  PMapRecord,
  PNonEmptyList,
  PObject,
  POwner,
  PParam,
  PPositive,
  PPositiveValue,
  PPrices,
  PRecord,
  proptestPTypes,
  PValue,
} from "../src/mod.ts";

Deno.test("euclid data/types tests", () => {
  // @ts-ignore TODO consider fixing this or leaving as is
  const gen = new Generators(
    // @ts-ignore TODO consider fixing this or leaving as is
    [
      ...fundamentalPrimitiveGenerators,
      // ...derivedPrimitiveGenerators,
      // ...euclidPrimitiveGenerators,
    ],
    [
      ...fundamentalContainerGenerators,
      // ...derivedContainerGenerators,
      // ...euclidContainerGenerators,
    ],
  );
  proptestPTypes(gen, 2000);
});

const fundamentalPrimitiveGenerators = [
  // PAny.genPType,
  PInteger.genPType,
  PByteString.genPType,
];

const fundamentalContainerGenerators = [
  // PLiteral.genPType,
  // PConstraint.genPType,
  // PList.genPType,
  // PMap.genPType,
  // PMapRecord.genPType,
  PRecord.genPType,
  // PConstr.genPType,
  // PObject.genPType,
  // PSum.genPType,
];

const derivedPrimitiveGenerators = [
  PBounded.genPType,
  PPositive.genPType,
];

const derivedContainerGenerators = [
  PNonEmptyList.genPType,
];

const euclidPrimitiveGenerators = [
  POwner.genPType,
  PAsset.genPType,
  PIdNFT.genPType,
  PAssets.genPType,
  PValue.genPType,
  PPositiveValue.genPType,
  PPrices.genPType,
  PAmounts.genPType, // <- works until here (10k iterations)
  // PParam.genPType,
  // PParamDatum.genPType,
  // PActiveAssets.genPType,
  // PDirac.genPType,
  // PDiracDatum.genPType,
  // PEuclidDatum.genPType,
];

// const euclidContainerGenerators = [
// ];
