import { PAsset } from "../general/derived/asset/asset.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { PBoughtSold } from "./boughtSold.js";
export class Swap {
    constructor(boughtAsset, soldAsset, prices) {
        Object.defineProperty(this, "boughtAsset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: boughtAsset
        });
        Object.defineProperty(this, "soldAsset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: soldAsset
        });
        Object.defineProperty(this, "prices", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: prices
        });
    }
}
export class PSwap extends PObject {
    constructor() {
        super(new PRecord({
            boughtAsset: PAsset.ptype,
            soldAsset: PAsset.ptype,
            prices: PBoughtSold.ptype,
        }), Swap);
    }
    static genPType() {
        return PSwap.ptype;
    }
}
Object.defineProperty(PSwap, "ptype", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PSwap()
});
