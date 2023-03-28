import { PConstraint } from "../../fundamental/container/constraint.js";
import { PInteger } from "../../fundamental/primitive/integer.js";
export declare const bothExtreme: (a: bigint, b: bigint) => boolean;
export declare class PBounded extends PConstraint<PInteger> {
    lowerBound: bigint;
    upperBound: bigint;
    static pinner: PInteger;
    constructor(lowerBound?: bigint, upperBound?: bigint);
    static genPType(): PConstraint<PInteger>;
}
export declare const genPBounded: (minLowerBound?: bigint) => PBounded;
export declare const newGenInRange: (lowerBound: bigint, upperBound: bigint) => () => bigint;
