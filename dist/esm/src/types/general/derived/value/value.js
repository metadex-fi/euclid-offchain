import { assert } from "../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { abs, max, maxInteger, min } from "../../../../utils/generators.js";
import { AssocMap, PMap } from "../../fundamental/container/map.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { f, t } from "../../fundamental/type.js";
import { Asset } from "../asset/asset.js";
import { Assets, ccysTkns } from "../asset/assets.js";
import { PCurrency } from "../asset/currency.js";
import { PToken } from "../asset/token.js";
import { PBounded } from "../bounded/bounded.js";
export const ccysTknsAmnts = new AssocMap((currency) => currency.show());
export const tknsAmnts = new AssocMap((tkn) => tkn.show());
export class Value {
    constructor(value = ccysTknsAmnts.anew) {
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "") => {
                const ttf = tabs + t + f;
                const ttff = ttf + f;
                const ccys = [`Value:`];
                for (const [currency, tokenMap] of this.value) {
                    const symbol = currency.toString();
                    ccys.push(`${ttf}${symbol === "" ? "ADA" : symbol}:`);
                    const t = [];
                    for (const [token, amount] of tokenMap) {
                        t.push(`${ttff}${token.name === "" ? symbol === "" ? "lovelace" : "_" : token.name}: ${amount}`);
                    }
                    ccys.push(t.join(",\n"));
                }
                return ccys.join(`\n`);
            }
        });
        Object.defineProperty(this, "concise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "") => {
                const tf = tabs + f;
                const amounts = [];
                for (const [ccy, tokenMap] of this.value) {
                    for (const [tkn, amount] of tokenMap) {
                        amounts.push(`${tf}${ccy.toString()}_${tkn.name}: ${amount.toString()}`);
                    }
                }
                if (amounts.length === 0)
                    return `[]`;
                else
                    return `[\n${amounts.join(`,\n`)}\n${tabs}]`;
            }
        });
        Object.defineProperty(this, "divideByScalar", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (scalar) => {
                return Value.newMapAmounts((a) => a / scalar)(this);
            }
        });
        Object.defineProperty(this, "divideByScalar_", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (scalar) => {
                return Value.newMapAmounts((a) => BigInt(Math.floor(Number(a) / scalar)))(this);
            }
        });
        Object.defineProperty(this, "newFoldWith", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (init, op) => () => {
                let agg = init;
                for (const [_, tokens] of this.value) {
                    for (const [_, amount] of tokens) {
                        agg = op(agg, amount);
                    }
                }
                return agg;
            }
        });
        Object.defineProperty(this, "sumAmounts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.newFoldWith(0n, (a, b) => a + b)
        });
        Object.defineProperty(this, "mulAmounts", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.newFoldWith(1n, (a, b) => a * b)
        });
        Object.defineProperty(this, "gcd", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (init = 0n) => this.newFoldWith(init, (a, b) => this.euclidean(a, b))()
        });
        Object.defineProperty(this, "exactAssets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (assets) => {
                return this.assets.equals(assets);
            }
        });
        Object.defineProperty(this, "maybeAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset) => {
                return this.value.get(asset.currency)?.get(asset.token);
            }
        });
        Object.defineProperty(this, "amountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, defaultAmnt) => {
                const amount = this.maybeAmountOf(asset) ??
                    defaultAmnt;
                assert(amount !== undefined, `amountOf: amount not found for asset\n${asset.show()}\nin ${this.concise()}`);
                return amount;
            }
        });
        Object.defineProperty(this, "setAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, amount) => {
                const tokens = this.value.get(asset.currency);
                assert(tokens, `setAmountOf: tokens not found for asset ${asset.show()} in ${this.show()}`);
                assert(tokens.has(asset.token), `setAmountOf: amount not found for asset ${asset.show()} in ${this.show()}`);
                tokens.set(asset.token, amount);
            }
        });
        Object.defineProperty(this, "initAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, amount) => {
                const tokens = this.value.get(asset.currency);
                if (tokens) {
                    assert(!tokens.has(asset.token), `initAmountOf: amount already set for asset ${asset.show()} in ${this.show()}`);
                    tokens.set(asset.token, amount);
                }
                else {
                    const tokens = tknsAmnts.anew;
                    tokens.set(asset.token, amount);
                    this.value.set(asset.currency, tokens);
                }
            }
        });
        Object.defineProperty(this, "fillAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, amount) => {
                const tokens = this.value.get(asset.currency);
                if (tokens) {
                    if (!tokens.has(asset.token)) {
                        tokens.set(asset.token, amount);
                    }
                }
                else {
                    const tokens = tknsAmnts.anew;
                    tokens.set(asset.token, amount);
                    this.value.set(asset.currency, tokens);
                }
            }
        });
        Object.defineProperty(this, "ofAssets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (assets) => {
                const value = new Value();
                assets.intersect(this.assets).forEach((asset) => {
                    const amount = this.amountOf(asset);
                    value.initAmountOf(asset, amount);
                });
                return value;
            }
        });
        Object.defineProperty(this, "intersect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                const value = new Value();
                for (const [currency, tknAmnts] of this.value) {
                    const tknAmnts_ = other.value.get(currency);
                    if (tknAmnts_) {
                        for (const [token, amount] of tknAmnts) {
                            const amount_ = tknAmnts_.get(token);
                            if (amount_) {
                                value.initAmountOf(new Asset(currency, token), min(amount, amount_));
                            }
                        }
                    }
                }
                return value;
            }
        });
        Object.defineProperty(this, "has", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset) => {
                const tokens = this.value.get(asset.currency);
                return tokens ? tokens.has(asset.token) : false;
            }
        });
        Object.defineProperty(this, "drop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset) => {
                const tokens = this.value.get(asset.currency);
                assert(tokens, `drop: tokens not found for asset ${asset.show()} in ${this.show()}`);
                assert(tokens.has(asset.token), `drop: amount not found for asset ${asset.show()} in ${this.show()}`);
                tokens.delete(asset.token);
                if (tokens.size === 0) {
                    this.value.delete(asset.currency);
                }
            }
        });
        Object.defineProperty(this, "addAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, amount) => {
                this.setAmountOf(asset, this.amountOf(asset) + amount);
            }
        });
        Object.defineProperty(this, "fill", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (assets, amount) => {
                const value = this.clone;
                assets.forEach((asset) => {
                    value.fillAmountOf(asset, amount);
                });
                return value;
            }
        });
        Object.defineProperty(this, "biggestAmount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                let biggest = undefined;
                for (const amounts of this.value.values()) {
                    for (const amount of amounts.values()) {
                        if (!biggest || biggest < amount) {
                            biggest = amount;
                        }
                    }
                }
                assert(biggest, `biggestAmount: no biggest found in ${this.concise()}`);
                return biggest;
            }
        });
        Object.defineProperty(this, "newAmountsCheck", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (op) => Value.newCompareWith((a) => op(a))(this)
        });
        Value.assert(this);
    }
    get zeroed() {
        return Value.newSetAmounts(0n)(this);
    }
    get unit() {
        return Value.newSetAmounts(1n)(this);
    }
    get assets() {
        const assets = ccysTkns.anew;
        for (const [currencySymbol, tokens] of this.value) {
            assets.set(currencySymbol, [...tokens.keys()]);
        }
        return new Assets(assets);
    }
    get normed() {
        const value = ccysTknsAmnts.anew;
        for (const [currency, tokens] of this.value) {
            const tokens_ = tknsAmnts.anew;
            for (const [token, amount] of tokens) {
                if (amount)
                    tokens_.set(token, amount);
            }
            if (tokens_.size)
                value.set(currency, tokens_);
        }
        return new Value(value);
    }
    euclidean(a, b) {
        a = abs(a);
        b = abs(b);
        if (b > a) {
            const temp = a;
            a = b;
            b = temp;
        }
        while (true) {
            if (b === 0n)
                return a;
            a %= b;
            if (a === 0n)
                return b;
            b %= a;
        }
    }
    get maxAmount() {
        return this.newFoldWith(this.unsortedHeadAmount, max)();
    }
    cleanReduce(...values) {
        const gcd = values.reduce((a, b) => b.gcd(a), this.gcd());
        return [this, ...values].map((v) => v.divideByScalar(gcd));
    }
    dirtyReduce(...values) {
        const maxAmnt = values.reduce((a, b) => max(a, b.maxAmount), this.maxAmount);
        const values_ = [this, ...values];
        if (maxAmnt <= maxInteger)
            return values_;
        const divisor = Number(maxAmnt) / Number(maxInteger);
        return values_.map((v) => v.divideByScalar_(divisor));
    }
    get toMap() {
        const map = this.value.anew;
        for (const [currencySymbol, tokens] of this.value) {
            const tokens_ = tknsAmnts.anew;
            for (const [tokenName, amount] of tokens) {
                tokens_.set(tokenName, amount);
            }
            map.set(currencySymbol, tokens_);
        }
        return map;
    }
    get size() {
        let size = 0n;
        for (const [_, tokens] of this.value) {
            size += BigInt(tokens.size);
        }
        return size;
    }
    get headAsset() {
        assert(this.value.size > 0, `no currencies in value: ${this.show()}`);
        const ccy = [...this.value.keys()].sort()[0];
        const tkns = this.value.get(ccy);
        assert(tkns, `no tokens for currency ${ccy}`);
        assert(tkns.size > 0, `no tokens for currency ${ccy}`);
        const tkn = [...tkns.keys()].sort()[0];
        return new Asset(ccy, tkn);
    }
    get unsortedHeadAmount() {
        for (const [_, tokens] of this.value) {
            for (const [_, amount] of tokens) {
                return amount;
            }
        }
        throw new Error(`no amounts in value: ${this.show()}`);
    }
    get clone() {
        return new Value(this.toMap);
    }
    get smallestAmount() {
        let smallest = undefined;
        for (const amounts of this.value.values()) {
            for (const amount of amounts.values()) {
                if (!smallest || amount < smallest) {
                    smallest = amount;
                }
            }
        }
        assert(smallest, `smallestAmount: no smallest found in ${this.concise()}`);
        return smallest;
    }
    static assert(value) {
        assert(value.value instanceof AssocMap, `Value must be a AssocMap, not ${value.value}`);
        Assets.assert(value.assets);
    }
    static assetsOf(...values) {
        const assets = ccysTkns.anew;
        for (const value of values) {
            for (const [currencySymbol, tokenMap] of value.toMap) {
                const tokens = assets.get(currencySymbol) ?? [];
                for (const token of tokenMap.keys()) {
                    if (!tokens.some((t) => t.name === token.name)) {
                        tokens.push(token);
                    }
                }
                assets.set(currencySymbol, tokens);
            }
        }
        return new Assets(assets);
    }
    static singleton(asset, amount) {
        const value = ccysTknsAmnts.anew;
        const tokens = tknsAmnts.anew;
        tokens.set(asset.token, amount);
        value.set(asset.currency, tokens);
        return new Value(value);
    }
    get positive() {
        return this.newAmountsCheck((a) => a > 0n);
    }
    get leqMaxInteger() {
        return this.newAmountsCheck((a) => a <= maxInteger);
    }
    static newSetAmounts(amount) {
        return Value.newMapAmounts(() => amount);
    }
}
Object.defineProperty(Value, "nullOfAssets", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (assets) => {
        const value = ccysTknsAmnts.anew;
        for (const [currencySymbol, tokens] of assets.toMap) {
            const tokens_ = tknsAmnts.anew;
            for (const tokenName of tokens) {
                tokens_.set(tokenName, 0n);
            }
            value.set(currencySymbol, tokens_);
        }
        return new Value(value);
    }
});
Object.defineProperty(Value, "generateWith", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (bounded) => {
        const assets = Assets.generate();
        const value = new Value();
        assets.forEach((asset) => {
            value.initAmountOf(asset, bounded.genData());
        });
        return value;
    }
});
Object.defineProperty(Value, "newUnionWith", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (op, defaultOut, ...defaultIns) => {
        // assert( // TODO FIXME
        //   defaultIns.length <= op.arguments.length,
        //   "more defaultIns than op arguments",
        // );
        return (arg = new Value(), ...args) => {
            // assert( TODO FIXME
            //   1 + args.length === op.arguments.length,
            //   "args length must match op arguments length",
            // );
            try {
                const args_ = args.map((v) => v ?? new Value());
                const assets = Value.assetsOf(arg, ...args_);
                const result = new Value();
                assets.forEach((asset) => {
                    const amountsIn = new Array();
                    [arg, ...args_].forEach((v, i) => {
                        const defaultIn = defaultIns[i];
                        amountsIn.push(v.amountOf(asset, defaultIn));
                    });
                    const amountOut = op(amountsIn[0], ...amountsIn.slice(1));
                    if (amountOut !== defaultOut) {
                        result.initAmountOf(asset, amountOut);
                    }
                });
                return result;
            }
            catch (e) {
                throw new Error(`newUnionWith:\n${op}\n${[arg, ...args]
                    .map((v) => v?.concise())
                    .join(",\n")}\nfailed: ${e}`);
            }
        };
    }
});
Object.defineProperty(Value, "add", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newUnionWith((a, b) => a + b)
});
Object.defineProperty(Value, "normedAdd", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newUnionWith((a, b) => a + b, 0n, 0n, 0n)
});
Object.defineProperty(Value, "subtract", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newUnionWith((a, b) => a - b)
});
Object.defineProperty(Value, "normedSubtract", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newUnionWith((a, b) => a - b, 0n, 0n, 0n)
});
Object.defineProperty(Value, "hadamard", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newUnionWith((a, b) => a * b)
});
Object.defineProperty(Value, "hadamard_", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newUnionWith((a, b) => a * b, undefined, 0n)
});
Object.defineProperty(Value, "divide", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newUnionWith((a, b) => a / b)
}); // reverse hadamard-product
Object.defineProperty(Value, "normedDivide", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newUnionWith((a, b) => a / b, 0n, 0n, 0n)
});
// upper bound is strict
Object.defineProperty(Value, "genBetween", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (lower, upper) => Value.newUnionWith((a, b) => new PBounded(a, b - 1n).genData())(lower, upper)
});
Object.defineProperty(Value, "newCompareWith", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (op, ...defaultIns) => {
        // assert( // TODO FIXME
        //   defaultIns.length <= op.arguments.length,
        //   "more defaultIns than op arguments",
        // );
        return (arg = new Value(), ...args) => {
            // assert( // TODO FIXME
            //   1 + args.length === op.arguments.length,
            //   "args length must match op arguments length",
            // );
            const args_ = args.map((v) => v ?? new Value());
            const assets = Value.assetsOf(arg, ...args_);
            for (const [currencySymbol, tokens] of assets.toMap) {
                for (const tokenName of tokens) {
                    const asset = new Asset(currencySymbol, tokenName);
                    const amountsIn = new Array();
                    [arg, ...args_].forEach((v, i) => {
                        const defaultIn = defaultIns[i];
                        const amountIn = v.amountOf(asset, defaultIn);
                        amountsIn.push(amountIn);
                    });
                    if (!op(amountsIn[0], ...amountsIn.slice(1))) {
                        return false;
                    }
                }
            }
            return true;
        };
    }
});
// TODO better "infinity" values. Maybe use onchain maximum?
// export const lt = newCompareWith(
//   (a, b) => a < b || bothExtreme(a, b),
//   -BigInt(maxInteger),
//   BigInt(maxInteger),
// );
Object.defineProperty(Value, "leq", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newCompareWith((a, b) => a <= b)
});
Object.defineProperty(Value, "leq_", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newCompareWith((a, b) => a <= b, undefined, 0n)
});
Object.defineProperty(Value, "lt_", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Value.newCompareWith((a, b) => a < b, 0n)
});
Object.defineProperty(Value, "newBoundedWith", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (bounds) => (value) => {
        const bounded = new Value();
        for (const [currencySymbol, tokens] of value.toMap) {
            for (const [tokenName, amount] of tokens) {
                bounded.initAmountOf(new Asset(currencySymbol, tokenName), amount < bounds.lowerBound
                    ? bounds.lowerBound
                    : amount > bounds.upperBound
                        ? bounds.upperBound
                        : amount);
            }
        }
        return bounded;
    }
});
Object.defineProperty(Value, "newMapAmounts", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (op) => Value.newUnionWith((a) => op(a))
});
export class PValue extends PWrapped {
    constructor(pbounded) {
        super(new PMap(PCurrency.ptype, new PMap(PToken.ptype, pbounded)), Value);
        Object.defineProperty(this, "pbounded", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pbounded
        });
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return Value.generateWith(this.pbounded);
            }
        });
    }
    static genPType() {
        return new PValue(PBounded.genPType());
    }
}
