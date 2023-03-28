import { Generators } from "../../../../utils/generators.js";
import { Data, PData, PType } from "../type.js";
import { PRecord } from "./record.js";
import { Lucid } from "../../../../../lucid.mod.js";
export declare const filterFunctions: <O extends Object>(o: O) => {
    [k: string]: any;
};
export declare class PObject<O extends Object> implements PType<Lucid.Constr<Data>, O> {
    readonly precord: PRecord<PData>;
    readonly O: new (...args: Array<any>) => O;
    readonly population: number;
    constructor(precord: PRecord<PData>, O: new (...args: Array<any>) => O);
    setIndex: (index: number) => number;
    plift: (l: Lucid.Constr<Data>) => O;
    pconstant: (data: O) => Lucid.Constr<Data>;
    genData: () => O;
    showData: (data: O, tabs?: string, maxDepth?: bigint) => string;
    showPType: (tabs?: string, maxDepth?: bigint) => string;
    static genPType(_gen: Generators, _maxDepth: bigint): PObject<any>;
}
