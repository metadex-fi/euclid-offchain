import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genPositive,
  gMaxLength,
  PConstraint,
  PData,
  PMap,
} from "../../../refactor_parse/lucid/src/mod.ts";

export type PNonEmptyMap<PKey extends PData, PValue extends PData> =
  PConstraint<
    PMap<PKey, PValue>
  >;
export function newPNonEmptyMap<PKey extends PData, PValue extends PData>(
  pkey: PKey,
  pvalue: PValue,
  size?: number,
): PNonEmptyMap<PKey, PValue> {
  assert(!size || size > 0, "empty map");
  const pinner = new PMap(pkey, pvalue, size);

  return new PConstraint<PMap<PKey, PValue>>(
    pinner,
    [assertNonEmptyMap],
    () => PMap.genMap(pkey, pvalue, size ?? genPositive(gMaxLength)),
  );
}

function assertNonEmptyMap<K, V>(m: Map<K, V>) {
  assert(m.size > 0, "encountered empty Map");
}
