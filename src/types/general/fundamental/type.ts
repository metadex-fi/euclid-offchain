/*
PType - for parser-type. Also a nod to Plutarch.
It's basically a crude runtime type system for data parsing.
Each class represents a mechanism to create the corresponding
non-P-type, not actual data.
plift parses, pconstant composes.
T is the equivalent concrete type.
*/

import {
  Constr,
  Data as LucidData,
  Datum,
  fromHex,
  Redeemer,
  toHex,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";

export type Data =
  | Uint8Array
  | bigint
  | Data[]
  | Map<Data, Data>
  | Constr<Data>;

export const Data = {
  to: (data: Data): Datum | Redeemer => {
    return LucidData.to(Data.lucid(data));
  },
  from: (raw: Datum | Redeemer): Data => {
    return Data.plutus(LucidData.from(raw));
  },

  plutus: (data: LucidData): Data => {
    if (typeof data === "string") {
      return fromHex(data);
    } else if (typeof data === "bigint") {
      return data;
    } else if (data instanceof Array) {
      return data.map(Data.plutus);
    } else if (data instanceof Map) {
      return new Map(
        [...data.entries()].map(([k, v]) => [Data.plutus(k), Data.plutus(v)]),
      );
    } else if (data instanceof Constr) {
      return new Constr(data.index, data.fields.map(Data.plutus));
    } else {
      throw new Error(`bytey: unknown data type ${data}`);
    }
  },

  lucid: (data: Data): LucidData => {
    if (data instanceof Uint8Array) {
      return toHex(data);
    } else if (typeof data === "bigint") {
      return data;
    } else if (data instanceof Array) {
      return data.map(Data.lucid);
    } else if (data instanceof Map) {
      return new Map(
        [...data.entries()].map(([k, v]) => [Data.lucid(k), Data.lucid(v)]),
      );
    } else if (data instanceof Constr) {
      return new Constr(data.index, data.fields.map(Data.lucid));
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
  readonly population: number; // number because convenient Infinity type
  plift(data: D): L;
  pconstant(data: L): D;
  genData(): L;
  showData(data: L, tabs?: string): string;
  showPType(tabs?: string): string;
}

export type PData = PType<Data, unknown>;
export type PLifted<P extends PData> = ReturnType<P["plift"]>;
export type PConstanted<P extends PData> = ReturnType<P["pconstant"]>;

export const f = "+  ";
export const t = "   ";
