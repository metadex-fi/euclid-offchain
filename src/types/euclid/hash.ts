import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Credential,
  fromHex,
  sha256,
  toHex,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { PByteString } from "../general/fundamental/primitive/bytestring.ts";
import { PLiteral, PWrapped } from "../mod.ts";

export class KeyHash {
  constructor(public readonly bytes: Uint8Array) {
    assert(bytes.length > 0, "paymentKeyHash must be non-empty");
  }
  public hash = (): Hash => new Hash(sha256(this.bytes));

  public show = (): string => {
    return `KeyHash: ${toHex(this.bytes)}`;
  };

  static fromCredential(credential: Credential): KeyHash {
    return new KeyHash(fromHex(credential.hash));
  }
}

export class PKeyHash extends PWrapped<KeyHash> {
  private constructor() {
    super(
      new PByteString(1n),
      KeyHash,
    );
  }

  static ptype = new PKeyHash();
  static genPType(): PWrapped<KeyHash> {
    return PKeyHash.ptype;
  }
}

// product from hashing-function
export class Hash {
  constructor(public readonly bytes: Uint8Array) {
    assert(
      bytes.length === Hash.numBytes,
      `hash must be ${Hash.numBytes} bytes, got ${bytes.length}`,
    );
  }

  public hash = (skip = 1n): Hash => {
    let hash = this.bytes;
    for (let i = 0n; i < skip; i++) {
      hash = sha256(hash);
    }
    return new Hash(hash);
  };

  public show = (): string => {
    return `Hash: ${this.toString()}`;
  };

  public toString = (): string => {
    return toHex(this.bytes);
  };

  static numBytes = 32;
}

export class POwner extends PLiteral<PKeyHash> {
  private constructor(
    public paymentKeyHash: KeyHash,
  ) {
    super(PKeyHash.ptype, paymentKeyHash);
  }

  static genPType(): PLiteral<PKeyHash> {
    const paymentKeyHash = PKeyHash.ptype.genData();
    return new POwner(paymentKeyHash);
  }

  static pliteral(paymentKeyHash: KeyHash): POwner {
    return new POwner(paymentKeyHash);
  }
}
