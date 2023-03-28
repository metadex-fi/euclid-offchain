import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Dirac } from "../../types/euclid/dirac.js";
import { EuclidValue } from "../../types/euclid/euclidValue.js";
import { Param } from "../../types/euclid/param.js";
import { Asset } from "../../types/general/derived/asset/asset.js";
import { Assets } from "../../types/general/derived/asset/assets.js";
import { PPositive } from "../../types/general/derived/bounded/positive.js";
import { PositiveValue } from "../../types/general/derived/value/positiveValue.js";
import { genNonNegative, gMaxLength, max, min, } from "../../utils/generators.js";
import { Pool } from "../pool.js";
import { DiracUtxo, ParamUtxo } from "../utxo.js";
// complete settings for opening a pool
export class Opening {
    constructor(user, param, deposit, // total of all Diracs
    numTicks) {
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: user
        });
        Object.defineProperty(this, "param", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: param
        });
        Object.defineProperty(this, "deposit", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: deposit
        });
        Object.defineProperty(this, "numTicks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: numTicks
        });
        Object.defineProperty(this, "tx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tx) => {
                return this.pool().openingTx(tx, this.user.contract).addSigner(this.user.address);
            }
        });
        Object.defineProperty(this, "pool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const assets = this.param.weights.assets;
                const minLowestPrices = this.param.minLowestPrices;
                const tickSizes = this.param.jumpSizes.divideBy(this.numTicks);
                const paramNFT = this.user.nextParamNFT.next(); // TODO remove next()
                const paramUtxo = ParamUtxo.open(this.param, paramNFT);
                let threadNFT = paramNFT.next();
                let diracs = [
                    new Dirac(this.user.paymentKeyHash, threadNFT, paramNFT, PositiveValue.normed(minLowestPrices)),
                ];
                // for each asset and for each existing dirac, "spread" that dirac
                // in that asset's dimension. "spread" means: add all other tick
                // offsets for that asset's lowest price.
                assets.forEach((asset) => {
                    // if (numJumps.amountOf(asset) === 0n) return;
                    const ticks = this.numTicks.amountOf(asset);
                    const tickSize = tickSizes.amountOf(asset);
                    const diracs_ = new Array();
                    diracs.forEach((dirac) => {
                        for (let i = 1n; i < ticks; i++) {
                            const lowestPrices = dirac.lowestPrices.clone;
                            lowestPrices.addAmountOf(asset, i * tickSize);
                            threadNFT = threadNFT.next();
                            diracs_.push(new Dirac(this.user.paymentKeyHash, threadNFT, paramNFT, lowestPrices));
                        }
                    });
                    diracs = diracs.concat(diracs_);
                });
                // TODO consider checking if balance has assets left over
                const balance = PositiveValue.normed(this.deposit.unsigned.divideByScalar(BigInt(diracs.length)));
                assert(balance.size === this.deposit.size, "balance size should match deposit size");
                const diracUtxos = diracs.map((dirac) => {
                    return DiracUtxo.open(this.param, dirac, balance);
                });
                this.user.setLastIdNFT(threadNFT);
                return Pool.open(paramUtxo, diracUtxos);
            }
        });
        // console.log(deposit.assets.union(this.param.virtual.assets).show());
        assert(deposit.assets.union(this.param.virtual.assets).equals(this.param.assets), `deposit and virtual must cover all assets, but got\ndeposit: ${deposit.concise()}\nparam: ${this.param.concise()}`);
        // TODO assert 2. numDiracs resulting from numTicks <= lowest deposit
    }
    get type() {
        return "Opening";
    }
}
// splitting it up this way to later use the same class to process actual user input
Object.defineProperty(Opening, "genOfUser", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (user) => {
        // console.log(`attempting to open`);
        const balance = user.availableBalance;
        if (!balance || balance.size < 1)
            return undefined;
        const maxAssets = gMaxLength;
        const deposit = balance.boundedSubValue(1n, maxAssets);
        const allAssets = deposit.assets;
        const virtualAssets = new Assets();
        let addVirtualAssets = max(genNonNegative(maxAssets), 2n) - allAssets.size;
        while (addVirtualAssets > 0n) {
            const asset = Asset.generate();
            if (allAssets.has(asset))
                continue;
            allAssets.insert(asset);
            virtualAssets.insert(asset);
            addVirtualAssets--;
        }
        // console.log(allAssets.show());
        const param = Param.genOf(user.paymentKeyHash, allAssets, virtualAssets);
        const gMaxDiracs = 26n; // because tx size
        const maxDiracs = deposit.smallestAmount; // because minimum deposit
        let maxTicks = min(gMaxDiracs, maxDiracs);
        const numTicks = new PositiveValue();
        allAssets.forEach((asset) => {
            const ticks = new PPositive(1n, min(min(gMaxLength, param.jumpSizes.amountOf(asset)), maxTicks)).genData();
            maxTicks /= ticks;
            numTicks.initAmountOf(asset, ticks);
        });
        // console.log(`numDiracs: ${numTicks.unsigned.mulAmounts()}`);
        // NOTE 27 diracs slightly exceeds the max tx size (17444 vs. 16384)
        // TODO consider splitting up the tx
        // console.log(`Opening`);
        return new Opening(user, param, deposit, new EuclidValue(numTicks));
    }
});