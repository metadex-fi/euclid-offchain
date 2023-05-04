import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { f, t } from "../type.js";
export class PConstraint {
  constructor(pinner, asserts, genInnerData, details) {
    Object.defineProperty(this, "pinner", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: pinner,
    });
    Object.defineProperty(this, "asserts", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: asserts,
    });
    Object.defineProperty(this, "genInnerData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: genInnerData,
    });
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: details,
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
      value: (data) => {
        const plifted = this.pinner.plift(data);
        this.asserts.forEach((assertion) => {
          assertion(plifted);
        });
        return plifted;
      },
    });
    Object.defineProperty(this, "pconstant", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data) => {
        this.asserts.forEach((assertion) => {
          try {
            assertion(data);
          } catch (e) {
            throw new Error(
              `Assertion failed in pconstant: ${e.message} of ${this.showPType()}`,
            );
          }
        });
        return this.pinner.pconstant(data);
      },
    });
    Object.defineProperty(this, "genData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return this.genInnerData();
      },
    });
    Object.defineProperty(this, "showData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data, tabs = "", maxDepth) => {
        if (maxDepth !== undefined && maxDepth <= 0n) {
          return "Constraint ( … )";
        }
        const tt = tabs + t;
        const ttf = tt + f;
        return `Constraint (
${ttf}${this.pinner.showData(data, ttf, maxDepth ? maxDepth - 1n : maxDepth)}
${tt})`;
      },
    });
    Object.defineProperty(this, "showPType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tabs = "", maxDepth) => {
        if (maxDepth !== undefined && maxDepth <= 0n) {
          return "PConstraint ( … )";
        }
        const tt = tabs + t;
        const ttf = tt + f;
        const asserts = `[\n
      ${ttf}` + this.asserts.map((a) => {
          return `(${a.toString()})`;
        }).join(`,\n${ttf}`) + `\n
    ${ttf}]`;
        return `PConstraint (${
          this.details ? `\n${ttf}details: ${this.details}` : ""
        }
${ttf}population: ${this.population},
${ttf}pinner: ${
          this.pinner.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)
        },
${tt})`;
        // ${ttf}asserts: \${asserts},
        // ${ttf}genInnerData: \${this.genInnerData.toString()}
      },
    });
    this.population = pinner.population;
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }
  static genPType(gen, maxDepth) {
    const pinner = gen.generate(maxDepth);
    const genInnerData = pinner.genData;
    return new PConstraint(pinner, [], genInnerData);
  }
}
