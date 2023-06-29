import { Assets } from "../general/derived/asset/assets.js";
import { KeyHash } from "../general/derived/hash/keyHash.js";
import { PObject } from "../general/fundamental/container/object.js";
import { EuclidValue } from "./euclidValue.js";
export declare const gMaxJumpSize = 100n;
export declare class Param {
    readonly owner: KeyHash;
    readonly virtual: EuclidValue;
    readonly weights: EuclidValue;
    readonly jumpSizes: EuclidValue;
    readonly active: bigint;
    constructor(owner: KeyHash, virtual: EuclidValue, // NOTE need those to be nonzero for multiplicative ticks
    weights: EuclidValue, // NOTE those are actually inverted
    jumpSizes: EuclidValue, active: bigint);
    static minAnchorPrice: (virtual: bigint, weight: bigint, jumpSize: bigint) => bigint;
    get minAnchorPrices(): EuclidValue;
    get assets(): Assets;
    get switched(): Param;
    sharedAssets: (assets: Assets) => Assets;
    concise: (tabs?: string) => string;
    static asserts(param: Param): void;
    static generate(): Param;
    static genOf(owner: KeyHash, allAssets: Assets): Param;
    static weightBounds(jumpSize: bigint, virtual: bigint): [bigint, bigint];
    static virtualBounds(jumpSize: bigint, weight: bigint): [bigint, bigint];
    static jumpSizeBounds(virtual: bigint, weight: bigint): [bigint, bigint];
}
export declare class PParam extends PObject<Param> {
    private constructor();
    genData: typeof Param.generate;
    static ptype: PParam;
    static genPType(): PParam;
}
