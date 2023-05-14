import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { maxInteger } from "../../utils/generators.ts";
import { Asset } from "../general/derived/asset/asset.ts";
import { Currency, PCurrency } from "../general/derived/asset/currency.ts";
import { Hash, PHash } from "../general/derived/hash/hash.ts";
import { PLiteral } from "../general/fundamental/container/literal.ts";
import { AssocMap } from "../general/fundamental/container/map.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";

export const gMaxHashes = 9000n; //maxInteger; // maximum distance between two subsequent idNFTs before we stop trying

// NOTE biggest difference to regular Asset is that tokenName is not decoded/encoded
// when parsing to/from lucid, as this is not symmetric unless starting with text-strings
// (here we start with hashes, aka hex-strings).
export class IdNFT {
  constructor(
    public readonly currency: Currency,
    public readonly token: Hash,
  ) {}

  public show = (): string => {
    return `IdNFT (${this.currency.show()}, ${this.token.show()})`;
  };

  public next = (skip = 1n): IdNFT => {
    return new IdNFT(this.currency, this.token.hash(skip));
  };

  public sortSubsequents = (candidates: IdNFT[]): {
    sorted: IdNFT[];
    wrongPolicy: IdNFT[];
    unmatched: IdNFT[];
  } => {
    const policy = this.currency.show();
    const hashes = new AssocMap<Hash, IdNFT>((h) => h.show());
    const sorted = new Array<IdNFT>();
    const wrongPolicy = new Array<IdNFT>();
    candidates.forEach((c) => {
      if (c.currency.show() === policy) hashes.set(c.token, c);
      else wrongPolicy.push(c);
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
  };

  public assertPrecedes = (other: IdNFT): void => {
    assert(this.currency.show() === other.currency.show(), "currency mismatch");
    let current = this.token.hash();
    const target = other.token.toString();
    for (let i = 0n; i < gMaxHashes; i++) {
      if (current.toString() === target) return;
      current = current.hash();
    }
    throw new Error("assertPrecedes failed");
  };

  public get toLucid(): string {
    if (this.currency.symbol.length === 0) return "lovelace";
    else return Lucid.toUnit(this.currency.toLucid(), this.token.toLucid());
  }

  public get toLucidNFT(): Lucid.Assets {
    return { [this.toLucid]: 1n };
  }

  static fromLucid(hexAsset: string): IdNFT {
    try {
      if (hexAsset === "lovelace") throw new Error("lovelace is not an id-NFT");
      else {
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

  static fromAsset(asset: Asset): IdNFT {
    try {
      return new IdNFT(asset.currency, Hash.fromString(asset.token.name));
    } catch (e) {
      throw new Error(`IdNFT.fromAsset ${asset.show()}:\n${e}`);
    }
  }
}

export class PIdNFT extends PObject<IdNFT> {
  constructor(
    public readonly policy: Currency,
  ) {
    super(
      new PRecord({
        currency: new PLiteral(PCurrency.ptype, policy),
        token: PHash.ptype,
      }),
      IdNFT,
    );
  }

  static genPType(): PIdNFT {
    return new PIdNFT(Currency.dummy);
  }
}
