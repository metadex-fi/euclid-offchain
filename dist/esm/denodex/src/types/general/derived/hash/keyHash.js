import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { PByteString } from "../../fundamental/primitive/bytestring.js";
import { Hash } from "./hash.js";
export class KeyHash {
    constructor(keyHash) {
        Object.defineProperty(this, "keyHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: keyHash
        });
        Object.defineProperty(this, "hash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => new Hash(Lucid.sha256(this.keyHash))
        });
        Object.defineProperty(this, "toString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return Lucid.toHex(this.keyHash);
            }
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `KeyHash: ${this.toString()}`;
            }
        });
        assert(keyHash.length === Number(KeyHash.numBytes), `keyHash must be ${Hash.numBytes} bytes, got ${keyHash.length}`);
    }
    static fromCredential(credential) {
        return new KeyHash(Lucid.fromHex(credential.hash));
    }
}
Object.defineProperty(KeyHash, "numBytes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 28n
});
export class PKeyHash extends PWrapped {
    constructor() {
        super(new PByteString(KeyHash.numBytes, KeyHash.numBytes), KeyHash);
    }
    static genPType() {
        return PKeyHash.ptype;
    }
}
Object.defineProperty(PKeyHash, "ptype", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PKeyHash()
});
