import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  contractCurrency,
  genIdNFT,
  nextThreadNFT,
} from "../tests/generators/types.ts";

import { defaultActiveAsset } from "./dex.ts";
import { Asset } from "./types/asset.ts";
import { Dirac } from "./types/dirac.ts";
import { Param } from "./types/param.ts";
import { contains, equal } from "./utils.ts";
import {
  assetsOf,
  isSubSet,
  leq,
  positive,
  sameAssets,
  unionValues,
} from "./value.ts";

const maxHashNFT = 1000;

export function assertContractCurrency(a: Asset) {
  assert(a.currencySymbol === contractCurrency, "not contract-currency");
}

export function assertNotADA(a: Asset) {
  assert(a.currencySymbol !== "", "encountered empty CurrencySymbol");
}

export const mkAssertWithinRange =
  (lowerBound?: number, upperBound?: number) => (i: bigint) => {
    assert(!lowerBound || lowerBound <= i, "too small");
    assert(!upperBound || i < upperBound, "too big");
  };

export function assertPositive(i: bigint) {
  assert(i > 0n, "encountered nonpositive");
}

export function assertNonEmptyList<T>(l: Array<T>) {
  assert(l.length > 0, "encountered empty List");
}

export function assertNonEmptyMap<K, V>(m: Map<K, V>) {
  assert(m.size > 0, "encountered empty Map");
}

export const mkAssertKeys =
  (keys: unknown[]) => (map: Map<unknown, unknown>) => {
    const mapKeys = map.keys();
    for (const expectedKey of keys) {
      const currentKey = mapKeys.next();
      assert(!currentKey.done, "map too small");
      assert(equal(currentKey.value, expectedKey), "wrong key");
    }
    assert(mapKeys.next().done, "map too big");
  };

export function mkDiracAsserts(param: Param) {
  return [
    diracIdNFTsAsserts,
    diracAssetsMatch,
    mkJumpStorageAsserts(param),
  ];
}

function diracIdNFTsAsserts(dirac: Dirac) {
  const owner = dirac.owner;
  const paramNFT = genIdNFT(owner);
  assert(equal(dirac.paramNFT, paramNFT), "wrong paramNFT");
  let threadNFT = nextThreadNFT(paramNFT);
  for (let i = 0; i < maxHashNFT; i++) {
    if (equal(dirac.threadNFT, threadNFT)) return;
    threadNFT = nextThreadNFT(paramNFT);
  }
  throw new Error("threadNFT hash limit reached");
}

function diracAssetsMatch(dirac: Dirac) {
  assert(isSubSet(dirac.activeAmnts, dirac.prices), "unknown asset in amounts");
  const assets = assetsOf(dirac.prices);
  for (const [prices, asset] of dirac.jumpStorage) {
    assert(contains(assets, asset), "unknown stored asset");
    assert(
      sameAssets(prices, dirac.prices),
      "misaligned prices in storage key",
    );
  }
}

const mkJumpStorageAsserts = (param: Param) => (dirac: Dirac) => {
  const assets = assetsOf(dirac.prices);
  for (const [prices, asset] of dirac.jumpStorage) {
    assert(positive(prices), "nonpositive prices in storage keys");
    const defaultAsset = defaultActiveAsset(param.initialPrices, prices);
    assert(!equal(asset, defaultAsset), "default asset stored");
    const modulo = unionValues(prices, param.jumpSizes, (x, y) => x % y);
    assert(modulo.size === 0, "storage jumpsize mismatch");
  }
};

const mkDiracPricesAsserts = (param: Param) => (dirac: Dirac) => {
  assert(positive(dirac.prices), "nonpositive prices in dirac");
  assert(leq());
  for (const [prices, asset] of dirac.jumpStorage) {
    assert(positive(prices), "nonpositive prices in storage keys");
  }
};

function paramAssetsAsserts(param: Param) {
  assert(sameAssets(jumpSize));
}
