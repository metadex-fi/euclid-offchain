import { PType } from "../type.js";
export declare class PByteString implements PType<Uint8Array, Uint8Array> {
    readonly minBytes: bigint;
    readonly maxBytes: bigint;
    readonly population: number;
    constructor(minBytes?: bigint, maxBytes?: bigint);
    plift: (s: Uint8Array) => Uint8Array;
    pconstant: (data: Uint8Array) => Uint8Array;
    genData: () => Uint8Array;
    showData: (data: Uint8Array) => string;
    showPType: () => string;
    static ptype: PByteString;
    static genPType(): PByteString;
}
