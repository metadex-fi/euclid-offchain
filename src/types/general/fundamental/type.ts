/*
PType - for parser-type. Also a nod to Plutarch.
It's basically a crude runtime type system for data parsing.
Each class represents a mechanism to create the corresponding
non-P-type, not actual data.
plift parses, pconstant composes.
T is the equivalent concrete type.
*/

import { Lucid } from "../../../../lucid.mod.ts";

export type Data =
  | Uint8Array
  | bigint
  | Data[]
  | Map<Data, Data>
  | Lucid.Constr<Data>;

export const Data = {
  to: (data: Data): Lucid.Datum | Lucid.Redeemer => {
    return Lucid.Data.to(Data.lucid(data));
  },
  from: (raw: Lucid.Datum | Lucid.Redeemer): Data => {
    return Data.plutus(Lucid.Data.from(raw));
  },

  plutus: (data: Lucid.Data): Data => {
    if (typeof data === "string") {
      return Lucid.fromHex(data);
    } else if (typeof data === "bigint") {
      return data;
    } else if (data instanceof Array) {
      return data.map(Data.plutus);
    } else if (data instanceof Map) {
      return new Map(
        [...data.entries()].map(([k, v]) => [Data.plutus(k), Data.plutus(v)]),
      );
    } else if (data instanceof Lucid.Constr) {
      return new Lucid.Constr(data.index, data.fields.map(Data.plutus));
    } else {
      throw new Error(`bytey: unknown data type ${data}`);
    }
  },

  lucid: (data: Data): Lucid.Data => {
    if (data instanceof Uint8Array) {
      return Lucid.toHex(data);
    } else if (typeof data === "bigint") {
      return data;
    } else if (data instanceof Array) {
      return data.map(Data.lucid);
    } else if (data instanceof Map) {
      return new Map(
        [...data.entries()].map(([k, v]) => [Data.lucid(k), Data.lucid(v)]),
      );
    } else if (data instanceof Lucid.Constr) {
      return new Lucid.Constr(data.index, data.fields.map(Data.lucid));
    } else {
      throw new Error(`stringy: unknown data type ${data}`);
    }
  },
};

export type RecordOfMaybe<T> = Record<string, T | undefined>;

// we need two types here, because we can both map multiple Data-types onto the same
// Lifted-type, and vice versa; examples (Data -> LIfted):
// 1. Array maps to Array (via PList), Record (via PRecord) and Object (via PObject)
// 2. Array (via PObject) and Constr (via PSum) map to Object
export interface PType<D extends Data, L extends unknown> {
  readonly population: bigint | undefined; // undefined means infinite TODO better way?
  plift(data: D): L;
  pconstant(data: L): D;
  genData(): L;
  showData(data: L, tabs?: string, maxDepth?: bigint): string;
  showPType(tabs?: string, maxDepth?: bigint): string;
}

export type PData = PType<Data, unknown>;
export type PLifted<P extends PData> = ReturnType<P["plift"]>;
export type PConstanted<P extends PData> = ReturnType<P["pconstant"]>;

export const f = "+  ";
export const t = "   ";
