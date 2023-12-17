import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import {
  PEuclidAction,
  SwapRedeemer,
} from "../../types/euclid/euclidAction.ts";
import { DiracDatum } from "../../types/euclid/euclidDatum.ts";
import { Swap } from "../../types/euclid/swap.ts";
import { Asset } from "../../types/general/derived/asset/asset.ts";
import { Data, f, t } from "../../types/general/fundamental/type.ts";
import {
  ceilDiv,
  genNonNegative,
  genPositive,
  max,
  maybeNdef,
  min,
  randomChoice,
} from "../../utils/generators.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";
import { Value } from "../../types/general/derived/value/value.ts";
import { Assets } from "../../types/general/derived/asset/assets.ts";
import { Dirac } from "../../types/euclid/dirac.ts";
import {
  compareVariants,
  maxInteger,
  webappExpLimit,
} from "../../utils/constants.ts";
import {
  bestMultsAhead,
  countMults,
  PairOption,
  SwapfindingVariant,
} from "./swapfinding6/swapsForPair.ts";

// const sellingADAtolerance = 0;

// export interface SwappingArgs {
//   readonly adhereMaxInteger: boolean,
//   readonly maxIntImpacted: boolean,
//   readonly maxExpMults: number | null,
//   readonly expLimitImpacted: boolean,
//   readonly user: User | null, // webapp needs undefined iirc
//   readonly paramUtxo: ParamUtxo,
//   readonly diracUtxo: DiracUtxo,
//   readonly buyingAsset: Asset,
//   readonly sellingAsset: Asset,
//   readonly buyingAmnt: bigint,
//   readonly sellingAmnt: bigint,
//   readonly buyingSpot: bigint, // inverted
//   readonly sellingSpot: bigint, // inverted
//   readonly buyingExp: bigint,
//   readonly sellingExp: bigint,
//   readonly availableBuying: bigint, // for corruption-tests (cannot be taken from dirac because of subSwaps)
//   readonly availableSelling: bigint | null, // for corruption-tests (cannot be left null or taken from user because of subSwaps). Null means no limit
//   readonly minBuying_: bigint,
//   readonly minSelling: bigint,
//   readonly tmpMinBuying: bigint | null, // for optimiziation. Need to store this to make corruption-tests pass
// }

export class Swapping {
  public previous?: Swapping;
  public subsequent?: Swapping;

  private constructor(
    public readonly user: User | null, // webapp needs undefined iirc
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxo: DiracUtxo,
    public readonly buyingAsset: Asset,
    public readonly sellingAsset: Asset,
    public readonly option: PairOption,
    public readonly maxIntImpacted: boolean,
    public readonly minExpMults: number,
    public readonly maxExpMults: number,
    public readonly corruptions: string[],
    // runTests: boolean, // corruption-test-swappings don't run tests themselves.
    // public readonly adhereMaxInteger: boolean,
    // public readonly maxIntImpacted: boolean,
    // public readonly maxExpMults: number | null,
    // // public readonly expLimitImpacted: boolean,
    // public readonly user: User | null, // webapp needs undefined iirc
    // public readonly paramUtxo: ParamUtxo,
    // public readonly diracUtxo: DiracUtxo,
    // public readonly buyingAsset: Asset,
    // public readonly sellingAsset: Asset,
    // public readonly buyingAmnt: bigint,
    // public readonly sellingAmnt: bigint,
    // public readonly newAnchorBuying: bigint, // inverted
    // public readonly newAnchorSelling: bigint, // inverted
    // public readonly buyingExp: bigint,
    // public readonly sellingExp: bigint,
    // private availableBuying: bigint, // for corruption-tests (cannot be taken from dirac because of subSwaps)
    // private readonly availableSelling: bigint | null, // for corruption-tests (cannot be left null or taken from user because of subSwaps). Null means no limit
    // private readonly minBuying_: bigint,
    // private readonly minSelling: bigint,
    // private readonly tmpMinBuying: bigint | null, // for optimiziation. Need to store this to make corruption-tests pass
    // runTests: boolean, // corruption-test-swappings don't run tests themselves.
  ) {
    // assert(
    //   buyingAmnt <= availableBuying,
    //   `buyingAmnt must be less than or equal to availableBuying: ${this.show()}`,
    // );
    // assert(
    //   availableSelling === null || sellingAmnt <= availableSelling,
    //   `sellingAmnt must be less than or equal to availableSelling: ${this.show()}`,
    // );
    // assert(
    //   buyingAmnt >= this.minBuying,
    //   `buyingAmnt too low: ${this.show()}`,
    // );
    // assert(
    //   sellingAmnt >= minSelling,
    //   `sellingAmnt too low: ${this.show()}`,
    // );
    // assert(
    //   newAnchorBuying > 0n,
    //   `newAnchorBuying must be positive: ${this.show()}`,
    // );
    // assert(
    //   newAnchorSelling > 0n,
    //   `newAnchorSelling must be positive: ${this.show()}`,
    // );
    // assert(
    //   (!adhereMaxInteger) || newAnchorBuying <= maxInteger,
    //   `newAnchorBuying must be <= maxInteger: ${this.show()}`,
    // );
    // assert(
    //   (!adhereMaxInteger) || newAnchorSelling <= maxInteger,
    //   `newAnchorSelling must be <= maxInteger: ${this.show()}`,
    // );
    // assert(
    //   minBuying_ > 0n,
    //   `minBuying must be positive: ${this.show()}`,
    // );
    // assert(
    //   tmpMinBuying === null || minBuying_ <= tmpMinBuying,
    //   `tmpMinBuying must be <= minBuying: ${this.show()}`,
    // );
    // assert(
    //   minSelling > 0n,
    //   `minSelling must be positive: ${this.show()}`,
    // );
    if (user) {
      assert(
        option.s.maxDelta !== "oo" &&
          option.s.maxDelta <= user.balance!.amountOf(sellingAsset),
        `availableSelling must be less than or equal to the available balance: ${this.show()}`,
      );
    }
    // if (maxExpMults !== null) {
    //   const buyingMults = countMults(option.b.exp);
    //   const sellingMults = countMults(option.s.exp);
    //   assert(
    //     buyingMults + sellingMults <= maxExpMults,
    //     `exponents must have ${buyingMults} + ${sellingMults} <= ${maxExpMults} multiplications: ${this.show()}`,
    //   );
    // }

    // if (runTests) {
    //   // assert(
    //   //   this.spotPrice <= this.effectivePrice,
    //   //   `spotPrice > effectivePrice: ${this.show()}`,
    //   // );
    //   assert(this.validates(), `Swapping does not validate: ${this.show()}`);
    // }
  }

  // private get minBuying(): bigint {
  //   return this.tmpMinBuying ?? this.minBuying_;
  // }

  public get type(): string {
    return "Swapping";
  }

  static boundary(
    user: User | null, // webapp needs undefined iirc
    paramUtxo: ParamUtxo,
    diracUtxo: DiracUtxo,
    buyingAsset: Asset,
    sellingAsset: Asset,
    option: PairOption,
    maxIntImpacted: boolean,
    minExpMults: number,
    maxExpMults: number,
  ): Swapping {
    console.log(`Swapping.boundary()`);
    return new Swapping(
      user, // webapp needs undefined iirc
      paramUtxo,
      diracUtxo,
      buyingAsset,
      sellingAsset,
      option,
      maxIntImpacted,
      minExpMults,
      maxExpMults,
      [],
      // true, // corruption-test-swappings don't run tests themselves.
      // adhereMaxInteger,
      // maxIntImpacted,
      // maxExpMults,
      // // expLimitImpacted,
      // user,
      // paramUtxo,
      // diracUtxo,
      // buyingAsset,
      // sellingAsset,
      // buyingAmnt,
      // sellingAmnt,
      // newAnchorBuying,
      // newAnchorSelling,
      // buyingExp,
      // sellingExp,
      // availableBuying, //diracUtxo.available.amountOf(buyingAsset),
      // availableSelling === -1n ? null : availableSelling, //user ? user.availableBalance!.amountOf(sellingAsset) : null,
      // minBuying,
      // minSelling,
      // tmpMinBuying,
      // true,
    );
  }

  // TODO don't forget to update (poll) chain state somewhere beforehand
  static genOfUser(user: User): Swapping | null {
    // console.log(`attempting to swap`);
    let swappings: Swapping[] = [];
    // TODO probably too much
    const variant: SwapfindingVariant = {
      accuracy: randomChoice(["exact", "perExpMaxDelta", "imperfectMaxDelta"]),
      stopOnceNotImproving: randomChoice([true, false]),
    };
    const expLimit = randomChoice([
      webappExpLimit,
      Number(genPositive(50n)),
      Number(genPositive()),
    ]);
    for (let i = maxInteger; i > 1n; i /= 10n) {
      swappings = user.contract!.state!.swappingsFor(
        user,
        variant,
        genPositive(i),
        genPositive(i),
        0,
        expLimit,
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

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Swapping (
${ttf}paramUtxo: ${this.paramUtxo.show(ttf)}
${ttf}diracUtxo: ${this.diracUtxo.show(ttf)}
${ttf}buyingAsset: ${this.buyingAsset.show()}
${ttf}sellingAsset: ${this.sellingAsset.show()}
${ttf}option: ${this.option.show(ttf)}
${ttf}maxIntImpacted: ${this.maxIntImpacted}
${ttf}minExpMults: ${this.minExpMults}
${ttf}maxExpMults: ${this.maxExpMults}
${ttf}corruptions: ${this.corruptions.toString()}
  )`;
  };

  // public toDataRow = (): string[] => {
  //   return [
  //     ...this.paramUtxo.toDataRow(),
  //     ...this.diracUtxo.toDataRow(),
  //     this.buyingAsset.show(),
  //     this.sellingAsset.show(),
  //     ...this.option.toDataRow(),
  //     this.maxIntImpacted.toString(),
  //     this.minExpMults.toString(),
  //     this.maxExpMults.toString(),
  //     this.corruptions.toString(),
  //   ]
  // }

  // public equals = (
  //   other: Swapping,
  //   compareMinSoft: boolean,
  //   ignore: string[],
  // ): boolean => {
  //   const as = this.show().split("\n");
  //   const bs = other.show().split("\n");
  //   let matches = true;

  //   if (as.length !== bs.length) {
  //     console.log(`mismatch in length: ${as.length} !== ${bs.length}`);
  //     matches = false;
  //   }
  //   for (let i = 0; i < as.length; i++) {
  //     const a = as[i];
  //     const b = bs[i];
  //     if ((!compareMinSoft) && a.includes("s.minDelta")) continue;

  //     let skip = false;
  //     for (const ign of ignore) {
  //       if (a.includes(ign)) {
  //         skip = true;
  //         break;
  //       }
  //     }
  //     if (skip) continue;
  //     if (a !== b) {
  //       console.log(`mismatch: ${a} !== ${b}`);
  //       matches = false;
  //     }
  //   }
  //   if (compareMinSoft && this.option.b.minDelta !== other.option.b.minDelta) {
  //     console.log(
  //       `mismatch in minBuying: ${this.option.b.minDelta} !== ${other.option.b.minDelta}`,
  //     );
  //     matches = false;
  //   }
  //   return matches;
  // };

  public split = (): Swapping[] => {
    throw new Error("Swapping-split not implemented");
  };

  public get posteriorDirac(): Dirac {
    const oldDirac = this.diracUtxo.dirac;

    const newAnchorPrices = oldDirac.anchorPrices.clone; // TODO cloning neccessary?
    assert(
      this.option.b.newAnchor <= maxInteger,
      `b.newAnchor too high: ${this.option.b.newAnchor}`,
    );
    assert(
      this.option.s.newAnchor <= maxInteger,
      `s.newAnchor too high: ${this.option.s.newAnchor}`,
    );
    newAnchorPrices.setAmountOf(this.buyingAsset, this.option.b.newAnchor);
    newAnchorPrices.setAmountOf(this.sellingAsset, this.option.s.newAnchor);

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
    assert(
      this.paramUtxo.utxo,
      `paramUtxo.utxo must be defined`,
    );
    const oldDirac = this.diracUtxo.dirac;
    const funds = this.diracUtxo.funds.clone; // TODO cloning probably not required here
    // console.log(`funds before: ${funds.show()}`)
    funds.addAmountOf(this.buyingAsset, -this.option.deltaBuying);
    funds.addAmountOf(this.sellingAsset, this.option.deltaSelling);
    // funds.setAmountOf(Asset.ADA, max(funds.amountOf(Asset.ADA), this.paramUtxo.param.minAda)) // TODO do we need this?
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
          this.option.b.exp,
          this.option.s.exp,
        ),
      ),
    );

    const newDirac = this.posteriorDirac;
    const datum = this.diracUtxo.peuclidDatum.pconstant(
      new DiracDatum(newDirac),
    );
    const datum_ = Data.to(datum);
    const redeemer = Data.to(swapRedeemer);
    // console.log("datum:", datum_);
    // console.log("redeemer:", redeemer);
    // console.log("utxo.txHash:", this.diracUtxo.utxo.txHash);
    // console.log("utxo.outputIndex:", this.diracUtxo.utxo.outputIndex);
    // console.log("utxo.assets:", this.diracUtxo.utxo.assets);
    // console.log("utxo.address:", this.diracUtxo.utxo.address);
    // console.log("utxo.datumHash:", this.diracUtxo.utxo.datumHash);
    // console.log("utxo.datum:", this.diracUtxo.utxo.datum);
    // console.log("utxo.scriptRef:", this.diracUtxo.utxo.scriptRef);

    const tx_ = tx
      .readFrom([this.paramUtxo.utxo])
      .collectFrom(
        [this.diracUtxo.utxo],
        redeemer,
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
    variant?: SwapfindingVariant,
  ): Swapping[] => {
    console.log(`subsequents(${maxSubsequents})`);
    const swappings: Swapping[] = [this];
    let previous = swappings[0];
    let sellableAmount = this.option.s.maxDelta === "oo"
      ? -1n
      : (this.option.s.maxDelta - this.option.deltaSelling);
    let diracUtxo = this.diracUtxo.applySwapping(this);

    while (sellableAmount != 0n) {
      if (maxSubsequents !== undefined && swappings.length >= maxSubsequents) {
        break;
      }

      const subsequents = diracUtxo.swappingsFor(
        this.user,
        this.paramUtxo,
        variant ?? this.option.variant,
        applyMinAmounts ? this.option.b.minDelta : 1n,
        applyMinAmounts ? this.option.s.minDelta : 1n,
        this.minExpMults,
        this.maxExpMults,
        Value.singleton(this.sellingAsset, sellableAmount),
        Assets.singleton(this.buyingAsset),
        undefined,
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
        sellableAmount -= swapping.option.deltaSelling;
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

  // private setAvailableBuying = (availableBuying: bigint): void => {
  //   this.option.b.maxDelta = availableBuying;
  // };

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
      this.option.variant,
      applyMinAmounts ? this.option.b.minDelta : 1n,
      applyMinAmounts ? this.option.s.minDelta : 1n,
      this.minExpMults,
      this.maxExpMults,
      Value.singleton(
        this.sellingAsset,
        amntIsSold ? amount : this.option.deltaSelling,
      ),
      Assets.singleton(this.buyingAsset),
      // TODO what
      amntIsSold ? this.option.deltaBuying : amount,
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
    // if (subSwapA && !amntIsSold) {
    //   subSwapA.setAvailableBuying(amount); // per definition of a subSwap // should already be set via swappingsFor-args
    // }
    // console.log(`to (A): ${subSwapA?.show()}`);
    // const compareSubSwaps = compareVariants; // subswapB not updated to new version
    // if (compareSubSwaps) {
    //   const subSwapB = this.subSwapB(amount, amntIsSold);
    //   if (subSwapA) {
    //     assert(subSwapB, `subSwapB must be defined, but got null`);
    //     assert(
    //       subSwapA.equals(subSwapB, true, [
    //         "available",
    //         "inBuying",
    //         "minSelling",
    //       ]),
    //       `found difference in subSwap-functions:\n${subSwapA.show()}\nvs.\n${subSwapB.show()}`,
    //     );
    //     // assert(subSwapA.show() === subSwapB.show(), `SUCCESS! ... but only show()-difference:\n${subSwapA.show()}\nvs.\n${subSwapB.show()}`);
    //     // the above detects only a difference in maxBuying, so we're not using it. TODO/NOTE the other variant is correct, this one wrong
    //   } else {assert(
    //       subSwapB === null,
    //       `subSwapB must be null, but got:\n${subSwapB?.show()}`,
    //     );}
    //   return subSwapB; // NOTE this is because minBuying and available are different, subSwapB has the correct one TODO why? this a problem?
    // }

    return subSwapA;
  };

  // not updated to new version
  // private subSwapB = (
  //   amount: bigint,
  //   amntIsSold: boolean,
  //   applyMinAmounts = true, // TODO test false
  // ): Swapping | null => {
  //   console.log(`subSwapB: ${amount} ${amntIsSold ? "sold" : "bought"}`);

  //   const maxBuying = amntIsSold ? this.buyingAmnt : amount;
  //   const maxSelling = amntIsSold ? amount : this.sellingAmnt;
  //   const boughtA0 = maxBuying * this.sellingSpot;
  //   const soldA0 = maxSelling * this.buyingSpot;
  //   const swapA0 = min(boughtA0, soldA0);
  //   const buyingAmnt = swapA0 / this.sellingSpot;

  //   // console.log(`"maxBuying": ${maxBuying}`);
  //   // console.log(`"maxSelling": ${maxSelling}`);
  //   // console.log(`this.buyingSpot: ${this.buyingSpot}`);
  //   // console.log(`this.sellingSpot: ${this.sellingSpot}`);
  //   // console.log(`boughtA0: ${boughtA0}`);
  //   // console.log(`soldA0: ${soldA0}`);
  //   // console.log(`swapA0: ${swapA0}`);
  //   // console.log(`buyingAmnt: ${buyingAmnt}`);

  //   const minBuying = applyMinAmounts ? this.minBuying : 1n;
  //   if (buyingAmnt < minBuying) return null;

  //   let sellingAmnt = ceilDiv(buyingAmnt * this.sellingSpot, this.buyingSpot);
  //   const minSelling = applyMinAmounts ? this.minSelling : 1n;
  //   if (sellingAmnt < minSelling && minSelling <= maxSelling) {
  //     sellingAmnt = minSelling;
  //   }
  //   // console.log(`sellingAmnt: ${sellingAmnt}`);
  //   if (sellingAmnt < minSelling) return null;
  //   assert(
  //     sellingAmnt <= this.sellingAmnt,
  //     `sellingAmnt cannot increase: ${sellingAmnt} > ${this.sellingAmnt}`,
  //   );
  //   assert(
  //     buyingAmnt <= this.buyingAmnt,
  //     `buyingAmnt cannot increase: ${buyingAmnt} > ${this.buyingAmnt}`,
  //   );

  //   const subSwap = new Swapping(
  //     this.adhereMaxInteger,
  //     this.maxIntImpacted,
  //     this.maxExpMults,
  //     // this.expLimitImpacted,
  //     this.user,
  //     this.paramUtxo,
  //     this.diracUtxo,
  //     this.buyingAsset,
  //     this.sellingAsset,
  //     buyingAmnt,
  //     sellingAmnt,
  //     this.buyingSpot,
  //     this.sellingSpot,
  //     this.buyingExp,
  //     this.sellingExp,
  //     amntIsSold ? this.availableBuying : amount, // per definition of a subSwap
  //     amntIsSold ? amount : this.availableSelling, // per definition of a subSwap
  //     applyMinAmounts ? this.minBuying_ : 1n,
  //     applyMinAmounts ? this.minSelling : 1n,
  //     this.tmpMinBuying,
  //     true,
  //   );

  //   // console.log(`to (B): ${subSwap.show()}`);
  //   return subSwap;
  // };

  // NOTE subSwapA is only wrong regarding maxBuying
  public subSwap = this.subSwapA; //compareVariants ? this.subSwapA : this.subSwapB; // TODO profile both and pick the better one (later)

  private randomSubSwap = (): Swapping => {
    const maxSelling = this.option.deltaSelling - 1n;
    const maxBuying = this.option.deltaBuying - 1n;
    const sellingOption = maxSelling >= this.option.s.minDelta;
    const buyingOption = maxBuying >= this.option.b.minDelta;
    if (sellingOption || buyingOption) {
      for (let i = 0; i < 100; i++) {
        const amntIsSold = randomChoice([sellingOption, !buyingOption]);
        const maxAmnt = amntIsSold ? maxSelling : maxBuying;
        const minAmnt = amntIsSold
          ? this.option.s.minDelta
          : this.option.b.minDelta;
        const amount = minAmnt + genNonNegative(maxAmnt - minAmnt);
        const subSwap = this.subSwap(amount, amntIsSold);
        if (subSwap) return subSwap;
      }
    }
    console.log(
      `randomSubSwap(): failed to find a smaller subSwap for ${this.show()}`,
    );
    return this; // TODO FIXME
    // this is to test the subSwap-function
    // const subSwap = Math.random() < 0.5
    //   ? this.subSwap(this.option.deltaBuying, false)
    //   : this.subSwap(this.option.deltaSelling, true);
    // assert(
    //   subSwap,
    //   `randomSubSwap(): failed to find a subSwap for ${this.show()}`,
    // );
    // assert(
    //   this.equals(subSwap, true, ["maxDelta"]), // maxDelta changes per definition of a subSwap
    //   `subSwap with unchanged amounts should result in same Swapping, but got:\n${subSwap.show()}\nfrom\n${this.show()}`,
    // );
    // return subSwap;
  };

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

  // static exponentsYieldPrice(
  //   anchor: bigint,
  //   js: bigint,
  //   exp: bigint,
  //   spot: bigint,
  //   buySell: string,
  // ): boolean {
  //   const spot_ = calcSpot(anchor, js)(exp);

  //   if (spot !== spot_) {
  //     console.error(
  //       `exponentsYieldPrice (${buySell}):
  //       spot ${spot} != ${spot_}
  //       for anchor ${anchor}, js ${js}, exp ${exp}`,
  //     );
  //     return false;
  //   }
  //   return true;
  // }

  // static pricesFitAmm(
  //   spotBuying: bigint,
  //   spotSelling: bigint,
  //   buyingAmm: bigint,
  //   sellingAmm: bigint,
  // ): boolean {
  //   const fitsBuying = spotBuying <= buyingAmm;
  //   const fitsSelling = sellingAmm <= spotSelling;
  //   if (!fitsBuying) {
  //     console.error(
  //       `pricesFitAmm:
  //       buyingAmm  ${buyingAmm} >
  //       spotBuying ${spotBuying}`,
  //     );
  //     return false;
  //   }
  //   if (!fitsSelling) {
  //     console.error(
  //       `pricesFitAmm:
  //       sellingAmm  ${sellingAmm} >
  //       spotSelling ${spotSelling}`,
  //     );
  //     return false;
  //   }
  //   return true;
  // }

  // static valueEquation(
  //   spotBuying: bigint,
  //   spotSelling: bigint,
  //   buyingAmount: bigint,
  //   sellingAmount: bigint,
  // ): boolean {
  //   const addedBuyingA0 = buyingAmount * spotSelling;
  //   const addedSellingA0 = sellingAmount * spotBuying;

  //   if (addedBuyingA0 > addedSellingA0) {
  //     console.error(
  //       `valueEquation:
  //       addedBuyingA0  ${addedBuyingA0} >
  //       addedSellingA0 ${addedSellingA0}`,
  //     );
  //     return false;
  //   }
  //   return true;
  // }

  // public validates(): boolean {
  //   return true; // TODO not updated to new version (it's in swapfinding6 now tho)
  //   // public readonly user: User | undefined, // TODO why can this be undefined again?
  //   // public readonly paramUtxo: ParamUtxo,
  //   // public readonly diracUtxo: DiracUtxo,
  //   // public readonly buyingAsset: Asset,
  //   // public readonly sellingAsset: Asset,
  //   // public readonly buyingAmnt: bigint,
  //   // public readonly sellingAmnt: bigint,
  //   // public readonly buyingSpot: bigint, // inverted
  //   // public readonly sellingSpot: bigint, // inverted
  //   // public readonly buyingExp: bigint,
  //   // public readonly sellingExp: bigint,

  //   // const param = this.paramUtxo.param;
  //   // const buyingWeight = param.weights.amountOf(this.buyingAsset);
  //   // const sellingWeight = param.weights.amountOf(this.sellingAsset);
  //   // const jsBuying = param.jumpSizes.amountOf(this.buyingAsset);
  //   // const jsSelling = param.jumpSizes.amountOf(this.sellingAsset);
  //   // const virtualBuying = param.virtual.amountOf(this.buyingAsset);
  //   // const virtualSelling = param.virtual.amountOf(this.sellingAsset);

  //   // const dirac = this.diracUtxo.dirac;
  //   // const anchorBuying = dirac.anchorPrices.amountOf(this.buyingAsset);
  //   // const anchorSelling = dirac.anchorPrices.amountOf(this.sellingAsset);
  //   // const balanceBuying = this.diracUtxo.funds.amountOf(this.buyingAsset, 0n);
  //   // const balanceSelling = this.diracUtxo.funds.amountOf(this.sellingAsset, 0n);

  //   // const buyingLiquidity = balanceBuying + virtualBuying;
  //   // const sellingLiquidity = balanceSelling + virtualSelling;

  //   // // const oldBuyingAmm = buyingWeight * buyingLiquidity;
  //   // // const oldSellingAmm = sellingWeight * sellingLiquidity;

  //   // const newBuyingAmm = buyingWeight * (buyingLiquidity - this.buyingAmnt);
  //   // const newSellingAmm = sellingWeight * (sellingLiquidity + this.sellingAmnt);

  //   // return true &&
  //   //   // Swapping.pricesFitDirac(
  //   //   //   spotBuying,
  //   //   //   spotSelling,
  //   //   //   buyingLowest,x
  //   //   //   sellingLowest,
  //   //   //   buyingJumpSize,
  //   //   //   sellingJumpSize,
  //   //   // ) &&
  //   //   Swapping.exponentsYieldPrice(
  //   //     anchorBuying,
  //   //     jsBuying,
  //   //     this.buyingExp,
  //   //     this.newAnchorBuying,
  //   //     "buying",
  //   //   ) &&
  //   //   Swapping.exponentsYieldPrice(
  //   //     anchorSelling,
  //   //     jsSelling,
  //   //     this.sellingExp,
  //   //     this.newAnchorSelling,
  //   //     "selling",
  //   //   ) &&
  //   //   Swapping.pricesFitAmm(
  //   //     this.buyingSpot,
  //   //     this.sellingSpot,
  //   //     newBuyingAmm,
  //   //     newSellingAmm,
  //   //   ) &&
  //   //   Swapping.valueEquation(
  //   //     this.buyingSpot,
  //   //     this.sellingSpot,
  //   //     this.buyingAmnt,
  //   //     this.sellingAmnt,
  //   //   );
  //   // // TODO othersUnchanged - con: this is implicit
  // }

  // try to make it wrong with minimal changes
  public corruptAll = (): Swapping[] => {
    if (this.option.variant.accuracy !== "exact") return [];
    const corrupted_: (Swapping | null)[] = [];
    for (const random of [false, true]) {
      let corrupted = [
        this.corruptSoldAmnt(random),
        this.corruptBoughtAmnt(random),
      ];

      for (let i = 0; i < 3; i++) {
        corrupted = corrupted.flatMap((s) =>
          s
            ? [
              s,
              s.corruptSoldAmnt(random),
              s.corruptBoughtAmnt(random),
              s.corruptSoldExp(random),
              s.corruptBoughtExp(random),
            ]
            : []
        );
        corrupted_.push(...corrupted);
      }
    }
    return corrupted_.filter((s) => s) as Swapping[];

    // const corruptSoldAmnt = this.corruptSoldAmnt(false)
    // const corruptBoughtAmnt = this.corruptBoughtAmnt(false)

    // return [
    //   // this.corruptBoughtSpot(), // TODO revert resp. check anchor-corruption instead
    //   // this.corruptSoldSpot(),

    //   // we pretend for now this doesn't matter, as we've found them while
    //   // optimizing for effective price. Therefore we only check if they
    //   /// can give us better amounts (below)
    //   // this.corruptSoldExp(false),
    //   // this.corruptBoughtExp(false),
    //   // this.corruptSoldExp(true),
    //   // this.corruptBoughtExp(true),

    //   corruptSoldAmnt?.corruptSoldExp(false),
    //   corruptSoldAmnt?.corruptBoughtExp(false),
    //   corruptBoughtAmnt?.corruptSoldExp(false),
    //   corruptBoughtAmnt?.corruptBoughtExp(false),

    //   // this.corruptSoldExp(false)?.corruptBoughtExp(false), // TODO more random combinations
    //   // this.corruptBoughtExp(false)?.corruptSoldExp(false),
    //   // this.corruptSoldExp(true)?.corruptBoughtExp(true),
    //   // this.corruptBoughtExp(true)?.corruptSoldExp(true),

    //   corruptSoldAmnt,
    //   corruptBoughtAmnt,
    //   this.corruptSoldAmnt(true),
    //   this.corruptBoughtAmnt(true),
    //   // TODO revert from time to time. and add exp-corruption
    //   // this.corruptSoldAmnt(true),
    //   // this.corruptBoughtAmnt(true),
    //   // this.corruptSoldAmnt(true),
    //   // this.corruptBoughtAmnt(true),
    //   // this.corruptSoldAmnt(true),
    //   // this.corruptBoughtAmnt(true),
    //   // this.corruptSoldAmnt(true),
    //   // this.corruptBoughtAmnt(true),
    // ].filter((s) => s) as Swapping[];
  };

  public corruptBoughtAmnt = (random: boolean): Swapping | null => {
    console.log(`trying to corrupt bought amount...\nof ${this.show()}`);
    if (this.option.deltaBuying === this.option.b.maxDelta) return null;
    assert(this.option.b.maxDelta !== "oo");
    const amnt = random
      ? genPositive(this.option.b.maxDelta - this.option.deltaBuying)
      : 1n;
    console.log(`... by ${amnt}`);
    const boughtTooMuch = new Swapping(
      this.user, // webapp needs undefined iirc
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      this.option.corrupted(
        this.option.deltaBuying + amnt,
        this.option.deltaSelling,
        this.option.b.exp,
        this.option.s.exp,
        maxInteger,
      ),
      this.maxIntImpacted,
      this.minExpMults,
      this.maxExpMults,
      [...this.corruptions, `boughtAmnt ${amnt}`],
      // false, // corruption-test-swappings don't run tests themselves.
    );

    console.log(`returning corruptBoughtAmnt`);
    return boughtTooMuch;
  };

  public corruptSoldAmnt = (random: boolean): Swapping | null => {
    console.log(`trying to corrupt sold amount...\nof ${this.show()}`);
    if (this.option.deltaSelling === this.option.s.minDelta) return null;
    const amnt = random
      ? genPositive(this.option.deltaSelling - this.option.s.minDelta)
      : 1n;
    console.log(`... by ${amnt}`);
    const soldTooLittle = new Swapping(
      this.user, // webapp needs undefined iirc
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      this.option.corrupted(
        this.option.deltaBuying,
        this.option.deltaSelling - amnt,
        this.option.b.exp,
        this.option.s.exp,
        maxInteger,
      ),
      this.maxIntImpacted,
      this.minExpMults,
      this.maxExpMults,
      [...this.corruptions, `soldAmnt ${amnt}`],
      // false, // corruption-test-swappings don't run tests themselves.
    );
    console.log(`returning corruptSoldAmnt`);
    return soldTooLittle;
  };

  public corruptBoughtExp = (random: boolean): Swapping | null => {
    console.log(`trying to corrupt bought exp...\nof ${this.show()}`);
    if (this.option.b.exp === 0n) return null;
    const amnt = random ? genPositive(this.option.b.exp) : 1n;
    console.log(`... by ${amnt}`);
    const maxExpMults = this.maxExpMults - this.option.s.mults;
    let exp = this.option.b.exp - amnt;
    while (true) {
      if (countMults(exp) > maxExpMults) {
        if (exp === 0n) return null;
        else exp--;
      } else break;
    }
    const boughtExpTooSmall = new Swapping(
      this.user, // webapp needs undefined iirc
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      this.option.corrupted(
        this.option.deltaBuying,
        this.option.deltaSelling,
        exp,
        this.option.s.exp,
        maxInteger,
      ),
      this.maxIntImpacted,
      this.minExpMults,
      this.maxExpMults,
      [...this.corruptions, `boughtExp ${amnt}`],
      // false, // corruption-test-swappings don't run tests themselves.
    );

    console.log(`returning corruptBoughtExp`);
    return boughtExpTooSmall;
  };

  public corruptSoldExp = (random: boolean): Swapping | null => {
    console.log(`trying to corrupt sold exp...\nof ${this.show()}`);
    if (this.option.s.exp === 0n) return null;
    const amnt = random ? genPositive(this.option.s.exp) : 1n;
    console.log(`... by ${amnt}`);
    const maxExpMults = this.maxExpMults - this.option.b.mults;
    let exp = this.option.s.exp - amnt;
    while (true) {
      if (countMults(exp) > maxExpMults) {
        if (exp === 0n) return null;
        else exp--;
      } else break;
    }
    const soldExpTooSmall = new Swapping(
      this.user, // webapp needs undefined iirc
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      this.option.corrupted(
        this.option.deltaBuying,
        this.option.deltaSelling,
        this.option.b.exp,
        exp,
        maxInteger,
      ),
      this.maxIntImpacted,
      this.minExpMults,
      this.maxExpMults,
      [...this.corruptions, `soldExp ${amnt}`],
      // false, // corruption-test-swappings don't run tests themselves.
    );

    console.log(`returning corruptSoldExp`);
    return soldExpTooSmall;
  };

  // private calcSpot = (buySell: "buying" | "selling"): (s: bigint) => bigint => {
  //   const param = this.paramUtxo.param;
  //   const dirac = this.diracUtxo.dirac;
  //   const asset = buySell === "buying" ? this.buyingAsset : this.sellingAsset;
  //   const anchor = dirac.anchorPrices.amountOf(asset);
  //   const js = param.jumpSizes.amountOf(asset);
  //   return calcSpot(anchor, js);
  // };

  // TODO not updated to new version
  // public corruptBoughtSpot = (nested = 0): Swapping | null => {
  //   console.log("corrupting bought spot...");

  //   let buyingExp = this.buyingExp;
  //   let sellingExp = this.sellingExp;
  //   let buyingSpot = this.buyingSpot;
  //   let sellingSpot = this.sellingSpot;
  //   const calcBuyingSpot = this.calcSpot("buying");
  //   while (buyingSpot <= this.buyingSpot) {
  //     buyingExp++;
  //     buyingSpot = calcBuyingSpot(buyingExp);
  //   }
  //   if (this.maxExpMults !== null) {
  //     const calcSellingSpot = this.calcSpot("selling");
  //     while (true) {
  //       const fittedExps = fitExpLimit({
  //         adhereMaxInteger: this.adhereMaxInteger,
  //         maxExpMults: this.maxExpMults,
  //         buyingExp,
  //         sellingExp,
  //         maxBuying: this.availableBuying,
  //         maxSelling: this.availableSelling,
  //         calcBuyingSpot,
  //         calcSellingSpot,
  //         // minSelling: this.minSelling,
  //       });
  //       if (fittedExps === null) return null;
  //       else if (fittedExps === "unchanged") break;
  //       else {
  //         const newBuyingSpot = calcBuyingSpot(fittedExps.buyingExp);
  //         if (newBuyingSpot <= this.buyingSpot) {
  //           buyingExp++;
  //         } else {
  //           buyingExp = fittedExps.buyingExp;
  //           sellingExp = fittedExps.sellingExp;
  //           buyingSpot = newBuyingSpot;
  //           sellingSpot = calcSellingSpot(fittedExps.sellingExp);
  //           break;
  //         }
  //       }
  //     }
  //   }

  //   // NOTE prices are inverted
  //   assert(
  //     buyingSpot > this.buyingSpot,
  //     `seems like buyingExp is being changed in the wrong direction`,
  //   );

  //   if (
  //     buyingSpot > 0n && (!this.adhereMaxInteger || buyingSpot <= maxInteger)
  //   ) {
  //     const buyingSpotTooHigh = this.corrupted(
  //       this.buyingAmnt,
  //       this.sellingAmnt,
  //       buyingSpot,
  //       sellingSpot,
  //       buyingExp,
  //       sellingExp,
  //     );

  //     if (buyingSpotTooHigh.validates()) {
  //       // console.log(`bought spot corruption succeeded: ${nested}`);
  //       // buyingSpotTooHigh.corruptBoughtSpot(nested + 1);
  //       // if (
  //       //   !this.sellingAsset.equals(Asset.ADA) || nested >= sellingADAtolerance
  //       // ) {
  //       throw new Error(
  //         `raising inverted buying price should fail offchain validation: ${this.show()}\n~~~>\n${buyingSpotTooHigh.show()}`,
  //       );
  //       // }
  //     } else console.log(`bought spot corruption failed: ${nested}`);

  //     // TODO FIXME (not urgent, it never failed)
  //     // assert(
  //     //   Swapping.exponentsYieldPrice(
  //     //     anchorBuying,
  //     //     jsBuying,
  //     //     buyingExp,
  //     //     buyingSpot,
  //     //     "buying",
  //     //   ),
  //     //   `buyingSpotTooHigh should still yield the correct price: ${buyingSpotTooHigh.show()}`,
  //     // );
  //     console.log(`returning corruptBoughtSpot`);
  //     return buyingSpotTooHigh;
  //   } else return null;
  // };

  // public corruptSoldSpot = (nested = 0): Swapping | null => {
  //   console.log("corrupting sold spot...");

  //   let buyingExp = this.buyingExp;
  //   let sellingExp = this.sellingExp;
  //   let buyingSpot = this.buyingSpot;
  //   let sellingSpot = this.sellingSpot;
  //   const calcSellingSpot = this.calcSpot("selling");
  //   while (sellingSpot >= this.sellingSpot) {
  //     sellingExp--;
  //     sellingSpot = calcSellingSpot(sellingExp);
  //   }
  //   if (this.maxExpMults !== null) {
  //     const calcBuyingSpot = this.calcSpot("buying");
  //     while (true) {
  //       const fittedExps = fitExpLimit({
  //         adhereMaxInteger: this.adhereMaxInteger,
  //         maxExpMults: this.maxExpMults,
  //         buyingExp,
  //         sellingExp,
  //         maxBuying: this.availableBuying,
  //         maxSelling: this.availableSelling,
  //         calcBuyingSpot,
  //         calcSellingSpot,
  //         // minSelling: this.minSelling,
  //       });
  //       if (fittedExps === null) return null;
  //       else if (fittedExps === "unchanged") break;
  //       else {
  //         const newSellingSpot = calcSellingSpot(fittedExps.sellingExp);
  //         if (newSellingSpot >= this.sellingSpot) {
  //           sellingExp--;
  //         } else {
  //           buyingExp = fittedExps.buyingExp;
  //           sellingExp = fittedExps.sellingExp;
  //           buyingSpot = calcBuyingSpot(fittedExps.buyingExp);
  //           sellingSpot = newSellingSpot;
  //           break;
  //         }
  //       }
  //     }
  //   }

  //   // NOTE prices are inverted
  //   assert(
  //     sellingSpot < this.sellingSpot,
  //     `seems like sellingExp is being changed in the wrong direction`,
  //   );

  //   if (
  //     sellingSpot > 0n &&
  //     (!this.adhereMaxInteger || sellingSpot <= maxInteger)
  //   ) {
  //     const buyingA0 = this.buyingAmnt * sellingSpot;
  //     const sellingA0 = this.sellingAmnt * this.buyingSpot;
  //     const swapA0 = min(sellingA0, buyingA0);
  //     if (swapA0 < sellingSpot) return null;

  //     const sellingSpotTooLow = this.corrupted(
  //       this.buyingAmnt,
  //       this.sellingAmnt,
  //       buyingSpot,
  //       sellingSpot,
  //       buyingExp,
  //       sellingExp,
  //     );

  //     if (sellingSpotTooLow.validates()) {
  //       // console.log(`sold spot corruption succeeded: ${nested}`);
  //       // sellingSpotTooLow.corruptSoldSpot(nested + 1);
  //       // if (
  //       //   !this.sellingAsset.equals(Asset.ADA) || nested >= sellingADAtolerance
  //       // ) {
  //       throw new Error(
  //         `lowering inverted selling price should fail offchain validation: ${this.show()}\n~~~>\n${sellingSpotTooLow.show()}`,
  //       );
  //       // }
  //     } else console.log(`sold spot corruption failed: ${nested}`);

  //     // TODO FIXME (not urgent, it never failed)
  //     // assert(
  //     //   Swapping.exponentsYieldPrice(
  //     //     anchorSelling,
  //     //     jsSelling,
  //     //     sellingExp,
  //     //     sellingSpot,
  //     //     "selling",
  //     //   ),
  //     //   `sellingSpotTooLow should still yield the correct price: ${sellingSpotTooLow.show()}`,
  //     // );
  //     console.log(`returning corruptSoldSpot`);
  //     return sellingSpotTooLow;
  //   } else return null;
  // };
}
