/*
PType - for parser-type. Also a nod to Plutarch.
It's basically a crude runtime type system for data parsing.
Each class represents a mechanism to create the corresponding
non-P-type, not actual data.
plift parses, pconstant composes.
T is the equivalent concrete type.
*/

import { Constr, Data } from "https://deno.land/x/lucid@0.8.6/mod.ts";

export type RecordOfMaybe<T> = Record<string, T | undefined>;

// returns all the fields that conform to Lifted, also filters functions
export type F<T> = {
  [P in keyof T]: T[P] extends Lmm<Lifted> | undefined ? T[P] : never;
};


// export class ObjectOf<T> implements RecordOfMaybe<T>{
// [x: string]: T|undefined;
// }

type L0 = bigint | string;
export type Lpp<L extends Lifted> = L | Array<L> | Map<L, L> | RecordOfMaybe<unknown>
// any type with an equivalent Data-type, determined by Constanted
export type Lifted = Lpp<Lpp<L0>>; //Lpp<Lpp<Lpp<Lpp<Lpp<Lpp<L0>>>>>>;
export type Lmm<LContainer extends Lifted> = LContainer extends Lpp<infer L> ? L
  : never;

// the equivalent Data-type
export type Constanted<L extends Lifted> = L extends bigint ? bigint
  : L extends string ? string
  : L extends Array<infer E extends Lifted> ? Array<Constanted<E>>
  : L extends Map<infer K extends Lifted, infer V extends Lifted>
    ? Map<Constanted<K>, Constanted<V>>
  : L extends RecordOfMaybe<unknown> 
    ? Array<Constanted<F<L>>>
  : never;

export interface PType<L extends Lifted> {
  readonly population: number; // number because convenient Infinity type
  plift(data: Constanted<L>): L;
  pconstant(data: L): Constanted<L>;
  // abstract genPType(gen: Generators, maxDepth: number, maxLength: number): PData; // static
  genData(): L;
  showData(data: L, tabs?: string): string;
  showPType(tabs?: string): string;
}

export const f = "+  ";
export const t = "   ";
