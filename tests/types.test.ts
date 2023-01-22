import {
  Generators,
  PActiveAssets,
  PAmounts,
  PByteString,
  PConstraint,
  PDirac,
  PDiracDatum,
  PEnum,
  PInteger,
  PJumpSizes,
  PKeyHash,
  PList,
  PLiteral,
  PMap,
  // PMapRecord,
  PObject,
  POwner,
  PParam,
  PParamDatum,
  PParamNFT,
  PPool,
  // PPool,
  // PPoolDatums,
  PPrices,
  PRecord,
  proptestPTypes,
  PString,
  PSum,
  PThreadNFT,
} from "../src/mod.ts";
import {
  PAsset,
  PAssets,
  PCurrencySymbol,
} from "../src/types/general/derived/asset.ts";
import { PBounded, PPositive } from "../src/types/general/derived/bounded.ts";
import { PNonEmptyList } from "../src/types/general/derived/nonEmptyList.ts";
import { PPositiveValue } from "../src/types/general/derived/value/positiveValue.ts";
import { PValue } from "../src/types/general/derived/value/value.ts";

// import { PActiveAssets } from "../src/types/euclid/activeAssets.ts";
// import { PDirac, PDiracDatum } from "../src/types/euclid/dirac.ts";

Deno.test("euclid data/types tests", () => {
  const gen = new Generators(
    // @ts-ignore TODO type instantiation is excessively deep and possibly infinite
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
  proptestPTypes(gen, 1000);
});

const fundamentalPrimitiveGenerators = [
  // PAny.genPType,
  PInteger.genPType,
  PByteString.genPType,
  PString.genPType,
];

const fundamentalContainerGenerators = [
  PLiteral.genPType,
  PEnum.genPType,
  PConstraint.genPType,
  PList.genPType,
  PMap.genPType,
  // PMapRecord.genPType,
  PRecord.genPType,
  PObject.genPType,
  PSum.genPType,
];

const derivedPrimitiveGenerators = [
  PBounded.genPType,
  PPositive.genPType,
  PCurrencySymbol.genPType,
  PAsset.genPType,
  PAssets.genPType,
  PValue.genPType,
  PPositiveValue.genPType,
];

const derivedContainerGenerators = [
  PNonEmptyList.genPType,
];

const euclidPrimitiveGenerators = [
  PKeyHash.genPType,
  POwner.genPType,
  PParamNFT.genPType,
  PThreadNFT.genPType,
  PJumpSizes.genPType,
  PPrices.genPType,
  PParam.genPType,
  PParamDatum.genPType,
  PAmounts.genPType,
  PActiveAssets.genPType,
  PDirac.genPType,
  PDiracDatum.genPType,
  // PPool.genPType,
  // PPoolDatums.genPType,
  // PEuclidDatum.genPType,
];
