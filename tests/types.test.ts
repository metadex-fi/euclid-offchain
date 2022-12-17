import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.145.0/testing/asserts.ts";
import { Data, genInteger } from "../../lucid-data-parse/lucid/mod.ts";

Deno.test("metatest", async () => {
  assertEquals(2, 2);
});

Deno.test("metatest", async () => {
  const i = genInteger(5);
  assertEquals(i[0], i[1]);
});

Deno.test("diracs", async () => {
  const dirac = genDirac();
  const data = Data.to(dirac);
  assertEquals(dirac, Data.from(data, DiracShape));
});
