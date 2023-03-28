import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { maxInteger } from "../../../../utils/generators.js";
import { genPBounded, PBounded } from "./bounded.js";

export class PPositive extends PBounded {
  constructor(
    public lowerBound = 1n,
    public upperBound = maxInteger,
  ) {
    assert(!lowerBound || lowerBound > 0n, `PPositive: ${lowerBound} <= 0`);
    super(lowerBound, upperBound);
  }

  static genPType(): PPositive {
    return genPBounded(1n);
  }
}
