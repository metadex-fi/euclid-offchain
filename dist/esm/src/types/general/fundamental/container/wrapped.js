import { assert } from "../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { f, t } from "../type.js";
import { filterFunctions } from "./object.js";
// like PObject, but only one field in the PRecord.
// Purpose is removing the extra Arrays around pconstanted wrappers.
export class PWrapped {
    constructor(pinner, O) {
        Object.defineProperty(this, "pinner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pinner
        });
        Object.defineProperty(this, "O", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: O
        });
        Object.defineProperty(this, "population", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plift", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                const inner = this.pinner.plift(data);
                return new (this.O)(inner);
            }
        });
        Object.defineProperty(this, "pconstant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                const inner = filterFunctions(data);
                const values = Object.values(inner);
                assert(values.length === 1, `pconstant: expected one value`);
                return this.pinner.pconstant(values[0]);
            }
        });
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const inner = this.pinner.genData();
                return new (this.O)(inner);
            }
        });
        Object.defineProperty(this, "showData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data, tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "Wrapped ( … )";
                const tt = tabs + t;
                const ttf = tt + f;
                const inner = filterFunctions(data);
                const values = Object.values(inner);
                assert(values.length === 1, `showData: expected one value`);
                return `Wrapped: ${this.O.name} (
${ttf}${this.pinner.showData(values[0], ttf, maxDepth ? maxDepth - 1n : maxDepth)}
${tt})`;
            }
        });
        Object.defineProperty(this, "showPType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n) {
                    return "PObject: PWrapped ( … )";
                }
                const tt = tabs + t;
                const ttf = tt + f;
                return `PObject: PWrapped (
${ttf}population: ${this.population},
${ttf}pinner: ${this.pinner.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)},
${ttf}O: ${this.O.name}
${tt})`;
            }
        });
        this.population = pinner.population;
        assert(this.population > 0, `Population not positive in ${this.showPType()}`);
    }
    static genPType(gen, maxDepth) {
        const pinner = gen.generate(maxDepth);
        return new PWrapped(pinner, WrapperClass);
    }
}
class WrapperClass {
    constructor(inner) {
        Object.defineProperty(this, "inner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: inner
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `WrapperClass (${this.inner})`;
            }
        });
    }
}
