import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../lucid.mod.js";
import { maxInteger } from "../../utils/generators.js";
import { Currency, PCurrency } from "../general/derived/asset/currency.js";
import { Hash, PHash } from "../general/derived/hash/hash.js";
import { PLiteral } from "../general/fundamental/container/literal.js";
import { AssocMap } from "../general/fundamental/container/map.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
export const gMaxHashes = maxInteger; // maximum distance between two subsequent idNFTs before we stop trying
// NOTE biggest difference to regular Asset is that tokenName is not decoded/encoded
// when parsing to/from lucid, as this is not symmetric unless starting with text-strings
// (here we start with hashes, aka hex-strings).
export class IdNFT {
  constructor(currency, token) {
    Object.defineProperty(this, "currency", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: currency,
    });
    Object.defineProperty(this, "token", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: token,
    });
    Object.defineProperty(this, "show", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return `IdNFT (${this.currency.show()}, ${this.token.show()})`;
      },
    });
    Object.defineProperty(this, "next", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (skip = 1n) => {
        return new IdNFT(this.currency, this.token.hash(skip));
      },
    });
    Object.defineProperty(this, "sortSubsequents", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (candidates) => {
        const policy = this.currency.show();
        const hashes = new AssocMap((h) => h.show());
        const sorted = new Array();
        const wrongPolicy = new Array();
        candidates.forEach((c) => {
          if (c.currency.show() === policy) {
            hashes.set(c.token, c);
          } else {
            wrongPolicy.push(c);
          }
        });
        let hits = hashes.size;
        let misses = gMaxHashes;
        let current = this.token;
        while (hits && misses) {
          current = current.hash();
          const match = hashes.get(current);
          if (match) {
            sorted.push(match);
            hashes.delete(current);
            misses = gMaxHashes;
            hits--;
          } else {
            misses--;
          }
        }
        const unmatched = [...hashes.values()];
        return { sorted, wrongPolicy, unmatched };
      },
    });
    Object.defineProperty(this, "assertPrecedes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        assert(
          this.currency.show() === other.currency.show(),
          "currency mismatch",
        );
        let current = this.token.hash();
        const target = other.token.toString();
        for (let i = 0n; i < gMaxHashes; i++) {
          if (current.toString() === target) {
            return;
          }
          current = current.hash();
        }
        throw new Error("assertPrecedes failed");
      },
    });
  }
  get toLucid() {
    if (this.currency.symbol.length === 0) {
      return "lovelace";
    } else {
      return Lucid.toUnit(this.currency.toLucid(), this.token.toLucid());
    }
  }
  get toLucidNFT() {
    return { [this.toLucid]: 1n };
  }
  static fromLucid(hexAsset) {
    try {
      if (hexAsset === "lovelace") {
        throw new Error("lovelace is not an id-NFT");
      } else {
        const unit = Lucid.fromUnit(hexAsset);
        return new IdNFT(
          Currency.fromLucid(unit.policyId),
          Hash.fromLucid(unit.assetName ?? ""),
        );
      }
    } catch (e) {
      throw new Error(`IdNFT.fromLucid ${hexAsset}:\n${e}`);
    }
  }
  static fromAsset(asset) {
    try {
      return new IdNFT(asset.currency, Hash.fromString(asset.token.name));
    } catch (e) {
      throw new Error(`IdNFT.fromAsset ${asset.show()}:\n${e}`);
    }
  }
}
export class PIdNFT extends PObject {
  constructor(policy) {
    super(
      new PRecord({
        currency: new PLiteral(PCurrency.ptype, policy),
        token: PHash.ptype,
      }),
      IdNFT,
    );
    Object.defineProperty(this, "policy", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: policy,
    });
  }
  static genPType() {
    return new PIdNFT(Currency.dummy);
  }
}
