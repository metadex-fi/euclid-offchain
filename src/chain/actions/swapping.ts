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
  genNonNegative,
  genPositive,
  maybeNdef,
  min,
  randomChoice,
} from "../../utils/generators.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";
import { Value } from "../../types/general/derived/value/value.ts";
import { Assets } from "../../types/general/derived/asset/assets.ts";
import { Dirac } from "../../types/euclid/dirac.ts";
import { calcSpot, countMultiplications } from "./swapfinding/helpers.ts";
import { fitExpLimit } from "./swapfinding/fitExpLimit.ts";
import {
  compareVariants,
  maxInteger,
  webappExpLimit,
} from "../../utils/constants.ts";

// const sellingADAtolerance = 0;

// export interface SwappingArgs {
//   readonly adhereMaxInteger: boolean,
//   readonly maxIntImpacted: boolean,
//   readonly expLimit: number | null,
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
  // public readonly spotPrice: number; // uninverted
  public readonly effectivePrice: number; // uninverted
  public previous?: Swapping;
  public subsequent?: Swapping;

  private constructor(
    public readonly adhereMaxInteger: boolean,
    public readonly maxIntImpacted: boolean,
    public readonly expLimit: number | null,
    public readonly expLimitImpacted: boolean,
    public readonly user: User | null, // webapp needs undefined iirc
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxo: DiracUtxo,
    public readonly buyingAsset: Asset,
    public readonly sellingAsset: Asset,
    public readonly buyingAmnt: bigint,
    public readonly sellingAmnt: bigint,
    // public readonly buyingSpot: bigint, // inverted
    // public readonly sellingSpot: bigint, // inverted
    public readonly exponent: bigint,
    private availableBuying: bigint, // for corruption-tests (cannot be taken from dirac because of subSwaps)
    private readonly availableSelling: bigint | null, // for corruption-tests (cannot be left null or taken from user because of subSwaps). Null means no limit
    private readonly minBuying_: bigint,
    private readonly minSelling: bigint,
    private readonly tmpMinBuying: bigint | null, // for optimiziation. Need to store this to make corruption-tests pass
    runTests: boolean, // corruption-test-swappings don't run tests themselves.
  ) {
    assert(
      buyingAmnt <= availableBuying,
      `buyingAmnt must be less than or equal to availableBuying: ${this.show()}`,
    );
    assert(
      availableSelling === null || sellingAmnt <= availableSelling,
      `sellingAmnt must be less than or equal to availableSelling: ${this.show()}`,
    );
    assert(
      buyingAmnt >= this.minBuying,
      `buyingAmnt too low: ${this.show()}`,
    );
    assert(
      sellingAmnt >= minSelling,
      `sellingAmnt too low: ${this.show()}`,
    );
    // assert(
    //   buyingSpot > 0n,
    //   `buyingSpot must be positive: ${this.show()}`,
    // );
    // assert(
    //   sellingSpot > 0n,
    //   `sellingSpot must be positive: ${this.show()}`,
    // );
    // assert(
    //   (!adhereMaxInteger) || buyingSpot <= maxInteger,
    //   `buyingSpot must be <= maxInteger: ${this.show()}`,
    // );
    // assert(
    //   (!adhereMaxInteger) || sellingSpot <= maxInteger,
    //   `sellingSpot must be <= maxInteger: ${this.show()}`,
    // );
    assert(
      minBuying_ > 0n,
      `minBuying must be positive: ${this.show()}`,
    );
    assert(
      tmpMinBuying === null || minBuying_ <= tmpMinBuying,
      `tmpMinBuying must be <= minBuying: ${this.show()}`,
    );
    assert(
      minSelling > 0n,
      `minSelling must be positive: ${this.show()}`,
    );
    if (user) {
      assert(
        availableSelling !== null &&
          availableSelling <= user.balance!.amountOf(sellingAsset),
        `availableSelling must be less than or equal to the available balance: ${this.show()}`,
      );
    }
    if (expLimit !== null) {
      const mults = countMultiplications(Number(exponent));
      assert(
        mults <= expLimit,
        `exponents must have ${mults} <= ${expLimit} multiplications: ${this.show()}`,
      );
    }

    // this.spotPrice = Number(sellingSpot) / Number(buyingSpot);
    this.effectivePrice = Number(sellingAmnt) / Number(buyingAmnt);

    if (runTests) {
      // assert(
      //   this.spotPrice <= this.effectivePrice,
      //   `spotPrice > effectivePrice: ${this.show()}`,
      // );
      assert(this.validates(), `Swapping does not validate: ${this.show()}`);
    }
  }

  private get minBuying(): bigint {
    return this.tmpMinBuying ?? this.minBuying_;
  }

  public get type(): string {
    return "Swapping";
  }

  static boundary(
    adhereMaxInteger: boolean,
    maxIntImpacted: boolean,
    expLimit: number | null,
    expLimitImpacted: boolean,
    user: User | null,
    paramUtxo: ParamUtxo,
    diracUtxo: DiracUtxo,
    buyingAsset: Asset,
    sellingAsset: Asset,
    buyingAmnt: bigint,
    sellingAmnt: bigint,
    // buyingSpot: bigint,
    // sellingSpot: bigint,
    exponent: bigint,
    availableBuying: bigint,
    availableSelling: bigint,
    minBuying: bigint,
    minSelling: bigint,
    tmpMinBuying: bigint | null,
  ): Swapping {
    console.log(`Swapping.boundary()`);
    return new Swapping(
      adhereMaxInteger,
      maxIntImpacted,
      expLimit,
      expLimitImpacted,
      user,
      paramUtxo,
      diracUtxo,
      buyingAsset,
      sellingAsset,
      buyingAmnt,
      sellingAmnt,
      // buyingSpot,
      // sellingSpot,
      exponent,
      availableBuying, //diracUtxo.available.amountOf(buyingAsset),
      availableSelling === -1n ? null : availableSelling, //user ? user.availableBalance!.amountOf(sellingAsset) : null,
      minBuying,
      minSelling,
      tmpMinBuying,
      true,
    );
  }

  // TODO don't forget to update (poll) chain state somewhere beforehand
  static genOfUser(user: User): Swapping | null {
    // console.log(`attempting to swap`);
    let swappings: Swapping[] = [];
    // TODO probably too much
    for (let i = maxInteger; i > 1n; i /= 10n) {
      swappings = user.contract!.state!.swappingsFor(
        true,
        user,
        maybeNdef(genPositive(i)),
        maybeNdef(genPositive(i)),
        randomChoice([
          undefined,
          // webappExpLimit, // TODO revery
          // Number(genPositive(50n)),
          // Number(genPositive()),
        ]),
      );
      if (swappings.length > 0) break;
    }
    // console.log(`\tswappings: ${swappings}`);
    if (swappings.length < 1) return null;
    // console.log(`Swapping`);
    const choice = randomChoice(swappings);
    return choice; // TODO revert
    if (Math.random() < 0.5) return choice;
    else return choice.randomSubSwap();
  }

  public show = (): string => {
    // expLimitImpacted: ${this.expLimitImpacted}
    // buyingSpot:       ${this.buyingSpot}
    // sellingSpot:      ${this.sellingSpot}
    // buyingExp:        ${this.buyingExp}
    // sellingExp:       ${this.sellingExp}
    // (buyingA0:        ${Number(this.buyingAmnt) / Number(this.buyingSpot)})
    // (sellingA0:       ${Number(this.sellingAmnt) / Number(this.sellingSpot)})
    // buyingExpMults:   ${countMultiplications(Number(this.buyingExp))}
    // sellingExpMults:  ${countMultiplications(Number(this.sellingExp))}
    // spotPrice:        ${this.spotPrice}
    return `Swapping (
  adhereMaxInteger: ${this.adhereMaxInteger}
  maxIntImpacted:   ${this.maxIntImpacted}
  expLimit:         ${this.expLimit}
  paramUtxo: ${this.paramUtxo.show()}
  diracUtxo: ${this.diracUtxo.show()}
  buyingAsset:      ${this.buyingAsset.show()}
  sellingAsset:     ${this.sellingAsset.show()}
  buyingAmnt:       ${this.buyingAmnt}
  sellingAmnt:      ${this.sellingAmnt}
  eff.Price:        ${this.effectivePrice}
  availableBuying:  ${this.availableBuying}
  availableSelling: ${this.availableSelling}
  minBuying:        ${this.minBuying_}
  minSelling:       ${this.minSelling}
  tmpMinBuying:     ${this.tmpMinBuying}
  )`;
    // (maxBuyingA0: ${this.maxBuying * this.sellingSpot})
  };

  public equals = (
    other: Swapping,
    compareMinSoft: boolean,
    ignore: string[],
  ): boolean => {
    const as = this.show().split("\n");
    const bs = other.show().split("\n");

    if (as.length !== bs.length) {
      console.log(`mismatch in length: ${as.length} !== ${bs.length}`);
      return false;
    }
    for (let i = 0; i < as.length; i++) {
      const a = as[i];
      const b = bs[i];
      if (!compareMinSoft && a.includes("minSelling")) continue;

      let skip = false;
      for (const ign of ignore) {
        if (a.includes(ign)) {
          skip = true;
          break;
        }
      }
      if (skip) continue;
      if (a !== b) {
        console.log(`mismatch: ${a} !== ${b}`);
        return false;
      }
    }
    if (compareMinSoft && this.minBuying !== other.minBuying) {
      console.log(
        `mismatch in minBuying: ${this.minBuying} !== ${other.minBuying}`,
      );
      return false;
    }
    return true;
  };

  public split = (): Swapping[] => {
    throw new Error("Swapping-split not implemented");
  };

  public get posteriorDirac(): Dirac {
    const oldDirac = this.diracUtxo.dirac;

    const newAnchorPrices = oldDirac.anchorPrices.clone; // TODO cloning neccessary?
    const js = this.paramUtxo.param.jumpSize;
    const jspp = js + 1n;
    const exp = this.exponent;
    const jse = exp >= 0n ? js ** exp : jspp ** -exp;
    const jsppe = exp >= 0n ? jspp ** exp : js ** -exp;
    const oldAnchorBuying = oldDirac.anchorPrices.amountOf(this.buyingAsset);
    const oldAnchorSelling = oldDirac.anchorPrices.amountOf(this.sellingAsset);
    const newAnchorBuying = (oldAnchorBuying * jsppe) / jse;
    const newAnchorSelling = (oldAnchorSelling * jsppe) / jse;
    newAnchorPrices.setAmountOf(this.buyingAsset, newAnchorBuying);
    newAnchorPrices.setAmountOf(this.sellingAsset, newAnchorSelling);

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
          this.exponent,
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
  ): Swapping[] => {
    console.log(`subsequents(${maxSubsequents})`);
    const swappings: Swapping[] = [this];
    let previous = swappings[0];
    let sellableAmount = this.availableSelling === null
      ? -1n
      : (this.availableSelling - this.sellingAmnt);
    let diracUtxo = this.diracUtxo.applySwapping(this);

    while (sellableAmount != 0n) {
      if (maxSubsequents !== undefined && swappings.length >= maxSubsequents) {
        break;
      }

      const subsequents = diracUtxo.swappingsFor(
        this.adhereMaxInteger,
        this.user,
        this.paramUtxo,
        true,
        applyMinAmounts ? this.minBuying : undefined,
        applyMinAmounts ? this.minSelling : undefined,
        Value.singleton(this.sellingAsset, sellableAmount),
        Assets.singleton(this.buyingAsset),
        undefined,
        this.expLimit ?? undefined,
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

  private setAvailableBuying = (availableBuying: bigint): void => {
    this.availableBuying = availableBuying;
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
      this.adhereMaxInteger,
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
      this.expLimit ?? undefined,
    );
    assert(
      swappings.length <= 1,
      `swappings.length must be <= 1, but got:\n${
        swappings.map((s) => s.show()).join("\n")
      }`,
    );
    const subSwapA = swappings.length > 0 ? swappings[0] : null;
    if (subSwapA) {
      subSwapA.setAvailableBuying(amntIsSold ? this.availableBuying : amount); // per definition of a subSwap
    }
    // console.log(`to (A): ${subSwapA?.show()}`);
    const compareSubSwaps = compareVariants;
    if (compareSubSwaps) {
      const subSwapB = this.subSwapB(amount, amntIsSold);
      if (subSwapA) {
        assert(subSwapB, `subSwapB must be defined, but got null`);
        assert(
          subSwapA.equals(subSwapB, true, [
            "available",
            "inBuying",
            "minSelling",
          ]),
          `found difference in subSwap-functions:\n${subSwapA.show()}\nvs.\n${subSwapB.show()}`,
        );
        // assert(subSwapA.show() === subSwapB.show(), `SUCCESS! ... but only show()-difference:\n${subSwapA.show()}\nvs.\n${subSwapB.show()}`);
        // the above detects only a difference in maxBuying, so we're not using it. TODO/NOTE the other variant is correct, this one wrong
      } else {assert(
          subSwapB === null,
          `subSwapB must be null, but got:\n${subSwapB?.show()}`,
        );}
      return subSwapB; // NOTE this is because minBuying and available are different, subSwapB has the correct one TODO why? this a problem?
    }

    return subSwapA;
  };

  private subSwapB = (
    amount: bigint,
    amntIsSold: boolean,
    applyMinAmounts = true, // TODO test false
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

    const minBuying = applyMinAmounts ? this.minBuying : 1n;
    if (buyingAmnt < minBuying) return null;

    let sellingAmnt = ceilDiv(buyingAmnt * this.sellingSpot, this.buyingSpot);
    const minSelling = applyMinAmounts ? this.minSelling : 1n;
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
      this.adhereMaxInteger,
      this.maxIntImpacted,
      this.expLimit,
      this.expLimitImpacted,
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      buyingAmnt,
      sellingAmnt,
      this.buyingSpot,
      this.sellingSpot,
      this.exponent,
      amntIsSold ? this.availableBuying : amount, // per definition of a subSwap
      amntIsSold ? amount : this.availableSelling, // per definition of a subSwap
      applyMinAmounts ? this.minBuying_ : 1n,
      applyMinAmounts ? this.minSelling : 1n,
      this.tmpMinBuying,
      true,
    );

    // console.log(`to (B): ${subSwap.show()}`);
    return subSwap;
  };

  // NOTE subSwapA is only wrong regarding maxBuying
  public subSwap = compareVariants ? this.subSwapA : this.subSwapB; // TODO profile both and pick the better one (later)

  private randomSubSwap = (): Swapping => {
    const maxSelling = this.sellingAmnt - 1n;
    const maxBuying = this.buyingAmnt - 1n;
    const sellingOption = maxSelling >= this.minSelling;
    const buyingOption = maxBuying >= this.minBuying;
    if (sellingOption || buyingOption) {
      for (let i = 0; i < 100; i++) {
        const amntIsSold = randomChoice([sellingOption, !buyingOption]);
        const maxAmnt = amntIsSold ? maxSelling : maxBuying;
        const minAmnt = amntIsSold ? this.minSelling : this.minBuying;
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
      this.equals(subSwap, true, ["available"]), // available changes per definition of a subSwap
      `subSwap with unchanged amounts should result in same Swapping, but got:\n${subSwap.show()}\nfrom\n${this.show()}`,
    );
    return subSwap;
  };

  // TODO update to single jumpSize/Exponent version
  public validates(): boolean {
    const param = this.paramUtxo.param;
    const buyingWeight = param.weights.amountOf(this.buyingAsset);
    const sellingWeight = param.weights.amountOf(this.sellingAsset);
    const virtualBuying = param.virtual.amountOf(this.buyingAsset);
    const virtualSelling = param.virtual.amountOf(this.sellingAsset);

    const dirac = this.diracUtxo.dirac;
    const anchorBuying = dirac.anchorPrices.amountOf(this.buyingAsset);
    const anchorSelling = dirac.anchorPrices.amountOf(this.sellingAsset);
    const balanceBuying = this.diracUtxo.funds.amountOf(this.buyingAsset, 0n);
    const balanceSelling = this.diracUtxo.funds.amountOf(this.sellingAsset, 0n);

    const buyingLiquidity = balanceBuying + virtualBuying;
    const sellingLiquidity = balanceSelling + virtualSelling;

    const newBuyingAmm = buyingWeight * (buyingLiquidity - this.buyingAmnt);
    const newSellingAmm = sellingWeight * (sellingLiquidity + this.sellingAmnt);

    const exp = this.exponent;
    const js = param.jumpSize;
    const jspp = js + 1n;
    const jse = exp >= 0n ? js ** exp : jspp ** -exp;
    const jsppe = exp >= 0n ? jspp ** exp : js ** -exp;

    const pricesFitBuying = anchorBuying * jsppe <= newBuyingAmm * jse;
    const pricesFitSelling = anchorSelling * jsppe >= newSellingAmm * jse;
    const valueEquation = this.sellingAmnt * anchorBuying * jse <=
      this.buyingAmnt * anchorSelling * jsppe;

    return pricesFitBuying && pricesFitSelling && valueEquation;
  }

  // try to make it wrong with minimal changes
  // public corruptAll = (): Swapping[] => {
  //   return [
  //     this.corruptBoughtSpot(), // TODO revert
  //     this.corruptSoldSpot(),

  //     this.corruptSoldAmnt(false),
  //     this.corruptBoughtAmnt(false),
  //     // TODO revert from time to time
  //     this.corruptSoldAmnt(true),
  //     this.corruptBoughtAmnt(true),
  //     // this.corruptSoldAmnt(true),
  //     // this.corruptBoughtAmnt(true),
  //     // this.corruptSoldAmnt(true),
  //     // this.corruptBoughtAmnt(true),
  //     // this.corruptSoldAmnt(true),
  //     // this.corruptBoughtAmnt(true),
  //     // this.corruptSoldAmnt(true),
  //     // this.corruptBoughtAmnt(true),
  //   ].filter((s) => s) as Swapping[];
  // };

  // private corrupted = (
  //   buyingAmnt: bigint,
  //   sellingAmnt: bigint,
  //   buyingSpot: bigint,
  //   sellingSpot: bigint,
  //   exponent: bigint,
  // ): Swapping => {
  //   console.log(`Swapping.corrupted()`);
  //   return new Swapping(
  //     this.adhereMaxInteger,
  //     this.maxIntImpacted,
  //     this.expLimit,
  //     this.expLimitImpacted,
  //     this.user,
  //     this.paramUtxo,
  //     this.diracUtxo,
  //     this.buyingAsset,
  //     this.sellingAsset,
  //     buyingAmnt,
  //     sellingAmnt,
  //     buyingSpot,
  //     sellingSpot,
  //     exponent,
  //     this.availableBuying,
  //     this.availableSelling,
  //     this.minBuying_,
  //     this.minSelling,
  //     this.tmpMinBuying,
  //     false,
  //   );
  // };

  // public corruptBoughtAmnt = (random: boolean): Swapping | null => {
  //   console.log(`trying to corrupt bought amount...`);
  //   if (this.buyingAmnt === this.availableBuying) return null;
  //   const amnt = random
  //     ? genPositive(this.availableBuying - this.buyingAmnt)
  //     : 1n;
  //   console.log(`... by ${amnt}`);
  //   const boughtTooMuch = this.corrupted(
  //     this.buyingAmnt + amnt,
  //     this.sellingAmnt,
  //     this.buyingSpot,
  //     this.sellingSpot,
  //     this.exponent,
  //   );
  //   assert(
  //     !boughtTooMuch.validates(),
  //     `buying ${amnt} more should fail offchain validation: ${this.show()}\n~~~>\n${boughtTooMuch.show()}`,
  //   );
  //   console.log(`returning corruptBoughtAmnt`);
  //   return boughtTooMuch;
  // };

  // public corruptSoldAmnt = (random: boolean): Swapping | null => {
  //   console.log(`trying to corrupt sold amount...`);
  //   if (this.sellingAmnt === this.minSelling) return null;
  //   const amnt = random ? genPositive(this.sellingAmnt - this.minSelling) : 1n;
  //   console.log(`... by ${amnt}`);
  //   const soldTooLittle = this.corrupted(
  //     this.buyingAmnt,
  //     this.sellingAmnt - amnt,
  //     this.buyingSpot,
  //     this.sellingSpot,
  //     this.exponent,
  //   );
  //   assert(
  //     !soldTooLittle.validates(),
  //     `selling ${amnt} less should fail offchain validation: ${this.show()}\n~~~>\n${soldTooLittle.show()}`,
  //   );
  //   console.log(`returning corruptSoldAmnt`);
  //   return soldTooLittle;
  // };

  // private calcSpot = (buySell: "buying" | "selling"): (s: bigint) => bigint => {
  //   const param = this.paramUtxo.param;
  //   const dirac = this.diracUtxo.dirac;
  //   const asset = buySell === "buying" ? this.buyingAsset : this.sellingAsset;
  //   const anchor = dirac.anchorPrices.amountOf(asset);
  //   const js = param.jumpSize;
  //   return calcSpot(anchor, js);
  // };

  // public corruptBoughtSpot = (nested = 0): Swapping | null => {
  //   console.log("corrupting bought spot...");

  //   let exponent = this.exponent;
  //   let buyingSpot = this.buyingSpot;
  //   let sellingSpot = this.sellingSpot;
  //   const calcBuyingSpot = this.calcSpot("buying");
  //   while (buyingSpot <= this.buyingSpot) {
  //     exponent++;
  //     buyingSpot = calcBuyingSpot(exponent);
  //   }
  //   if (this.expLimit !== null) {
  //     const calcSellingSpot = this.calcSpot("selling");
  //     while (true) {
  //       const fittedExps = fitExpLimit({
  //         adhereMaxInteger: this.adhereMaxInteger,
  //         expLimit: this.expLimit,
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

  //   let exponent = this.exponent;
  //   let buyingSpot = this.buyingSpot;
  //   let sellingSpot = this.sellingSpot;
  //   const calcSellingSpot = this.calcSpot("selling");
  //   while (sellingSpot >= this.sellingSpot) {
  //     exponent--;
  //     sellingSpot = calcSellingSpot(exponent);
  //   }
  //   if (this.expLimit !== null) {
  //     const calcBuyingSpot = this.calcSpot("buying");
  //     while (true) {
  //       const fittedExps = fitExpLimit({
  //         adhereMaxInteger: this.adhereMaxInteger,
  //         expLimit: this.expLimit,
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
