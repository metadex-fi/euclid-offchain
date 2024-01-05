import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  countMults,
  PairOption,
  PairOptions,
} from "./swapfinding6/swapsForPair.ts";
import { Swapping } from "./swapping.ts";
import { Dirac } from "../../types/euclid/dirac.ts";
import { maxInteger } from "../../utils/constants.ts";
import { genPositive } from "../../utils/generators.ts";

export class SubSwapping {
  constructor(
    public readonly of: Swapping,
    public option: PairOption,
  ) {
    if (of.user) {
      assert(
        option.s.maxDelta !== "oo" &&
          option.s.maxDelta <= of.user.balance!.amountOf(of.sellingAsset),
        `availableSelling must be less than or equal to the available balance: ${this.show()}`,
      );
    }
  }

  public show(): string {
    return `SubSwapping ( ${this.option.show()} )`;
  }

  public concise(tabs = ""): string {
    return `${tabs}variant: ${this.option.variant.accuracy}, ${this.option.variant.stopOnceNotImproving};\tdeltaBuying: ${this.option.deltaBuying}, deltaSelling: ${this.option.deltaSelling};\tb.exp: ${this.option.b.exp}, s.exp: ${this.option.s.exp}`;
  }

  public get posteriorDirac(): Dirac {
    const oldDirac = this.of.diracUtxo.dirac;

    const newAnchorPrices = oldDirac.anchorPrices.clone; // TODO cloning neccessary?
    assert(
      this.option.b.newAnchor <= maxInteger,
      `b.newAnchor too high: ${this.option.b.newAnchor}`,
    );
    assert(
      this.option.s.newAnchor <= maxInteger,
      `s.newAnchor too high: ${this.option.s.newAnchor}`,
    );
    newAnchorPrices.setAmountOf(this.of.buyingAsset, this.option.b.newAnchor);
    newAnchorPrices.setAmountOf(this.of.sellingAsset, this.option.s.newAnchor);

    return new Dirac(
      oldDirac.owner,
      oldDirac.threadNFT,
      oldDirac.paramNFT,
      newAnchorPrices,
    );
  }

  public absorb = (other: SubSwapping): void => {
    this.option = this.option.mergeWith(other.option);
  };

  public calcNextSubSwapping = (): SubSwapping | null => {
    if (this.option.deltaSelling === this.option.s.maxDelta) return null;
    if (this.option.deltaBuying === this.option.b.maxDelta) return null;
    const sellingOption = this.option.s.afterDelta(this.option.deltaSelling);
    const buyingOption = this.option.b.afterDelta(this.option.deltaBuying);
    const pairOptions = new PairOptions(
      buyingOption,
      sellingOption,
      this.of.minExpMults,
      this.of.remainingExpMults,
      maxInteger,
      false,
      this.option.variant,
    );

    const nextOption = pairOptions.bestAdheringOption;
    if (nextOption === null) return null;
    return new SubSwapping(this.of, nextOption);
  };

  public fractional = (
    of: Swapping,
    amount: bigint,
    amntIsSold: boolean,
  ): SubSwapping | null => {
    console.log(
      `SubSwapping.fractional(): ${amount} ${amntIsSold ? "sold" : "bought"}`,
    );
    let sellingOption = this.option.s;
    let buyingOption = this.option.b;
    if (amntIsSold) {
      if (amount < sellingOption.minDelta) return null; // TODO and then?
      sellingOption = sellingOption.withLowerMaxDelta(amount);
    } else {
      if (amount < buyingOption.minDelta) return null; // TODO and then?
      buyingOption = buyingOption.withLowerMaxDelta(amount);
    }
    const pairOptions = new PairOptions(
      buyingOption,
      sellingOption,
      this.of.minExpMults,
      this.of.maxExpMults,
      maxInteger,
      false,
      this.option.variant,
    );
    const fractionalOption = pairOptions.bestAdheringOption;
    // assert(fractionalOption, `fractionalOption is null`); // TODO can/should this happen?
    if (fractionalOption === null) return null; // TODO can/should this happen?
    return new SubSwapping(of, fractionalOption);
  };

  // try to make it wrong with minimal changes
  // TODO adjust for the new version with inherent chaining
  // TODO include newAnchorPrices, and consider what else too
  public corruptAll = (): SubSwapping[] => {
    const corrupted_: (SubSwapping | null)[] = [];
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
    return corrupted_.filter((s) => s) as SubSwapping[];
  };

  public corruptBoughtAmnt = (random: boolean): SubSwapping | null => {
    console.log(`trying to corrupt bought amount...\nof ${this.show()}`);
    if (this.option.deltaBuying === this.option.b.maxDelta) return null;
    assert(this.option.b.maxDelta !== "oo");
    const amnt = random
      ? genPositive(this.option.b.maxDelta - this.option.deltaBuying)
      : 1n;
    console.log(`... by ${amnt}`);
    const boughtTooMuch = new SubSwapping(
      this.of,
      this.option.corrupted(
        this.option.deltaBuying + amnt,
        this.option.deltaSelling,
        this.option.b.exp,
        this.option.s.exp,
        maxInteger,
      ),
    );

    console.log(`returning corruptBoughtAmnt`);
    return boughtTooMuch;
  };

  public corruptSoldAmnt = (random: boolean): SubSwapping | null => {
    console.log(`trying to corrupt sold amount...\nof ${this.show()}`);
    if (this.option.deltaSelling === this.option.s.minDelta) return null;
    const amnt = random
      ? genPositive(this.option.deltaSelling - this.option.s.minDelta)
      : 1n;
    console.log(`... by ${amnt}`);
    const soldTooLittle = new SubSwapping(
      this.of,
      this.option.corrupted(
        this.option.deltaBuying,
        this.option.deltaSelling - amnt,
        this.option.b.exp,
        this.option.s.exp,
        maxInteger,
      ),
    );
    console.log(`returning corruptSoldAmnt`);
    return soldTooLittle;
  };

  public corruptBoughtExp = (random: boolean): SubSwapping | null => {
    console.log(`trying to corrupt bought exp...\nof ${this.show()}`);
    if (this.option.b.exp === 0n) return null;
    const amnt = random ? genPositive(this.option.b.exp) : 1n;
    console.log(`... by ${amnt}`);
    const maxExpMults = this.of.maxExpMults - this.option.s.mults;
    let exp = this.option.b.exp - amnt;
    while (true) {
      if (countMults(exp) > maxExpMults) {
        if (exp === 0n) return null;
        else exp--;
      } else break;
    }
    const boughtExpTooSmall = new SubSwapping(
      this.of,
      this.option.corrupted(
        this.option.deltaBuying,
        this.option.deltaSelling,
        exp,
        this.option.s.exp,
        maxInteger,
      ),
    );

    console.log(`returning corruptBoughtExp`);
    return boughtExpTooSmall;
  };

  public corruptSoldExp = (random: boolean): SubSwapping | null => {
    console.log(`trying to corrupt sold exp...\nof ${this.show()}`);
    if (this.option.s.exp === 0n) return null;
    const amnt = random ? genPositive(this.option.s.exp) : 1n;
    console.log(`... by ${amnt}`);
    const maxExpMults = this.of.maxExpMults - this.option.b.mults;
    let exp = this.option.s.exp - amnt;
    while (true) {
      if (countMults(exp) > maxExpMults) {
        if (exp === 0n) return null;
        else exp--;
      } else break;
    }
    const soldExpTooSmall = new SubSwapping(
      this.of,
      this.option.corrupted(
        this.option.deltaBuying,
        this.option.deltaSelling,
        this.option.b.exp,
        exp,
        maxInteger,
      ),
    );

    console.log(`returning corruptSoldExp`);
    return soldExpTooSmall;
  };
}
