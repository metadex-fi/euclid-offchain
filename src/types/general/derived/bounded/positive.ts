import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { maxInteger } from "../../../../mod.ts";
import { genPBounded, PBounded } from "./bounded.ts";

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
