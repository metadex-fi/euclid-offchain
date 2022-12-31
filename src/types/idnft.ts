import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  fromHex,
  genPositive,
  gMaxLength,
  PaymentKeyHash,
  PConstraint,
  sha256,
  toHex,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { contractCurrency } from "../../tests/generators.ts";
import { Asset, PAsset } from "./asset.ts";
import { maxTicks, minTicks } from "./dirac.ts";

// 4 ** 4 = 256
// TODO prod: derive this from observed number of diracs in pool
export const gMaxHashes = gMaxLength ** Number(maxTicks - minTicks);

export type IdNFT = Asset;
export const newIdNFT = (hash: string): IdNFT => {
  return new Asset(contractCurrency, hash);
};
export function nextThreadNFT(threadNFT: IdNFT): IdNFT {
  return newIdNFT(toHex(sha256(fromHex(threadNFT.tokenName))));
}

export type PIdNFT = PConstraint<PAsset>;
const newNewPIdNFT =
  (maxHashes?: number) => (owner: PaymentKeyHash): PIdNFT => {
    return new PConstraint<PAsset>(
      PAsset,
      [assertContractCurrency, newAssertOwnersToken(owner, maxHashes)],
      newGenIdNFT(owner, maxHashes),
    );
  };
export const newPParamNFT = newNewPIdNFT();
export const newPThreadNFT = newNewPIdNFT(gMaxHashes);

function assertContractCurrency(a: Asset) {
  assert(a.currencySymbol === contractCurrency, "not contract-currency");
}

const newAssertOwnersToken =
  (owner: PaymentKeyHash, maxHashes = 0) => (a: Asset): void => {
    let hash = owner;
    for (let i = 0; i < maxHashes; i++) {
      if (a.tokenName === hash) {
        return;
      }
      hash = toHex(sha256(fromHex(hash)));
    }
    throw new Error(`ownership could not be proven within ${maxHashes} hashes`);
  };

const newGenIdNFT =
  (owner: PaymentKeyHash, maxHashes?: number) => (): IdNFT => {
    let hash = owner;
    if (maxHashes) {
      const hashes = genPositive(maxHashes);
      for (let i = 0; i < hashes; i++) {
        hash = toHex(sha256(fromHex(hash)));
      }
    }
    return newIdNFT(hash);
  };
