import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { f, t } from "../type.js";
export class PLiteral {
    constructor(pliteral, literal) {
        Object.defineProperty(this, "pliteral", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pliteral
        });
        Object.defineProperty(this, "literal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: literal
        });
        Object.defineProperty(this, "population", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "plutusLiteral", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "str", {
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
                assert(this.pliteral.showData(this.pliteral.plift(l)) === this.str, "Literal does not match");
                return this.literal;
            }
        });
        Object.defineProperty(this, "pconstant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                assert(this.pliteral.showData(data) === this.str, "Literal does not match");
                return this.plutusLiteral;
            }
        });
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return this.literal;
            }
        });
        Object.defineProperty(this, "showData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data, tabs = "", maxDepth) => {
                if (maxDepth !== undefined && maxDepth <= 0n)
                    return "Literal ( … )";
                assert(this.pliteral.showData(data) === this.str, `Literal.showData: Literal does not match, got:\n${this.pliteral.showData(data)},\nexpected:\n${this.str}.`);
                const tt = tabs + t;
                const ttf = tt + f;
                return `Literal (
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
                    return "PLiteral ( … )";
                const tt = tabs + t;
                const ttf = tt + f;
                return `PLiteral (
${ttf}population: ${this.population},
${ttf}pliteral: ${this.pliteral.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)},
${ttf}literal: ${this.pliteral.showData(this.literal, ttf, maxDepth ? maxDepth - 1n : maxDepth)}
${tt})`;
            }
        });
        this.plutusLiteral = pliteral.pconstant(literal);
        this.str = pliteral.showData(literal);
    }
    static genPType(gen, maxDepth) {
        const pliteral = gen.generate(maxDepth);
        const literal = pliteral.genData();
        return new PLiteral(pliteral, literal);
    }
}
