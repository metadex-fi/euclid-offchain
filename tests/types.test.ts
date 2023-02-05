import {
  Generators,
  PAsset,
  PAssets,
  PBoughtSold,
  PBounded,
  PByteString,
  PConstraint,
  PCurrency,
  PEnum,
  PHash,
  PIdNFT,
  PInteger,
  PKeyHash,
  PList,
  PLiteral,
  PMap,
  PObject,
  PPositive,
  PRecord,
  proptestPTypes,
  PString,
  PSum,
  PSwap,
  PToken,
  PWrapped,
} from "../src/mod.ts";
import { PNonEmptyList } from "../src/types/general/derived/nonEmptyList.ts";
import { PPositiveValue } from "../src/types/general/derived/value/positiveValue.ts";
import { PValue } from "../src/types/general/derived/value/value.ts";

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
  PWrapped.genPType,
];

const derivedPrimitiveGenerators = [
  PBounded.genPType,
  PPositive.genPType,
  PHash.genPType,
  PKeyHash.genPType,
  PCurrency.genPType,
  PToken.genPType,
  PAsset.genPType,
  PAssets.genPType,
  PValue.genPType,
  PPositiveValue.genPType,
];

const derivedContainerGenerators = [
  PNonEmptyList.genPType,
];

const euclidPrimitiveGenerators = [
  PBoughtSold.genPType,
  PSwap.genPType,
  // PIdNFT.genPType,
];
