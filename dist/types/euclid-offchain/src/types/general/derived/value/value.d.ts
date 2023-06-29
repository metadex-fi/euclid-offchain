import { AssocMap } from "../../fundamental/container/map.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { Asset } from "../asset/asset.js";
import { Assets } from "../asset/assets.js";
import { Currency } from "../asset/currency.js";
import { Token } from "../asset/token.js";
import { PBounded } from "../bounded/bounded.js";
export declare const ccysTknsAmnts: AssocMap<Currency, AssocMap<Token, bigint>>;
export declare const tknsAmnts: AssocMap<Token, bigint>;
export declare class Value {
    private value;
    constructor(value?: AssocMap<Currency, AssocMap<Token, bigint>>);
    show: (tabs?: string) => string;
    concise: (tabs?: string) => string;
    get zeroed(): Value;
    get unit(): Value;
    scale: (scalar: bigint) => Value;
    divideByScalar: (scalar: bigint) => Value;
    divideByScalar_: (scalar: number) => Value;
    get assets(): Assets;
    get normed(): Value;
    private newFoldWith;
    sumAmounts: () => bigint;
    mulAmounts: () => bigint;
    private euclidean;
    gcd: (init?: bigint) => bigint;
    get maxAmount(): bigint;
    cleanReduce(...values: Value[]): Value[];
    dirtyReduce(...values: Value[]): Value[];
    exactAssets: (assets: Assets) => boolean;
    maybeAmountOf: (asset: Asset) => bigint | undefined;
    amountOf: (asset: Asset, defaultAmnt?: bigint) => bigint;
    setAmountOf: (asset: Asset, amount: bigint) => void;
    initAmountOf: (asset: Asset, amount: bigint) => void;
    fillAmountOf: (asset: Asset, amount: bigint) => void;
    ofAssets: (assets: Assets) => Value;
    intersect: (other: Value) => Value;
    get toMap(): AssocMap<Currency, AssocMap<Token, bigint>>;
    get size(): bigint;
    get headAsset(): Asset;
    get unsortedHeadAmount(): bigint;
    get clone(): Value;
    has: (asset: Asset) => boolean;
    drop: (asset: Asset) => void;
    addAmountOf: (asset: Asset, amount: bigint) => void;
    fill: (assets: Assets, amount: bigint) => Value;
    get smallestAmount(): bigint;
    get biggestAmount(): bigint;
    static nullOfAssets: (assets: Assets) => Value;
    static assert(value: Value): void;
    static generateWith: (bounded: PBounded) => Value;
    static newUnionWith: (op: (arg: bigint, ...args: Array<bigint>) => bigint, defaultOut?: bigint, ...defaultIns: Array<bigint | undefined>) => (arg?: Value, ...args: Array<Value | undefined>) => Value;
    static add: (arg?: Value, ...args: Array<Value | undefined>) => Value;
    static normedAdd: (arg?: Value, ...args: Array<Value | undefined>) => Value;
    static subtract: (arg?: Value, ...args: Array<Value | undefined>) => Value;
    static normedSubtract: (arg?: Value, ...args: Array<Value | undefined>) => Value;
    static hadamard: (arg?: Value, ...args: Array<Value | undefined>) => Value;
    static divide: (arg?: Value, ...args: Array<Value | undefined>) => Value;
    static normedDivide: (arg?: Value, ...args: Array<Value | undefined>) => Value;
    static genBetween: (lower: Value, upper: Value) => Value;
    private static assetsOf;
    static singleton(asset: Asset, amount: bigint): Value;
    private static newCompareWith;
    static leq: (arg?: Value, ...args: Array<Value | undefined>) => boolean;
    static leq_: (arg?: Value, ...args: Array<Value | undefined>) => boolean;
    static lt: (arg?: Value, ...args: Array<Value | undefined>) => boolean;
    static lt_: (arg?: Value, ...args: Array<Value | undefined>) => boolean;
    private newAmountsCheck;
    get positive(): boolean;
    get leqMaxInteger(): boolean;
    static newBoundedWith: (bounds: PBounded) => (value: Value) => Value;
    private static newMapAmounts;
    private static newSetAmounts;
}
export declare class PValue extends PWrapped<Value> {
    pbounded: PBounded;
    constructor(pbounded: PBounded);
    genData: () => Value;
    static genPType(): PWrapped<Value>;
}
