import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { maxInteger } from "../../../../utils/generators.js";
import { genPBounded, PBounded } from "./bounded.js";
export class PPositive extends PBounded {
  constructor(lowerBound = 1n, upperBound = maxInteger) {
    assert(!lowerBound || lowerBound > 0n, `PPositive: ${lowerBound} <= 0`);
    super(lowerBound, upperBound);
    Object.defineProperty(this, "lowerBound", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: lowerBound,
    });
    Object.defineProperty(this, "upperBound", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: upperBound,
    });
  }
  static genPType() {
    return genPBounded(1n);
  }
}
