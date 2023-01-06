import { PLiteral } from "../src/types/general/literal.ts";
import { PConstraint } from "../src/types/general/constraint.ts";
import { PList } from "../src/types/general/list.ts";
import { PObject } from "../src/types/general/object.ts";
import { PRecord } from "../src/types/general/record.ts";
import { PMap } from "../src/types/general/map.ts";
import { PMapRecord } from "../src/types/general/mapRecord.ts";
import { PConstr } from "../src/types/general/constr.ts";
import { PInteger } from "../src/types/general/integer.ts";
import { PByteString } from "../src/types/general/bytestring.ts";
import { PAsset, PAssets } from "../src/types/euclid/asset.ts";
import { PNonEmptyList } from "../src/types/euclid/nonEmptyList.ts";
import { PBounded, PPositive } from "../src/types/euclid/primitive.ts";
import { Generators } from "../src/utils/testing/generators.ts";
import { proptestPTypes } from "../src/utils/testing/proptests.ts";
import { PPositiveValue, PValue } from "../src/types/euclid/value.ts";
import { PPrices } from "../src/types/euclid/prices.ts";

Deno.test("euclid data/types tests", () => {
  // // @ts-ignore TODO consider fixing this or leaving as is
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

export const generalPrimitiveGenerators = [
  // PAny.genPType,
  PInteger.genPType,
  PByteString.genPType,
];

export const generalContainerGenerators = [
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
