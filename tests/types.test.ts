import { PByteString } from "../src/types/general/fundamental/bytestring.ts";

Deno.test("euclid data/types tests", () => {
  // const gen = new Generators(
  //   [
  //     ...generalPrimitiveGenerators,
  //     // ...euclidPrimitiveGenerators,
  //   ],
  //   [
  //     // ...generalContainerGenerators,
  //     // ...euclidContainerGenerators,
  //   ],
  // );
  // proptestPTypes(gen, 5000);
});

const generalPrimitiveGenerators = [
  // PAny.genPType,
  // PInteger.genPType,
  PByteString.genPType,
];

// export const generalContainerGenerators = [
//   PLiteral.genPType,
//   PConstraint.genPType,
//   PList.genPType,
//   PMap.genPType,
//   PMapRecord.genPType,
//   PConstr.genPType,
//   PRecord.genPType,
//   PObject.genPType,
//   // PSum.genPType,
// ];

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
