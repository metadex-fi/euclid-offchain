/*
PType - for parser-type. Also a nod to Plutarch.
It's basically a crude runtime type system for data parsing.
Each class represents a mechanism to create the corresponding
non-P-type, not actual data.
plift parses, pconstant composes.
T is the equivalent concrete type.
*/
import { Lucid } from "../../../../lucid.mod.js";
export const Data = {
  to: (data) => {
    return Lucid.Data.to(Data.lucid(data));
  },
  from: (raw) => {
    return Data.plutus(Lucid.Data.from(raw));
  },
  plutus: (data) => {
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
  lucid: (data) => {
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
export const f = "+  ";
export const t = "   ";
