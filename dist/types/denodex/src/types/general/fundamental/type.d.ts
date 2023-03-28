import { Lucid } from "../../../../lucid.mod.js";
export declare type Data = Uint8Array | bigint | Data[] | Map<Data, Data> | Lucid.Constr<Data>;
export declare const Data: {
    to: (data: Data) => Lucid.Datum | Lucid.Redeemer;
    from: (raw: Lucid.Datum | Lucid.Redeemer) => Data;
    plutus: (data: Lucid.Data) => Data;
    lucid: (data: Data) => Lucid.Data;
};
export declare type RecordOfMaybe<T> = Record<string, T | undefined>;
export interface PType<D extends Data, L extends unknown> {
    readonly population: number;
    plift(data: D): L;
    pconstant(data: L): D;
    genData(): L;
    showData(data: L, tabs?: string, maxDepth?: bigint): string;
    showPType(tabs?: string, maxDepth?: bigint): string;
}
export declare type PData = PType<Data, unknown>;
export declare type PLifted<P extends PData> = ReturnType<P["plift"]>;
export declare type PConstanted<P extends PData> = ReturnType<P["pconstant"]>;
export declare const f = "+  ";
export declare const t = "   ";
