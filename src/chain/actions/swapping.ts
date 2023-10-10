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
import {
  ceilDiv,
  genPositive,
  min,
  randomChoice,
} from "../../utils/generators.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";
import { Value } from "../../types/general/derived/value/value.ts";
import { Assets } from "../../types/general/derived/asset/assets.ts";
import { Dirac } from "../../types/euclid/dirac.ts";
import { genNonNegative, maxInteger, maybeNdef } from "../../mod.ts";
import { getMinSelling } from "../mod.ts";

// const sellingADAtolerance = 0;

export class Swapping {
  public readonly spotPrice: number; // uninverted
  public readonly effectivePrice: number; // uninverted
  public previous?: Swapping;
  public subsequent?: Swapping;

  private constructor(
    public readonly user: User | undefined, // webapp needs undefined iirc
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxo: DiracUtxo,
    public readonly buyingAsset: Asset,
    public readonly sellingAsset: Asset,
    public readonly buyingAmnt: bigint,
    public readonly sellingAmnt: bigint,
    public readonly buyingSpot: bigint, // inverted
    public readonly sellingSpot: bigint, // inverted
    public readonly buyingExp: bigint,
    public readonly sellingExp: bigint,
    runTests: boolean, // corruption-test-swappings don't run tests themselves.
    private maxBuying: bigint, // for corruption-tests
    private minBuying_: bigint | null,
    private minSelling: bigint | null,
    private tmpMinBuying: bigint | null, // for optimiziation. Need to store this to make corruption-tests pass
  ) {
    assert(
      buyingAmnt <= maxBuying,
      `buyingAmnt must be less than or equal to maxBuying: ${this.show()}`,
    );
    assert(
      buyingAmnt >= (minBuying_ ?? 1n),
      `buyingAmnt too low: ${this.show()}`,
    );
    assert(
      sellingAmnt >= getMinSelling(sellingAsset, minSelling),
      `sellingAmnt too low: ${this.show()}`,
    );
    assert(
      buyingSpot > 0n,
      `buyingSpot must be positive: ${this.show()}`,
    );
    assert(
      sellingSpot > 0n,
      `sellingSpot must be positive: ${this.show()}`,
    );
    assert(
      buyingSpot <= maxInteger,
      `buyingSpot must be <= maxInteger: ${this.show()}`,
    );
    assert(
      sellingSpot <= maxInteger,
      `sellingSpot must be <= maxInteger: ${this.show()}`,
    );
    assert(
      buyingAmnt <= diracUtxo.available.amountOf(buyingAsset),
      `buyingAmnt must be less than or equal to the available balance: ${this.show()}`,
    );
    assert(
      minBuying_ === null || minBuying_ > 0n,
      `minBuying must be positive: ${this.show()}`,
    );
    assert(
      minSelling === null || minSelling > 0n,
      `minSelling must be positive: ${this.show()}`,
    );
    assert(
      minBuying_ === null || tmpMinBuying === null ||
        minBuying_ <= tmpMinBuying,
      `tmpMinBuying must be <= minBuying: ${this.show()}`,
    );
    if (user) {
      assert(
        sellingAmnt <= user.balance!.amountOf(sellingAsset),
        `sellingAmnt must be less than or equal to the available balance: ${this.show()}`,
      );
    }

    this.spotPrice = Number(sellingSpot) / Number(buyingSpot);
    this.effectivePrice = Number(sellingAmnt) / Number(buyingAmnt);

    if (runTests) {
      // TODO ensure this does not fail when in fact the onchain-code would validate it
      // TODO hard assert again, once the above above is ensured. Or alternatively none at all, call it manually, for performance
      // if (!this.validates()) {
      //   console.error(`Swapping does not validate: ${this.show()}`);
      // }
      assert(this.validates(), `Swapping does not validate: ${this.show()}`);

      // if (runCorruptionTests) this.corruptAll();
    }
  }

  private get minBuying(): bigint | null {
    return this.tmpMinBuying ?? this.minBuying_;
  }

  public get type(): string {
    return "Swapping";
  }

  public show = (): string => {
    return `Swapping (
  paramUtxo:    ${this.paramUtxo.show()}
  diracUtxo:    ${this.diracUtxo.show()}
  buyingAsset:  ${this.buyingAsset.show()}
  sellingAsset: ${this.sellingAsset.show()}
  buyingAmnt:   ${this.buyingAmnt}
  sellingAmnt:  ${this.sellingAmnt}
  buyingSpot:   ${this.buyingSpot}
  sellingSpot:  ${this.sellingSpot}
  (boughtA0:    ${this.buyingAmnt * this.sellingSpot})
  (soldA0:      ${this.sellingAmnt * this.buyingSpot})
  buyingExp:    ${this.buyingExp}
  sellingExp:   ${this.sellingExp}
  spotPrice:    ${this.spotPrice}
  eff.Price:    ${this.effectivePrice}
  maxBuying:    ${this.maxBuying}
  (maxBuyingA0: ${this.maxBuying * this.sellingSpot})
  minBuying:    ${this.minBuying_}
  minSelling:   ${this.minSelling}
  tmpMinBuying: ${this.tmpMinBuying}
)`;
  };

  public equalNumbers = (
    other: Swapping,
    compareMaxBuying: boolean,
    compareMinima: boolean,
  ): boolean => {
    return (
      this.buyingAmnt === other.buyingAmnt &&
      this.sellingAmnt === other.sellingAmnt &&
      this.buyingSpot === other.buyingSpot &&
      this.sellingSpot === other.sellingSpot &&
      this.buyingExp === other.buyingExp &&
      this.sellingExp === other.sellingExp &&
      (!compareMaxBuying || this.maxBuying === other.maxBuying) &&
      (!compareMinima || (
        this.minBuying_ === other.minBuying_ &&
        this.minSelling === other.minSelling &&
        this.tmpMinBuying === other.tmpMinBuying
      ))
    );
  };

  public split = (): Swapping[] => {
    throw new Error("Swapping-split not implemented");
  };

  public get posteriorDirac(): Dirac {
    const oldDirac = this.diracUtxo.dirac;

    const newAnchorPrices = oldDirac.anchorPrices.clone; // TODO cloning neccessary?
    newAnchorPrices.setAmountOf(this.buyingAsset, this.buyingSpot);
    newAnchorPrices.setAmountOf(this.sellingAsset, this.sellingSpot);

    return new Dirac(
      oldDirac.owner,
      oldDirac.threadNFT,
      oldDirac.paramNFT,
      newAnchorPrices,
    );
  }

  // TODO set subsequent's diracUtxo's utxo to the one resulting from this tx
  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    console.log(`compiling tx for ${this.show()}`);
    assert(
      this.diracUtxo.utxo,
      `diracUtxo.utxo must be defined - subsequents-issue?`,
    );
    const oldDirac = this.diracUtxo.dirac;
    const funds = this.diracUtxo.funds.clone; // TODO cloning probably not required here
    // console.log(`funds before: ${funds.show()}`)
    funds.addAmountOf(this.buyingAsset, -this.buyingAmnt);
    funds.addAmountOf(this.sellingAsset, this.sellingAmnt);
    // console.log(`funds after: ${funds.show()}`)
    const retour: Lucid.Assets = funds.toLucid;
    retour[oldDirac.threadNFT.toLucid] = 1n;
    // Object.entries(retour).forEach(([asset, amount]) => {
    //   console.log(`\t${asset}: ${amount}`);
    // });

    const swapRedeemer = PEuclidAction.ptype.pconstant(
      new SwapRedeemer(
        new Swap(
          this.buyingAsset,
          this.sellingAsset,
          new BoughtSold(
            this.buyingExp,
            this.sellingExp,
          ),
        ),
      ),
    );

    const newDirac = this.posteriorDirac;
    const datum = this.diracUtxo.peuclidDatum.pconstant(
      new DiracDatum(newDirac),
    );
    const datum_ = Data.to(datum);

    const tx_ = tx
      .readFrom([this.paramUtxo.utxo!])
      .collectFrom(
        [this.diracUtxo.utxo!],
        Data.to(swapRedeemer),
      )
      .payToContract(
        this.user!.contract.address,
        {
          inline: datum_,
        },
        retour,
      );

    return tx_;
  };

  private setSubsequentUtxo = (txCore: Lucid.C.Transaction) => {
    if (this.subsequent) {
      const txBody = txCore.body();
      const txHash = Lucid.C.hash_transaction(txBody);
      const txOuts = txBody.outputs();
      // console.log(`dirac's address: ${this.diracUtxo.utxo!.address}`);
      for (let i = 0; i < txOuts.len(); i++) {
        const txOut = txOuts.get(i);
        const addr = txOut.address().to_bech32(undefined);
        // console.log(`\t${addr} ?`);
        if (addr !== this.diracUtxo.utxo!.address) continue;
        // console.log(`\tmatches.`);
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

  public succeeded = this.setSubsequentUtxo;

  public subsequents = (
    maxSubsequents?: number,
    applyMinAmounts = true, // TODO test false
  ): Swapping[] => {
    console.log(`subsequents(${maxSubsequents})`);
    const swappings: Swapping[] = [this];
    let previous = swappings[0];
    let sellableAmount = this.user
      ? this.user.balance!.amountOf(this.sellingAsset) -
        this.sellingAmnt
      : -1n;
    let diracUtxo = this.diracUtxo.applySwapping(this);

    while (sellableAmount != 0n) {
      if (maxSubsequents !== undefined && swappings.length >= maxSubsequents) {
        break;
      }

      const subsequents = diracUtxo.swappingsFor(
        this.user,
        this.paramUtxo,
        true,
        applyMinAmounts ? this.minBuying ?? undefined : undefined,
        applyMinAmounts ? this.minSelling ?? undefined : undefined,
        Value.singleton(this.sellingAsset, sellableAmount),
        Assets.singleton(this.buyingAsset),
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
        sellableAmount -= swapping.sellingAmnt;
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

  private setMaxBuying = (maxBuying: bigint): void => {
    this.maxBuying = maxBuying;
  };

  // The idea behind this variant is the guess that with lower amounts we might
  // have a different optimum for exponents and prices
  // ~~> update: as we're not touching buyingExps in the swappingsFor loop anymore, only diff in maxBuying
  // TODO maybe investigate further, and compare performances. Note that the other variant is correct, this one wrong, regarding maxBuying
  // TODO granularity
  private subSwapA = (
    amount: bigint,
    amntIsSold: boolean,
    applyMinAmounts = true, // TODO test false
  ): Swapping | null => {
    console.log(`subSwapA: ${amount} ${amntIsSold ? "sold" : "bought"}`);
    // console.log(`from: ${this.show()}`);
    const swappings = this.diracUtxo.swappingsFor(
      this.user,
      this.paramUtxo,
      false,
      applyMinAmounts ? this.minBuying ?? undefined : undefined,
      applyMinAmounts ? this.minSelling ?? undefined : undefined,
      Value.singleton(
        this.sellingAsset,
        amntIsSold ? amount : this.sellingAmnt,
      ),
      Assets.singleton(this.buyingAsset),
      // TODO what
      amntIsSold ? this.buyingAmnt : amount,
      // adding minBalance here because we are removing it again in swappingsFor
      // (amntIsSold ? this.buyingAmnt : amount) +
      //   getMinBalance(this.buyingAsset),
    );
    assert(
      swappings.length <= 1,
      `swappings.length must be <= 1, but got:\n${
        swappings.map((s) => s.show()).join("\n")
      }`,
    );
    const subSwapA = swappings.length > 0 ? swappings[0] : null;
    if (subSwapA) subSwapA.setMaxBuying(amntIsSold ? this.maxBuying : amount); // per definition of a subSwap
    // console.log(`to (A): ${subSwapA?.show()}`);
    const compareSubSwaps = true;
    if (compareSubSwaps) {
      const subSwapB = this.subSwapB(amount, amntIsSold);
      if (subSwapA) {
        assert(subSwapB, `subSwapB must be defined, but got null`);
        assert(
          subSwapA.equalNumbers(subSwapB, false, false),
          `found difference in subSwap-functions:\n${subSwapA.show()}\nvs.\n${subSwapB.show()}`,
        );
        // assert(subSwapA.show() === subSwapB.show(), `SUCCESS! ... but only show()-difference:\n${subSwapA.show()}\nvs.\n${subSwapB.show()}`);
        // the above detects only a difference in maxBuying, so we're not using it. TODO/NOTE the other variant is correct, this one wrong
      } else {assert(
          subSwapB === null,
          `subSwapB must be null, but got:\n${subSwapB?.show()}`,
        );}
      return subSwapB; // NOTE this is because minBuying and maxima are different, subSwapB has the correct one
    }

    return subSwapA;
  };

  private subSwapB = (
    amount: bigint,
    amntIsSold: boolean,
    applyMinAmounts = true, // TODO test false, TODO add to subSwapA (not important)
  ): Swapping | null => {
    console.log(`subSwapB: ${amount} ${amntIsSold ? "sold" : "bought"}`);

    const maxBuying = amntIsSold ? this.buyingAmnt : amount;
    const maxSelling = amntIsSold ? amount : this.sellingAmnt;
    const boughtA0 = maxBuying * this.sellingSpot;
    const soldA0 = maxSelling * this.buyingSpot;
    const swapA0 = min(boughtA0, soldA0);
    const buyingAmnt = swapA0 / this.sellingSpot;

    // console.log(`"maxBuying": ${maxBuying}`);
    // console.log(`"maxSelling": ${maxSelling}`);
    // console.log(`this.buyingSpot: ${this.buyingSpot}`);
    // console.log(`this.sellingSpot: ${this.sellingSpot}`);
    // console.log(`boughtA0: ${boughtA0}`);
    // console.log(`soldA0: ${soldA0}`);
    // console.log(`swapA0: ${swapA0}`);
    // console.log(`buyingAmnt: ${buyingAmnt}`);

    const minBuying = applyMinAmounts ? this.minBuying ?? 1n : 1n;
    if (buyingAmnt < minBuying) return null;

    let sellingAmnt = ceilDiv(buyingAmnt * this.sellingSpot, this.buyingSpot);
    const minSelling = applyMinAmounts
      ? getMinSelling(this.sellingAsset, this.minSelling)
      : 1n;
    if (sellingAmnt < minSelling && minSelling <= maxSelling) {
      sellingAmnt = minSelling;
    }
    // console.log(`sellingAmnt: ${sellingAmnt}`);
    if (sellingAmnt < minSelling) return null;
    assert(
      sellingAmnt <= this.sellingAmnt,
      `sellingAmnt cannot increase: ${sellingAmnt} > ${this.sellingAmnt}`,
    );
    assert(
      buyingAmnt <= this.buyingAmnt,
      `buyingAmnt cannot increase: ${buyingAmnt} > ${this.buyingAmnt}`,
    );

    const subSwap = new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      buyingAmnt,
      sellingAmnt,
      this.buyingSpot,
      this.sellingSpot,
      this.buyingExp,
      this.sellingExp,
      true,
      amntIsSold ? this.maxBuying : amount, // per definition of a subSwap
      applyMinAmounts ? this.minBuying_ : null,
      applyMinAmounts ? this.minSelling : null,
      this.tmpMinBuying,
    );

    // console.log(`to (B): ${subSwap.show()}`);
    return subSwap;
  };

  // NOTE subSwapA is only wrong regarding maxBuying
  public subSwap = this.subSwapB; // TODO profile both and pick the better one (later)

  private randomSubSwap = (): Swapping => {
    const minSelling = getMinSelling(this.sellingAsset, this.minSelling);
    const minBuying = this.minBuying ?? 1n;
    const maxSelling = this.sellingAmnt - 1n;
    const maxBuying = this.buyingAmnt - 1n;
    const sellingOption = maxSelling >= minSelling;
    const buyingOption = maxBuying >= minBuying;
    if (sellingOption || buyingOption) {
      for (let i = 0; i < 100; i++) {
        const amntIsSold = randomChoice([sellingOption, !buyingOption]);
        const maxAmnt = amntIsSold ? maxSelling : maxBuying;
        const minAmnt = amntIsSold ? minSelling : minBuying;
        const amount = minAmnt + genNonNegative(maxAmnt - minAmnt);
        const subSwap = this.subSwap(amount, amntIsSold);
        if (subSwap) return subSwap;
      }
    }
    console.log(
      `randomSubSwap(): failed to find a smaller subSwap for ${this.show()}`,
    );
    // this is to test the subSwap-function
    const subSwap = Math.random() < 0.5
      ? this.subSwap(this.buyingAmnt, false)
      : this.subSwap(this.sellingAmnt, true);
    assert(
      subSwap,
      `randomSubSwap(): failed to find a subSwap for ${this.show()}`,
    );
    assert(
      this.equalNumbers(subSwap, false, true), // maxBuying changes per definition of a subSwap
      `subSwap with unchanged amounts should result in same Swapping, but got:\n${subSwap.show()}\nfrom\n${this.show()}`,
    );
    return subSwap;
  };

  static boundary(
    user: User | undefined,
    paramUtxo: ParamUtxo,
    diracUtxo: DiracUtxo,
    buyingAsset: Asset,
    sellingAsset: Asset,
    buyingAmnt: bigint,
    sellingAmnt: bigint,
    buyingSpot: bigint,
    sellingSpot: bigint,
    buyingExp: bigint,
    sellingExp: bigint,
    minBuying: bigint | null,
    minSelling: bigint | null,
    tmpMinBuying: bigint | null,
  ): Swapping {
    console.log(`Swapping.boundary()`);
    return new Swapping(
      user,
      paramUtxo,
      diracUtxo,
      buyingAsset,
      sellingAsset,
      buyingAmnt,
      sellingAmnt,
      buyingSpot,
      sellingSpot,
      buyingExp,
      sellingExp,
      true,
      diracUtxo.available.amountOf(buyingAsset),
      minBuying,
      minSelling,
      tmpMinBuying,
    );
  }

  // TODO don't forget to update (poll) chain state somewhere beforehand
  static genOfUser(user: User): Swapping | null {
    // console.log(`attempting to swap`);
    let swappings: Swapping[] = [];
    // TODO probably too much
    for (let i = maxInteger; i > 1n; i /= 10n) {
      swappings = user.contract!.state!.swappingsFor(
        user,
        maybeNdef(genPositive(i)),
        maybeNdef(genPositive(i)),
      );
      if (swappings.length > 0) break;
    }
    // console.log(`\tswappings: ${swappings}`);
    if (swappings.length < 1) return null;
    // console.log(`Swapping`);
    const choice = randomChoice(swappings);
    // return choice; // TODO revert
    if (Math.random() < 0.5) return choice;
    else return choice.randomSubSwap();
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

  static spot = (a: bigint, j: bigint, e: bigint) =>
    (0 <= e)
      ? (a * ((j + 1n) ** e)) / (j ** e)
      : (a * (j ** -e)) / ((j + 1n) ** -e);

  static exp = (anchor: number, amm: number, jumpMultiplier: number) =>
    Math.log(amm / anchor) /
    Math.log(jumpMultiplier);

  static exponentsYieldPrice(
    anchor: bigint,
    js: bigint,
    exp: bigint,
    spot: bigint,
    buySell: string,
  ): boolean {
    const spot_ = Swapping.spot(anchor, js, exp);

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

  static buyingAssetForSale(
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
        `buyingAssetForSale (${oldNew}): 
        buyingAmm  ${buyingAmm} > 
        spotBuying ${spotBuying}`,
      );
      return false;
    }
    if (!fitsSelling) {
      console.error(
        `buyingAssetForSale (${oldNew}):
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

  public validates(): boolean {
    // public readonly user: User | undefined, // TODO why can this be undefined again?
    // public readonly paramUtxo: ParamUtxo,
    // public readonly diracUtxo: DiracUtxo,
    // public readonly buyingAsset: Asset,
    // public readonly sellingAsset: Asset,
    // public readonly buyingAmnt: bigint,
    // public readonly sellingAmnt: bigint,
    // public readonly buyingSpot: bigint, // inverted
    // public readonly sellingSpot: bigint, // inverted
    // public readonly buyingExp: bigint,
    // public readonly sellingExp: bigint,

    const param = this.paramUtxo.param;
    const buyingWeight = param.weights.amountOf(this.buyingAsset);
    const sellingWeight = param.weights.amountOf(this.sellingAsset);
    const jsBuying = param.jumpSizes.amountOf(this.buyingAsset);
    const jsSelling = param.jumpSizes.amountOf(this.sellingAsset);
    const virtualBuying = param.virtual.amountOf(this.buyingAsset);
    const virtualSelling = param.virtual.amountOf(this.sellingAsset);

    const dirac = this.diracUtxo.dirac;
    const anchorBuying = dirac.anchorPrices.amountOf(this.buyingAsset);
    const anchorSelling = dirac.anchorPrices.amountOf(this.sellingAsset);
    const balanceBuying = this.diracUtxo.funds.amountOf(this.buyingAsset, 0n);
    const balanceSelling = this.diracUtxo.funds.amountOf(this.sellingAsset, 0n);

    const buyingLiquidity = balanceBuying + virtualBuying;
    const sellingLiquidity = balanceSelling + virtualSelling;

    const oldBuyingAmm = buyingWeight * buyingLiquidity;
    const oldSellingAmm = sellingWeight * sellingLiquidity;

    const newBuyingAmm = buyingWeight * (buyingLiquidity - this.buyingAmnt);
    const newSellingAmm = sellingWeight * (sellingLiquidity + this.sellingAmnt);

    return true &&
      // Swapping.pricesFitDirac(
      //   spotBuying,
      //   spotSelling,
      //   buyingLowest,x
      //   sellingLowest,
      //   buyingJumpSize,
      //   sellingJumpSize,
      // ) &&
      Swapping.exponentsYieldPrice(
        anchorBuying,
        jsBuying,
        this.buyingExp,
        this.buyingSpot,
        "buying",
      ) &&
      Swapping.exponentsYieldPrice(
        anchorSelling,
        jsSelling,
        this.sellingExp,
        this.sellingSpot,
        "selling",
      ) &&
      Swapping.buyingAssetForSale(
        this.buyingSpot,
        this.sellingSpot,
        oldBuyingAmm,
        oldSellingAmm,
        "old",
      ) &&
      Swapping.buyingAssetForSale(
        this.buyingSpot,
        this.sellingSpot,
        newBuyingAmm,
        newSellingAmm,
        "new",
      ) &&
      Swapping.valueEquation(
        this.buyingSpot,
        this.sellingSpot,
        this.buyingAmnt,
        this.sellingAmnt,
      );
    // TODO othersUnchanged - con: this is implicit
  }

  // try to make it wrong with minimal changes
  public corruptAll = (): Swapping[] => {
    return [
      this.corruptBoughtSpot(),
      this.corruptSoldSpot(),

      this.corruptSoldAmnt(false),
      this.corruptBoughtAmnt(false),
      // TODO revert
      this.corruptSoldAmnt(true),
      this.corruptBoughtAmnt(true),
      this.corruptSoldAmnt(true),
      this.corruptBoughtAmnt(true),
      this.corruptSoldAmnt(true),
      this.corruptBoughtAmnt(true),
      this.corruptSoldAmnt(true),
      this.corruptBoughtAmnt(true),
      this.corruptSoldAmnt(true),
      this.corruptBoughtAmnt(true),
    ].filter((s) => s) as Swapping[];
  };

  public corruptBoughtAmnt = (random: boolean): Swapping | null => {
    console.log(`trying to corrupt bought amount...`);
    if (this.buyingAmnt === this.maxBuying) return null;
    const amnt = random ? genPositive(this.maxBuying - this.buyingAmnt) : 1n;
    console.log(`... by ${amnt}`);
    const boughtTooMuch = new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      this.buyingAmnt + amnt,
      this.sellingAmnt,
      this.buyingSpot,
      this.sellingSpot,
      this.buyingExp,
      this.sellingExp,
      false,
      this.maxBuying,
      this.minBuying_,
      this.minSelling,
      this.tmpMinBuying,
    );
    assert(
      !boughtTooMuch.validates(),
      `buying ${amnt} more should fail offchain validation: ${this.show()}\n~~~>\n${boughtTooMuch.show()}`,
    );
    console.log(`returning corruptBoughtAmnt`);
    return boughtTooMuch;
  };

  public corruptSoldAmnt = (random: boolean): Swapping | null => {
    console.log(`trying to corrupt sold amount...`);
    const minSelling = getMinSelling(this.sellingAsset, this.minSelling);
    if (this.sellingAmnt === minSelling) return null;
    const amnt = random ? genPositive(this.sellingAmnt - minSelling) : 1n;
    console.log(`... by ${amnt}`);
    const soldTooLittle = new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      this.buyingAmnt,
      this.sellingAmnt - amnt,
      this.buyingSpot,
      this.sellingSpot,
      this.buyingExp,
      this.sellingExp,
      false,
      this.maxBuying,
      this.minBuying_,
      this.minSelling,
      this.tmpMinBuying,
    );
    assert(
      !soldTooLittle.validates(),
      `selling ${amnt} less should fail offchain validation: ${this.show()}\n~~~>\n${soldTooLittle.show()}`,
    );
    console.log(`returning corruptSoldAmnt`);
    return soldTooLittle;
  };

  public corruptBoughtSpot = (nested = 0): Swapping | null => {
    console.log("corrupting bought spot...");
    const param = this.paramUtxo.param;
    const dirac = this.diracUtxo.dirac;

    const jsBuying = param.jumpSizes.amountOf(this.buyingAsset);
    const anchorBuying = dirac.anchorPrices.amountOf(this.buyingAsset);
    let buyingExp_ = this.buyingExp;
    let buyingSpot_ = this.buyingSpot;
    while (buyingSpot_ === this.buyingSpot) {
      buyingExp_++;
      buyingSpot_ = Swapping.spot(anchorBuying, jsBuying, buyingExp_);
    }
    // NOTE prices are inverted
    assert(
      buyingSpot_ > this.buyingSpot,
      `seems like buyingExp is being changed in the wrong direction`,
    );

    if (buyingSpot_ > 0n && buyingSpot_ <= maxInteger) {
      const buyingSpotTooHigh = new Swapping(
        this.user,
        this.paramUtxo,
        this.diracUtxo,
        this.buyingAsset,
        this.sellingAsset,
        this.buyingAmnt,
        this.sellingAmnt,
        buyingSpot_,
        this.sellingSpot,
        buyingExp_,
        this.sellingExp,
        false,
        this.maxBuying,
        this.minBuying_,
        this.minSelling,
        this.tmpMinBuying,
      );

      if (buyingSpotTooHigh.validates()) {
        console.log(`bought spot corruption succeeded: ${nested}`);
        // buyingSpotTooHigh.corruptBoughtSpot(nested + 1);
        // if (
        //   !this.sellingAsset.equals(Asset.ADA) || nested >= sellingADAtolerance
        // ) {
        throw new Error(
          `raising inverted buying price should fail offchain validation: ${this.show()}\n~~~>\n${buyingSpotTooHigh.show()}`,
        );
        // }
      } else console.log(`bought spot corruption failed: ${nested}`);

      assert(
        Swapping.exponentsYieldPrice(
          anchorBuying,
          jsBuying,
          buyingExp_,
          buyingSpot_,
          "buying",
        ),
        `buyingSpotTooHigh should still yield the correct price: ${buyingSpotTooHigh.show()}`,
      );
      console.log(`returning corruptBoughtSpot`);
      return buyingSpotTooHigh;
    } else return null;
  };

  public corruptSoldSpot = (nested = 0): Swapping | null => {
    console.log("corrupting sold spot...");
    const param = this.paramUtxo.param;
    const dirac = this.diracUtxo.dirac;

    const jsSelling = param.jumpSizes.amountOf(this.sellingAsset);
    const anchorSelling = dirac.anchorPrices.amountOf(this.sellingAsset);
    let sellingExp_ = this.sellingExp;
    let sellingSpot_ = this.sellingSpot;
    while (sellingSpot_ === this.sellingSpot) {
      sellingExp_--;
      sellingSpot_ = Swapping.spot(anchorSelling, jsSelling, sellingExp_);
    }
    // NOTE prices are inverted
    assert(
      sellingSpot_ < this.sellingSpot,
      `seems like sellingExp is being changed in the wrong direction`,
    );

    if (sellingSpot_ > 0n && sellingSpot_ <= maxInteger) {
      const buyingA0 = this.buyingAmnt * sellingSpot_;
      const sellingA0 = this.sellingAmnt * this.buyingSpot;
      const swapA0 = min(sellingA0, buyingA0);
      if (swapA0 < sellingSpot_) return null;

      const sellingSpotTooLow = new Swapping(
        this.user,
        this.paramUtxo,
        this.diracUtxo,
        this.buyingAsset,
        this.sellingAsset,
        this.buyingAmnt,
        this.sellingAmnt,
        this.buyingSpot,
        sellingSpot_,
        this.buyingExp,
        sellingExp_,
        false,
        this.maxBuying,
        this.minBuying_,
        this.minSelling,
        this.tmpMinBuying,
      );

      if (sellingSpotTooLow.validates()) {
        console.log(`sold spot corruption succeeded: ${nested}`);
        // sellingSpotTooLow.corruptSoldSpot(nested + 1);
        // if (
        //   !this.sellingAsset.equals(Asset.ADA) || nested >= sellingADAtolerance
        // ) {
        throw new Error(
          `lowering inverted selling price should fail offchain validation: ${this.show()}\n~~~>\n${sellingSpotTooLow.show()}`,
        );
        // }
      } else console.log(`sold spot corruption failed: ${nested}`);

      assert(
        Swapping.exponentsYieldPrice(
          anchorSelling,
          jsSelling,
          sellingExp_,
          sellingSpot_,
          "selling",
        ),
        `sellingSpotTooLow should still yield the correct price: ${sellingSpotTooLow.show()}`,
      );
      console.log(`returning corruptSoldSpot`);
      return sellingSpotTooLow;
    } else return null;
  };

  // public corruptRandomAmnts = (): Swapping | null => {
  //   for (let i = 0; i < 100; i++) {
  //     const randomAmnts = new Swapping(
  //       this.user,
  //       this.paramUtxo,
  //       this.diracUtxo,
  //       this.buyingAsset,
  //       this.sellingAsset,
  //       genPositive(this.maxBuying),
  //       genPositive(this.sellingAmnt),
  //       this.buyingSpot,
  //       this.sellingSpot,
  //       this.buyingExp,
  //       this.buyingSpot,
  //       false,
  //       this.maxBuying,
  //       this.granularity,
  //     );
  //     if (!randomAmnts.validates()) return randomAmnts;
  //   }
  //   return null;
  // }
}
