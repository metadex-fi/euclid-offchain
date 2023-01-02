import { Generators,PInteger,PByteString,PList,PMap,PConstr,PRecord,PMapRecord,PObject } from "../../refactor_parse/lucid/src/mod.ts";
import { propertyTestPTypesParsing } from "../../refactor_parse/lucid/tests/plutus.types.test.ts";

Deno.test("parsing property tests", () => {
  const gen = new Generators(
    [
      // PData.genPType,
      PInteger.genPType,
      PByteString.genPType,
    ],
    [
      PList.genPType,
      PMap.genPType,
      PConstr.genPType,
      PRecord.genPType,
      PMapRecord.genPType,
      // PSum.genPType,
      PObject.genPType,
    ],
  );
  propertyTestPTypesParsing(gen);
});