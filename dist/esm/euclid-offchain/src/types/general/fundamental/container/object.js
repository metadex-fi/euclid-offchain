import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { f, t } from "../type.js";
import { PRecord } from "./record.js";
import { PInteger } from "../primitive/integer.js";
import { PByteString } from "../primitive/bytestring.js";
import { Lucid } from "../../../../../lucid.mod.js";
export const filterFunctions = (o) => Object.fromEntries(Object.entries(o).filter(([_, v]) => typeof v !== "function"));
export class PObject {
    constructor(precord, O) {
        Object.defineProperty(this, "precord", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: precord
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
        Object.defineProperty(this, "setIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (index) => this.precord.setIndex(index)
        });
        Object.defineProperty(this, "plift", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (l) => {
                assert(l instanceof Lucid.Constr, `plift: expected Constr`);
                const record = this.precord.plift(l);
                const args = Object.values(record);
                return new (this.O)(...args);
            }
        });
        Object.defineProperty(this, "pconstant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                const record = filterFunctions(data);
                return this.precord.pconstant(record);
            }
        });
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const record = this.precord.genData();
                try {
                    const o = new this.O(...Object.values(record));
                    return o;
                }
                catch (e) {
                    throw new Error(`Error in genData for ${this.precord.showData(record)}: ${e}`);
                }
            }
        });
        Object.defineProperty(this, "showData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data, tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "Object ( … )";
                const tt = tabs + t;
                const ttf = tt + f;
                const record = this.precord.showData(filterFunctions(data), ttf, maxDepth ? maxDepth - 1n : maxDepth);
                return `Object: ${this.O.name} (
${ttf}${record}
${tt})`;
            }
        });
        Object.defineProperty(this, "showPType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "PObject ( … )";
                const tt = tabs + t;
                const ttf = tt + f;
                return `PObject (
${ttf}population: ${this.population},
${ttf}precord: ${this.precord.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)},
${ttf}O: ${this.O.name}
${tt})`;
            }
        });
        this.population = precord.population;
        assert(this.population > 0, `Population not positive in ${this.showPType()}`);
    }
    static genPType(_gen, _maxDepth) {
        const precord = new PRecord({
            s: PByteString.genPType(),
            i: PInteger.genPType(),
            // ls: PList.genPType(gen, maxDepth),
            // li: PList.genPType(gen, maxDepth),
            // msli: PMap.genPType(gen, maxDepth),
            // mlis: PMap.genPType(gen, maxDepth),
        });
        return new PObject(precord, ExampleClass);
    }
}
class ExampleClass {
    constructor(s, i) {
        Object.defineProperty(this, "s", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: s
        });
        Object.defineProperty(this, "i", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: i
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `ExampleClass (${this.s}, ${this.i})`;
            }
        });
    }
}
