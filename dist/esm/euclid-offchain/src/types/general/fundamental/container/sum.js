import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { boundedSubset, genPositive, randomChoice, } from "../../../../utils/generators.js";
import { f, t } from "../type.js";
import { PObject } from "./object.js";
import { PRecord } from "./record.js";
import { PInteger } from "../primitive/integer.js";
import { PByteString } from "../primitive/bytestring.js";
export class PSum {
    constructor(pconstrs) {
        Object.defineProperty(this, "pconstrs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pconstrs
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
            value: (c) => {
                // return {} as Os;
                assert(c instanceof Lucid.Constr, `plift: expected Constr`);
                assert(c.index < this.pconstrs.length, `plift: constr index out of bounds`);
                return this.pconstrs[Number(c.index)].plift(c);
            }
        });
        Object.defineProperty(this, "matchData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                assert(data instanceof Object, `PSum.matchData: expected Object`);
                const matches = new Array();
                this.pconstrs.forEach((pconstr, i) => {
                    if (data instanceof pconstr.O) {
                        matches.push(pconstr);
                    }
                });
                assert(matches.length === 1, `PSum.pconstant: expected exactly one match, got ${matches.length}: ${matches.map((pconstr) => pconstr.O.name)}`);
                return matches[0];
            }
        });
        Object.defineProperty(this, "pconstant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                return this.matchData(data).pconstant(data);
            }
        });
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return randomChoice(this.pconstrs).genData();
            }
        });
        Object.defineProperty(this, "showData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data, tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "Sum ( … )";
                const tt = tabs + t;
                const ttf = tt + f;
                return `Sum (
${ttf}${this.matchData(data).showData(data, ttf, maxDepth ? maxDepth - 1n : maxDepth)}
${tt})`;
            }
        });
        assert(pconstrs.length > 0, `PSum: expected at least one PObject`);
        assert(pconstrs.every((pconstr) => pconstr instanceof PObject), `PSum: expected all pconstrs to be PObjects`);
        this.population = pconstrs.reduce((acc, pconstr) => acc + pconstr.population, 0);
        pconstrs.forEach((pconstr, i) => {
            pconstr.setIndex(i);
        });
    }
    showPType(tabs = "", maxDepth) {
        if (maxDepth !== undefined && maxDepth <= 0n)
            return "PSum ( … )";
        const tt = tabs + t;
        const ttf = tt + f;
        return `PSum (
${ttf}${this.pconstrs.map((pconstr) => pconstr.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)).join(`,\n`)}
${tt})`;
    }
    static genPType() {
        //minSizedSubset also serves as shuffle
        const pconstrs = [PConstr0, PConstr1, PConstr2, PConstr3];
        const len = genPositive(BigInt(pconstrs.length));
        const pconstrs_ = boundedSubset(pconstrs, len);
        return new PSum(pconstrs_);
    }
}
class Constr0 {
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
    }
}
class Constr1 {
    constructor(i, s) {
        Object.defineProperty(this, "i", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: i
        });
        Object.defineProperty(this, "s", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: s
        });
    }
}
class Constr2 {
    constructor(i) {
        Object.defineProperty(this, "i", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: i
        });
    }
}
class Constr3 {
    constructor(s) {
        Object.defineProperty(this, "s", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: s
        });
    }
}
const PConstr0 = new PObject(new PRecord({
    s: PByteString.genPType(),
    i: PInteger.genPType(),
}), Constr0);
const PConstr1 = new PObject(new PRecord({
    i: PInteger.genPType(),
    s: PByteString.genPType(),
}), Constr1);
const PConstr2 = new PObject(new PRecord({
    i: PInteger.genPType(),
}), Constr2);
const PConstr3 = new PObject(new PRecord({
    s: PByteString.genPType(),
}), Constr3);
