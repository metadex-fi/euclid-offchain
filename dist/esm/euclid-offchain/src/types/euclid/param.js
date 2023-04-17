import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Assets } from "../general/derived/asset/assets.js";
import { PPositive } from "../general/derived/bounded/positive.js";
import { PKeyHash } from "../general/derived/hash/keyHash.js";
import { PositiveValue, PPositiveValue, } from "../general/derived/value/positiveValue.js";
import { Value } from "../general/derived/value/value.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { f, t } from "../general/fundamental/type.js";
import { EuclidValue, PEuclidValue } from "./euclidValue.js";
import { PInteger } from "../general/fundamental/primitive/integer.js";
import { min } from "../../utils/generators.js";
// TODO somewhere, take care of sortedness where it applies (not only for PParam)
export const minLiquidityJumpSize = 1n; //100n; // TODO/NOTE should never be less than 1n
export class Param {
    constructor(owner, virtual, weights, // NOTE those are actually inverted
    jumpSizes, active) {
        Object.defineProperty(this, "owner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: owner
        });
        Object.defineProperty(this, "virtual", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: virtual
        });
        Object.defineProperty(this, "weights", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: weights
        });
        Object.defineProperty(this, "jumpSizes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: jumpSizes
        });
        Object.defineProperty(this, "active", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: active
        });
        Object.defineProperty(this, "sharedAssets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (assets) => this.assets.intersect(assets)
        });
        Object.defineProperty(this, "concise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "") => {
                const tt = tabs + t;
                const ttf = tt + f;
                return `Param (
${ttf}owner: ${this.owner.toString()}, 
${ttf}virtual: ${this.virtual.concise(ttf)}, 
${ttf}weights: ${this.weights.concise(ttf)}
${ttf}jumpSizes: ${this.jumpSizes.concise(ttf)}, 
${ttf}active: ${this.active.toString()}
${tt})`;
            }
        });
        Param.asserts(this);
    }
    // filled with zeroes for assets without virtual liquidity
    get minAnchorPrices() {
        return Value.hadamard_(this.virtual.unsigned, this.weights.unsigned);
    }
    get assets() {
        return this.weights.assets;
    }
    get switched() {
        return new Param(this.owner, this.virtual, this.weights, this.jumpSizes, this.active ? 0n : 1n);
    }
    static asserts(param) {
        const assets = param.jumpSizes.assets;
        assert(assets.equals(param.weights.assets), "assets of jumpSizes and weights must match");
        assert(param.virtual.assets.subsetOf(assets), `assets of virtual must be a subset of assets of jumpSizes and weights, but ${param.virtual.assets.show()}\nis not a subset of ${assets.show()}`);
        const minAnchorPrices = param.minAnchorPrices;
        const maxAnchorPrices = Value.add(minAnchorPrices, param.jumpSizes.unsigned);
        assert(maxAnchorPrices.leqMaxInteger, `max anchor price must be leq max integer, but is ${maxAnchorPrices.concise()}`);
        assert(param.weights.leq(param.jumpSizes.divideByScalar(minLiquidityJumpSize)), `weights must be leq jumpSizes / ${minLiquidityJumpSize.toString()}, but are ${param.weights.concise()} and ${param.jumpSizes.concise()}`);
    }
    static generate() {
        const owner = PKeyHash.ptype.genData();
        const allAssets = Assets.generate(2n);
        const virtualAssets = allAssets.randomSubset();
        return Param.genOf(owner, allAssets, virtualAssets);
    }
    static genOf(owner, allAssets, virtualAssets) {
        assert(virtualAssets.subsetOf(allAssets), `Param.genOf: virtual assets must be a subset of all assets, but ${virtualAssets.show()} is not a subset of ${allAssets.show()}`);
        const jumpSizes = new PositiveValue();
        const weights = new PositiveValue();
        const virtual = new PositiveValue();
        allAssets.forEach((asset) => {
            if (virtualAssets.has(asset)) {
                const maxLowestPrice = new PPositive(minLiquidityJumpSize + 1n).genData();
                const jumpSize = new PPositive(minLiquidityJumpSize, maxLowestPrice - 1n).genData();
                const minLowestPrice = maxLowestPrice - jumpSize;
                const weight = new PPositive(1n, min(minLowestPrice, jumpSize / minLiquidityJumpSize)).genData();
                virtual.initAmountOf(asset, minLowestPrice / weight);
                jumpSizes.initAmountOf(asset, jumpSize);
                weights.initAmountOf(asset, weight);
            }
            else {
                const maxLowestPrice = new PPositive(minLiquidityJumpSize).genData();
                const jumpSize = new PPositive(minLiquidityJumpSize, maxLowestPrice).genData();
                const minLowestPrice = maxLowestPrice - jumpSize;
                const weight = new PPositive(1n, jumpSize / minLiquidityJumpSize).genData();
                if (weight <= minLowestPrice) {
                    virtual.initAmountOf(asset, minLowestPrice / weight);
                }
                jumpSizes.initAmountOf(asset, jumpSize);
                weights.initAmountOf(asset, weight);
            }
        });
        return new Param(owner, virtual, new EuclidValue(weights), new EuclidValue(jumpSizes), 1n);
    }
}
export class PParam extends PObject {
    constructor() {
        super(new PRecord({
            owner: PKeyHash.ptype,
            virtual: PPositiveValue.ptype,
            weights: PEuclidValue.ptype,
            jumpSizes: PEuclidValue.ptype,
            active: PInteger.ptype,
        }), Param);
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Param.generate
        });
    }
    static genPType() {
        return PParam.ptype;
    }
}
Object.defineProperty(PParam, "ptype", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PParam()
});
