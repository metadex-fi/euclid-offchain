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
  propertyTestPTypesParsing,
} from "../../refactor_parse/lucid/src/mod.ts";
import { PLiteral } from "../../refactor_parse/lucid/src/plutus/types/literal.ts";
import { PAsset, PAssets } from "../src/types/asset.ts";
import { PNonEmptyList } from "../src/types/nonEmptyList.ts";
import { PBounded, PPositive } from "../src/types/primitive.ts";
import { PValue } from "../src/types/value.ts";

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
  propertyTestPTypesParsing(gen, 500);
});

export const lucidPrimitiveGenerators = [
  // PAny.genPType,
  PInteger.genPType,
  PByteString.genPType,
];

export const lucidContainerGenerators = [
  PList.genPType,
  PMap.genPType,
  PConstr.genPType,
  PRecord.genPType,
  PMapRecord.genPType,
  // PSum.genPType,
  PObject.genPType,
  PLiteral.genPType,
  PConstraint.genPType,
];

const euclidPrimitiveGenerators = [
  PAsset.genPType,
  // PAssetOf.genPType,
  PAssets.genPType,
  PBounded.genPType,
  PPositive.genPType,
  PValue.genPType,
  // () => newPPositiveValue(PAssets.genData()),
  // genPParam,
];

const euclidContainerGenerators = [
  PNonEmptyList.genPType,
  // newNewPValue(new PInteger()),
];
