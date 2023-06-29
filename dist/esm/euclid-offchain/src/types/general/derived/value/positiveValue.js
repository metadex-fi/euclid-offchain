import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { genPositive } from "../../../../utils/generators.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { Asset } from "../asset/asset.js";
import { PPositive } from "../bounded/positive.js";
import { PValue, Value } from "./value.js";
export class PositiveValue {
    constructor(value = new Value()) {
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: value
        });
        Object.defineProperty(this, "initAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, amount) => {
                assert(amount > 0n, `initAmountOf: amount must be positive, got ${amount} for asset ${asset.show()}`);
                this.value?.initAmountOf(asset, amount);
            }
        });
        Object.defineProperty(this, "concise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "") => `+${this.value.concise(tabs)}`
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "") => `PositiveValue (\n${this.value.show(tabs)}\n)`
        });
        Object.defineProperty(this, "amountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, defaultAmnt) => this.value.amountOf(asset, defaultAmnt)
        });
        Object.defineProperty(this, "drop", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset) => this.value.drop(asset)
        });
        Object.defineProperty(this, "ofAssets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (assets) => {
                return new PositiveValue(this.value.ofAssets(assets));
            }
        });
        Object.defineProperty(this, "intersect", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return new PositiveValue(this.value.intersect(other.value));
            }
        });
        Object.defineProperty(this, "setAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, amount) => this.value.setAmountOf(asset, amount)
        });
        Object.defineProperty(this, "has", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset) => this.value.has(asset)
        });
        Object.defineProperty(this, "fill", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (assets, amount) => {
                assert(amount > 0n, `fill: amount must be positive, got ${amount}`);
                return new PositiveValue(this.value.fill(assets, amount));
            }
        });
        Object.defineProperty(this, "addAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, amount) => {
                if (this.has(asset))
                    this.increaseAmountOf(asset, amount);
                else
                    this.initAmountOf(asset, amount);
            }
        });
        Object.defineProperty(this, "increaseAmountOf", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (asset, amount) => {
                const newAmount = this.amountOf(asset) + amount;
                assert(newAmount >= 0n, `addAmountOf: newAmount must be nonnegative, got ${this.amountOf(asset)} - ${amount} = ${newAmount}`);
                if (newAmount === 0n) {
                    this.value.drop(asset);
                }
                else {
                    this.value.setAmountOf(asset, newAmount);
                }
            }
        });
        Object.defineProperty(this, "boundedSubValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (minSize, maxSize) => {
                const assets = this.assets.boundedSubset(minSize, maxSize);
                const value = new PositiveValue();
                assets.forEach((asset) => {
                    const amount = this.amountOf(asset);
                    value.initAmountOf(asset, genPositive(amount));
                });
                return value;
            }
        });
        Object.defineProperty(this, "plus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return new PositiveValue(Value.add(this.unsigned, other.unsigned));
            }
        });
        Object.defineProperty(this, "normedPlus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return new PositiveValue(Value.normedAdd(this.unsigned, other.unsigned));
            }
        });
        Object.defineProperty(this, "minus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return new PositiveValue(Value.subtract(this.unsigned, other.unsigned));
            }
        });
        Object.defineProperty(this, "normedMinus", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return new PositiveValue(Value.normedSubtract(this.unsigned, other.unsigned));
            }
        });
        Object.defineProperty(this, "hadamard", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return new PositiveValue(Value.hadamard(this.unsigned, other.unsigned));
            }
        });
        // reverse hadamard product
        Object.defineProperty(this, "divideBy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return new PositiveValue(Value.divide(this.unsigned, other.unsigned));
            }
        });
        Object.defineProperty(this, "normedDivideBy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return new PositiveValue(Value.normedDivide(this.unsigned, other.unsigned));
            }
        });
        Object.defineProperty(this, "scale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (scalar) => {
                return new PositiveValue(this.value.scale(scalar));
            }
        });
        Object.defineProperty(this, "leq", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return Value.leq(this.unsigned, other.unsigned);
            }
        });
        assert(value.positive, `value must be positive: ${value.show()}`);
    }
    get toMap() {
        return this.value.toMap;
    }
    get assets() {
        return this.value.assets;
    }
    get unsigned() {
        return new Value(this.value.toMap);
    }
    get unit() {
        return this.value.unit;
    }
    get zeroed() {
        return this.value.zeroed;
    }
    get size() {
        return this.value.size;
    }
    get headAsset() {
        return this.value.headAsset;
    }
    get smallestAmount() {
        return this.value.smallestAmount;
    }
    get biggestAmount() {
        return this.value.biggestAmount;
    }
    get clone() {
        return new PositiveValue(this.value.clone);
    }
    // public halfRandomAmount = (): void => {
    //   const asset = this.assets.randomChoice();
    //   this.value.setAmountOf(
    //     asset,
    //     max(1n, this.value.amountOf(asset) / 2n),
    //   );
    // };
    // public divideByScalar = (scalar: bigint): PositiveValue => {
    //   return new PositiveValue(this.value.divideByScalar(scalar));
    // }
    get toLucid() {
        const assets = {};
        this.assets.forEach((asset) => {
            assets[asset.toLucid()] = this.amountOf(asset);
        });
        return assets;
    }
    static fromLucid(assets, idNFT) {
        try {
            const value = new Value();
            Object.entries(assets).forEach(([name, amount]) => {
                if (name !== idNFT) {
                    const asset = Asset.fromLucid(name);
                    value.initAmountOf(asset, amount);
                }
            });
            return new PositiveValue(value);
        }
        catch (e) {
            throw new Error(`Amounts.fromLucid ${Object.entries(assets).map(([ass, amnt]) => `${ass}: ${amnt}\n`)}:${e}`);
        }
    }
    static normed(value) {
        return new PositiveValue(value.normed);
    }
    static singleton(asset, amount) {
        return new PositiveValue(Value.singleton(asset, amount));
    }
}
Object.defineProperty(PositiveValue, "maybeFromMap", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (m) => {
        if (m === undefined)
            return undefined;
        else
            return new PositiveValue(new Value(m));
    }
});
Object.defineProperty(PositiveValue, "genOfAssets", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (assets, ppositive = new PPositive()) => {
        const value = new Value();
        assets.forEach((asset) => {
            value.initAmountOf(asset, ppositive.genData());
        });
        return new PositiveValue(value);
    }
});
export const boundPositive = Value.newBoundedWith(new PPositive());
export class PPositiveValue extends PWrapped {
    constructor() {
        super(new PValue(new PPositive()), PositiveValue);
    }
    static genPType() {
        return PPositiveValue.ptype;
    }
}
Object.defineProperty(PPositiveValue, "ptype", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PPositiveValue()
});
