import { PWrapped } from "../general/fundamental/container/wrapped.js";
import { Lucid } from "../../../lucid.mod.js";
import { Asset } from "../general/derived/asset/asset.js";
import { Assets } from "../general/derived/asset/assets.js";
import { PositiveValue } from "../general/derived/value/positiveValue.js";
import { Value } from "../general/derived/value/value.js";
export declare class EuclidValue {
    private readonly value;
    constructor(value: PositiveValue);
    get assets(): Assets;
    get unsigned(): Value;
    get unsized(): PositiveValue;
    get unit(): Value;
    concise: (tabs?: string) => string;
    amountOf: (asset: Asset, defaultAmnt?: bigint) => bigint;
    get toLucid(): Lucid.Assets;
    plus: (other: EuclidValue) => EuclidValue;
    minus: (other: EuclidValue) => EuclidValue;
    normedMinus: (other: EuclidValue) => PositiveValue;
    hadamard: (other: EuclidValue) => EuclidValue;
    divideBy: (other: EuclidValue) => EuclidValue;
    leq: (other: EuclidValue) => boolean;
    bounded: (lower?: bigint, upper?: bigint) => EuclidValue;
    static asserts(euclidValue: EuclidValue): void;
    static generate(): EuclidValue;
    static genOfAssets(assets: Assets): EuclidValue;
    static genBelow(upper: EuclidValue): EuclidValue;
    static fromValue: (value: Value) => EuclidValue;
    static filled: (value: PositiveValue, assets: Assets, amount: bigint) => EuclidValue;
}
export declare class PEuclidValue extends PWrapped<EuclidValue> {
    constructor();
    genData: typeof EuclidValue.generate;
    static ptype: PEuclidValue;
    static genPType(): PEuclidValue;
}
