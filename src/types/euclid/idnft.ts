import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  fromHex,
  PaymentKeyHash,
  sha256,
  toHex,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  contractCurrency,
  genPositive,
  gMaxLength,
  maybeNdef,
} from "../../mod.ts";
import { Asset, PAsset, PConstraint } from "../mod.ts";

export const minTicks = 1n; // per dimension
export const maxTicks = 5n; // per dimension
// 4 ** 4 = 256
// TODO prod: derive this from observed number of diracs in pool
export const gMaxHashes = gMaxLength ** (maxTicks - minTicks);

export class IdNFT {
  constructor(
    private owner: PaymentKeyHash,
    private hashes = 0n,
  ) {
    assert(
      hashes <= gMaxHashes,
      `hashes: ${hashes} exceeds gMaxHashes: ${gMaxHashes}`,
    );
  }

  public next = (): IdNFT => {
    assert(
      this.hashes < gMaxHashes,
      `hashes: ${this.hashes} will exceed gMaxHashes: ${gMaxHashes}`,
    );
    return new IdNFT(this.owner, this.hashes + 1n);
  };

  public asset = (): Asset => {
    let tokenName = this.owner;
    for (let i = 0; i < this.hashes; i++) {
      tokenName = nextHash(tokenName);
    }
    return new Asset(contractCurrency, tokenName);
  };

  public show = (): string => {
    return `IdNFT(${this.owner}, ${this.hashes})`;
  };
}

function nextHash(hash: string): string {
  return toHex(sha256(fromHex(hash)));
}

// @ts-ignore TODO consider fixing this or leaving as is
export class PIdNFT extends PConstraint<PAsset> {
  private constructor(
    public owner: PaymentKeyHash,
    public maxHashes = 0n,
  ) {
    super(
      PAsset.ptype,
      [assertContractCurrency, newAssertOwnersToken(owner, maxHashes)],
      newGenIdNFT(owner, maxHashes),
    );
  }

  static newPParamNFT(owner: PaymentKeyHash) {
    return new PIdNFT(owner);
  }

  static newPThreadNFT(owner: PaymentKeyHash) {
    return new PIdNFT(owner, gMaxHashes);
  }

  static genPType(): PConstraint<PAsset> {
    const maxHashes = maybeNdef(() => genPositive(gMaxHashes))?.();
    return new PConstraint(
      PAsset.ptype,
      [assertContractCurrency],
      newGenIdNFT(contractCurrency, maxHashes),
    );
  }
}

function assertContractCurrency(a: Asset) {
  assert(
    a.currencySymbol === contractCurrency,
    `currencySymbol: ${a.currencySymbol} of ${a.show()} is not contractCurrency: ${contractCurrency}`,
  );
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
  (owner: PaymentKeyHash, maxHashes?: bigint) => (): Asset => {
    const hashes = maxHashes ? genPositive(maxHashes) : 0n;
    return new IdNFT(owner, hashes).asset();
  };
