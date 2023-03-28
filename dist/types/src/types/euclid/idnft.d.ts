import { Lucid } from "../../../lucid.mod.js";
import { Asset } from "../general/derived/asset/asset.js";
import { Currency } from "../general/derived/asset/currency.js";
import { Hash } from "../general/derived/hash/hash.js";
import { PObject } from "../general/fundamental/container/object.js";
export declare const gMaxHashes = 9000n;
export declare class IdNFT {
    readonly currency: Currency;
    readonly token: Hash;
    constructor(currency: Currency, token: Hash);
    show: () => string;
    next: (skip?: bigint) => IdNFT;
    sortSubsequents: (candidates: IdNFT[]) => {
        sorted: IdNFT[];
        wrongPolicy: IdNFT[];
        unmatched: IdNFT[];
    };
    assertPrecedes: (other: IdNFT) => void;
    get toLucid(): string;
    get toLucidNFT(): Lucid.Assets;
    static fromLucid(hexAsset: string): IdNFT;
    static fromAsset(asset: Asset): IdNFT;
}
export declare class PIdNFT extends PObject<IdNFT> {
    readonly policy: Currency;
    constructor(policy: Currency);
    static genPType(): PIdNFT;
}
