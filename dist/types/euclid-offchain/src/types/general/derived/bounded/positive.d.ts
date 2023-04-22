import { PBounded } from "./bounded.js";
export declare class PPositive extends PBounded {
    lowerBound: bigint;
    upperBound: bigint;
    constructor(lowerBound?: bigint, upperBound?: bigint);
    static genPType(): PPositive;
}
