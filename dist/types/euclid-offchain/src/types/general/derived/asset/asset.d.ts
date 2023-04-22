import { Lucid } from "../../../../../lucid.mod.js";
import { PObject } from "../../fundamental/container/object.js";
import { Currency } from "./currency.js";
import { Token } from "./token.js";
export declare class Asset {
    readonly currency: Currency;
    readonly token: Token;
    constructor(currency: Currency, token: Token);
    show: () => string;
    concise: () => string;
    equals: (other: Asset) => boolean;
    toLucid: () => string;
    toLucidWith: (amount: bigint) => Lucid.Assets;
    static fromLucid(hexAsset: string): Asset;
    static assertADAlovelace(asset: Asset): void;
    static ADA: Asset;
    private static generateNonADA;
    static generate(): Asset;
}
export declare class PAsset extends PObject<Asset> {
    private constructor();
    genData: typeof Asset.generate;
    showData: (data: Asset) => string;
    showPType: () => string;
    static ptype: PAsset;
    static genPType(): PObject<Asset>;
}
