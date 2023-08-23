import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { BoughtSold } from "../../types/euclid/boughtSold.ts";
import {
  PEuclidAction,
  SwapRedeemer,
} from "../../types/euclid/euclidAction.ts";
import { DiracDatum } from "../../types/euclid/euclidDatum.ts";
import { Swap } from "../../types/euclid/swap.ts";
import { Asset } from "../../types/general/derived/asset/asset.ts";
import { Data } from "../../types/general/fundamental/type.ts";
import { ceilDiv, genPositive, min, randomChoice } from "../../utils/generators.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";
import { Value } from "../../types/general/derived/value/value.ts";

const runCorruptionTests = true;
const compareSubSwaps = false;

export class Swapping {
  public readonly spotPrice: number; // uninverted
  public readonly effectivePrice: number; // uninverted
  public previous?: Swapping;
  public subsequent?: Swapping;

  private constructor(
    public readonly user: User | undefined, // webapp needs undefined iirc
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxo: DiracUtxo,
    public readonly boughtAsset: Asset,
    public readonly soldAsset: Asset,
    public readonly boughtAmount: bigint,
    public readonly soldAmount: bigint,
    public readonly boughtSpot: bigint, // inverted
    public readonly soldSpot: bigint, // inverted
    public readonly boughtExp: bigint,
    public readonly soldExp: bigint,
    runTests: boolean, // corruption-test-swappings don't run tests
    private readonly maxBuying: bigint, // for corruption-tests
  ) {
    assert(boughtAmount > 0n, `boughtAmount must be positive`);
    assert(soldAmount > 0n, `soldAmount must be positive`);
    assert(boughtSpot > 0n, `boughtSpot must be positive`);
    assert(soldSpot > 0n, `soldSpot must be positive`);
    assert(boughtAmount <= diracUtxo.balance.amountOf(boughtAsset), `boughtAmount must be less than or equal to the balance`);
    if (user) assert(soldAmount <= user.balance!.amountOf(soldAsset), `soldAmount must be less than or equal to the balance`);

    this.spotPrice = Number(soldSpot) / Number(boughtSpot);
    this.effectivePrice = Number(soldAmount) / Number(boughtAmount);

    if (runTests) {
      // TODO ensure this does not fail when in fact the onchain-code would validate it
      // TODO hard assert again, once the above above is ensured. Or alternatively none at all, call it manually, for performance
      if (!this.validates()) console.error(`Swapping does not validate: ${this.show()}`);
      // assert(this.validates(), `Swapping does not validate:: ${this.show()}`);
      
      if (runCorruptionTests) this.corruptionTests();
    }
  }

  public get type(): string {
    return "Swapping";
  }

  public show = (): string => {
    return `Swapping (
  paramUtxo: ${this.paramUtxo.show()}
  diracUtxo: ${this.diracUtxo.show()}
  boughtAsset:  ${this.boughtAsset.show()}
  soldAsset:    ${this.soldAsset.show()}
  boughtAmount: ${this.boughtAmount}
  soldAmount:   ${this.soldAmount}
  boughtSpot:   ${this.boughtSpot}
  soldSpot:     ${this.soldSpot}
  (boughtA0:    ${this.boughtAmount * this.soldSpot})
  (soldA0:      ${this.soldAmount * this.boughtSpot})
  boughtExp:    ${this.boughtExp}
  soldExp:      ${this.soldExp}
  spotPrice:    ${this.spotPrice}
  eff.Price:    ${this.effectivePrice}
  maxBuying:    ${this.maxBuying}
  (maxBuyingA0: ${this.maxBuying * this.soldSpot})
)`;
  };

  public equalNumbers = (other: Swapping): boolean => {
    return (
      this.boughtAmount === other.boughtAmount &&
      this.soldAmount === other.soldAmount &&
      this.boughtSpot === other.boughtSpot &&
      this.soldSpot === other.soldSpot &&
      this.boughtExp === other.boughtExp &&
      this.soldExp === other.soldExp
    );
  }

  public split = (): Swapping[] => {
    throw new Error("Swapping-split not implemented");
  };

  // TODO set subsequent's diracUtxo's utxo to the one resulting from this tx
  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    console.log(this.show());
    assert(
      this.diracUtxo.utxo,
      `diracUtxo.utxo must be defined - subsequents-issue?`,
    );
    const funds = this.diracUtxo.balance.clone; // TODO cloning probably not required here
    funds.addAmountOf(this.boughtAsset, -this.boughtAmount);
    funds.addAmountOf(this.soldAsset, this.soldAmount);
    const retour = funds.toLucid;
    retour[this.diracUtxo.dirac.threadNFT.toLucid] = 1n;

    const swapRedeemer = PEuclidAction.ptype.pconstant(
      new SwapRedeemer(
        new Swap(
          this.boughtAsset,
          this.soldAsset,
          new BoughtSold(
            this.boughtExp,
            this.soldExp,
          ),
        ),
      ),
    );

    const datum = this.diracUtxo.peuclidDatum.pconstant(
      new DiracDatum(this.diracUtxo.dirac),
    );

    const tx_ = tx
      .readFrom([this.paramUtxo.utxo!])
      .collectFrom(
        [this.diracUtxo.utxo!],
        Data.to(swapRedeemer),
      )
      .payToContract(
        this.user!.contract.address,
        {
          inline: Data.to(datum),
        },
        retour,
      );

    return tx_;
  };

  public setSubsequentUtxo = (txBody: Lucid.C.TransactionBody) => {
    if (this.subsequent) { // TODO this is wrong, as it empties the tasks
      const txHash = Lucid.C.hash_transaction(txBody);
      const txOuts = txBody.outputs();
      console.log(`dirac's address: ${this.diracUtxo.utxo!.address}`);
      for (let i = 0; i < txOuts.len(); i++) {
        const txOut = txOuts.get(i);
        const addr = txOut.address().to_bech32(undefined);
        console.log(`\t${addr} ?`);
        if (addr !== this.diracUtxo.utxo!.address) continue;
        console.log(`\tmatches.`);
        const txIn = Lucid.C.TransactionInput.new(
          txHash,
          Lucid.C.BigNum.from_str(i.toString()),
        );
        const utxo = Lucid.C.TransactionUnspentOutput.new(txIn, txOut);
        const utxo_ = Lucid.coreToUtxo(utxo);
        this.subsequent.diracUtxo.utxo = utxo_;
        break;
      }
      assert(
        this.subsequent.diracUtxo.utxo,
        `failed to set subsequent's diracUtxo's utxo`,
      );
    } else {
      console.log(`no subsequent`);
    }
  };

  public subsequents = (maxSubsequents?: number): Swapping[] => {
    const swappings: Swapping[] = [this];
    let previous = swappings[0];
    let sellableAmount = this.user
      ? this.user.balance!.amountOf(this.soldAsset) -
        this.soldAmount
      : -1n;
    let diracUtxo = this.diracUtxo.applySwapping(this);

    while (sellableAmount != 0n) {
      if (maxSubsequents && swappings.length >= maxSubsequents) break;

      const subsequents = diracUtxo.swappingsFor(
        this.user,
        this.paramUtxo,
        Value.singleton(this.soldAsset, sellableAmount),
        this.boughtAsset,
      );
      if (subsequents.length === 0) break;
      assert(
        subsequents.length === 1,
        `subsequents.length must be 1, but got:\n${
          subsequents.map((s) => s.show()).join("\n")
        }`,
      );

      const swapping = subsequents[0];
      if (sellableAmount > 0) {
        sellableAmount -= swapping.soldAmount;
        assert(sellableAmount >= 0n, `sold too much: ${swapping.show()}`);
      }
      diracUtxo = diracUtxo.applySwapping(swapping);

      previous.subsequent = swapping;
      swapping.previous = previous;
      previous = swapping;
      swappings.push(swapping);
    }

    return swappings;
  };

  // The idea behind this variant is the guess that with lower amounts we might 
  // have a different optimum for exponents and prices
  // ~~> update: could not find a difference, which is quite remarkable if you think about it
  // TODO maybe investigate further, and compare performances
  private subSwapA = (
    amount: bigint,
    amntIsSold: boolean,
  ) : Swapping | undefined => {
    const swappings = this.diracUtxo.swappingsFor(
      this.user,
      this.paramUtxo,
      Value.singleton(this.soldAsset, amntIsSold ? amount : this.soldAmount),
      this.boughtAsset,
      amntIsSold ? this.boughtAmount : amount,
    );
    assert(swappings.length <= 1, `swappings.length must be <= 1, but got:\n${swappings.map((s) => s.show()).join("\n")}`);
    const subSwapA = swappings.length > 0 ? swappings[0] : undefined;
    if (compareSubSwaps) {
      const subSwapB = this.subSwapB(amount, amntIsSold);
      if (subSwapA) {
        assert(subSwapB, `subSwapB must be defined, but got undefined`);
        assert(subSwapA.equalNumbers(subSwapB), `SUCCESS! subSwap-thesis confirmed:\n${subSwapA.show()}\nvs.\n${subSwapB.show()}`);
        // assert(subSwapA.show() === subSwapB.show(), `SUCCESS! ... but only show()-difference:\n${subSwapA.show()}\nvs.\n${subSwapB.show()}`);
        // the above detects only a difference in maxBuying, so we're not using it. TODO not sure which variant is correct here
      } else assert(subSwapB === undefined, `subSwapB must be undefined, but got:\n${subSwapB?.show()}`);
    }
    return subSwapA;
  }

  private subSwapB = (
    amount: bigint,
    amntIsSold: boolean,
  ): Swapping | undefined => {
    console.log(`subSwap: ${amount} ${amntIsSold ? "sold" : "bought"}`);
    const offerA0 = (amntIsSold ? this.boughtAmount : amount) * this.soldSpot;
    const demandA0 = (amntIsSold ? amount : this.soldAmount) * this.boughtSpot;
    const swapA0 = min(offerA0, demandA0);
    const boughtAmount = swapA0 / this.soldSpot;
    if (!boughtAmount) return undefined;
    const soldAmount = ceilDiv(boughtAmount * this.soldSpot, this.boughtSpot);

    assert(
      soldAmount <= this.soldAmount,
      `soldAmount cannot increase: ${soldAmount} > ${this.soldAmount}`,
    );
    assert(
      boughtAmount <= this.boughtAmount,
      `boughtAmount cannot increase: ${boughtAmount} > ${this.boughtAmount}`,
    );

    return new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.boughtAsset,
      this.soldAsset,
      boughtAmount,
      soldAmount,
      this.boughtSpot,
      this.soldSpot,
      this.boughtExp,
      this.soldExp,
      true,
      amntIsSold ? this.maxBuying : amount, // per definition of a subSwap
    );
  };

  public subSwap = compareSubSwaps ? this.subSwapA : this.subSwapB; // TODO profile both and pick the better one (later)

  private randomSubSwap = (): Swapping => {
    for (let i = 0; i < 100; i++) {
      const amntIsSold = Math.random() < 0.5;
      const amount = genPositive(amntIsSold ? this.soldAmount : this.boughtAmount);
      const subSwap = this.subSwapA(amount, amntIsSold);
      if (subSwap) return subSwap;
    }
    throw new Error(`randomSubSwap(): failed to find a subSwap for ${this.show()}`);
  }

  // TODO should this rather be using subSwap for consistency?
  // private randomSubSwap = (): Swapping => {
  //   console.log(`randomSubSwap()`);
  //   const offerA0 = this.boughtAmount * this.soldSpot;
  //   const demandA0 = this.soldAmount * this.boughtSpot;
  //   const maxSwapA0 = min(offerA0, demandA0);
  //   const maxBought = maxSwapA0 / this.soldSpot;
  //   assert(
  //     maxBought > 0n,
  //     `Swapping.randomSubSwap: maxBought must be positive, but is ${maxBought} (${maxSwapA0} / ${this.soldSpot}) for ${this.show()}`,
  //   );
  //   // assert(
  //   //   maxBought >= 0n,
  //   //   `Swapping.randomSubSwap: maxBought must be nonnegative, but is ${maxBought} for ${this.show()}`,
  //   // );

  //   const boughtAmount = genPositive(maxBought);
  //   const soldAmount = BigInt(Math.ceil(Number(boughtAmount) * this.spotPrice));

  //   return new Swapping(
  //     this.user,
  //     this.paramUtxo,
  //     this.diracUtxo,
  //     this.boughtAsset,
  //     this.soldAsset,
  //     boughtAmount,
  //     soldAmount,
  //     this.boughtSpot,
  //     this.soldSpot,
  //     this.boughtExp,
  //     this.soldExp,
  //   );
  // };

  static boundary(
    user: User | undefined,
    paramUtxo: ParamUtxo,
    diracUtxo: DiracUtxo,
    boughtAsset: Asset,
    soldAsset: Asset,
    boughtAmount: bigint,
    soldAmount: bigint,
    boughtSpot: bigint,
    soldSpot: bigint,
    boughtExp: bigint,
    soldExp: bigint,
  ): Swapping {
    console.log(`Swapping.boundary()`);
    return new Swapping(
      user,
      paramUtxo,
      diracUtxo,
      boughtAsset,
      soldAsset,
      boughtAmount,
      soldAmount,
      boughtSpot,
      soldSpot,
      boughtExp,
      soldExp,
      true,
      diracUtxo.balance.amountOf(boughtAsset),
    );
  }

  // TODO don't forget to update (poll) chain state somewhere beforehand
  static genOfUser(user: User): Swapping | undefined {
    // console.log(`attempting to swap`);
    const swappings = user.contract!.state!.swappingsFor(user);
    // console.log(`\tswappings: ${swappings}`);
    if (swappings.length < 1) return undefined;
    // console.log(`Swapping`);
    return randomChoice(swappings).randomSubSwap();
  }

  // private static pricesFitDirac(
  //   spotBuying: bigint,
  //   spotSelling: bigint,
  //   buyingLowest: bigint,
  //   sellingLowest: bigint,
  //   buyingJumpSize: bigint,
  //   sellingJumpSize: bigint,
  // ): boolean {
  //   const fitBuying = (spotBuying - buyingLowest) % buyingJumpSize === 0n;
  //   const fitSelling = (spotSelling - sellingLowest) % sellingJumpSize === 0n;
  //   if (!fitBuying) {
  //     console.log(
  //       `pricesFitDirac:
  //       buying ${spotBuying}
  //       not fit for ${buyingLowest}
  //       with jump ${buyingJumpSize}`,
  //     );
  //   }
  //   if (!fitSelling) {
  //     console.log(
  //       `pricesFitDirac:
  //       selling ${spotSelling}
  //       not fit for ${sellingLowest}
  //       with jump ${sellingJumpSize}`,
  //     );
  //   }
  //   return fitBuying && fitSelling;
  // }

  static exponentsYieldPrice(
    anchor: bigint,
    js: bigint,
    exp: bigint,
    spot: bigint,
    buySell: string,
  ): boolean {
    const spot_ = (anchor * ((js + 1n) ** exp)) / (js ** exp);
    if (spot !== spot_) {
      console.error(
        `exponentsYieldPrice (${buySell}):
        spot ${spot} != ${spot_} 
        for anchor ${anchor}, js ${js}, exp ${exp}`,
      );
      return false;
    }
    return true;
  }

  static boughtAssetForSale(
    spotBuying: bigint,
    spotSelling: bigint,
    buyingAmm: bigint,
    sellingAmm: bigint, 
    oldNew: string,
  ): boolean {
    const fitsBuying = spotBuying <= buyingAmm;
    const fitsSelling = sellingAmm <= spotSelling;
    if (!fitsBuying) {
      console.error(
        `boughtAssetForSale (${oldNew}): 
        buyingAmm  ${buyingAmm} > 
        spotBuying ${spotBuying}`,
      );
      return false;
    }
    if (!fitsSelling) {
      console.error(
        `boughtAssetForSale (${oldNew}):
        sellingAmm  ${sellingAmm} > 
        spotSelling ${spotSelling}`,
      );
      return false;
    }
    return true;
  }

  static valueEquation(
    spotBuying: bigint,
    spotSelling: bigint,
    buyingAmount: bigint,
    sellingAmount: bigint,
  ): boolean {
    const addedBuyingA0 = buyingAmount * spotSelling;
    const addedSellingA0 = sellingAmount * spotBuying;

    if (addedBuyingA0 > addedSellingA0) {
      console.error(
        `valueEquation: 
        addedBuyingA0  ${addedBuyingA0} > 
        addedSellingA0 ${addedSellingA0}`,
      );
      return false;
    }
    return true;
  }

  // TODO fixme
  public validates(): boolean {

    // public readonly user: User | undefined, // TODO why can this be undefined again?
    // public readonly paramUtxo: ParamUtxo,
    // public readonly diracUtxo: DiracUtxo,
    // public readonly boughtAsset: Asset,
    // public readonly soldAsset: Asset,
    // public readonly boughtAmount: bigint,
    // public readonly soldAmount: bigint,
    // public readonly boughtSpot: bigint, // inverted
    // public readonly soldSpot: bigint, // inverted
    // public readonly boughtExp: bigint,
    // public readonly soldExp: bigint,

    const param = this.paramUtxo.param;
    const buyingWeight = param.weights.amountOf(this.boughtAsset);
    const sellingWeight = param.weights.amountOf(this.soldAsset);
    const jsBuying = param.jumpSizes.amountOf(this.boughtAsset);
    const jsSelling = param.jumpSizes.amountOf(this.soldAsset);
    const virtualBuying = param.virtual.amountOf(this.boughtAsset);
    const virtualSelling = param.virtual.amountOf(this.soldAsset);

    const dirac = this.diracUtxo.dirac;
    const anchorBuying = dirac.anchorPrices.amountOf(this.boughtAsset);
    const anchorSelling = dirac.anchorPrices.amountOf(this.soldAsset);
    const balanceBuying = this.diracUtxo.balance.amountOf(this.boughtAsset, 0n);
    const balanceSelling = this.diracUtxo.balance.amountOf(this.soldAsset, 0n);

    const buyingLiquidity = balanceBuying + virtualBuying;
    const sellingLiquidity = balanceSelling + virtualSelling;

    
    const oldBuyingAmm = buyingWeight * buyingLiquidity;
    const oldSellingAmm = sellingWeight * sellingLiquidity;

    const newBuyingAmm = buyingWeight * (buyingLiquidity - this.boughtAmount);
    const newSellingAmm = sellingWeight * (sellingLiquidity + this.soldAmount);

    return true &&
      // Swapping.pricesFitDirac(
      //   spotBuying,
      //   spotSelling,
      //   buyingLowest,
      //   sellingLowest,
      //   buyingJumpSize,
      //   sellingJumpSize,
      // ) &&
      Swapping.exponentsYieldPrice(
        anchorBuying,
        jsBuying,
        this.boughtExp,
        this.boughtSpot,
        "buying",
      ) &&
      Swapping.exponentsYieldPrice(
        anchorSelling,
        jsSelling,
        this.soldExp,
        this.soldSpot,
        "selling",
      ) &&
      Swapping.boughtAssetForSale(
        this.boughtSpot,
        this.soldSpot,
        oldBuyingAmm,
        oldSellingAmm,
        "old",
      ) &&
      Swapping.boughtAssetForSale(
        this.boughtSpot,
        this.soldSpot,
        newBuyingAmm,
        newSellingAmm,
        "new",
      ) &&
      Swapping.valueEquation(
        this.boughtSpot,
        this.soldSpot,
        this.boughtAmount,
        this.soldAmount,
      );
    // TODO othersUnchanged - con: this is implicit
  }

  // try to make it wrong with minimal changes
  public corruptionTests = () => {
    // this.testBuyTooMuch();
    // this.testSellTooLittle();
    // this.testBuyingPrice();
    this.testSellingPrice();
  }

  public testBuyTooMuch = () => {
    if (this.boughtAmount === this.maxBuying) return;
    const boughtTooMuch = new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.boughtAsset,
      this.soldAsset,
      this.boughtAmount + 1n,
      this.soldAmount,
      this.boughtSpot,
      this.soldSpot,
      this.boughtExp,
      this.soldExp,
      false,
      this.maxBuying,
    );
    assert(!boughtTooMuch.validates(), `buying one more should fail: ${this.show()}\n~~~>\n${boughtTooMuch.show()}`);
    // TODO next try fiddling with the prices
  }

  public testSellTooLittle = () => {
    if (this.soldAmount === 1n) return;
    const soldTooLittle = new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.boughtAsset,
      this.soldAsset,
      this.boughtAmount,
      this.soldAmount - 1n,
      this.boughtSpot,
      this.soldSpot,
      this.boughtExp,
      this.soldExp,
      false,
      this.maxBuying,
    );
    assert(!soldTooLittle.validates(), `selling one less should fail: ${this.show()}\n~~~>\n${soldTooLittle.show()}`);
    // TODO next try fiddling with the prices
  }

  public testBuyingPrice = () => {
    const param = this.paramUtxo.param;
    const dirac = this.diracUtxo.dirac;

    const jsBuying = param.jumpSizes.amountOf(this.boughtAsset);
    const anchorBuying = dirac.anchorPrices.amountOf(this.boughtAsset);
    let boughtExp_ = this.boughtExp;
    let boughtSpot_ = this.boughtSpot;
    while (boughtSpot_ === this.boughtSpot) {
      boughtExp_++;
      boughtSpot_ = (anchorBuying * ((jsBuying + 1n) ** boughtExp_)) / (jsBuying ** boughtExp_);
    }
    // NOTE prices are inverted
    assert(boughtSpot_ > this.boughtSpot, `seems like boughtExp is being changed in the wrong direction`);
   
    if (boughtSpot_ > 0n) {
      const boughtSpotTooHigh = new Swapping(
        this.user,
        this.paramUtxo,
        this.diracUtxo,
        this.boughtAsset,
        this.soldAsset,
        this.boughtAmount,
        this.soldAmount,
        boughtSpot_,
        this.soldSpot,
        boughtExp_,
        this.soldExp,
        false,
        this.maxBuying,
      );
      assert(!boughtSpotTooHigh.validates(), `raising buying price should fail: ${this.show()}\n~~~>\n${boughtSpotTooHigh.show()}`);
      assert(Swapping.exponentsYieldPrice(
        anchorBuying,
        jsBuying,
        boughtExp_,
        boughtSpot_,
        "buying",
      ), `boughtSpotTooHigh should still yield the correct price: ${boughtSpotTooHigh.show()}`);
    }
  }

  public testSellingPrice = () => {
    const param = this.paramUtxo.param;
    const dirac = this.diracUtxo.dirac;

    const jsSelling = param.jumpSizes.amountOf(this.soldAsset);
    const anchorSelling = dirac.anchorPrices.amountOf(this.soldAsset);
    let soldExp_ = this.soldExp;
    let soldSpot_ = this.soldSpot;
    while (soldSpot_ === this.soldSpot) {
      soldExp_--;
      soldSpot_ = (anchorSelling * ((jsSelling + 1n) ** soldExp_)) / (jsSelling ** soldExp_);
    }
    // NOTE prices are inverted
    assert(soldSpot_ < this.soldSpot, `seems like soldExp is being changed in the wrong direction`);

    
    if (soldSpot_ > 0n) {
      const buyingA0 = this.boughtAmount * soldSpot_;
      const sellingA0 = this.soldAmount * this.boughtSpot;
      const swapA0 = min(sellingA0, buyingA0);
      if (swapA0 < soldSpot_) return;

      const soldSpotTooLow = new Swapping(
        this.user,
        this.paramUtxo,
        this.diracUtxo,
        this.boughtAsset,
        this.soldAsset,
        this.boughtAmount,
        this.soldAmount,
        this.boughtSpot,
        soldSpot_,
        this.boughtExp,
        soldExp_,
        false,
        this.maxBuying,
      );
      assert(!soldSpotTooLow.validates(), `lowering selling price should fail: ${this.show()}\n~~~>\n${soldSpotTooLow.show()}`);
      assert(Swapping.exponentsYieldPrice(
        anchorSelling,
        jsSelling,
        soldExp_,
        soldSpot_,
        "selling",
      ), `soldSpotTooLow should still yield the correct price: ${soldSpotTooLow.show()}`);
    }
  }
}
