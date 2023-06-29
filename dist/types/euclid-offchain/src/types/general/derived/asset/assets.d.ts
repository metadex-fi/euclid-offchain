import { Lucid } from "../../../../../lucid.mod.js";
import { AssocMap } from "../../fundamental/container/map.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { Asset } from "./asset.js";
import { Currency } from "./currency.js";
import { Token } from "./token.js";
export declare const ccysTkns: AssocMap<Currency, Token[]>;
export declare class Assets {
    private assets;
    constructor(assets?: AssocMap<Currency, Token[]>);
    show: (tabs?: string) => string;
    equals: (other: Assets) => boolean;
    get clone(): Assets;
    insert: (asset: Asset) => void;
    add: (asset: Asset) => Assets;
    drop: (asset: Asset) => Assets;
    get head(): Asset;
    get tail(): Assets;
    randomChoice: () => Asset;
    randomSubset: () => Assets;
    boundedSubset: (minSize?: bigint, maxSize?: bigint) => Assets;
    has: (asset: Asset) => boolean;
    get toMap(): AssocMap<Currency, Token[]>;
    get empty(): boolean;
    get size(): bigint;
    subsetOf: (other: Assets) => boolean;
    get toList(): Asset[];
    forEach: (f: (value: Asset, index: number, array: Asset[]) => void) => void;
    static fromList(assets: Asset[]): Assets;
    intersect: (assets: Assets) => Assets;
    union: (assets: Assets) => Assets;
    toLucidWith: (amount: bigint) => Lucid.Assets;
    static assert(assets: Assets): void;
    static generate: (minLength?: bigint, maxLength?: bigint) => Assets;
    static singleton: (asset: Asset) => Assets;
}
export declare class PAssets extends PWrapped<Assets> {
    private constructor();
    genData: (minLength?: bigint, maxLength?: bigint | undefined) => Assets;
    static ptype: PAssets;
    static genPType(): PWrapped<Assets>;
}
