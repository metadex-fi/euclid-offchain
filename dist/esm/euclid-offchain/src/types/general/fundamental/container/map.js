import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import {
  genNonNegative,
  gMaxLength,
  maybeNdef,
} from "../../../../utils/generators.js";
import { maxShowDepth } from "../../../../utils/proptests.js";
import { Data, f, t } from "../type.js";
import { PList } from "./list.js";
function census(numKeys, numValues, size) {
  let population = 1;
  let remaining = numKeys;
  for (let i = 0; i < size; i++) {
    population *= numValues * remaining--;
  }
  return population;
}
export class AssocMap {
  constructor(showKey) {
    Object.defineProperty(this, "showKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: showKey,
    });
    Object.defineProperty(this, "inner", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map(),
    });
    Object.defineProperty(this, "set", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (k, v) => {
        this.inner.set(this.showKey(k), [k, v]);
      },
    });
    Object.defineProperty(this, "get", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (k) => {
        return this.inner.get(this.showKey(k))?.[1];
      },
    });
    Object.defineProperty(this, "has", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (k) => {
        return this.inner.has(this.showKey(k));
      },
    });
    Object.defineProperty(this, "delete", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (k) => {
        return this.inner.delete(this.showKey(k));
      },
    });
    Object.defineProperty(this, "clear", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        this.inner.clear();
      },
    });
    Object.defineProperty(this, "forEach", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (callbackfn, thisArg) => {
        for (const [k, v] of this) {
          callbackfn.call(thisArg, v, k, this);
        }
      },
    });
    Object.defineProperty(this, "map", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (f) => {
        const result = new AssocMap(this.showKey);
        for (const [k, v] of this) {
          const v1 = f(v);
          if (v1) {
            result.set(k, v1);
          }
        }
        return result;
      },
    });
    Object.defineProperty(this, "zipWith", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other, f) => {
        const result = new AssocMap(this.showKey);
        for (const [k, v] of this) {
          const v0 = other.get(k);
          if (v0) {
            result.set(k, f(v, v0));
          }
        }
        return result;
      },
    });
    Object.defineProperty(this, "show", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (showValue, tabs = "") => {
        const tt = t + tabs;
        const ttf = tt + f;
        return `AssocMap {
      ${
          [...this.inner.values()].map(([key, value]) =>
            `${ttf}${this.showKey(key, ttf)} => ${showValue(value, ttf)}`
          ).join(",\n")
        }
      ${tt}}`;
      },
    });
  }
  // TODO check this notation works
  get size() {
    return this.inner.size;
  }
  // TODO check this notation works
  get anew() {
    return new AssocMap(this.showKey);
  }
  get last() {
    if (this.size === 0) {
      return undefined;
    }
    const ks = [...this.keys()];
    if (ks) {
      return this.get(ks[ks.length - 1]);
    } else {
      return undefined;
    }
  }
  // TODO check this notation works
  *keys() {
    for (const [_, entry] of this.inner) {
      yield entry[0];
    }
  }
  // TODO check this notation works
  *values() {
    for (const [_, entry] of this.inner) {
      yield entry[1];
    }
  }
  // TODO check this notation works
  *entries() {
    for (const [_, entry] of this.inner) {
      yield entry;
    }
  }
  // TODO check this notation works
  *[Symbol.iterator]() {
    yield* this.entries();
  }
}
export class PMap {
  constructor(pkey, pvalue, size, keys, dataKeys) {
    Object.defineProperty(this, "pkey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: pkey,
    });
    Object.defineProperty(this, "pvalue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: pvalue,
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: size,
    });
    Object.defineProperty(this, "keys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: keys,
    });
    Object.defineProperty(this, "dataKeys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: dataKeys,
    });
    Object.defineProperty(this, "population", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "plift", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (m) => {
        assert(m instanceof Map, `plift: expected Map`);
        assert(!this.size || this.size === BigInt(m.size), `plift: wrong size`);
        const data = new AssocMap(this.pkey.showData);
        let i = 0;
        m.forEach((value, key) => {
          const k = this.pkey.plift(key);
          assert(
            !this.dataKeys || Data.to(this.dataKeys[i++]) === Data.to(key),
            `PMap.pconstant: wrong key of ptype
        ${this.pkey.showPType("", maxShowDepth)}
        : ${key.toString()}`,
          );
          data.set(k, this.pvalue.plift(value));
        });
        return data;
      },
    });
    Object.defineProperty(this, "pconstant", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data) => {
        assert(
          data instanceof AssocMap,
          `AssocMap.pconstant: expected AssocMap`,
        );
        assert(
          !this.size || this.size === BigInt(data.size),
          `AssocMap.pconstant: wrong size: ${this.size} vs. ${data.size} of ${
            this.showData(data, "", maxShowDepth)
          }`,
        );
        const m = new Map();
        let i = 0;
        data.forEach((value, key) => {
          const k = this.pkey.pconstant(key);
          assert(
            !this.dataKeys ||
              Data.to(this.dataKeys[i++]) ===
                Data.to(k),
            `PMap.plift: wrong key`,
          );
          m.set(k, this.pvalue.pconstant(value));
        });
        return m;
      },
    });
    Object.defineProperty(this, "genData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        if (this.keys) {
          // console.log(`populating Map with keys: ${JSON.stringify(this.keys)}`);
          const m = new AssocMap(this.pkey.showData);
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
      },
    });
    Object.defineProperty(this, "showData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data, tabs = "", maxDepth) => {
        if (maxDepth !== undefined && maxDepth <= 0n) {
          return "AssocMap { … }";
        }
        assert(
          data instanceof AssocMap,
          `PMap.showData: expected AssocMap, got ${data}`,
        );
        const tt = tabs + t;
        const ttf = tt + f;
        return `AssocMap {
${
          [...data.entries()].map(([key, value]) =>
            `${ttf}${
              this.pkey.showData(key, ttf, maxDepth ? maxDepth - 1n : maxDepth)
            } => ${
              this.pvalue.showData(
                value,
                ttf,
                maxDepth ? maxDepth - 1n : maxDepth,
              )
            }`
          ).join(",\n")
        }
${tt}}`;
      },
    });
    Object.defineProperty(this, "showPType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tabs = "", maxDepth) => {
        if (maxDepth !== undefined && maxDepth <= 0n) {
          return "PMap ( … )";
        }
        const tt = tabs + t;
        const ttf = tt + f;
        const ttft = ttf + t;
        const keys = this.keys
          ? new PList(this.pkey).showData(this.keys, ttft)
          : "undefined";
        return `PMap (
${ttf}population: ${this.population},
${ttf}pkey: ${this.pkey.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)},
${ttf}pvalue: ${
          this.pvalue.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)
        },
${ttf}size?: ${this.size},
${ttf}keys?: ${keys}
${tt})`;
      },
    });
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
    } else {
      this.population = 1; // worst case, consider preventing this by setting minimum size, or using undefined
    }
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }
  static genKeys(pkey, size) {
    // console.log(`PMap.genKeys: ${pkey.showPType()}, size: ${Number(size)}`);
    let timeout = gMaxLength + 100n;
    function genKey() {
      const key = pkey.genData();
      const keyString = pkey.showData(key);
      if (!keyStrings.has(keyString)) {
        keyStrings.set(keyString, 1);
        keys.push(key);
      } else {
        keyStrings.set(keyString, keyStrings.get(keyString) + 1);
        // console.log(
        //   `PMap.genKeys: duplicate key: ${keyString}, timeout: ${
        //     Number(timeout)
        //   }`,
        // );
        if (timeout-- < 0n) {
          throw new Error(`Map.genKeys: timeout with
${t}size: ${Number(size)},
${t}keyStrings: ${
            [...keyStrings.entries()].map(([key, value]) => `${value} x ${key}`)
              .join(`,\n${t + f}`)
          },
${t}pkey: ${pkey.showPType(t)}`);
        }
      }
    }
    const keys = new Array();
    const keyStrings = new Map();
    const maxKeys = pkey.population;
    if (size) {
      assert(
        size <= maxKeys,
        `PMap.genKeys: size too big: ${Number(size)} vs. ${maxKeys}`,
      );
      while (keys.length < size) {
        genKey();
      }
    } else {
      const size_ = genNonNegative(
        BigInt(Math.min(Number(gMaxLength), maxKeys)),
      );
      for (let i = 0; i < size_; i++) {
        genKey();
      }
    }
    return keys;
  }
  static genMap(pkey, pvalue, size) {
    assert(
      Number(size) <= pkey.population,
      `PMap: not enough keys for size ${Number(size)} in ${pkey.showPType()}`,
    );
    const m = new AssocMap(pkey.showData);
    const keys = PMap.genKeys(pkey, size);
    // console.log(`generating Map with keys: ${JSON.stringify(keys)}`);
    keys.forEach((key) => {
      m.set(key, pvalue.genData());
    });
    return m;
  }
  static genPType(gen, maxDepth) {
    const pkey = gen.generate(maxDepth - 1n);
    const pvalue = gen.generate(maxDepth - 1n);
    const keys = maybeNdef(() => PMap.genKeys(pkey))?.();
    const size = maybeNdef(BigInt(
      keys?.length ??
        genNonNegative(BigInt(Math.min(Number(gMaxLength), pkey.population))),
    ));
    return new PMap(pkey, pvalue, size, keys);
  }
}
