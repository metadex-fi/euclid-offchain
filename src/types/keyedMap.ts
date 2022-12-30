// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import {
//   PConstanted,
//   PConstraint,
//   PData,
//   PLifted,
//   PMap,
// } from "../../../refactor_parse/lucid/src/mod.ts";
// import { assertNonEmptyMap, mkAssertKeys } from "../asserts.ts";

// function genKeyedMap<K, V>(
//   keys: K[],
//   genValue: () => V,
// ): Map<K, V> {
//   assert(keys.length > 0, "generating empty map");
//   const map = new Map<K, V>();
//   for (const key of keys) {
//     map.set(key, genValue());
//   }
//   return map;
// }

// export type PKeyedMap<PKey extends PData, PValue extends PData> = PConstraint<
//   PMap<PKey, PValue>
// >;
// export function mkPKeyedMap<K, PKey extends PData, PValue extends PData>(
//   keys: K[],
//   pkey: PKey,
//   pvalue: PValue,
// ): PKeyedMap<PKey, PValue> {
//   const pinner = new PMap<PData, PData>(pkey, pvalue, keys.length);

//   const asserts = [assertNonEmptyMap, mkAssertKeys(keys)];

//   const genInnerData = () =>
//     genKeyedMap<PLifted<PKey>, PLifted<PValue>>(keys, pvalue.genData);

//   const genInnerPlutusData = () =>
//     genKeyedMap<PConstanted<PKey>, PConstanted<PValue>>(
//       keys,
//       pvalue.genPlutusData as () => PConstanted<PValue>,
//     );

//   return new PConstraint<PMap<PKey, PValue>>(
//     pinner,
//     asserts,
//     genInnerData,
//     genInnerPlutusData,
//   );
// }

// function mkMapFromKeys<K, PKey extends PData, PValue extends PData>(
//   keys: K[],
//   mkKey: () => K,
//   mkValue: () => PValue,
// ): Map<K, V> {
//   const map = new Map<K, V>();
//   for (const key of keys) {
//     map.set(key, genValue());
//   }
//   return map;
// }
