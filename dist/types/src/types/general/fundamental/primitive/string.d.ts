import { PType } from "../type.js";
export declare class PString implements PType<Uint8Array, string> {
    readonly minLength: bigint;
    readonly maxLength: bigint;
    readonly population: number;
    constructor(minLength?: bigint, maxLength?: bigint);
    plift: (s: Uint8Array) => string;
    pconstant: (data: string) => Uint8Array;
    genData: () => string;
    showData: (data: string) => string;
    showPType: () => string;
    static ptype: PString;
    static genPType(): PString;
}
