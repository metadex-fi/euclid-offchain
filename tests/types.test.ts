import {
  Generators,
  PBounded,
  PByteString,
  PConstr,
  PConstraint,
  PInteger,
  PList,
  PLiteral,
  PMap,
  PMapRecord,
  PNonEmptyList,
  PObject,
  PPositive,
  PRecord,
} from "../src/mod.ts";
import { proptestPTypes } from "../src/utils/testing/proptests.ts";

Deno.test("euclid data/types tests", () => {
  // @ts-ignore TODO consider fixing this or leaving as is
  const gen = new Generators(
    [
      ...fundamentalPrimitiveGenerators,
      ...derivedPrimitiveGenerators,
      // ...euclidPrimitiveGenerators,
    ],
    [
      ...fundamentalContainerGenerators,
      ...derivedContainerGenerators,
      // ...euclidContainerGenerators,
    ],
  );
  proptestPTypes(gen, 1000);
});

const fundamentalPrimitiveGenerators = [
  // PAny.genPType,
  PInteger.genPType,
  PByteString.genPType,
];

const fundamentalContainerGenerators = [
  PLiteral.genPType,
  PConstraint.genPType,
  PList.genPType,
  PMap.genPType,
  PMapRecord.genPType,
  PConstr.genPType,
  PRecord.genPType,
  PObject.genPType,
  // PSum.genPType,
];

const derivedPrimitiveGenerators = [
  PBounded.genPType,
  PPositive.genPType,
];

const derivedContainerGenerators = [
  PNonEmptyList.genPType,
];

// const euclidPrimitiveGenerators = [
//   PAsset.genPType,
//   PAssets.genPType,
//   PBounded.genPType,
//   PPositive.genPType,
//   PValue.genPType,
//   PPositiveValue.genPType,
//   PPrices.genPType,
//   // () => newPPositiveValue(PAssets.genData()),
//   // genPParam,
// ];

// const euclidContainerGenerators = [
//   PNonEmptyList.genPType,
//   // newNewPValue(new PInteger()),
// ];
