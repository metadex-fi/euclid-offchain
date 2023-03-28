import { maxInteger } from "../../utils/generators.js";
import { PPositive } from "../general/derived/bounded/positive.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
export class BoughtSold {
    constructor(bought, sold) {
        Object.defineProperty(this, "bought", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: bought
        });
        Object.defineProperty(this, "sold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: sold
        });
    }
}
export class PBoughtSold extends PObject {
    constructor() {
        // leaving this as ppositive, because onchain rep should be positive
        // TODO high upper bound, but this is required by onchain. set maxInteger accordingly
        // TODO also the value is just artlessly, excessively high right now
        // needs to be less than weight * (virtual + balance) + jumpSize
        const ppositive = new PPositive(1n, maxInteger ** maxInteger);
        super(new PRecord({
            bought: ppositive,
            sold: ppositive,
        }), BoughtSold);
    }
    static genPType() {
        return PBoughtSold.ptype;
    }
}
Object.defineProperty(PBoughtSold, "ptype", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PBoughtSold()
});
