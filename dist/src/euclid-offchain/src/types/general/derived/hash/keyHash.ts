import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { PByteString } from "../../fundamental/primitive/bytestring.js";
import { Hash } from "./hash.js";

export class KeyHash {
  constructor(public readonly keyHash: Uint8Array) {
    assert(
      keyHash.length === Number(KeyHash.numBytes),
      `keyHash must be ${Hash.numBytes} bytes, got ${keyHash.length}`,
    );
  }
  public hash = (): Hash => new Hash(Lucid.sha256(this.keyHash));

  public toString = (): string => {
    return Lucid.toHex(this.keyHash);
  };

  public show = (): string => {
    return `KeyHash: ${this.toString()}`;
  };

  static fromCredential(credential: Lucid.Credential): KeyHash {
    return new KeyHash(Lucid.fromHex(credential.hash));
  }

  static numBytes = 28n;
}

export class PKeyHash extends PWrapped<KeyHash> {
  private constructor() {
    super(
      new PByteString(KeyHash.numBytes, KeyHash.numBytes),
      KeyHash,
    );
  }

  static ptype = new PKeyHash();
  static genPType(): PWrapped<KeyHash> {
    return PKeyHash.ptype;
  }
}
