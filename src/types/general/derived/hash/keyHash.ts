import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../../../lucid.mod.ts";
import { PByteString, PWrapped } from "../../mod.ts";
import { Hash } from "./hash.ts";

export class KeyHash {
  constructor(public readonly keyHash: Uint8Array) {
    assert(keyHash.length > 0, "paymentKeyHash must be non-empty");
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
