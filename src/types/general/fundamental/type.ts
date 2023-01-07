/*
PType - for parser-type. Also a nod to Plutarch.
It's basically a crude runtime type system for data parsing.
Each class represents a mechanism to create the corresponding
non-P-type, not actual data.
plift parses, pconstant composes.
T is the equivalent concrete type.
*/

import { Constr, Data } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { PByteString } from "./bytestring.ts";
import { PConstr } from "./constr.ts";
import { PInteger } from "./integer.ts";
import { PMap } from "./map.ts";
import { PObject } from "./object.ts";

export type RecordOf<T> = Record<string, T>;
export type RecordOfMaybe<T> = RecordOf<T | undefined>;
export type PData = PType<Data, unknown>;
export type PConstanted<PT extends PData> = ReturnType<
  PT["pconstant"]
>; //| PT extends PConstr<PT> ? Constr<PConstanted<PT>> : never;
export type PLifted<PT extends PData> = ReturnType<
  PT["plift"]
>;

type PlutusObject<T> = RecordOf<PlutusOf<T>>;

export type PlutusOf<T> = T extends Data ? T
  : T extends Array<infer E> ? Array<PlutusOf<E>>
  : T extends Map<infer K, infer V> ? Map<PlutusOf<K>, PlutusOf<V>>
  : T extends Constr<infer F> ? Array<PlutusOf<F>>
  : T extends PlutusObject<T> ? Array<PlutusOf<T[keyof T]>>
  : never;

export type PTypeOf<T> = T extends bigint ? PInteger
  : T extends string ? PByteString
  // @ts-ignore TODO consider fixing this or leaving as is
  : T extends Array<infer E> ? PList<PTypeOf<E>>
  // @ts-ignore TODO consider fixing this or leaving as is
  : T extends Map<infer K, infer V> ? PMap<PTypeOf<K>, PTypeOf<V>>
  : T extends Constr<infer F> ? PConstr<PTypeOf<F>>
  : T extends RecordOf<PlutusOf<unknown>> ? PObject<T>
  : never; //PAny<PlutusOf<T>>;

export interface PType<P extends Data, T> {
  population: number; // number because convenient Infinity type
  plift(data: P): T;
  pconstant(data: T): P;
  // abstract genPType(gen: Generators, maxDepth: number, maxLength: number): PData; // static
  genData(): T;
  showData(data: T, tabs?: string): string;
  showPType(tabs?: string): string;
}
export type Constructor<T> = new (...args: unknown[]) => T;
export const PTypes: RecordOf<PData> = {};

export const f = "+  ";
export const t = "   ";
