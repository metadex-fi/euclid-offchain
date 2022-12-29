import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genPositive,
  PConstanted,
  PConstraint,
  PData,
  PLifted,
  PList,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { assertNonEmptyList } from "../asserts.ts";

function genNonEmptyList<T>(
  elemGenerator: () => T,
  length?: number,
): Array<T> {
  if (length) {
    assert(length > 0, "generating empty list");
    return PList.genList(elemGenerator, length);
  } else {
    const length = genPositive();
    return PList.genList(elemGenerator, length);
  }
}

export type PNonEmptyList<PElem extends PData> = PConstraint<
  PList<PElem>
>;
export function mkPNonEmptyList<PElem extends PData>(
  pelem: PElem,
  length?: number,
): PNonEmptyList<PElem> {
  const pinner = new PList<PData>(pelem, length);

  const asserts = [assertNonEmptyList];

  const genInnerData = () =>
    genNonEmptyList<PLifted<PElem>>(
      pelem.genData,
      length,
    );

  const genInnerPlutusData = () =>
    genNonEmptyList<PConstanted<PElem>>(
      pelem.genPlutusData as () => PConstanted<PElem>,
      length,
    );

  return new PConstraint<PList<PElem>>(
    pinner,
    asserts,
    genInnerData,
    genInnerPlutusData,
  );
}
