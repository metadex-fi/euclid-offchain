import { PType } from "../type.js";
export declare class PInteger implements PType<bigint, bigint> {
    readonly population: number;
    plift: (i: bigint) => bigint;
    pconstant: (data: bigint) => bigint;
    genData: () => bigint;
    showData: (data: bigint) => string;
    showPType: () => string;
    static ptype: PInteger;
    static genPType(): PInteger;
}
