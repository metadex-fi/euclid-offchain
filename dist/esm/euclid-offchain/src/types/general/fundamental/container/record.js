import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { genName, genNonNegative, gMaxLength, maybeNdef, } from "../../../../utils/generators.js";
import { f, t, } from "../type.js";
export class PRecord {
    constructor(pfields) {
        Object.defineProperty(this, "pfields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pfields
        });
        Object.defineProperty(this, "population", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "index", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        }); // for sum types
        Object.defineProperty(this, "setIndex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (index) => this.index = index
        });
        Object.defineProperty(this, "plift", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (c) => {
                assert(c instanceof Lucid.Constr, `Record.plift: expected Constr, got ${c} (${typeof c})\nfor ${this.showPType()})`);
                assert(c.index === this.index, `Record.plift: wrong index ${c.index} for ${this.showPType()}`);
                const r = {};
                let i = 0;
                Object.entries(this.pfields).forEach(([key, pfield]) => {
                    if (pfield !== undefined) {
                        assert(i < c.fields.length, `Record.plift: too few elements at
key = ${key}
i = ${i}
pfield = ${pfield.showPType()}
in [${c}] of length ${c.fields.length}
for ${this.showPType()};
status: ${Object.keys(r).join(`,\n${f}`)}`);
                        const value = c.fields[i++];
                        assert(value !== undefined, `Record.plift: undefined value <${value}> at
key = ${key}
i = ${i}
pfield = ${pfield.showPType()}
in [${c}] of length ${c.fields.length}
for ${this.showPType()};
status: ${Object.keys(r).join(`,\n${f}`)}`);
                        r[key] = pfield.plift(value);
                    }
                    else {
                        r[key] = undefined;
                    }
                });
                assert(i === c.fields.length, `Record.plift: too many elements (${c.fields.length}) for ${this.showPType()}`);
                return r;
            }
        });
        Object.defineProperty(this, "checkFields", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                assert(data instanceof Object, `PRecord.checkFields: expected Object, got ${data}\nfor ${this.showPType()}`);
                const pfieldsNames = Object.keys(this.pfields).join(`,\n${f}`);
                const dataFieldsNames = Object.keys(data).join(`,\n${f}`);
                assert(pfieldsNames === dataFieldsNames, `PRecord.checkFields: expected fields:\n${f}${pfieldsNames},\ngot:\n${f}${dataFieldsNames}\nfor ${this.showPType()}\n`);
            }
        });
        Object.defineProperty(this, "pconstant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                this.checkFields(data);
                const l = new Array();
                Object.entries(this.pfields).forEach(([key, pfield]) => {
                    const value = data[key];
                    if (pfield) {
                        assert(value !== undefined, `cannot constant ${value} with pfield: ${pfield.showPType()}`);
                        l.push(pfield.pconstant(value));
                    }
                    else {
                        assert(value === undefined, `cannot constant ${value} with undefined pfield`);
                    }
                });
                return new Lucid.Constr(this.index, l);
            }
        });
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const r = {};
                Object.entries(this.pfields).forEach(([key, pfield]) => {
                    r[key] = pfield?.genData();
                });
                return r;
            }
        });
        Object.defineProperty(this, "showData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data, tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "Record { … }";
                this.checkFields(data);
                if (data.size === 0)
                    return "Record {}";
                const tt = tabs + t;
                const ttf = tt + f;
                const ttft = ttf + t;
                const fields = Object.entries(data).map(([key, value]) => {
                    const pfield = this.pfields[key];
                    if (pfield === undefined) {
                        assert(value === undefined, `PRecord.showData: value ${value} for undefined pfield at key ${key}`);
                        return `${key.length === 0 ? "_" : key}: undefined`;
                    }
                    else {
                        assert(value !== undefined, `PRecord.showData: value undefined for pfield ${pfield.showPType()} at key ${key}`);
                        return `${key.length === 0 ? "_" : key}: ${pfield.showData(value, ttft, maxDepth ? maxDepth - 1n : maxDepth)}`;
                    }
                }).join(`,\n${ttf}`);
                return `Record {
${ttf}index: ${this.index},
${ttf}fields: ${fields}
${tt}}`;
            }
        });
        Object.defineProperty(this, "showPType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "PRecord ( … )";
                const tt = tabs + t;
                const ttf = tt + f;
                const ttff = ttf + f;
                const fields = Object.entries(this.pfields).map(([key, pfield]) => {
                    return `\n${ttff}${key.length === 0 ? "_" : key}: ${pfield?.showPType(ttff, maxDepth ? maxDepth - 1n : maxDepth) ??
                        "undefined"}`;
                });
                return `PRecord (
${ttf}population: ${this.population},
${ttf}pfields: {${fields.length > 0 ? `${fields.join(`,`)}\n${ttf}` : ""}}
${tt})`;
            }
        });
        let population = 1;
        Object.values(pfields).forEach((pfield) => {
            if (pfield)
                population *= pfield.population;
        });
        this.population = population;
        assert(this.population > 0, `Population not positive in ${this.showPType()}`);
    }
    static genPType(gen, maxDepth) {
        const pfields = {};
        const maxi = genNonNegative(gMaxLength);
        for (let i = 0; i < maxi; i++) {
            const key = genName();
            const pvalue = maybeNdef(() => gen.generate(maxDepth))?.();
            pfields[key] = pvalue;
        }
        return new PRecord(pfields);
    }
}
