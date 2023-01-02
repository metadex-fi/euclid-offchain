import {
  Generators,
  PByteString,
  PConstr,
  PData,
  PInteger,
  PList,
  PMap,
  PMapRecord,
  PObject,
  PRecord,
} from "../../refactor_parse/lucid/src/mod.ts";
import {
  lucidContainerGenerators,
  lucidPrimitiveGenerators,
  propertyTestPTypesParsing,
} from "../../refactor_parse/lucid/tests/plutus.types.test.ts";
import { Asset, PAsset, PAssets } from "../src/types/asset.ts";
import { genPParam } from "../src/types/param.ts";
import { genPBounded, newPBounded, PPositive } from "../src/types/primitive.ts";
import {
  newNewPValue,
  newPJumpSizes,
  newPPositiveValue,
} from "../src/types/value.ts";

Deno.test("parsing property tests", () => {
  const gen = new Generators(
    [
      ...lucidPrimitiveGenerators,
      ...euclidPrimitiveGenerators,
    ],
    [
      ...lucidContainerGenerators,
      // ...euclidContainerGenerators,
    ],
  );
  propertyTestPTypesParsing(gen, 100);
});

const euclidPrimitiveGenerators = [
  () => PAsset,
  () => PAssets,
  () => PPositive,
  genPBounded,
  // () => newPPositiveValue(PAssets.genData()),
  // genPParam,
];

const euclidContainerGenerators = [
  PList.genPType,
  // newNewPValue(new PInteger()),
];
