import { Lucid } from "../../../../../lucid.mod.js";
import { Generators } from "../../../../utils/generators.js";
import { PConstanted, PData, PLifted, PType, RecordOfMaybe } from "../type.js";
export declare class PRecord<PFields extends PData> implements PType<Lucid.Constr<PConstanted<PFields>>, RecordOfMaybe<PLifted<PFields>>> {
    readonly pfields: RecordOfMaybe<PFields>;
    readonly population: number;
    private index;
    constructor(pfields: RecordOfMaybe<PFields>);
    setIndex: (index: number) => number;
    plift: (c: Lucid.Constr<PConstanted<PFields>>) => RecordOfMaybe<PLifted<PFields>>;
    private checkFields;
    pconstant: (data: RecordOfMaybe<PLifted<PFields>>) => Lucid.Constr<PConstanted<PFields>>;
    genData: () => RecordOfMaybe<PLifted<PFields>>;
    showData: (data: RecordOfMaybe<PLifted<PFields>>, tabs?: string, maxDepth?: bigint) => string;
    showPType: (tabs?: string, maxDepth?: bigint) => string;
    static genPType<PFields extends PData>(gen: Generators, maxDepth: bigint): PRecord<PFields>;
}
