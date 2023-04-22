import { PWrapped } from "../../fundamental/container/wrapped.js";
export declare class Hash {
    readonly bytes: Uint8Array;
    constructor(bytes: Uint8Array);
    hash: (skip?: bigint) => Hash;
    show: () => string;
    toString: () => string;
    toLucid: () => string;
    static fromLucid(hexTokenName: string): Hash;
    static fromString(s: string): Hash;
    static numBytes: bigint;
    static dummy: Hash;
}
export declare class PHash extends PWrapped<Hash> {
    private constructor();
    static ptype: PHash;
    static genPType(): PWrapped<Hash>;
}
