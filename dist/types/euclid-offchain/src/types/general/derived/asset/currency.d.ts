import { PWrapped } from "../../fundamental/container/wrapped.js";
export declare class Currency {
    readonly symbol: Uint8Array;
    constructor(symbol: Uint8Array);
    toString: () => string;
    show: () => string;
    concise: () => string;
    valueOf: () => string;
    toLucid: () => string;
    static fromLucid(hexCurrencySymbol: string): Currency;
    static fromHex: (hex: string) => Currency;
    static numBytes: bigint;
    static ADA: Currency;
    static dummy: Currency;
}
export declare class PCurrency extends PWrapped<Currency> {
    constructor();
    static ptype: PCurrency;
    static genPType(): PWrapped<Currency>;
}
