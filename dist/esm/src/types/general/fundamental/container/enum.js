import { assert } from "../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { genPositive, gMaxLength, randomChoice, } from "../../../../utils/generators.js";
import { f, t } from "../type.js";
export class PEnum {
    constructor(pliteral, literals) {
        Object.defineProperty(this, "pliteral", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pliteral
        });
        Object.defineProperty(this, "literals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: literals
        });
        Object.defineProperty(this, "population", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plutusLiterals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "strs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "plift", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (l) => {
                const str = this.pliteral.showData(this.pliteral.plift(l));
                const index = this.strs.indexOf(str);
                assert(index !== -1, "PEnum.plift: Literal does not match");
                return this.literals[index];
            }
        });
        Object.defineProperty(this, "pconstant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                const str = this.pliteral.showData(data);
                const index = this.strs.indexOf(str);
                assert(index !== -1, "PEnum.pconstant: Literal does not match");
                return this.plutusLiterals[index];
            }
        });
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return randomChoice(this.literals);
            }
        });
        Object.defineProperty(this, "showData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data, tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "Enum ( … )";
                const str = this.pliteral.showData(data);
                const index = this.strs.indexOf(str);
                assert(index !== -1, `PEnum.showData: Literal does not match, got:\n${str},\nexpected one of:\n${this.strs.join(", ")}.`);
                const tt = tabs + t;
                const ttf = tt + f;
                return `Enum (
${ttf}${this.pliteral.showData(data, ttf, maxDepth ? maxDepth - 1n : maxDepth)}
${tt})`;
            }
        });
        Object.defineProperty(this, "showPType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "PEnum ( … )";
                const tt = tabs + t;
                const ttf = tt + f;
                const ttft = ttf + t;
                const ttftf = ttft + f;
                return `PEnum (
${ttf}population: ${this.population},
${ttf}pliteral: ${this.pliteral.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)},
${ttf}literals: [
${ttftf}${this.literals.map((l) => this.pliteral.showData(l, ttftf, maxDepth ? maxDepth - 1n : maxDepth)).join(`,\n${ttftf}`)}
${ttft}]
${tt})`;
            }
        });
        assert(literals.length > 0, "PEnum: literals of enum must be non-empty");
        this.plutusLiterals = literals.map((l) => pliteral.pconstant(l));
        this.strs = [];
        literals.forEach((l) => {
            const str = pliteral.showData(l);
            assert(!this.strs.includes(str), `PEnum: Duplicate literal: ${str}`);
            this.strs.push(str);
        });
        this.population = literals.length;
    }
    static genPType(gen, maxDepth) {
        const pliteral = gen.generate(maxDepth);
        const length = genPositive(gMaxLength);
        const literals = [];
        const strs = [];
        for (let i = 0; i < length; i++) {
            const literal = pliteral.genData();
            const str = pliteral.showData(literal);
            if (!strs.includes(str)) {
                strs.push(str);
                literals.push(literal);
            }
        }
        return new PEnum(pliteral, literals);
    }
}
