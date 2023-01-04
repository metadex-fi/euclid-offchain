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
export const gMaxHashes = gMaxLength ** (maxTicks - minTicks);

export type IdNFT = Asset;
export const newIdNFT = (hash: string): IdNFT => {
  return new Asset(contractCurrency, hash);
};
export function nextThreadNFT(threadNFT: IdNFT): IdNFT {
  return newIdNFT(toHex(sha256(fromHex(threadNFT.tokenName))));
}

export class PIdNFT extends PConstraint<PAsset> {
  constructor(
    public owner: PaymentKeyHash,
    public maxHashes = 0n,
  ) {
    super(
      new PAsset(),
      [assertContractCurrency, newAssertOwnersToken(owner, maxHashes)],
      newGenIdNFT(owner, maxHashes),
    );
  }

  static genPType(): PConstraint<PAsset> {
    return new PConstraint(
      PAsset.genPType(),
      [assertContractCurrency],
      newGenIdNFT(contractCurrency),
    );
  }
}

export const newPParamNFT = (owner: PaymentKeyHash) => new PIdNFT(owner);
export const newPThreadNFT = (owner: PaymentKeyHash) =>
  new PIdNFT(owner, gMaxHashes);

function assertContractCurrency(a: Asset) {
  assert(a.currencySymbol === contractCurrency, "not contract-currency");
}

const newAssertOwnersToken =
  (owner: PaymentKeyHash, maxHashes = 0n) => (a: Asset): void => {
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
  (owner: PaymentKeyHash, maxHashes?: bigint) => (): IdNFT => {
    let hash = owner;
    if (maxHashes) {
      const hashes = genPositive(maxHashes);
      for (let i = 0; i < hashes; i++) {
        hash = toHex(sha256(fromHex(hash)));
      }
    }
    return newIdNFT(hash);
  };
