import { assert } from "../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { PByteString } from "../../fundamental/primitive/bytestring.js";
// product from hashing-function
export class Hash {
    constructor(bytes) {
        Object.defineProperty(this, "bytes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: bytes
        });
        Object.defineProperty(this, "hash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (skip = 1n) => {
                let hash = this.bytes;
                for (let i = 0n; i < skip; i++) {
                    hash = Lucid.sha256(hash);
                }
                return new Hash(hash);
            }
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `Hash: ${this.toString()}`;
            }
        });
        Object.defineProperty(this, "toString", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return Lucid.toHex(this.bytes);
            }
        });
        Object.defineProperty(this, "toLucid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return Lucid.toHex(this.bytes);
            }
        });
        assert(bytes.length === Number(Hash.numBytes), `hash must be ${Hash.numBytes} bytes, got ${bytes.length}`);
    }
    static fromLucid(hexTokenName) {
        try {
            return Hash.fromString(hexTokenName);
        }
        catch (e) {
            throw new Error(`Token.fromLucid ${hexTokenName}:\n${e}`);
        }
    }
    static fromString(s) {
        try {
            return new Hash(Lucid.fromHex(s));
        }
        catch (e) {
            throw new Error(`Hash.fromString ${s}:\n${e}`);
        }
    }
}
Object.defineProperty(Hash, "numBytes", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 32n
});
Object.defineProperty(Hash, "dummy", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Hash(new Uint8Array(Number(Hash.numBytes)))
});
export class PHash extends PWrapped {
    constructor() {
        super(new PByteString(Hash.numBytes, Hash.numBytes), Hash);
    }
    static genPType() {
        return PHash.ptype;
    }
}
Object.defineProperty(PHash, "ptype", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PHash()
});
