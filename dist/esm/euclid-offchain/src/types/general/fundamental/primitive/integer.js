import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { genNumber, maxInteger } from "../../../../utils/generators.js";
export class PInteger {
  constructor() {
    Object.defineProperty(this, "population", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: Number(maxInteger) * 2 + 1,
    });
    Object.defineProperty(this, "plift", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (i) => {
        assert(
          typeof i === `bigint`,
          `.PInteger.plift: expected Integer, got ${i} (${typeof i})`,
        );
        return i;
      },
    });
    Object.defineProperty(this, "pconstant", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data) => {
        assert(
          typeof data === `bigint`,
          `PInteger.pconstant: expected Integer, got ${data} (${typeof data})`,
        );
        return data;
      },
    });
    Object.defineProperty(this, "genData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return genNumber();
      },
    });
    Object.defineProperty(this, "showData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data) => {
        assert(
          typeof data === `bigint`,
          `PInteger.showData: expected Integer, got ${data} (${typeof data})`,
        );
        return `Integer: ${data}`;
      },
    });
    Object.defineProperty(this, "showPType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return `PInteger`;
      },
    });
  }
  static genPType() {
    return PInteger.ptype;
  }
}
Object.defineProperty(PInteger, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PInteger(),
});
