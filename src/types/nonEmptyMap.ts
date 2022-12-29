import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genPositive,
  PConstanted,
  PConstraint,
  PData,
  PLifted,
  PMap,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { assertNonEmptyMap } from "../asserts.ts";

function genNonEmptyMap<PKey extends PData, PValue extends PData, K, V>(
  mapGenerator: (
    pkey: PKey,
    pvalue: PValue,
    size: number,
  ) => Map<K, V>,
  pkey: PKey,
  pvalue: PValue,
  size?: number,
): Map<K, V> {
  if (size) {
    assert(size > 0, "generating empty map");
    return mapGenerator(pkey, pvalue, size);
  } else {
    const size = genPositive();
    return mapGenerator(pkey, pvalue, size);
  }
}

export type PNonEmptyMap<PKey extends PData, PValue extends PData> =
  PConstraint<
    PMap<PKey, PValue>
  >;
export function mkPNonEmptyMap<PKey extends PData, PValue extends PData>(
  pkey: PKey,
  pvalue: PValue,
  size?: number,
): PNonEmptyMap<PKey, PValue> {
  const pinner = new PMap<PData, PData>(pkey, pvalue, size);

  const asserts = [assertNonEmptyMap];

  const genInnerData = () =>
    genNonEmptyMap<PKey, PValue, PLifted<PKey>, PLifted<PValue>>(
      PMap.genMap,
      pkey,
      pvalue,
      size,
    );

  const genInnerPlutusData = () =>
    genNonEmptyMap<PKey, PValue, PConstanted<PKey>, PConstanted<PValue>>(
      PMap.genPlutusMap,
      pkey,
      pvalue,
      size,
    );

  return new PConstraint<PMap<PKey, PValue>>(
    pinner,
    asserts,
    genInnerData,
    genInnerPlutusData,
  );
}
