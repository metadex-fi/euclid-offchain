import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { BoughtSold } from "../../types/euclid/boughtSold.js";
import { PEuclidAction, SwapRedeemer, } from "../../types/euclid/euclidAction.js";
import { DiracDatum } from "../../types/euclid/euclidDatum.js";
import { Swap } from "../../types/euclid/swap.js";
import { PositiveValue } from "../../types/general/derived/value/positiveValue.js";
import { Data } from "../../types/general/fundamental/type.js";
import { genPositive, min, randomChoice, } from "../../utils/generators.js";
import { Value } from "../../types/general/derived/value/value.js";
export class Swapping {
    constructor(user, paramUtxo, diracUtxo, boughtAsset, soldAsset, boughtAmount, soldAmount, boughtSpot, // inverted
    soldSpot) {
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: user
        });
        Object.defineProperty(this, "paramUtxo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: paramUtxo
        });
        Object.defineProperty(this, "diracUtxo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: diracUtxo
        });
        Object.defineProperty(this, "boughtAsset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: boughtAsset
        });
        Object.defineProperty(this, "soldAsset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: soldAsset
        });
        Object.defineProperty(this, "boughtAmount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: boughtAmount
        });
        Object.defineProperty(this, "soldAmount", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: soldAmount
        });
        Object.defineProperty(this, "boughtSpot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: boughtSpot
        });
        Object.defineProperty(this, "soldSpot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: soldSpot
        });
        Object.defineProperty(this, "spotPrice", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        }); // uninverted
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `Swapping (
  paramUtxo: ${this.paramUtxo.show()}
  diracUtxo: ${this.diracUtxo.show()}
  boughtAsset: ${this.boughtAsset.show()}
  soldAsset: ${this.soldAsset.show()}
  boughtAmount: ${this.boughtAmount}
  soldAmount: ${this.soldAmount}
  boughtSpot: ${this.boughtSpot}
  soldSpot: ${this.soldSpot}
)`;
            }
        });
        Object.defineProperty(this, "tx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tx) => {
                console.log(this.show());
                const funds = this.diracUtxo.balance.clone; // TODO cloning probably not required here
                funds.addAmountOf(this.boughtAsset, -this.boughtAmount);
                funds.addAmountOf(this.soldAsset, this.soldAmount);
                const retour = funds.toLucid;
                retour[this.diracUtxo.dirac.threadNFT.toLucid] = 1n;
                const swapRedeemer = PEuclidAction.ptype.pconstant(new SwapRedeemer(new Swap(this.boughtAsset, this.soldAsset, new BoughtSold(this.boughtSpot, this.soldSpot))));
                const datum = this.diracUtxo.peuclidDatum.pconstant(new DiracDatum(this.diracUtxo.dirac));
                console.log(PositiveValue.fromLucid(this.diracUtxo.utxo.assets).concise());
                console.log(PositiveValue.fromLucid(retour).concise());
                console.log(this.diracUtxo.utxo.assets);
                console.log(retour);
                return tx
                    .readFrom([this.paramUtxo.utxo])
                    .collectFrom([this.diracUtxo.utxo], Data.to(swapRedeemer))
                    .payToContract(this.user.contract.address, {
                    inline: Data.to(datum),
                }, retour);
            }
        });
        Object.defineProperty(this, "subsequents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const swappings = [];
                let sellableAmount = this.user.balance.amountOf(this.soldAsset) -
                    this.soldAmount;
                let diracUtxo = this.diracUtxo.applySwapping(this);
                while (sellableAmount > 0n) {
                    const subsequents = diracUtxo.swappingsFor(this.user, this.paramUtxo, Value.singleton(this.soldAsset, sellableAmount), this.boughtAsset);
                    if (subsequents.length === 0)
                        break;
                    assert(subsequents.length === 1, `subsequents.length must be 1`);
                    const swapping = subsequents[0];
                    sellableAmount -= swapping.soldAmount;
                    diracUtxo = diracUtxo.applySwapping(swapping);
                    swappings.push(swapping);
                }
                return swappings;
            }
        });
        Object.defineProperty(this, "subSwap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (amount, amountIsSold) => {
                const offerA0 = (amountIsSold ? this.boughtAmount : amount) * this.soldSpot;
                const demandA0 = (amountIsSold ? amount : this.soldAmount) *
                    this.boughtSpot;
                const swapA0 = min(offerA0, demandA0);
                const boughtAmount = swapA0 / this.soldSpot;
                assert(boughtAmount > 0n, `Swapping.subSwap: boughtAmount must be positive, but is ${boughtAmount} for ${this.show()}`);
                const soldAmount = BigInt(Math.ceil(Number(boughtAmount) * this.spotPrice));
                assert(soldAmount <= this.soldAmount, `soldAmount cannot increase: ${soldAmount} > ${this.soldAmount}`);
                assert(boughtAmount <= this.boughtAmount, `boughtAmount cannot increase: ${boughtAmount} > ${this.boughtAmount}`);
                return new Swapping(this.user, this.paramUtxo, this.diracUtxo, this.boughtAsset, this.soldAsset, boughtAmount, soldAmount, this.boughtSpot, this.soldSpot);
            }
        });
        // TODO should this rather be using subSwap for consistency?
        Object.defineProperty(this, "randomSubSwap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                const offerA0 = this.boughtAmount * this.soldSpot;
                const demandA0 = this.soldAmount * this.boughtSpot;
                const maxSwapA0 = min(offerA0, demandA0);
                const maxBought = maxSwapA0 / this.soldSpot;
                assert(maxBought > 0n, `Swapping.randomSubSwap: maxBought must be positive, but is ${maxBought} for ${this.show()}`);
                const boughtAmount = genPositive(maxBought);
                const soldAmount = BigInt(Math.ceil(Number(boughtAmount) * this.spotPrice));
                return new Swapping(this.user, this.paramUtxo, this.diracUtxo, this.boughtAsset, this.soldAsset, boughtAmount, soldAmount, this.boughtSpot, this.soldSpot);
            }
        });
        assert(boughtAmount > 0n, `boughtAmount must be positive`);
        assert(soldAmount > 0n, `soldAmount must be positive`);
        assert(boughtSpot > 0n, `boughtSpot must be positive`);
        assert(soldSpot > 0n, `soldSpot must be positive`);
        this.spotPrice = Number(soldSpot) / Number(boughtSpot);
    }
    get type() {
        return "Swapping";
    }
    static boundary(user, paramUtxo, diracUtxo, boughtAsset, soldAsset, boughtAmount, soldAmount, boughtSpot, soldSpot) {
        return new Swapping(user, paramUtxo, diracUtxo, boughtAsset, soldAsset, boughtAmount, soldAmount, boughtSpot, soldSpot);
    }
    // TODO don't forget to update (poll) chain state somewhere beforehand
    static genOfUser(user) {
        // console.log(`attempting to swap`);
        const swappings = user.contract.state.swappingsFor(user);
        // console.log(`\tswappings: ${swappings}`);
        if (swappings.length < 1)
            return undefined;
        // console.log(`Swapping`);
        return randomChoice(swappings).randomSubSwap();
    }
    static pricesFitDirac(spotBuying, spotSelling, buyingLowest, sellingLowest, buyingJumpSize, sellingJumpSize) {
        const fitBuying = (spotBuying - buyingLowest) % buyingJumpSize === 0n;
        const fitSelling = (spotSelling - sellingLowest) % sellingJumpSize === 0n;
        if (!fitBuying) {
            console.log(`pricesFitDirac: 
        buying ${spotBuying} 
        not fit for ${buyingLowest} 
        with jump ${buyingJumpSize}`);
        }
        if (!fitSelling) {
            console.log(`pricesFitDirac:
        selling ${spotSelling}
        not fit for ${sellingLowest}
        with jump ${sellingJumpSize}`);
        }
        return fitBuying && fitSelling;
    }
    static boughtAssetForSale(spotBuying, spotSelling, buyingAmm, sellingAmm, oldNew) {
        const fitsBuying = spotBuying <= buyingAmm;
        const fitsSelling = sellingAmm <= spotSelling;
        if (!fitsBuying) {
            console.log(`boughtAssetForSale (${oldNew}): 
        buyingAmm ${buyingAmm} > 
        spotBuying ${spotBuying}`);
        }
        if (!fitsSelling) {
            console.log(`boughtAssetForSale (${oldNew}):
        sellingAmm ${sellingAmm} < 
        spotSelling ${spotSelling}`);
        }
        return fitsBuying && fitsSelling;
    }
    static valueEquation(spotBuying, spotSelling, buyingAmount, sellingAmount) {
        const addedBuyingA0 = buyingAmount * spotSelling;
        const addedSellingA0 = sellingAmount * spotBuying;
        if (addedBuyingA0 > addedSellingA0) {
            console.log(`valueEquation: 
        addedBuyingA0 ${addedBuyingA0} > 
        addedSellingA0 ${addedSellingA0}`);
        }
        return addedBuyingA0 <= addedSellingA0;
    }
    static validates(spotBuying, spotSelling, buyingLowest, sellingLowest, buyingJumpSize, sellingJumpSize, buyingWeight, sellingWeight, buyingLiquidity, sellingLiquidity, buyingAmount, sellingAmount) {
        const oldBuyingAmm = buyingWeight * buyingLiquidity;
        const oldSellingAmm = sellingWeight * sellingLiquidity;
        const newBuyingAmm = buyingWeight * (buyingLiquidity - buyingAmount);
        const newSellingAmm = sellingWeight * (sellingLiquidity + sellingAmount);
        return Swapping.pricesFitDirac(spotBuying, spotSelling, buyingLowest, sellingLowest, buyingJumpSize, sellingJumpSize) &&
            Swapping.boughtAssetForSale(spotBuying, spotSelling, oldBuyingAmm, oldSellingAmm, "old") &&
            Swapping.boughtAssetForSale(spotBuying, spotSelling, newBuyingAmm, newSellingAmm, "new") &&
            Swapping.valueEquation(spotBuying, spotSelling, buyingAmount, sellingAmount);
        // TODO othersUnchanged
    }
}
