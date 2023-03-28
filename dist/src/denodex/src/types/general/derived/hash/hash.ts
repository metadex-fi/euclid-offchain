import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { PByteString } from "../../fundamental/primitive/bytestring.js";

// product from hashing-function
export class Hash {
  constructor(public readonly bytes: Uint8Array) {
    assert(
      bytes.length === Number(Hash.numBytes),
      `hash must be ${Hash.numBytes} bytes, got ${bytes.length}`,
    );
  }

  public hash = (skip = 1n): Hash => {
    let hash = this.bytes;
    for (let i = 0n; i < skip; i++) {
      hash = Lucid.sha256(hash);
    }
    return new Hash(hash);
  };

  public show = (): string => {
    return `Hash: ${this.toString()}`;
  };

  public toString = (): string => {
    return Lucid.toHex(this.bytes);
  };

  public toLucid = (): string => {
    return Lucid.toHex(this.bytes);
  };

  static fromLucid(hexTokenName: string): Hash {
    try {
      return Hash.fromString(hexTokenName);
    } catch (e) {
      throw new Error(`Token.fromLucid ${hexTokenName}:\n${e}`);
    }
  }

  static fromString(s: string): Hash {
    try {
      return new Hash(Lucid.fromHex(s));
    } catch (e) {
      throw new Error(`Hash.fromString ${s}:\n${e}`);
    }
  }

  static numBytes = 32n;
  static dummy = new Hash(new Uint8Array(Number(Hash.numBytes)));
}

export class PHash extends PWrapped<Hash> {
  private constructor() {
    super(
      new PByteString(Hash.numBytes, Hash.numBytes),
      Hash,
    );
  }

  static ptype = new PHash();
  static genPType(): PWrapped<Hash> {
    return PHash.ptype;
  }
}
