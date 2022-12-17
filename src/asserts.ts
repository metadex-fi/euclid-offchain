import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { contractCurrency, genIdNFT, nextThreadNFT } from "../tests/generators.ts";
import { defaultActiveAsset } from "./dex.ts";
import { Dirac, Param } from "./types.ts";
import { contains, equal } from "./utils.ts";
import {
  assetsOf,
  isSubSet,
  positive,
  sameAssets,
  unionValues,
} from "./value.ts";

const maxHashNFT = 1000;

export function assertContractCurrency(s: string) {
    assert(s === contractCurrency, "not contract-currency");
}

export function assertNotADA(s: string) {
    assert(s !== "", "encountered empty ByteString");
}

export function assertPositive(i: bigint) {
  assert(i > 0n, "encountered nonpositive");
}

export function assertNonEmpty<K, V>(m: Map<K, V>) {
  assert(m.size > 0, "encountered empty Map");
}

export function mkDiracAsserts(param: Param) {
    return [
        diracIdNFTsAsserts,
        diracAssetsMatch,
        mkJumpStorageAsserts(param)
    ]
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
}

const mkDiracPricesAsserts = (param: Param) => (dirac: Dirac) => {
  assert(positive(dirac.prices), "nonpositive prices in dirac");
  assert(leq());
  for (const [prices, asset] of dirac.jumpStorage) {
    assert(positive(prices), "nonpositive prices in storage keys");
  }
}

function paramAssetsAsserts(param: Param) {
  assert(sameAssets(jumpSize));
}
