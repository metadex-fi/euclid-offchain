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
  maxTicks,
  maybeNdef,
} from "../../mod.ts";
import { Asset, f, PAsset, PConstraint, POwner } from "../mod.ts";

// export const maxTicks = 5n; // per dimension
// TODO prod: derive this from observed number of diracs in pool
export const gMaxHashes = 1n + maxTicks ** gMaxLength; // TODO why is this wrong?

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
      this.hashes <= gMaxHashes,
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

  static newParamNFT(owner: PaymentKeyHash) {
    return new IdNFT(owner);
  }

  static newThreadNFT(owner: PaymentKeyHash) {
    return new IdNFT(owner, gMaxHashes);
  }
}

function nextHash(hash: string): string {
  return toHex(sha256(fromHex(hash)));
}

// @ts-ignore TODO consider fixing this or leaving as is
export class PIdNFT extends PConstraint<PAsset> {
  private constructor(
    public owner: PaymentKeyHash,
    public maxHashes?: bigint, // undefined means Param-NFT, so exactly 0 hashes; if set,
  ) { //                          we are saying that it's a thread-NFT, so at least 1 hashes
    if (maxHashes) {
      assert(
        maxHashes <= gMaxHashes,
        `maxHashes: ${maxHashes} exceeds gMaxHashes: ${gMaxHashes}`,
      );
      assert(maxHashes > 0n, `maxHashes: ${maxHashes} must be positive`);
    }
    super(
      PAsset.ptype,
      [assertContractCurrency, newAssertOwnersToken(owner, maxHashes)],
      newGenIdNFT(owner, maxHashes),
      `PIdNFT(${owner}, ${maxHashes})`,
    );
    this.population = Number(maxHashes ?? 1n);
  }

  public showData = (data: Asset): string => {
    return `IdNFT ${data.show()}`;
  };

  public showPType = (): string => {
    return `PObject: PIdNFT(${this.owner}, ${this.maxHashes})`;
  };

  static newPParamNFT(owner: PaymentKeyHash) {
    return new PIdNFT(owner);
  }

  static newPThreadNFT(owner: PaymentKeyHash) {
    return new PIdNFT(owner, gMaxHashes);
  }

  static genPType(): PConstraint<PAsset> {
    const owner = POwner.genPType().genData();
    const maxHashes = maybeNdef(() => genPositive(gMaxHashes))?.();
    return new PIdNFT(owner, maxHashes);
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
    const log = [hash];
    for (let i = -1n; i < maxHashes; i++) {
      if (a.tokenName === hash) {
        return;
      }
      hash = toHex(sha256(fromHex(hash)));
      log.push(hash);
    }
    throw new Error(
      `ownership of ${owner} could not be proven for\n${a.show()}\nwithin ${maxHashes} hashes:\n${f}${
        log.join(`\n${f}`)
      }`,
    );
  };

const newGenIdNFT =
  (owner: PaymentKeyHash, maxHashes?: bigint) => (): Asset => {
    const hashes = maxHashes ? genPositive(maxHashes) : 0n;
    return new IdNFT(owner, hashes).asset();
  };
