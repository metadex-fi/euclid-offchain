import { assert } from "../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { genNonNegative, maxInteger } from "../../../../utils/generators.js";
import { PConstraint } from "../../fundamental/container/constraint.js";
import { PInteger } from "../../fundamental/primitive/integer.js";
export const bothExtreme = (a, b) => a === b && a === maxInteger || a === -maxInteger;
export class PBounded extends PConstraint {
    constructor(lowerBound = -maxInteger, upperBound = maxInteger) {
        assert(lowerBound <= upperBound, `PBounded: ${lowerBound} > ${upperBound}`);
        super(PBounded.pinner, [newAssertInRange(lowerBound, upperBound)], newGenInRange(lowerBound, upperBound), `PBounded(${lowerBound}, ${upperBound})`);
        Object.defineProperty(this, "lowerBound", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: lowerBound
        });
        Object.defineProperty(this, "upperBound", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: upperBound
        });
        this.population = Number(upperBound - lowerBound) + 1;
    }
    static genPType() {
        return genPBounded();
    }
}
Object.defineProperty(PBounded, "pinner", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PInteger()
});
export const genPBounded = (minLowerBound = -maxInteger) => {
    assert(minLowerBound >= -maxInteger, `${minLowerBound} < -maxInteger`);
    assert(minLowerBound < maxInteger, `${minLowerBound} >= maxInteger`);
    const lowerBound = newGenInRange(minLowerBound, maxInteger)();
    const upperBound = newGenInRange(lowerBound, maxInteger)();
    return new PBounded(lowerBound, upperBound);
};
export const newGenInRange = (lowerBound, upperBound) => {
    if (lowerBound === upperBound)
        return () => lowerBound;
    assert(lowerBound <= upperBound, `newGenInRange: ${lowerBound} > ${upperBound}`);
    return () => lowerBound + genNonNegative(upperBound - lowerBound);
};
const newAssertInRange = (lowerBound, upperBound) => (i) => {
    assert(!lowerBound || lowerBound <= i, `too small: ${i} < ${lowerBound} by ${lowerBound - i}`);
    assert(!upperBound || i <= upperBound, `too big: ${i} > ${upperBound} by ${i - upperBound}`);
};
