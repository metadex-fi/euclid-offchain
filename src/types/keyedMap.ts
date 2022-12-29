import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  PConstanted,
  PConstraint,
  PData,
  PLifted,
  PMap,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { assertNonEmptyMap, mkAssertKeys } from "../asserts.ts";

function genKeyedMap<K, V>(
  keys: K[],
  genValue: () => V,
): Map<K, V> {
  assert(keys.length > 0, "generating empty map");
  const map = new Map<K, V>();
  for (const key of keys) {
    map.set(key, genValue());
  }
  return map;
}

// function genKeyedMapWith<K, V>(
//   keys: K[],
//   genValue: (key: K) => V,
// ): Map<K, V> {
//   assert(keys.length > 0, "generating empty map");
//   const map = new Map<K, V>();
//   for (const key of keys) {
//     map.set(key, genValue(key));
//   }
//   return map;
// }

export type PKeyedMap<PKey extends PData, PValue extends PData> = PConstraint<
  PMap<PKey, PValue>
>;
export function mkPKeyedMap<PKey extends PData, PValue extends PData>(
  keys: PLifted<PKey>[],
  pkey: PKey,
  pvalue: PValue,
): PKeyedMap<PKey, PValue> {
  const pinner = new PMap<PData, PData>(pkey, pvalue, keys.length);

  const asserts = [assertNonEmptyMap, mkAssertKeys(keys)];

  const genInnerData = () =>
    genKeyedMap<PLifted<PKey>, PLifted<PValue>>(keys, pvalue.genData);

  const genInnerPlutusData = () =>
    genKeyedMap<PConstanted<PKey>, PConstanted<PValue>>(
      keys,
      pvalue.genPlutusData as () => PConstanted<PValue>,
    );

  return new PConstraint<PMap<PKey, PValue>>(
    pinner,
    asserts,
    genInnerData,
    genInnerPlutusData,
  );
}

// export function mkPKeyedMapWith<K, PKey extends PData, PValue extends PData>(
//   keys: K[],
//   pkey: PKey,
//   pvalue: PValue,
//   pvalueGenerator: (key: PLifted<PKey> | PConstanted<PKey>) => PValue,
// ): PKeyedMap<PKey, PValue> {
//   const pinner = new PMap<PData, PData>(pkey, pvalue, keys.length);

//   const asserts = [assertNonEmptyMap, mkAssertKeys(keys)];

//   const genInnerData = () =>
//     genKeyedMapWith<PLifted<PKey>, PLifted<PValue>>(
//       keys as PLifted<PKey>[],
//       (key: PLifted<PKey>) => pvalueGenerator(key).genData as PLifted<PValue>,
//     );

//   const genInnerPlutusData = () =>
//     genKeyedMapWith<PConstanted<PKey>, PConstanted<PValue>>(
//       keys as PConstanted<PKey>[],
//       (key: PConstanted<PKey>) =>
//         pvalueGenerator(key).genPlutusData as PConstanted<PValue>,
//     );

//   return new PConstraint<PMap<PKey, PValue>>(
//     pinner,
//     asserts,
//     genInnerData,
//     genInnerPlutusData,
//   );
// }
