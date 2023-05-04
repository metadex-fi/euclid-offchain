import { Generators } from "../../../../utils/generators.js";
import { PConstanted, PData, PLifted, PType } from "../type.js";
export declare class AssocMap<K, V> {
  private readonly showKey;
  private readonly inner;
  constructor(showKey: (k: K, tabs?: string) => string);
  get size(): number;
  get anew(): AssocMap<K, V>;
  get last(): V | undefined;
  set: (k: K, v: V) => void;
  get: (k: K) => V | undefined;
  has: (k: K) => boolean;
  delete: (k: K) => boolean;
  clear: () => void;
  keys(): Generator<K>;
  values(): Generator<V>;
  entries(): Generator<[K, V]>;
  [Symbol.iterator](): Generator<[K, V]>;
  forEach: (
    callbackfn: (value: V, key: K, map: AssocMap<K, V>) => void,
    thisArg?: any,
  ) => void;
  map: <V1>(f: (v: V) => V1 | undefined) => AssocMap<K, V1>;
  zipWith: <V0, V1>(
    other: AssocMap<K, V0>,
    f: (v: V, v0: V0) => V1,
  ) => AssocMap<K, V1>;
  show: (showValue: (v: V, tabs?: string) => string, tabs?: string) => string;
}
export declare class PMap<PKey extends PData, PValue extends PData>
  implements
    PType<
      Map<PConstanted<PKey>, PConstanted<PValue>>,
      AssocMap<PLifted<PKey>, PLifted<PValue>>
    > {
  readonly pkey: PKey;
  readonly pvalue: PValue;
  readonly size?: bigint | undefined;
  readonly keys?: ReturnType<PKey["plift"]>[] | undefined;
  private readonly dataKeys?;
  readonly population: number;
  constructor(
    pkey: PKey,
    pvalue: PValue,
    size?: bigint | undefined,
    keys?: ReturnType<PKey["plift"]>[] | undefined,
    dataKeys?: ReturnType<PKey["pconstant"]>[] | undefined,
  );
  plift: (
    m: Map<PConstanted<PKey>, PConstanted<PValue>>,
  ) => AssocMap<PLifted<PKey>, PLifted<PValue>>;
  pconstant: (
    data: AssocMap<PLifted<PKey>, PLifted<PValue>>,
  ) => Map<PConstanted<PKey>, PConstanted<PValue>>;
  static genKeys<PKey extends PData>(
    pkey: PKey,
    size?: bigint,
  ): PLifted<PKey>[];
  static genMap<PKey extends PData, PValue extends PData>(
    pkey: PKey,
    pvalue: PValue,
    size: bigint,
  ): AssocMap<PLifted<PKey>, PLifted<PValue>>;
  genData: () => AssocMap<PLifted<PKey>, PLifted<PValue>>;
  showData: (
    data: AssocMap<PLifted<PKey>, PLifted<PValue>>,
    tabs?: string,
    maxDepth?: bigint,
  ) => string;
  showPType: (tabs?: string, maxDepth?: bigint) => string;
  static genPType<PKey extends PData, PValue extends PData>(
    gen: Generators,
    maxDepth: bigint,
  ): PMap<PKey, PValue>;
}
