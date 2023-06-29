import { maxInteger } from "../../utils/generators.js";
import { PBounded } from "../general/derived/bounded/bounded.js";
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
        // TODO high upper bound, but this is required by onchain. set maxInteger accordingly
        // TODO also the value is just artlessly, excessively high right now
        // needs to be less than weight * (virtual + balance) + jumpSize
        const pbounded = new PBounded(0n, maxInteger);
        super(new PRecord({
            bought: pbounded,
            sold: pbounded,
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
