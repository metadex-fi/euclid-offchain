import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Generators,
  genPositive,
  maybeNdef,
} from "../../../utils/generators.ts";
import { PList } from "../fundamental/container/list.ts";
import { PData, PLifted } from "../fundamental/type.ts";
import { PConstraint } from "./../fundamental/container/constraint.ts";
import { gMaxLength } from "../../../utils/constants.ts";

export class PNonEmptyList<PElem extends PData> extends PConstraint<
  PList<PElem>
> {
  constructor(
    pelem: PElem,
    length?: bigint,
  ) {
    assert(!length || length > 0, "empty list");

    super(
      new PList(pelem, length),
      [assertNonEmptyList],
      () =>
        PList.genList(
          pelem.genData,
          length ?? genPositive(gMaxLength),
        ) as PLifted<PElem>[],
    );
  }

  static genPType(
    gen: Generators,
    maxDepth: bigint,
  ): PConstraint<
    PList<PData>
  > {
    const length = maybeNdef(genPositive(gMaxLength));
    const pelem = gen.generate(maxDepth);
    return new PNonEmptyList(pelem, length);
  }
}

function assertNonEmptyList<T>(l: Array<T>) {
  assert(l.length > 0, "encountered empty List");
}

// TODO something here or in nonEmptyMap or both to ensure
// at least two assets in pool
