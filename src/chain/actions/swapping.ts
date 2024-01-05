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
  // maxSubSwappings,
  globalExpLimit,
  gMaxLength,
  maxInteger,
} from "../../utils/constants.ts";
import {
  bestMultsAhead,
  countMults,
  PairOption,
  PairOptions,
  SwapfindingVariant,
} from "./swapfinding6/swapsForPair.ts";
import { SubSwapping } from "./subSwapping.ts";
import { SubSwap } from "../../types/euclid/subSwap.ts";

export class Swapping {
  private calculatedAllSubSwappings = false;
  private remainingExpMults_: number | null = null;
  public readonly subSwappings: SubSwapping[] = [];
  private absorbed = false;
  public previousChained?: Swapping;
  public subsequentChained?: Swapping;

  private constructor(
    public readonly user: User | null, // webapp needs undefined iirc
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxo: DiracUtxo,
    public readonly buyingAsset: Asset,
    public readonly sellingAsset: Asset,
    public readonly maxIntImpacted: boolean,
    public readonly minExpMults: number,
    public readonly maxExpMults: number,
    // public readonly corruptions: string[],
  ) {} // TODO assert somewhere that the stuff of the subSwappings that should be the same is in fact the same

  public get type(): string {
    return "Swapping";
  }

  public get totalDeltas(): {
    deltaSelling: bigint;
    deltaBuying: bigint;
  } {
    this.calcAllSubSwappings();
    const totals = this.subSwappings.reduce(
      (acc, s) => {
        // assert(
        //   s.of === this,
        //   `applySwapping(): subSwapping.of mismatch: ${s.of.show()} !== ${this.show()}`,
        // ); // TODO this should happen somewhere else ideally, and check the options as well
        return [acc[0] + s.option.deltaSelling, acc[1] + s.option.deltaBuying];
      },
      [0n, 0n],
    );
    return {
      deltaSelling: totals[0],
      deltaBuying: totals[1],
    };
  }

  public get lastSubSwapping(): SubSwapping {
    assert(
      this.calculatedAllSubSwappings,
      `lastSubSwapping(): not all subSwappings calculated`,
    );
    const lastSubSwapping = this.subSwappings.at(-1);
    assert(lastSubSwapping, `lastSubSwapping(): no subSwappings`);
    return lastSubSwapping;
  }

  public get remainingExpMults(): number {
    if (this.remainingExpMults_ === null) {
      
      const fstOption = this.subSwappings[0].option;
      this.remainingExpMults_ = this.maxExpMults - fstOption.b.mults - fstOption.s.mults;

      let prevExpBuying = fstOption.b.exp;
      let prevExpSelling = fstOption.s.exp;

      for (let i = 1; i < this.subSwappings.length; i++) {
        const ithOption = this.subSwappings[i].option;
        const diffExpBuying = ithOption.b.exp - prevExpBuying;
        const diffExpSelling = ithOption.s.exp - prevExpSelling;

        this.remainingExpMults_! -= countMults(diffExpBuying) +
          countMults(diffExpSelling) + 2; // +2 because we need to at least mutliply the new stuff with the old in the fold. TODO could probably come up with some slightly more elegant solutions here

        prevExpBuying = ithOption.b.exp;
        prevExpSelling = ithOption.s.exp;
      };
    }
    assert(
      this.remainingExpMults_! >= 0,
      `remainingExpMults must be >= 0, but is ${this.remainingExpMults_}`,
    );
    return this.remainingExpMults_!;
  }

  static boundary(
    user: User | null, // webapp needs undefined iirc
    paramUtxo: ParamUtxo,
    diracUtxo: DiracUtxo,
    buyingAsset: Asset,
    sellingAsset: Asset,
    firstOption: PairOption,
    maxIntImpacted: boolean,
    minExpMults: number,
    maxExpMults: number,
  ): Swapping {
    console.log(`Swapping.boundary()`);
    const swapping = new Swapping(
      user, // webapp needs undefined iirc
      paramUtxo,
      diracUtxo,
      buyingAsset,
      sellingAsset,
      maxIntImpacted,
      minExpMults,
      maxExpMults,
      // [],
    );
    swapping.subSwappings.push(new SubSwapping(swapping, firstOption));
    return swapping;
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
      Number(genPositive(50n)),
      Number(
        genPositive(
          isFinite(globalExpLimit) ? BigInt(globalExpLimit) : undefined,
        ),
      ),
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
    if (Math.random() < 0.5) {
      return choice;
    }
    return choice.randomFractional();
  }

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    const ttff = ttf + f;
    return `Swapping (
${ttf}paramUtxo: ${this.paramUtxo.show(ttf)}
${ttf}diracUtxo: ${this.diracUtxo.show(ttf)}
${ttf}buyingAsset: ${this.buyingAsset.show()}
${ttf}sellingAsset: ${this.sellingAsset.show()}
${ttf}subSwappings:\n${this.subSwappings.map((s) => s.concise(ttff)).join("\n")}
${ttf}calculatedAllSubSwappings: ${this.calculatedAllSubSwappings}
${ttf}maxIntImpacted: ${this.maxIntImpacted}
${ttf}minExpMults: ${this.minExpMults}
${ttf}maxExpMults: ${this.maxExpMults}
${ttf}remainingExpMults: ${this.remainingExpMults_}
${ttf}absorbed: ${this.absorbed}
)`;
    // ${ttf}corruptions: ${this.corruptions.toString()}
  };

  public split = (): Swapping[] => {
    throw new Error("Swapping-split not implemented");
  };

  // TODO set subsequent's diracUtxo's utxo to the one resulting from this tx
  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    console.log(`compiling tx...`);
    this.calcAllSubSwappings();
    console.log(`...for ${this.show()}`);
    assert(
      this.diracUtxo.utxo,
      `diracUtxo.utxo must be defined - subsequents-issue?`,
    );
    assert(
      this.paramUtxo.utxo,
      `paramUtxo.utxo must be defined`,
    );

    let prevExpBuying = 0n;
    let prevExpSelling = 0n;

    const swapRedeemer = PEuclidAction.ptype.pconstant(
      new SwapRedeemer(
        new Swap(
          this.buyingAsset,
          this.sellingAsset,
          this.subSwappings.map((subSwapping, i) => {
            const diffExpBuying = subSwapping.option.b.exp - prevExpBuying;
            const diffExpSelling = subSwapping.option.s.exp - prevExpSelling;

            console.log(
              "expBuying:",
              subSwapping.option.b.exp,
              "-",
              prevExpBuying,
              "=",
              diffExpBuying,
              "expSelling:",
              subSwapping.option.s.exp,
              "-",
              prevExpSelling,
              "=",
              diffExpSelling,
            );

            assert(
              diffExpSelling >= 0n && diffExpBuying >= 0n,
              `exps shouldn't decrease`,
            );

            if (i > 0) {
              assert(
                diffExpSelling > 0n || diffExpBuying > 0n,
                `exp must increase for at least one asset`,
              );
            }

            prevExpBuying = subSwapping.option.b.exp;
            prevExpSelling = subSwapping.option.s.exp;

            return new SubSwap(
              subSwapping.option.deltaBuying,
              subSwapping.option.deltaSelling,
              diffExpBuying,
              diffExpSelling,
            );
          }),
        ),
      ),
    );

    const newDiracUtxo = this.diracUtxo.applySwapping(this);
    const retour: Lucid.Assets = newDiracUtxo.funds.toLucid; // applySwapping should already clone it
    retour[this.diracUtxo.dirac.threadNFT.toLucid] = 1n;

    const datum = this.diracUtxo.peuclidDatum.pconstant(
      new DiracDatum(newDiracUtxo.dirac),
    );
    const datum_ = Data.to(datum);
    const redeemer = Data.to(swapRedeemer);

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
    if (this.subsequentChained) {
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
        this.subsequentChained.diracUtxo.utxo = utxo_;
        break;
      }
      assert(
        this.subsequentChained.diracUtxo.utxo,
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
    this.calcAllSubSwappings();
    const swappings: Swapping[] = [this];
    let previous = swappings[0];
    const lastSubSwapping = this.lastSubSwapping;
    let sellableAmount = lastSubSwapping.option.s.maxDelta === "oo"
      ? -1n
      : (lastSubSwapping.option.s.maxDelta -
        lastSubSwapping.option.deltaSelling);
    let diracUtxo = this.diracUtxo.applySwapping(this);

    while (sellableAmount != 0n) {
      if (maxSubsequents !== undefined && swappings.length >= maxSubsequents) {
        break;
      }

      const subsequents = diracUtxo.swappingsFor(
        this.user,
        this.paramUtxo,
        variant ?? lastSubSwapping.option.variant,
        applyMinAmounts ? lastSubSwapping.option.b.minDelta : 1n,
        applyMinAmounts ? lastSubSwapping.option.s.minDelta : 1n,
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
        sellableAmount -= swapping.totalDeltas.deltaSelling;
        assert(sellableAmount >= 0n, `sold too much: ${swapping.show()}`);
      }
      diracUtxo = diracUtxo.applySwapping(swapping);

      previous.subsequentChained = swapping;
      swapping.previousChained = previous;
      previous = swapping;
      swappings.push(swapping);
    }

    return swappings;
  };

  // private setAvailableBuying = (availableBuying: bigint): void => {
  //   this.option.b.maxDelta = availableBuying;
  // };

  private calcNextSubSwapping = (): SubSwapping | null => {
    console.log(
      `Swapping.calcNextSubSwapping(): ${this.subSwappings.length + 1}`,
    );
    if (this.calculatedAllSubSwappings) return null;
    if (this.remainingExpMults === 0) {
      console.log(`calcNextSubSwapping(): remainingExpMults === 0`);
      this.calculatedAllSubSwappings = true;
      return null;
    }
    const lastSubSwapping = this.subSwappings.at(-1);
    assert(lastSubSwapping, `calcNextSubSwapping(): no subSwappings`);
    const nextSubSwapping = lastSubSwapping.calcNextSubSwapping();
    if (!nextSubSwapping) {
      this.calculatedAllSubSwappings = true;
      return null;
    }
    assert(
      nextSubSwapping.of === lastSubSwapping.of,
      `calcNextSubSwapping(): of changed`,
    );
    assert(
      nextSubSwapping.option.adhereMaxInteger ===
        lastSubSwapping.option.adhereMaxInteger,
      `calcNextSubSwapping(): adhereMaxInteger changed`,
    );
    assert(
      nextSubSwapping.option.minExpMults === lastSubSwapping.option.minExpMults,
      `calcNextSubSwapping(): minExpMults changed`,
    );
    // assert(nextSubSwapping.option.maxExpMults === lastSubSwapping.option.maxExpMults, `calcNextSubSwapping(): maxExpMults changed`);
    assert(
      nextSubSwapping.option.variant === lastSubSwapping.option.variant,
      `calcNextSubSwapping(): variant changed`,
    );

    const usedMults =
      countMults(nextSubSwapping.option.b.exp - lastSubSwapping.option.b.exp) +
      countMults(nextSubSwapping.option.s.exp - lastSubSwapping.option.s.exp) +
      2; // +2 because we need to at least mutliply the new stuff with the old in the fold. TODO could probably come up with some slightly more elegant solutions here
    if (this.remainingExpMults_! < usedMults) {
      console.log(`calcNextSubSwapping(): remainingExpMults = ${this.remainingExpMults} < usedMults = ${usedMults}`);
      this.calculatedAllSubSwappings = true;
      return null;
    }
    this.remainingExpMults_! -= usedMults;

    if (
      nextSubSwapping.option.s.exp === lastSubSwapping.option.s.exp &&
      nextSubSwapping.option.b.exp === lastSubSwapping.option.b.exp
    ) {
      console.log(`calcNextSubSwapping(): exp unchanged`);
      assert(
        nextSubSwapping.option.variant.accuracy !== "perExpMaxDelta",
        `calcNextSubSwapping(): variant.accuracy === perExpMaxDelta`,
      );
      lastSubSwapping.absorb(nextSubSwapping); // NOTE/TODO this technically destroys the ideal-ness of exact calculations
      this.absorbed = true;
      return lastSubSwapping;
    } else {
      this.subSwappings.push(nextSubSwapping);
      return nextSubSwapping;
    }
  };

  public calcAllSubSwappings = (): void => {
    while (this.calcNextSubSwapping()) {
      //
    }
  };

  public fractional = (
    amount: bigint,
    amntIsSold: boolean,
  ): Swapping | null => {
    console.log(
      `Swapping.fractional(): ${amount} ${amntIsSold ? "sold" : "bought"}`,
    );

    const swapping = new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      this.maxIntImpacted,
      this.minExpMults,
      this.maxExpMults,
      // this.corruptions,
    );

    const subSwappings: SubSwapping[] = [];
    let current: SubSwapping | null = null;
    let currentIndex = -1;
    while (amount > 0n) {
      if (++currentIndex >= this.subSwappings.length) {
        current = this.calcNextSubSwapping();
        // if we're here, we need another subSwapping. If none exists we can't get a fractional
        // TODO should this return null instead?
        if (!current) throw new Error("Swapping.fractional(): TODO 2");
      } else {
        current = this.subSwappings[currentIndex];
      }
      const currentMaxAmnt = amntIsSold
        ? current.option.deltaSelling
        : current.option.deltaBuying;

      if (amount < currentMaxAmnt) {
        // means we need a fractional subSwapping
        current = current.fractional(
          swapping,
          amount,
          amntIsSold,
        ); // if this is null, this means rn that the last subSwapping has a too large minDelta
        if (current) subSwappings.push(current);
        // else throw new Error("Swapping.fractional(): TODO 1"); // TODO consider better handling - this should be possible in theory in at least some cases but has bad effort/reward ratio
        break;
      }
      // otherwise collect this one and try to iterate
      subSwappings.push(new SubSwapping(swapping, current.option));
      amount -= currentMaxAmnt;
    }
    // assert(amount === 0n, `fractional(): nonzero amount left: ${amount}`); // TODO FIXME (likely fails because of the break above)

    if (subSwappings.length === 0) return null; // means amount was too small

    swapping.subSwappings.push(...subSwappings);
    return swapping;
  };

  private randomFractional = (): Swapping => {
    const totalDeltas = this.totalDeltas;
    const maxSelling = totalDeltas.deltaSelling - 1n;
    const maxBuying = totalDeltas.deltaBuying - 1n;
    const lastSubSwapping = this.subSwappings.at(-1);
    assert(lastSubSwapping, `randomFractional(): no subSwappings`);
    const couldSellLess = maxSelling >= lastSubSwapping.option.s.minDelta;
    const couldBuyLess = maxBuying >= lastSubSwapping.option.b.minDelta;
    if (couldSellLess || couldBuyLess) {
      for (let i = 0; i < 100; i++) {
        const amntIsSold = randomChoice([couldSellLess, !couldBuyLess]);
        const maxAmnt = amntIsSold ? maxSelling : maxBuying;
        const minAmnt = amntIsSold // NOTE/TODO the minDeltas should be the same for all subSwappings, maybe assert this somewhere
          ? lastSubSwapping.option.s.minDelta
          : lastSubSwapping.option.b.minDelta;
        const amount = minAmnt + genNonNegative(maxAmnt - minAmnt);
        const fractionalSwap = this.fractional(amount, amntIsSold);
        if (fractionalSwap) return fractionalSwap;
      }
    }
    console.log(
      `randomFractionalSwap(): failed to find a smaller fractional swap for ${this.show()}`,
    );
    return this; // TODO FIXME
    // this is to test the fractionalSwap-function
    // const fractionalSwap = Math.random() < 0.5
    //   ? this.fractionalSwap(this.option.deltaBuying, false)
    //   : this.fractionalSwap(this.option.deltaSelling, true);
    // assert(
    //   fractionalSwap,
    //   `randomSubSwap(): failed to find a fractionalSwap for ${this.show()}`,
    // );
    // assert(
    //   this.equals(fractionalSwap, true, ["maxDelta"]), // maxDelta changes per definition of a fractionalSwap
    //   `fractionalSwap with unchanged amounts should result in same Swapping, but got:\n${fractionalSwap.show()}\nfrom\n${this.show()}`,
    // );
    // return fractionalSwap;
  };

  /*
  we try to corrupt this Swapping in the following ways:

  - try to corrupt each subSwapping individually (TODO)
  - try to corrupt each subSwapping, discarding the following ones <- focus on this one first, as it seems to be the tightest
  - try to corrupt each subSwapping, recomputing the following ones (TODO)

  */

  public withSubSwappings = (subSwappings: SubSwapping[]): Swapping => {
    const swapping = new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.buyingAsset,
      this.sellingAsset,
      this.maxIntImpacted,
      this.minExpMults,
      this.maxExpMults,
      // this.corruptions,
    );
    swapping.subSwappings.push(...subSwappings.map((s) => new SubSwapping(swapping, s.option)));
    return swapping;
  }

  public corruptAll = (): Swapping[] => {
    if (this.absorbed) return [];
    const variant = this.subSwappings[0].option.variant;
    if (variant.accuracy !== "exact" || variant.stopOnceNotImproving) return [];

    // const individually: Swapping[] = [];
    const discardFollowing: Swapping[] = [];
    // const recomputeFollowing: Swapping[] = [];
    this.subSwappings.forEach((subSwapping, i) => {
      const corrupted = subSwapping.corruptAll();
      corrupted.forEach((corruptedSubSwapping) => {
        const previous = this.subSwappings.slice(0, i);
        // const following = this.subSwappings.slice(i + 1);
        const corruptedSwapping = new Swapping(
          this.user,
          this.paramUtxo,
          this.diracUtxo,
          this.buyingAsset,
          this.sellingAsset,
          this.maxIntImpacted,
          this.minExpMults,
          this.maxExpMults,
          // this.corruptions,
        );
        corruptedSwapping.subSwappings.push(
          ...previous.map((s) => new SubSwapping(corruptedSwapping, s.option)),
        );
        corruptedSwapping.subSwappings.push(
          new SubSwapping(corruptedSwapping, corruptedSubSwapping.option),
        );
        discardFollowing.push(corruptedSwapping);
      });
    });
    return discardFollowing;
  };
}
