import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../lucid.mod.js";
import { DiracDatum, ParamDatum, PEuclidDatum, PPreEuclidDatum, } from "../types/euclid/euclidDatum.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { Asset } from "../types/general/derived/asset/asset.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
import { Data, f, t } from "../types/general/fundamental/type.js";
import { min } from "../utils/generators.js";
import { Swapping } from "./actions/swapping.js";
export class ParamUtxo {
    constructor(param, paramNFT, utxo) {
        Object.defineProperty(this, "param", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: param
        });
        Object.defineProperty(this, "paramNFT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: paramNFT
        });
        Object.defineProperty(this, "utxo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: utxo
        });
        Object.defineProperty(this, "openingTx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tx, contract) => {
                const peuclidDatum = PPreEuclidDatum.genPType(); //only need this for ParamDatum, so this is fine
                const paramDatum = peuclidDatum.pconstant(new ParamDatum(this.param));
                const paramNFT = this.paramNFT.toLucidNFT;
                // console.log(paramNFT);
                return tx
                    .attachMintingPolicy(contract.mintingPolicy)
                    .mintAssets(paramNFT, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
                    .payToContract(contract.address, {
                    inline: Data.to(paramDatum),
                    scriptRef: contract.validator, // for now, for simplicities' sake
                }, paramNFT);
            }
        });
        Object.defineProperty(this, "sharedAssets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (assets) => this.param.sharedAssets(assets)
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "") => {
                const tt = tabs + t;
                const ttf = tt + f;
                return `ParamUtxo (
  ${ttf}param: ${this.param.concise(ttf)}
  ${tt})`;
            }
        });
    }
    static parse(utxo, param) {
        const lovelace = Asset.ADA.toLucid();
        const assets = Object.keys(utxo.assets).filter((a) => a !== lovelace);
        assert(assets.length === 1, `expected exactly id-NFT in ${assets.toString()}`);
        assert(utxo.assets[assets[0]] === 1n, `expected exactly 1 id-NFT`);
        const paramNFT = IdNFT.fromLucid(assets[0]);
        return new ParamUtxo(param, paramNFT, utxo);
    }
    static open(param, paramNFT) {
        return new ParamUtxo(param, paramNFT);
    }
}
export class PreDiracUtxo {
    constructor(utxo, datum, preDirac) {
        Object.defineProperty(this, "utxo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: utxo
        });
        Object.defineProperty(this, "datum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: datum
        });
        Object.defineProperty(this, "preDirac", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: preDirac
        });
        Object.defineProperty(this, "balance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "parse", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (param) => {
                try {
                    return DiracUtxo.parse(this, param);
                }
                catch (_e) { // TODO log this somewhere
                    return undefined;
                }
            }
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "") => {
                const tt = tabs + t;
                const ttf = tt + f;
                return `PreDiracUtxo (
  ${ttf}utxo: {this.utxo.concise(ttf)}
  ${ttf}datum: {this.datum.concise(ttf)}
  ${ttf}preDirac: ${this.preDirac.concise(ttf)}
  ${tt})`;
            }
        });
        const threadNFT = this.preDirac.threadNFT.toLucid;
        assert(utxo.assets[threadNFT] === 1n, `expected exactly 1 thread-NFT, got ${utxo.assets[threadNFT]}`);
        this.balance = PositiveValue.fromLucid(utxo.assets, threadNFT);
    }
}
export class DiracUtxo {
    constructor(// keep private, because how we handle optional utxo arg
    peuclidDatum, dirac, balance, utxo) {
        Object.defineProperty(this, "peuclidDatum", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: peuclidDatum
        });
        Object.defineProperty(this, "dirac", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dirac
        });
        Object.defineProperty(this, "balance", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: balance
        });
        Object.defineProperty(this, "utxo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: utxo
        });
        // public assets = (): Assets => this.dirac.assets;
        // public sharedAssets = (assets: Assets): Assets =>
        //   this.dirac.sharedAssets(assets);
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tabs = "") => {
                const tt = tabs + t;
                const ttf = tt + f;
                return `DiracUtxo (
  ${ttf}dirac: ${this.dirac.concise(ttf)},
  ${ttf}balance: ${this.balance?.concise(ttf) ?? "undefined"}
  ${tt})`;
            }
        });
        Object.defineProperty(this, "openingTx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tx, contract) => {
                const diracDatum = this.peuclidDatum.pconstant(new DiracDatum(this.dirac));
                const funds = this.balance.toLucid;
                const threadNFT = this.dirac.threadNFT.toLucidNFT;
                funds[Object.keys(threadNFT)[0]] = 1n;
                return tx
                    .mintAssets(threadNFT, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
                    .payToContract(contract.address, {
                    inline: Data.to(diracDatum),
                }, funds);
            }
        });
        Object.defineProperty(this, "swappingsFor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (user, pool, sellable_) => {
                const swappings = new Array();
                const param = pool.paramUtxo.param;
                const liquidity_ = new PositiveValue();
                const spotBuying_ = new PositiveValue();
                const spotSelling_ = new PositiveValue();
                const maxBuying_ = new PositiveValue();
                const maxSelling_ = new PositiveValue();
                param.assets.forEach((asset) => {
                    const virtual = param.virtual.amountOf(asset, 0n);
                    const buyable = this.balance.amountOf(asset, 0n);
                    const sellable = sellable_.amountOf(asset, 0n);
                    const weight = param.weights.amountOf(asset); // NOTE: inverted
                    const jumpSize = param.jumpSizes.amountOf(asset);
                    const lowest = this.dirac.lowestPrices.amountOf(asset, 0n);
                    const liquidity = buyable + virtual;
                    if (liquidity <= 0n)
                        return; // TODO reconsider if this can happen, throw error instead if not
                    liquidity_.initAmountOf(asset, liquidity);
                    const amm = liquidity * weight; // NOTE: inverted
                    assert(amm > 0n, `amm <= 0n`);
                    const spotBuying = ((amm - lowest) / jumpSize) * jumpSize + lowest; // NOTE: inverted
                    assert(spotBuying >= lowest, `spotBuying < lowest`);
                    const spotSelling = spotBuying + jumpSize; // NOTE: inverted
                    const a = Number(amm);
                    const w = Number(weight);
                    const l = Number(liquidity);
                    // deposit of asset into pool to move inverted amm-price a to inverted spot price s
                    const delta = (s) => l * (((s / a) ** (w / (w + 1))) - 1);
                    if (spotBuying > 0n) {
                        const sb = Number(spotBuying);
                        const d = delta(sb);
                        const maxBuying = d === Infinity
                            ? buyable
                            : min(buyable, BigInt(Math.floor(-delta(sb))));
                        if (maxBuying > 0n) {
                            spotBuying_.initAmountOf(asset, spotBuying);
                            maxBuying_.initAmountOf(asset, maxBuying);
                        }
                    }
                    if (spotSelling > 0n) {
                        const ss = Number(spotSelling);
                        const d = delta(ss);
                        const maxSelling = d === Infinity
                            ? sellable
                            : min(sellable, BigInt(Math.floor(d)));
                        if (maxSelling > 0n) {
                            spotSelling_.initAmountOf(asset, spotSelling);
                            maxSelling_.initAmountOf(asset, maxSelling);
                        }
                    }
                });
                const sellableAssets = maxSelling_.assets.toList;
                const buyableAssets = maxBuying_.assets.toList;
                sellableAssets.forEach((sellingAsset) => {
                    const spotSelling = spotSelling_.amountOf(sellingAsset); // NOTE: inverted
                    const maxSelling = maxSelling_.amountOf(sellingAsset);
                    buyableAssets.forEach((buyingAsset) => {
                        if (sellingAsset.equals(buyingAsset))
                            return;
                        const spotBuying = spotBuying_.amountOf(buyingAsset); // NOTE: inverted
                        const maxBuying = maxBuying_.amountOf(buyingAsset);
                        // NOTE: below not strictly A0, but want to avoid divisions.
                        // Ok, since only relative value matters. Assume it's a different A0'.
                        const maxBuyingA0 = maxBuying * spotSelling;
                        const maxSellingA0 = maxSelling * spotBuying;
                        const maxSwapA0 = min(maxSellingA0, maxBuyingA0);
                        if (maxSwapA0 < spotSelling)
                            return; // to avoid zero buying amount
                        const buyingAmount = maxSwapA0 / spotSelling;
                        const sellingAmount = BigInt(Math.ceil(Number(maxSwapA0) / Number(spotBuying)));
                        const swapping = Swapping.boundary(user, pool.paramUtxo, this, buyingAsset, sellingAsset, buyingAmount, sellingAmount, spotBuying, spotSelling);
                        assert(Swapping.validates(spotBuying, spotSelling, this.dirac.lowestPrices.amountOf(buyingAsset, 0n), this.dirac.lowestPrices.amountOf(sellingAsset, 0n), param.jumpSizes.amountOf(buyingAsset), param.jumpSizes.amountOf(sellingAsset), param.weights.amountOf(buyingAsset), param.weights.amountOf(sellingAsset), liquidity_.amountOf(buyingAsset), liquidity_.amountOf(sellingAsset), buyingAmount, sellingAmount), `invalid swap: ${swapping.show()}`);
                        swappings.push(swapping);
                    });
                });
                return swappings;
            }
        });
    }
    static parse(from, param) {
        // lifting it again, to utilize the tighter constraints in PEuclidDatum
        const peuclidDatum = new PEuclidDatum(param, from.preDirac.paramNFT, from.preDirac.threadNFT);
        const diracDatum = peuclidDatum.plift(from.datum);
        assert(diracDatum instanceof DiracDatum, `expected DiracDatum`);
        return new DiracUtxo(peuclidDatum, diracDatum.dirac, from.balance, from.utxo);
    }
    static open(param, dirac, balance) {
        const peuclidDatum = new PEuclidDatum(param, dirac.paramNFT, dirac.threadNFT);
        return new DiracUtxo(peuclidDatum, dirac, balance);
    }
}
