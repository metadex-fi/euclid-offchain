import { PData } from "../types/general/fundamental/type.js";
export declare const maxInteger = 9000n;
export declare const gMaxStringLength = 9000n;
export declare const gMaxStringBytes: bigint;
export declare const gMaxLength = 3n;
export declare const gMaxDepth = 4n;
export declare const feesEtcLovelace = 100000000n;
export declare class Generators {
  primitives: Array<() => PData>;
  containers: Array<(gen: Generators, maxDepth: bigint) => PData>;
  constructor(
    primitives: Array<() => PData>,
    containers: Array<(gen: Generators, maxDepth: bigint) => PData>,
  );
  generate(maxDepth: bigint): PData;
}
export declare function max(a: bigint, b: bigint): bigint;
export declare function min(a: bigint, b: bigint): bigint;
export declare function abs(n: bigint): bigint;
export declare function randomChoice<T>(alternatives: T[]): T;
export declare function randomIndexedChoice<T>(alternatives: T[]): [T, number];
export declare function randomSubset<T>(set: T[]): T[];
export declare function nonEmptySubSet<T>(set: T[]): T[];
export declare function boundedSubset<T>(
  set: T[],
  minSize?: bigint,
  maxSize?: bigint,
): T[];
export declare function maybeNdef<T>(value: T): T | undefined;
export declare function genNonNegative(maxValue?: bigint): bigint;
export declare function genPositive(maxValue?: bigint): bigint;
export declare function genNumber(maxValue?: bigint): bigint;
export declare function genByteString(
  minBytes?: bigint,
  maxBytes?: bigint,
): Uint8Array;
export declare function genName(minLength?: bigint, maxLength?: bigint): string;
