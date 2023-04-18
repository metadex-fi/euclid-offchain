import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import {
  genNonNegative,
  gMaxLength,
  maybeNdef,
} from "../../../../utils/generators.js";
import { f, t } from "../type.js";
export class PList {
  constructor(pelem, length) {
    Object.defineProperty(this, "pelem", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: pelem,
    });
    Object.defineProperty(this, "length", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: length,
    });
    Object.defineProperty(this, "population", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "plift", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (l) => {
        assert(l instanceof Array, `List.plift: expected List: ${l}`);
        assert(
          !this.length || this.length === BigInt(l.length),
          `plift: wrong length - ${this.length} vs. ${l.length}`,
        );
        const data = l.map((elem) => this.pelem.plift(elem));
        return data;
      },
    });
    Object.defineProperty(this, "pconstant", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data) => {
        assert(data instanceof Array, `pconstant: expected Array`);
        assert(
          !this.length || this.length === BigInt(data.length),
          `pconstant: wrong length`,
        );
        return data.map(this.pelem.pconstant);
      },
    });
    Object.defineProperty(this, "genData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const length = this.length ? this.length : genNonNegative(gMaxLength);
        return PList.genList(this.pelem.genData, length);
      },
    });
    Object.defineProperty(this, "showData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data, tabs = "", maxDepth) => {
        if (maxDepth !== undefined && maxDepth <= 0n) {
          return "List [ … ]";
        }
        assert(
          data instanceof Array,
          `PList.showData: expected Array, got ${data}`,
        );
        const tt = tabs + t;
        const ttf = tt + f;
        return `List [
${
          data.map((d) =>
            `${ttf}${
              this.pelem.showData(d, ttf, maxDepth ? maxDepth - 1n : maxDepth)
            }`
          ).join(",\n")
        }
${tt}]`;
      },
    });
    Object.defineProperty(this, "showPType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tabs = "", maxDepth) => {
        if (maxDepth !== undefined && maxDepth <= 0n) {
          return "PList ( … )";
        }
        const tt = tabs + t;
        const ttf = tt + f;
        return `PList (
${ttf}population: ${this.population},
${ttf}pelem: ${this.pelem.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)},
${ttf}length?: ${this.length}
${tt})`;
      },
    });
    assert(!length || length >= 0, "negative length");
    if (!length || length === 0n) {
      this.population = 1; // worst case, consider preventing this by setting minimum size
    } else {
      this.population = pelem.population ** Number(length);
    }
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }
  static genList(elemGenerator, length) {
    const l = new Array();
    for (let i = 0; i < length; i++) {
      l.push(elemGenerator());
    }
    return l;
  }
  static genPType(gen, maxDepth) {
    const length = maybeNdef(genNonNegative(gMaxLength));
    const pelem = gen.generate(maxDepth);
    return new PList(pelem, length);
  }
}
