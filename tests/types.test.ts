import {
  Generators,
  PByteString,
  PConstr,
  PConstraint,
  PInteger,
  PList,
  PMap,
  PMapRecord,
  PObject,
  PRecord,
  proptestPTypes,
} from "../../refactor_parse/lucid/src/mod.ts";
import { PLiteral } from "../../refactor_parse/lucid/src/plutus/types/literal.ts";
import { PAsset, PAssets } from "../src/types/asset.ts";
import { PNonEmptyList } from "../src/types/nonEmptyList.ts";
import { PPrices } from "../src/types/prices.ts";
import { PBounded, PPositive } from "../src/types/primitive.ts";
import { PPositiveValue, PValue } from "../src/types/value.ts";

Deno.test("euclid data/types tests", () => {
  const gen = new Generators(
    [
      ...lucidPrimitiveGenerators,
      ...euclidPrimitiveGenerators,
    ],
    [
      ...lucidContainerGenerators,
      ...euclidContainerGenerators,
    ],
  );
  proptestPTypes(gen, 5000);
});

export const lucidPrimitiveGenerators = [
  // PAny.genPType,
  PInteger.genPType,
  PByteString.genPType,
];

export const lucidContainerGenerators = [
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

const euclidPrimitiveGenerators = [
  PAsset.genPType,
  PAssets.genPType,
  PBounded.genPType,
  PPositive.genPType,
  PValue.genPType,
  PPositiveValue.genPType,
  PPrices.genPType,
  // () => newPPositiveValue(PAssets.genData()),
  // genPParam,
];

const euclidContainerGenerators = [
  PNonEmptyList.genPType,
  // newNewPValue(new PInteger()),
];
