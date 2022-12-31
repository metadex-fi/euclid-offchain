import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { contractCurrency, nextThreadNFT } from "../tests/generators.ts";

import { defaultActiveAsset } from "./dex.ts";
import { Asset } from "./types/asset.ts";
import { Dirac } from "./types/dirac.ts";
import { Param } from "./types/param.ts";
import { contains, equal } from "./utils.ts";

// const maxHashNFT = 1000;

// export const mkAssertKeys =
//   (keys: unknown[]) => (map: Map<unknown, unknown>) => {
//     const mapKeys = map.keys();
//     for (const expectedKey of keys) {
//       const currentKey = mapKeys.next();
//       assert(!currentKey.done, "map too small");
//       assert(equal(currentKey.value, expectedKey), "wrong key");
//     }
//     assert(mapKeys.next().done, "map too big");
//   };

// export function mkDiracAsserts(param: Param) {
//   return [
//     diracIdNFTsAsserts,
//     diracAssetsMatch,
//     mkJumpStorageAsserts(param),
//   ];
// }

const mkJumpStorageAsserts = (param: Param) => (dirac: Dirac) => {
  const assets = assetsOf(dirac.prices);
  for (const [prices, asset] of dirac.jumpStorage) {
    const defaultAsset = defaultActiveAsset(param.initialPrices, prices);
    assert(!equal(asset, defaultAsset), "default asset stored");
    const modulo = unionValues(prices, param.jumpSizes, (x, y) => x % y);
    assert(modulo.size === 0, "storage jumpsize mismatch");
  }
};
