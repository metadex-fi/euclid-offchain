import { Generators } from "../../../../utils/generators.js";
import { PConstanted, PData, PLifted, PType } from "../type.js";
export declare class PList<PElem extends PData> implements PType<PConstanted<PElem>[], PLifted<PElem>[]> {
    readonly pelem: PElem;
    readonly length?: bigint | undefined;
    readonly population: number;
    constructor(pelem: PElem, length?: bigint | undefined);
    plift: (l: PConstanted<PElem>[]) => PLifted<PElem>[];
    pconstant: (data: PLifted<PElem>[]) => PConstanted<PElem>[];
    static genList<T>(elemGenerator: () => T, length: bigint): Array<T>;
    genData: () => PLifted<PElem>[];
    showData: (data: PLifted<PElem>[], tabs?: string, maxDepth?: bigint) => string;
    showPType: (tabs?: string, maxDepth?: bigint) => string;
    static genPType<PElem extends PData>(gen: Generators, maxDepth: bigint): PList<PElem>;
}
