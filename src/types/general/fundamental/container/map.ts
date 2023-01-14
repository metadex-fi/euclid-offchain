import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Data } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Generators,
  genNonNegative,
  gMaxLength,
  maybeNdef,
} from "../../../../mod.ts";
import { Constanted, f, Lifted, Lmm, PType, t } from "../type.ts";
import { PList } from "./list.ts";

function census(numKeys: number, numValues: number, size: bigint): number {
  let population = 1;
  let remaining = numKeys;
  for (let i = 0; i < size; i++) {
    population *= numValues * remaining--;
  }
  return population;
}

export class PMap<
  K extends Lifted,
  V extends Lifted,
> implements
  PType<
    Map<Lmm<K>, Lmm<V>>
  > {
  public readonly population: number;

  constructor(
    public readonly pkey: PType<Lmm<K>>,
    public readonly pvalue: PType<Lmm<V>>,
    public readonly size?: bigint,
    public readonly keys?: Lmm<K>[],
    private readonly dataKeys?: Constanted<Lmm<K>>[],
  ) {
    if (keys) {
      this.dataKeys = keys.map((k) => pkey.pconstant(k));
      const length = BigInt(keys.length);
      if (size) {
        assert(length === size, `PMap: wrong size`);
      } else {
        this.size = length;
      }
      this.population = pvalue.population ** keys.length; //if keys given, their ordering is fixed
    } else if (size) {
      assert(
        Number(size) <= pkey.population,
        `PMap: not enough keys for size ${size} in\n${pkey.showPType()}`,
      );
      this.population = census(pkey.population, pvalue.population, size); // if keys not given, their ordering matters
    } else this.population = 1; // worst case, consider preventing this by setting minimum size, or using undefined
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (
    m: Constanted<Map<Lmm<K>, Lmm<V>>>,
  ): Map<Lmm<K>, Lmm<V>> => {
    assert(m instanceof Map, `plift: expected Map`);
    assert(
      !this.size || this.size === BigInt(m.size),
      `plift: wrong size`,
    );

    const data = new Map<Lmm<K>, Lmm<V>>();
    let i = 0;
    m.forEach((value, key) => {
      const k = this.pkey.plift(key);
      assert(
        !this.dataKeys || Data.to(this.dataKeys[i++]) === Data.to(key),
        `PMap.pconstant: wrong key of ptype
        ${this.pkey.showPType()}
        : ${key.toString()}`,
      );
      data.set(k, this.pvalue.plift(value));
    });
    return data;
  };

  public pconstant = (
    data: Map<Lmm<K>, Lmm<V>>,
  ): Constanted<Map<Lmm<K>, Lmm<V>>> => {
    assert(data instanceof Map, `pconstant: expected Map`);
    assert(
      !this.size || this.size === BigInt(data.size),
      `pconstant: wrong size: ${this.size} vs. ${data.size}`,
    );

    const m = new Map<Constanted<Lmm<K>>, Constanted<Lmm<V>>>();
    let i = 0;
    data.forEach((value, key) => {
      const k = this.pkey.pconstant(key);
      assert(
        !this.dataKeys ||
          Data.to(this.dataKeys[i++]) ===
            Data.to(k),
        `PMap.plift: wrong key`,
      );
      m.set(
        k,
        this.pvalue.pconstant(value),
      );
    });
    return m;
  };

  static genKeys<K extends Lifted>(
    pkey: PType<K>,
    size?: bigint,
  ): K[] {
    // console.log(`PMap.genKeys: ${pkey.showPType()}, size: ${Number(size)}`);
    let timeout = gMaxLength + 100n;

    function genKey(): void {
      const key = pkey.genData();
      const keyString = pkey.showData(key);

      if (!keyStrings.has(keyString)) {
        keyStrings.set(keyString, 1);
        keys.push(key);
      } else {
        keyStrings.set(keyString, keyStrings.get(keyString)! + 1);
        // console.log(
        //   `PMap.genKeys: duplicate key: ${keyString}, timeout: ${
        //     Number(timeout)
        //   }`,
        // );
        if (timeout-- < 0n) {
          throw new Error(
            `Map.genKeys: timeout with
${t}size: ${Number(size)},
${t}keyStrings: ${
              [...keyStrings.entries()].map(([key, value]) =>
                `${value} x ${key}`
              ).join(`,\n${t + f}`)
            },
${t}pkey: ${pkey.showPType(t)}`,
          );
        }
      }
    }

    const keys = new Array<K>();
    const keyStrings = new Map<string, number>();

    const maxKeys = pkey.population;
    if (size) {
      assert(
        size <= maxKeys,
        `PMap.genKeys: size too big: ${Number(size)} vs. ${maxKeys}`,
      );
      while (keys.length < size) genKey();
    } else {
      const size_ = genNonNegative(
        BigInt(Math.min(Number(gMaxLength), maxKeys)),
      );
      for (let i = 0; i < size_; i++) genKey();
    }
    return keys;
  }

  static genMap<K extends Lifted, V extends Lifted>(
    pkey: PType<Lmm<K>>,
    pvalue: PType<Lmm<V>>,
    size: bigint,
  ): Map<Lmm<K>, Lmm<V>> {
    assert(
      Number(size) <= pkey.population,
      `PMap: not enough keys for size ${Number(size)} in ${pkey.showPType()}`,
    );
    const m = new Map<Lmm<K>, Lmm<V>>();
    const keys = PMap.genKeys(pkey, size);
    // console.log(`generating Map with keys: ${JSON.stringify(keys)}`);
    keys.forEach((key) => {
      m.set(key, pvalue.genData());
    });
    return m;
  }

  public genData = (): Map<Lmm<K>, Lmm<V>> => {
    if (this.keys) {
      // console.log(`populating Map with keys: ${JSON.stringify(this.keys)}`);
      const m = new Map<Lmm<K>, Lmm<V>>();
      this.keys.forEach((key) => {
        m.set(key, this.pvalue.genData());
      });
      return m;
    } else {
      // console.log(`generating Data for ${this.showPType()}`);
      const size = this.size ? this.size : genNonNegative(
        BigInt(Math.min(Number(gMaxLength), this.pkey.population)),
      );
      // console.log(`generating Map with size: ${Number(size)}`);
      return PMap.genMap(this.pkey, this.pvalue, size);
    }
  };

  public showData = (
    data: Map<Lmm<K>, Lmm<V>>,
    tabs = "",
  ): string => {
    assert(data instanceof Map, `PMap.showData: expected Map, got ${data}`);
    const tt = tabs + t;
    const ttf = tt + f;

    return `Map {
${
      [...data.entries()].map(([key, value]) =>
        `${ttf}${this.pkey.showData(key, ttf)} => ${
          this.pvalue.showData(value, ttf)
        }`
      ).join(",\n")
    }
${tt}}`;
  };

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    const ttft = ttf + t;

    const keys = this.keys
      ? new PList(this.pkey).showData(this.keys, ttft)
      : "undefined";

    return `PMap (
${ttf}population: ${this.population},
${ttf}pkey: ${this.pkey.showPType(ttf)},
${ttf}pvalue: ${this.pvalue.showPType(ttf)},
${ttf}size?: ${this.size},
${ttf}keys?: ${keys}
${tt})`;
  };

  static genPType<K extends Lifted, V extends Lifted>(
    gen: Generators,
    maxDepth: bigint,
  ): PMap<K, V> { // additional maxDepth - 1n intentional
    const pkey: PType<Lmm<K>> = gen.generate(maxDepth - 1n);
    const pvalue: PType<Lmm<V>> = gen.generate(maxDepth - 1n);
    const keys: Lmm<K>[] | undefined = maybeNdef(() => PMap.genKeys(pkey))?.();
    const size = maybeNdef(
      BigInt(
        keys?.length ??
          genNonNegative(BigInt(Math.min(Number(gMaxLength), pkey.population))),
      ),
    );

    return new PMap<K, V>(pkey, pvalue, size, keys);
  }
}
