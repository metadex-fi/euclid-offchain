import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { genName, genNonNegative, gMaxStringLength, maybeNdef, } from "../../../../utils/generators.js";
export class PString {
    constructor(minLength = 0n, maxLength = gMaxStringLength) {
        Object.defineProperty(this, "minLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: minLength
        });
        Object.defineProperty(this, "maxLength", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: maxLength
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
            value: (s) => {
                assert(s instanceof Uint8Array, `PString.plift: expected Uint8Array, got ${s} (${typeof s})`);
                const data = Lucid.toText(Lucid.toHex(s));
                assert(data.length >= this.minLength, `PString.plift: data too short: ${data}`);
                assert(data.length <= this.maxLength, `PString.plift: data too long: ${data}`);
                return data;
            }
        });
        Object.defineProperty(this, "pconstant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                assert(typeof data === `string`, `PString.pconstant: expected string, got ${data} (${typeof data})`);
                assert(data.length >= this.minLength, `PString.pconstant: data too short: ${data}`);
                assert(data.length <= this.maxLength, `PString.pconstant: data too long: ${data}`);
                return Lucid.fromHex(Lucid.fromText(data.toString()));
            }
        });
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return genName(this.minLength, this.maxLength);
            }
        });
        Object.defineProperty(this, "showData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                assert(typeof data === `string`, `PString.showData: expected String, got ${data} (${typeof data})`);
                return `PString: ${data}`;
            }
        });
        Object.defineProperty(this, "showPType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `PString`;
            }
        });
        assert(minLength >= 0n, `PString: minLength must be non-negative, got ${minLength}`);
        assert(maxLength >= minLength, `PString: maxLength must be greater than or equal to minLength, got ${maxLength} < ${minLength}`);
        this.population = maxLength ? Infinity : 1; // NOTE inaccurate, but serves, and quickly
    }
    static genPType() {
        const minLength = maybeNdef(genNonNegative)?.(gMaxStringLength);
        const maxLength = maybeNdef(() => (minLength ?? 0n) + genNonNegative(gMaxStringLength - (minLength ?? 0n)))?.();
        return new PString(minLength, maxLength);
    }
}
Object.defineProperty(PString, "ptype", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PString()
});
