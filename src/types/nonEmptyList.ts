import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genPositive,
  gMaxLength,
  PConstraint,
  PData,
  PList,
} from "../../../refactor_parse/lucid/src/mod.ts";

export type PNonEmptyList<PElem extends PData> = PConstraint<
  PList<PElem>
>;
export function newPNonEmptyList<PElem extends PData>(
  pelem: PElem,
  length?: number,
): PNonEmptyList<PElem> {
  assert(!length || length > 0, "empty list");
  const pinner = new PList(pelem, length);

  return new PConstraint<PList<PElem>>(
    pinner,
    [assertNonEmptyList],
    () => PList.genList(pelem.genData, length ?? genPositive(gMaxLength)),
  );
}

function assertNonEmptyList<T>(l: Array<T>) {
  assert(l.length > 0, "encountered empty List");
}

// TODO something here or in nonEmptyMap or both to ensure
// at least two assets in pool
