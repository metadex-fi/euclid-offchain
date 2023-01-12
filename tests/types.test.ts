import {
  Generators,
  PActiveAssets,
  PAllDiracs,
  PAmounts,
  PAsset,
  PAssets,
  PBounded,
  PByteString,
  PConstr,
  PConstraint,
  PDirac,
  PDiracDatum,
  PEnum,
  PIdNFT,
  PInteger,
  PJumpSizes,
  PList,
  PLiteral,
  PMap,
  PMapRecord,
  PNonEmptyList,
  PObject,
  POwner,
  PParam,
  PParamDatum,
  PPositive,
  PPositiveValue,
  PPrices,
  PRecord,
  proptestPTypes,
  PValue,
} from "../src/mod.ts";

Deno.test("euclid data/types tests", () => {
  const gen = new Generators(
    // @ts-ignore TODO consider fixing this or leaving as is
    [
      ...fundamentalPrimitiveGenerators,
      ...derivedPrimitiveGenerators,
      ...euclidPrimitiveGenerators,
    ],
    [
      ...fundamentalContainerGenerators,
      ...derivedContainerGenerators,
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
  PMapRecord.genPType,
  PRecord.genPType,
  PConstr.genPType,
  PObject.genPType,
  // PSum.genPType,
];

const derivedPrimitiveGenerators = [
  PBounded.genPType,
  PPositive.genPType,
  PAsset.genPType,
  PAssets.genPType,
  PValue.genPType,
  PPositiveValue.genPType,
];

const derivedContainerGenerators = [
  PNonEmptyList.genPType,
];

const euclidPrimitiveGenerators = [
  POwner.genPType,
  PIdNFT.genPType,
  PJumpSizes.genPType,
  PPrices.genPType,
  PAmounts.genPType,
  PParam.genPType,
  PParamDatum.genPType,
  PActiveAssets.genPType,
  PDirac.genPType,
  PDiracDatum.genPType,
  // PAllDiracs.genPType,
  // PEuclidDatum.genPType,
];
