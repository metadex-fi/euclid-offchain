import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  ceilDiv,
  genNonNegative,
  genPositive,
  max,
  min,
  randomChoice,
} from "../../../utils/generators.ts";
// import { maxInteger, maxIntRoot } from "../../../utils/constants.ts";
import { PPositive } from "../../../types/general/derived/bounded/positive.ts";
import { maxSmallInteger } from "../../../types/euclid/smallValue.ts";
import { Param } from "../../../types/euclid/param.ts";
import { f, t } from "../../../types/general/fundamental/type.ts";

const logging = false;

export const genWildAssetParams = (maxInteger: bigint) => {
  const jumpSize = genPositive(maxSmallInteger);
  const virtual = genPositive(maxInteger);
  const balance = genNonNegative(maxInteger - virtual);
  const locked = genNonNegative(balance);
  const available = balance - locked;
  const maxIntRoot = BigInt(Math.floor(Number(maxInteger) ** 0.5));
  const weight = genPositive(randomChoice([maxInteger, maxIntRoot]));
  const anchor = genPositive(maxInteger);
  const minDelta = genPositive(maxInteger);
  return { virtual, balance, available, weight, anchor, jumpSize, minDelta };
};

export const genTightAssetParams = (maxInteger: bigint) => {
  const jumpSize = genPositive(maxSmallInteger);
  const virtual = new PPositive(
    ceilDiv(jumpSize + 1n, maxSmallInteger),
    maxInteger,
  ).genData();
  const balance = genNonNegative(maxInteger - virtual);
  const locked = genNonNegative(balance);
  const available = balance - locked;
  const maxIntRoot = BigInt(Math.floor(Number(maxInteger) ** 0.5));
  const [minWeight, maxWeight] = Param.weightBounds(
    jumpSize,
    virtual,
    maxIntRoot,
  );
  const weight = new PPositive(minWeight, maxWeight).genData();
  const anchor = genPositive(maxInteger);
  const minDelta = genPositive(maxInteger);
  return { virtual, balance, available, weight, anchor, jumpSize, minDelta };
};

export class AssetOption {
  private newAnchorCache: bigint | null = null;
  private multsCache: number | null = null;

  private constructor(
    readonly type: "buying" | "selling",
    readonly v: bigint,
    readonly b: bigint,
    readonly w: bigint,
    readonly a: bigint,
    readonly js: bigint,
    readonly minDelta: bigint,
    readonly maxDelta: bigint | "oo",
    readonly l: bigint,
    readonly wl: bigint,
    readonly jspp: bigint,
    readonly logJM: number,
    readonly logAW: number,
    readonly exp: bigint,
    readonly jse: bigint,
    readonly jsppe: bigint,
  ) {
    assert(
      maxDelta === "oo" || minDelta <= maxDelta,
      `${type}: minDelta = ${minDelta} > maxDelta = ${maxDelta}`,
    );
    assert(minDelta > 0n);
  }

  static initial(
    type: "buying" | "selling",
    v: bigint,
    b: bigint,
    w: bigint,
    a: bigint,
    js: bigint,
    minDelta: bigint,
    maxDelta: bigint | "oo",
  ): AssetOption {
    const l = v + b;
    const wl = l * w;
    const jspp = js + 1n;
    const logJM = log(jspp) - log(js);
    const logAW = log(a) - log(w);

    const option = new AssetOption(
      type,
      v,
      b,
      w,
      a,
      js,
      minDelta,
      maxDelta,
      l,
      wl,
      jspp,
      logJM,
      logAW,
      0n,
      1n,
      1n,
    );

    const exp = option.minExpForDelta(minDelta);
    return option.withExp(exp);
  }

  public withExp = (exp: bigint): AssetOption => {
    assert(exp >= 0n);
    const by = exp - this.exp;

    let jse = this.jse;
    let jsppe = this.jsppe;
    if (by > 0n) {
      jse *= this.js ** by;
      jsppe *= this.jspp ** by;
    } else if (by < 0n) {
      jse /= this.js ** -by;
      jsppe /= this.jspp ** -by;
    }
    // assert(jse === this.js ** exp);
    // assert(jsppe === this.jspp ** exp);

    return new AssetOption(
      this.type,
      this.v,
      this.b,
      this.w,
      this.a,
      this.js,
      this.minDelta,
      this.maxDelta,
      this.l,
      this.wl,
      this.jspp,
      this.logJM,
      this.logAW,
      exp,
      jse,
      jsppe,
    );
  };

  public afterDelta = (delta: bigint): AssetOption => {
    const b = this.type === "buying" ? this.b - delta : this.b + delta;
    const l = this.v + b;
    const wl = l * this.w;
    return new AssetOption(
      this.type,
      this.v,
      b,
      this.w,
      this.a,
      this.js,
      1n, // This is 1 because the user-defined minDelta is assumed to already having been serviced by the first subSwapping
      this.maxDelta === "oo" ? "oo" : this.maxDelta - delta,
      l,
      wl,
      this.jspp,
      this.logJM,
      this.logAW,
      this.exp,
      this.jse,
      this.jsppe,
    );
  };

  public withLowerMaxDelta = (lowerMaxDelta: bigint): AssetOption => {
    assert(
      this.maxDelta === "oo" || lowerMaxDelta <= this.maxDelta,
      `${this.type}: lowerMaxDelta ${lowerMaxDelta} > maxDelta ${this.maxDelta}`,
    );
    return new AssetOption(
      this.type,
      this.v,
      this.b,
      this.w,
      this.a,
      this.js,
      this.minDelta,
      lowerMaxDelta,
      this.l,
      this.wl,
      this.jspp,
      this.logJM,
      this.logAW,
      this.exp,
      this.jse,
      this.jsppe,
    );
  };

  public equalExceptAfterDelta = (other: AssetOption): boolean =>
    this.type === other.type &&
    this.v === other.v &&
    // this.b === other.b &&
    this.w === other.w &&
    this.a === other.a &&
    this.js === other.js &&
    // this.minDelta === other.minDelta &&
    // this.maxDelta === other.maxDelta &&
    // this.l === other.l &&
    // this.wl === other.wl &&
    this.jspp === other.jspp &&
    this.logJM === other.logJM &&
    this.logAW === other.logAW &&
    this.exp === other.exp &&
    this.jse === other.jse &&
    this.jsppe === other.jsppe;

  public minExpForDelta = (delta: bigint): bigint => {
    const numerator = this.type === "buying"
      ? this.logAW - log(this.l - delta)
      : log(this.l + delta) - this.logAW;

    const exp = BigInt(Math.ceil(numerator / this.logJM)) - 1n; // TODO fix -1n to start below limit, for good measure/rounding errors (sometimes seems to take too long in frontend)
    if (exp < this.exp) return this.exp; // was 0 before, using this.exp instead because of subSwappings, which can't have decreasing exps as of now (TODO consider changing this)
    return exp;
  };

  public maxDeltaForExp = (): bigint | null => {
    const maxDelta = this.type === "buying"
      ? (this.wl * this.jsppe - this.a * this.jse) / (this.jsppe * this.w)
      : (this.a * this.jsppe - this.wl * this.jse) / (this.jse * this.w);

    if (maxDelta < this.minDelta) return null; // apparently rounding errors? Also we purposefully do this, see above TODO check
    if (this.maxDelta === "oo") {
      return maxDelta;
    } else {
      return min(maxDelta, this.maxDelta);
    }
  };

  public get newAnchor(): bigint {
    if (this.newAnchorCache === null) {
      this.newAnchorCache = this.type === "buying"
        ? (this.a * this.jse) / this.jsppe
        : (this.a * this.jsppe) / this.jse;
    }
    return this.newAnchorCache;
  }

  public get mults(): number {
    if (this.multsCache === null) {
      this.multsCache = countMults(this.exp);
    }
    return this.multsCache;
  }

  public show = (tabs = "", verbose = false): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    if (verbose) {
      return `AssetOption (
${ttf}type: ${this.type}
${ttf}v: ${this.v}
${ttf}b: ${this.b}
${ttf}w: ${this.w}
${ttf}a: ${this.a}
${ttf}js: ${this.js}
${ttf}minDelta: ${this.minDelta}
${ttf}maxDelta: ${this.maxDelta}
${ttf}l: ${this.l}
${ttf}wl: ${this.wl}
${ttf}jspp: ${this.jspp}
${ttf}logJM: ${this.logJM}
${ttf}logAW: ${this.logAW}
${ttf}exp: ${this.exp}
${ttf}jse: ${this.jse}
${ttf}jsppe: ${this.jsppe}
${ttf}newAnchor: ${this.newAnchor}
${ttf}mults: ${this.mults}
${tt})`;
    }

    return `AssetOption (
${ttf}type: ${this.type}
${ttf}v: ${this.v}
${ttf}b: ${this.b}
${ttf}w: ${this.w}
${ttf}a: ${this.a}
${ttf}js: ${this.js}
${ttf}minDelta: ${this.minDelta}
${ttf}maxDelta: ${this.maxDelta}
${ttf}exp: ${this.exp}
${ttf}newAnchor: ${this.newAnchor}
${ttf}mults: ${this.mults}
${tt})`;
  };
}

export type SwapfindingAccuracy =
  | "exact"
  | "perExpMaxDelta"
  | "imperfectMaxDelta";
// | "maxDelta";

export type SwapfindingVariant = {
  accuracy: SwapfindingAccuracy;
  stopOnceNotImproving: boolean;
};

export class PairOption {
  readonly effectivePrice: number;
  private spotPriceCache: number | null = null;
  private constructor(
    readonly b: AssetOption,
    readonly s: AssetOption,
    readonly deltaBuying: bigint,
    readonly deltaSelling: bigint,
    readonly perfect: boolean,
    readonly adhereMaxInteger: boolean,
    readonly minExpMults: number, // for testing
    readonly maxExpMults: number,
    readonly variant: SwapfindingVariant,
  ) {
    assert(b.type === "buying");
    assert(s.type === "selling");
    assert(
      deltaBuying >= b.minDelta,
      `deltaBuying < b.minDelta: ${deltaBuying} < ${b.minDelta}`,
    );
    assert(
      deltaSelling >= s.minDelta,
      `deltaSelling < s.minDelta: ${deltaSelling} < ${s.minDelta}`,
    );
    assert(b.maxDelta !== "oo");
    assert(
      deltaBuying <= b.maxDelta,
      `deltaBuying > b.maxDelta: ${deltaBuying} > ${b.maxDelta}`,
    );
    assert(
      s.maxDelta === "oo" || deltaSelling <= s.maxDelta,
      `deltaSelling > s.maxDelta: ${deltaSelling} > ${s.maxDelta}`,
    );
    this.effectivePrice = Number(this.deltaSelling) / Number(this.deltaBuying);
  }

  static new = (
    b: AssetOption,
    s: AssetOption,
    deltaBuying: bigint,
    deltaSelling: bigint,
    perfect: boolean,
    adhereMaxInteger: boolean,
    minExpMults: number,
    maxExpMults: number,
    maxInteger: bigint,
    variant: SwapfindingVariant,
  ): PairOption => {
    const option = new PairOption(
      b,
      s,
      deltaBuying,
      deltaSelling,
      perfect,
      adhereMaxInteger,
      minExpMults,
      maxExpMults,
      variant,
    );
    assert(
      option.validates(maxInteger),
      `new option should pass offchain validation: ${option.show()}`,
    );
    return option;
  };

  public mergeWith = (other: PairOption): PairOption => {
    // assert(this.effectivePrice === other.effectivePrice, `effectivePrice: ${this.effectivePrice} !== ${other.effectivePrice}`); // TODO mere guess, because wondering why we're getting subSwappings with same exps in the first place. Also fails lol
    assert(
      this.b.equalExceptAfterDelta(other.b),
      `buying not equal: ${this.b.show(undefined, true)} !== ${
        other.b.show(undefined, true)
      }`,
    );
    assert(
      this.s.equalExceptAfterDelta(other.s),
      `selling not equal: ${this.s.show(undefined, true)} !== ${
        other.s.show(undefined, true)
      }`,
    );
    assert(
      this.adhereMaxInteger === other.adhereMaxInteger,
      `adhereMaxInteger: ${this.adhereMaxInteger} !== ${other.adhereMaxInteger}`,
    );
    assert(
      this.minExpMults === other.minExpMults,
      `minExpMults: ${this.minExpMults} !== ${other.minExpMults}`,
    );
    // assert(this.maxExpMults === other.maxExpMults, `maxExpMults: ${this.maxExpMults} !== ${other.maxExpMults}`);
    assert(
      this.variant === other.variant,
      `variant: ${this.variant} !== ${other.variant}`,
    );

    return new PairOption(
      this.b, // TODO not entirely certain about those
      this.s, // TODO not entirely certain about those
      this.deltaBuying + other.deltaBuying,
      this.deltaSelling + other.deltaSelling,
      this.perfect && other.perfect, // TODO check if those ever mismatch (curiosity mostly)
      this.adhereMaxInteger,
      this.minExpMults,
      this.maxExpMults,
      this.variant,
    );
  };

  private validates = (maxInteger: bigint): boolean => {
    let passes = true;

    if (this.variant.accuracy === "perExpMaxDelta") { // || this.variant === "maxDelta") {
      if (
        this.deltaBuying * this.s.a * this.s.jsppe * this.b.jsppe >
          this.deltaSelling * this.b.a * this.b.jse * this.s.jse
      ) {
        passes = false;
        console.error(`value equation: ${this.show()}`);
      }
    } else if (this.perfect) {
      if (
        this.deltaBuying * this.s.a * this.s.jsppe * this.b.jsppe !==
          this.deltaSelling * this.b.a * this.b.jse * this.s.jse
      ) {
        passes = false;
        console.error(`value equation: ${this.show()}`);
      }
    } else {
      if (
        this.deltaBuying * this.s.a * this.s.jsppe * this.b.jsppe >=
          this.deltaSelling * this.b.a * this.b.jse * this.s.jse
      ) {
        passes = false;
        console.error(`value equation: ${this.show()}`);
      }
    }
    if (
      this.b.a * this.b.jse >
        (this.b.l - this.deltaBuying) * this.b.jsppe * this.b.w
    ) {
      passes = false;
      console.error(`price fit buying: ${this.show()}`);
    }

    if (
      (this.s.l + this.deltaSelling) * this.s.jse * this.s.w >
        this.s.a * this.s.jsppe
    ) {
      passes = false;
      console.error(`price fit selling: ${this.show()}`);
    }

    if (this.adhereMaxInteger) {
      if (this.b.newAnchor > maxInteger) {
        passes = false;
        console.error(`maxInteger buying: ${this.show()}`);
      }

      if (this.s.newAnchor > maxInteger) {
        passes = false;
        console.error(`maxInteger selling: ${this.show()}`);
      }
    }

    if (this.b.mults + this.s.mults > this.maxExpMults) {
      passes = false;
      console.error(`maxExpMults: ${this.show()}`);
    }

    return passes;
  };

  public corrupted = (
    deltaBuying: bigint,
    deltaSelling: bigint,
    expBuying: bigint,
    expSelling: bigint,
    maxInteger: bigint,
  ): PairOption => {
    const option = new PairOption(
      this.b.withExp(expBuying),
      this.s.withExp(expSelling),
      deltaBuying,
      deltaSelling,
      // Number(deltaSelling) / Number(deltaBuying),
      this.perfect,
      this.adhereMaxInteger,
      this.minExpMults,
      this.maxExpMults,
      this.variant,
    );
    assert(
      !option.validates(maxInteger),
      `corrupted option should fail offchain validation: ${this.show()}\n~~~>\n${option.show()}`,
    );
    // if (
    //   !option.validates()
    // ) {
    //   console.error(
    //     `corrupted option should fail offchain validation: ${this.show()}\n~~~>\n${option.show()}`,
    //   );
    // }
    return option;
  };

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `PairOption (
${ttf}b: ${this.b.show(ttf)}
${ttf}s: ${this.s.show(ttf)}
${ttf}deltaBuying: ${this.deltaBuying}
${ttf}deltaSelling: ${this.deltaSelling}
${ttf}effectivePrice: ${this.effectivePrice}
${ttf}perfect: ${this.perfect}
${ttf}adhereMaxInteger: ${this.adhereMaxInteger}
${ttf}minExpMults: ${this.minExpMults}
${ttf}maxExpMults: ${this.maxExpMults}
${ttf}accuracy: ${this.variant.accuracy}
${ttf}stopOnceNotImproving: ${this.variant.stopOnceNotImproving}
${tt})`;
  };

  public get spotPrice(): number {
    if (this.spotPriceCache === null) {
      // if (this.perfect) this.spotPriceCache = this.effectivePrice; TODO wip
      let [buyingMultiplier, sellingMultiplier] = calcMultipliers(
        this.b,
        this.s,
        false, // TODO consider true, for more exactness
      );
      let sellingMultiplier_ = Number(sellingMultiplier);
      while (!isFinite(sellingMultiplier_)) {
        buyingMultiplier /= 10n;
        sellingMultiplier /= 10n;
        sellingMultiplier_ = Number(sellingMultiplier);
      }
      this.spotPriceCache = Number(buyingMultiplier) / sellingMultiplier_;
    }
    return this.spotPriceCache;
  }
}

export const log = (x: bigint): number => Math.log(Number(x));

const gcd = (a: bigint, b: bigint): bigint => {
  while (b !== 0n) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
};

const reduce = (a: bigint, b: bigint): [bigint, bigint] => {
  const gcd_ = gcd(a, b);
  // assert(gcd_ === gcd(b, a));
  const a_ = a / gcd_;
  const b_ = b / gcd_;
  // assert(a_ * gcd_ === a);
  // assert(b_ * gcd_ === b);
  return [a_, b_];
};

// const smallestPrimeFactor = (n: bigint): bigint => {
//   for (let i = 2n; i <= Math.sqrt(Number(n)); i++) {
//     if (n % i === 0n) {
//       return i; // Found the smallest prime factor
//     }
//   }
//   return n; // The number itself is prime if no factor is found
// };

// each power of 2 is a multiplication.
export const countMults = (exp: bigint): number => {
  const exp_ = Math.abs(Number(exp));

  const binaryRepresentation = exp_.toString(2).slice(1);
  const b = binaryRepresentation.length; // Total bits
  const k = (binaryRepresentation.match(/1/g) || []).length; // Count of '1' bits

  return b + k;
};

// best we can do to decrease the number of multiplications is reaching the next power of 2
export const bestMultsAhead = (exp: bigint): number =>
  Math.abs(Number(exp) - 1).toString(2).length;

const calcMultipliers = (
  b: AssetOption,
  s: AssetOption,
  reduce_: boolean,
): [bigint, bigint] => {
  const buyingMultiplier = s.a * s.jsppe * b.jsppe;
  const sellingMultiplier = b.a * b.jse * s.jse;
  if (reduce_) return reduce(buyingMultiplier, sellingMultiplier);
  return [buyingMultiplier, sellingMultiplier];
};

export class PairOptions {
  readonly bestAdheringOption: PairOption | null;
  // readonly bestOverallOption: PairOption | null;
  // readonly maxDeltaOption: PairOption | null; // TODO wip
  readonly maxIntegerImpacted: boolean;

  constructor(
    b: AssetOption,
    s: AssetOption,
    minExpMults: number,
    maxExpMults: number,
    maxInteger: bigint,
    runAsserts: boolean,
    variant: SwapfindingVariant, // TODO test and compare stopOnceNotImproving
    rounding?: bigint,
  ) {
    assert(b.type === "buying");
    assert(s.type === "selling");
    assert(b.maxDelta !== "oo");

    // if (variant === "maxDelta") {
    //   // calculating maximum volume option

    //   const minExpBuying = b.minExpForDelta(b.maxDelta);

    // } else {
    // calculating effective-price-optimized option

    const minExpSelling = s.minExpForDelta(s.minDelta);
    const minExpBuying = b.minExpForDelta(b.minDelta);

    let bestAdheringOption: PairOption | null = null;
    let bestExceedingOption: PairOption | null = null;
    // let now = performance.now();

    let continueExploringExps: boolean;

    const checkNewOption = (
      expBuying: bigint,
      expSelling: bigint,
      exceedsMaxInteger: boolean,
    ) =>
    (
      deltaBuying: bigint,
      deltaSelling: bigint,
      perfect: boolean,
    ): PairOption | null => {
      let bestPriceOption = exceedsMaxInteger
        ? bestExceedingOption
        : bestAdheringOption;

      // const effectivePrice = Number(deltaSelling) / Number(deltaBuying);
      const effNew = deltaSelling * (bestPriceOption?.deltaBuying ?? 0n);
      const effOld = deltaBuying * (bestPriceOption?.deltaSelling ?? 0n);
      if (
        (!bestPriceOption) ||
        effNew < effOld ||
        (effNew === effOld &&
          (deltaBuying > bestPriceOption.deltaBuying ||
            deltaSelling > bestPriceOption.deltaSelling))
      ) {
        // const duration = performance.now() - now;
        // now = performance.now();
        // if (logging) console.log(
        //   duration / 1000,
        //   "s, found better price option",
        //   perfect,
        //   deltaBuying,
        //   deltaSelling,
        //   effectivePrice,
        // );
        // if (bestPriceOption) assert(!bestPriceOption.perfect);

        /*
         in order to find out if we got a suboptimal solution due to maxInteger,
         we are keeping track of two bestPriceOptions separately - one adhering one and one exceeding one.
         in the end, we compare the best of each to see if we have maxIntegerImpacted or not.
         */

        bestPriceOption = PairOption.new(
          b.withExp(expBuying),
          s.withExp(expSelling),
          deltaBuying,
          deltaSelling,
          // effectivePrice,
          perfect,
          !exceedsMaxInteger,
          minExpMults,
          maxExpMults,
          maxInteger,
          variant,
        );
        if (exceedsMaxInteger) {
          bestExceedingOption = bestPriceOption;
        } else {
          bestAdheringOption = bestPriceOption;
        }
        return bestPriceOption;
      } else if (bestPriceOption) {
        assert(!perfect);
        // if we already found a solution, and this one is not better, we assert it isn't perfect
        // -> perfect solutions are always optimal (fails if we do perfect first)
      }

      if (variant.stopOnceNotImproving) {
        continueExploringExps = false;
      }
      return null;
    };

    const improvementFeasible = (
      buyingDeltaMultiplier: bigint,
      sellingDeltaMultiplier: bigint,
    ) =>
    (bestPriceOption: PairOption | null): boolean => {
      if (bestPriceOption) {
        // best achieveable effective = buyingDeltaMultiplier / sellingDeltaMultiplier
        // current effective = deltaSelling / deltaBuying
        // best achieveable effective >= current effective
        // <=> buyingDeltaMultiplier / sellingDeltaMultiplier >= deltaSelling / deltaBuying
        // <=> buyingDeltaMultiplier * deltaBuying >= sellingDeltaMultiplier * deltaSelling
        const best = bestPriceOption as PairOption;
        const mDeltaBuying = best.deltaBuying * buyingDeltaMultiplier;
        const mDeltaSelling = best.deltaSelling * sellingDeltaMultiplier;
        if (mDeltaBuying > mDeltaSelling) { // NOTE/TODO techically we are missing out on same price higher delta options when using >=
          if (logging) {
            console.log("improvement not feasible over", bestPriceOption);
          }
          return false;
        } // spot price is the best we can get, so if that's worse than what we got already, we can skip this
        else if (rounding !== undefined) {
          const potential = (rounding * (mDeltaSelling - mDeltaBuying)) /
            mDeltaSelling;
          if (logging) {
            console.log(
              "maximum possible improvement:",
              (100 * Number(potential)) / Number(rounding),
              "%",
            );
          }
          if (potential === 0n) { // good enough
            if (logging) {
              console.log("improvement not feasible over", bestPriceOption);
            }
            return false;
          }
        }
      }
      // if (logging) console.log("improvement feasible over", bestPriceOption);
      return true;
    };

    // for (const mode of ["perfect", "imperfect"]) {
    const queue: { expBuying: bigint; expSelling: bigint }[] = [{
      expBuying: minExpBuying,
      expSelling: minExpSelling,
    }];
    const checked: { expBuying: bigint; expSelling: bigint }[] = [];
    const exceedingQueue: { expBuying: bigint; expSelling: bigint }[] = [];
    // for (const mode of ["adhering", "exceeding"]) {
    for (const mode of ["adhering"]) { // NOTE not doing the exceedsMaxInteger thing for now (in frontend instead by other means)
      let stepBuyingFirst: boolean;
      if (mode === "exceeding") {
        throw new Error("WIP");
        // queue = exceedingQueue;
        // checked = [];
        // variant.accuracy = "perExpMaxDelta"; // using the fastest, since we only need to know if an exceeding option exists
      }
      if (logging) console.log("mode:", mode);
      if (logging) console.log("queue:", queue);
      while (queue.length) {
        continueExploringExps = true;
        stepBuyingFirst = randomChoice([true, false]); //!stepBuyingFirst; // TODO consider making this deterministic again
        // queue.sort((a, b) => {
        //   const aMin = min(a.expBuying, a.expSelling);
        //   const bMin = min(b.expBuying, b.expSelling);r
        //   return Number(aMin - bMin);
        // });
        const { expBuying, expSelling } = queue.shift()!;
        // let minExpBuying = queue[0].expBuying;
        // let minExpSelling = queue[0].expSelling;
        // queue.forEach(({ expBuying, expSelling }) => {
        //   minExpBuying = min(minExpBuying, expBuying);
        //   minExpSelling = min(minExpSelling, expSelling);
        // });
        // const best = queue.findIndex(({ expBuying, expSelling }) =>
        //   expBuying === minExpBuying || expSelling === minExpSelling
        // );
        // const { expBuying, expSelling } = queue.splice(best, 1)[0];
        if (
          checked.find((e) =>
            e.expBuying === expBuying &&
            e.expSelling === expSelling
          )
        ) continue;
        checked.push({ expBuying, expSelling });
        const buyingMults = countMults(expBuying);
        const sellingMults = countMults(expSelling);

        if (buyingMults + sellingMults < minExpMults) {
          if (stepBuyingFirst) {
            queue.push({ expBuying: expBuying + 1n, expSelling });
            queue.push({ expBuying, expSelling: expSelling + 1n });
          } else {
            queue.push({ expBuying, expSelling: expSelling + 1n });
            queue.push({ expBuying: expBuying + 1n, expSelling });
          }
          continue;
        }
        if (buyingMults + sellingMults > maxExpMults) {
          if (
            bestMultsAhead(expBuying) + bestMultsAhead(expSelling) <=
              maxExpMults
          ) {
            if (stepBuyingFirst) {
              queue.push({ expBuying: expBuying + 1n, expSelling });
              queue.push({ expBuying, expSelling: expSelling + 1n });
            } else {
              queue.push({ expBuying, expSelling: expSelling + 1n });
              queue.push({ expBuying: expBuying + 1n, expSelling });
            }
          }
          continue;
        }
        s = s.withExp(expSelling);
        b = b.withExp(expBuying);
        // NOTE below wasn't part of performance-comparison - or consideration -
        // for the expensive imperfect swapfinding. Remedy that. And see note below
        const exceedsMaxInteger = (b.newAnchor > maxInteger) ||
          (s.newAnchor > maxInteger);
        // const exceedsMaxInteger = false;

        /* NOTE - below:

       - reduces average runtime from ~1.5s to ~6ms (outdated info)
       - seems to be allowed for some reason, see the assertion at the very bottom
         ( assert(!(this.maxIntegerImpacted && adhering)); )
       - ...which translates to: if we find both an adhering and exceeding option,
         the exceeding one isn't better
       - thus, we are are only interested in knowing if any exceeding option exists at all
         for maxIntImpacted, not how good we can get it

       */

        // if (bestExceedingOption && exceedsMaxInteger) continue;
        // if (exceedsMaxInteger) continue; // vastly cheaper but doesn't inform us about maxIntegerImpacted
        if (mode === "adhering") {
          assert(!bestExceedingOption);
          if (exceedsMaxInteger) {
            exceedingQueue.push({ expBuying, expSelling });
            continue;
          }
        } else {
          throw new Error("WIP");
          // assert(exceedsMaxInteger);
          // if (bestExceedingOption) break;
        }

        const checkNewOption_ = checkNewOption(
          expBuying,
          expSelling,
          exceedsMaxInteger,
        );

        let maxSellingForExp: bigint | null;
        let maxBuyingForExp: bigint | null;
        if (stepBuyingFirst) {
          maxBuyingForExp = b.maxDeltaForExp();
          if (maxBuyingForExp === null) {
            // if we can't find a delta for this exp (presumably due to rounding-errors), try one bigger
            queue.push({ expBuying: expBuying + 1n, expSelling });
            continue;
          }
          maxSellingForExp = s.maxDeltaForExp();
          if (maxSellingForExp === null) {
            // if we can't find a delta for this exp (presumably due to rounding-errors), try one bigger
            queue.push({ expBuying, expSelling: expSelling + 1n });
            continue;
          }
        } else {
          maxSellingForExp = s.maxDeltaForExp();
          if (maxSellingForExp === null) {
            // if we can't find a delta for this exp (presumably due to rounding-errors), try one bigger
            queue.push({ expBuying, expSelling: expSelling + 1n });
            continue;
          }
          maxBuyingForExp = b.maxDeltaForExp();
          if (maxBuyingForExp === null) {
            // if we can't find a delta for this exp (presumably due to rounding-errors), try one bigger
            queue.push({ expBuying: expBuying + 1n, expSelling });
            continue;
          }
        }
        assert(
          maxSellingForExp >= s.minDelta,
          `maxSellingForExp: ${maxSellingForExp} < s.minDelta: ${s.minDelta}`,
        );
        assert(
          maxBuyingForExp >= b.minDelta,
          `maxBuyingForExp: ${maxBuyingForExp} < b.minDelta: ${b.minDelta}`,
        );

        let [buyingMultiplier, sellingMultiplier] = calcMultipliers(
          b,
          s,
          false,
        );
        // if (logging) console.log("buying-multiplier", buyingMultiplier);
        // if (logging) console.log("selling-multiplier", sellingMultiplier);
        const improvementFeasible_ = improvementFeasible(
          buyingMultiplier,
          sellingMultiplier,
        );

        // value-equation: deltaBuying * buyingDeltaMultiplier <= deltaSelling * sellingDeltaMultiplier
        const bestPriceOption = exceedsMaxInteger
          ? bestExceedingOption
          : bestAdheringOption;
        if (!improvementFeasible_(bestPriceOption)) continue;

        let buyingForSelling = (selling: bigint): bigint =>
          (selling * sellingMultiplier) / buyingMultiplier;
        let sellingForBuying = (buying: bigint): bigint =>
          ceilDiv(buying * buyingMultiplier, sellingMultiplier);

        if (variant.accuracy === "perExpMaxDelta") {
          const buyingForMaxSelling = buyingForSelling(maxSellingForExp);
          // const sellingForMaxBuying = sellingForBuying(maxBuyingForExp);
          let buying: bigint;
          let selling: bigint;

          if (buyingForMaxSelling < maxBuyingForExp) {
            buying = buyingForMaxSelling;
            selling = maxSellingForExp;
          } else {
            buying = maxBuyingForExp;
            const sellingForMaxBuying = sellingForBuying(maxBuyingForExp);
            selling = max(sellingForMaxBuying, s.minDelta);
          }

          // if (sellingForMaxBuying < maxSellingForExp) {
          //   assert(selling === max(sellingForMaxBuying, s.minDelta));
          //   assert(buying === maxBuyingForExp);
          // } else {
          //   assert(selling === maxSellingForExp);
          //   assert(buying === buyingForMaxSelling);
          // }

          if (buying >= b.minDelta) {
            checkNewOption_(
              buying,
              selling,
              false, // actually unknown, but irrelevant
            );
          }
        } else {
          // if (mode === "perfect") {
          // trying to find perfect solution, meaning without rounding-error and with tight value equation
          // if (logging) console.log(
          //   "trying to find perfect solution for ",
          //   expBuying,
          //   expSelling,
          // );

          [buyingMultiplier, sellingMultiplier] = reduce(
            buyingMultiplier,
            sellingMultiplier,
          );

          const minBuyingMultiplier = ceilDiv(
            b.minDelta,
            sellingMultiplier,
          );
          const minSellingMultiplier = ceilDiv(
            s.minDelta,
            buyingMultiplier,
          );
          const minMultiplier = max(
            minBuyingMultiplier,
            minSellingMultiplier,
          );

          const maxBuyingMultiplier = maxBuyingForExp /
            sellingMultiplier;
          const maxSellingMultiplier = maxSellingForExp /
            buyingMultiplier;
          const maxMultiplier = min(
            maxBuyingMultiplier,
            maxSellingMultiplier,
          );

          if (minMultiplier <= maxMultiplier) {
            const deltaBuying = maxMultiplier * sellingMultiplier;
            const deltaSelling = maxMultiplier * buyingMultiplier;
            checkNewOption_(
              deltaBuying,
              deltaSelling,
              true,
            );
            continue; // if we found a perfect solution, we know that increasing exps will only make it worse
            // }
          } else {
            // try to find imperfect solution if we can't find a perfect one (TODO this eats the bulk of the expected runtime)
            // if (logging) console.log(
            //   "trying to find imperfect solution for ",
            //   expBuying,
            //   expSelling,
            // );

            buyingForSelling = (selling: bigint): bigint =>
              (selling * sellingMultiplier) / buyingMultiplier;
            sellingForBuying = (buying: bigint): bigint =>
              ceilDiv(buying * buyingMultiplier, sellingMultiplier);

            if (variant.accuracy === "imperfectMaxDelta") {
              const buyingForMaxSelling = buyingForSelling(maxSellingForExp);
              // const sellingForMaxBuying = sellingForBuying(maxBuyingForExp);
              let buying: bigint;
              let selling: bigint;

              if (buyingForMaxSelling < maxBuyingForExp) {
                buying = buyingForMaxSelling;
                selling = maxSellingForExp;
              } else {
                buying = maxBuyingForExp;
                const sellingForMaxBuying = sellingForBuying(maxBuyingForExp);
                selling = max(sellingForMaxBuying, s.minDelta);
              }

              // if (sellingForMaxBuying < maxSellingForExp) {
              //   assert(selling === max(sellingForMaxBuying, s.minDelta));
              //   assert(buying === maxBuyingForExp);
              // } else {
              //   assert(selling === maxSellingForExp);
              //   assert(buying === buyingForMaxSelling);
              // }

              if (buying >= b.minDelta) {
                checkNewOption_(
                  buying,
                  selling,
                  false,
                );
              }
            } else {
              const findImperfectExhaustively = (
                minSelling: bigint,
                maxSelling: bigint,
              ): PairOption | null => {
                let prevDeltaBuying: bigint | null = null;
                let deltaSelling = minSelling;
                let bestFoundImprovement: PairOption | null = null;
                while (
                  deltaSelling <= maxSelling // && improvementFeasible_() // TODO what (not using this function anyways)
                ) {
                  const maxBuyingForSelling = buyingForSelling(deltaSelling);
                  if (prevDeltaBuying !== null) {
                    assert(
                      maxBuyingForSelling > prevDeltaBuying,
                      `${maxBuyingForSelling} <= ${prevDeltaBuying}`,
                    );
                    const maxBuyingForSelling_ =
                      ((deltaSelling - 1n) * sellingMultiplier) /
                      buyingMultiplier;
                    assert(maxBuyingForSelling_ === prevDeltaBuying);
                  }
                  prevDeltaBuying = maxBuyingForSelling;
                  assert(maxBuyingForSelling >= b.minDelta);

                  if (maxBuyingForSelling < maxBuyingForExp!) {
                    const maybeBetter = checkNewOption_(
                      maxBuyingForSelling,
                      deltaSelling,
                      false,
                    );
                    if (maybeBetter) {
                      bestFoundImprovement = maybeBetter;
                    }
                  } else {
                    const maybeBetter = checkNewOption_(
                      maxBuyingForExp!,
                      deltaSelling,
                      false,
                    );
                    if (maybeBetter) {
                      bestFoundImprovement = maybeBetter;
                    }
                    break;
                  }

                  const minDeltaSellingForNextBuying = sellingForBuying(
                    maxBuyingForSelling + 1n,
                  );
                  assert(minDeltaSellingForNextBuying > deltaSelling);
                  deltaSelling = minDeltaSellingForNextBuying;
                }

                return bestFoundImprovement;
              };

              // see math/swapfinding/rounding copy 6.ipynb for reasoning behind the algorithm below

              type Rational = {
                numerator: bigint;
                denominator: bigint;
              };
              type Point = {
                delta: bigint;
                loss: Rational;
              };

              // 1 means a is larger, -1 means b is larger
              const compare = (a: Rational, b: Rational): number => {
                const aLoss = a.numerator * b.denominator;
                const bLoss = b.numerator * a.denominator;
                if (aLoss === bLoss) return 0;
                if (aLoss > bLoss) return 1;
                return -1;
              };

              const bestStep = (
                stepsizes: bigint[],
                current: Point,
              ) => {
                let next: Point | null = null;
                let stepsize_: bigint | null = null;
                for (let i = 0; i < stepsizes.length; i++) {
                  const stepsize = stepsizes[i];
                  const delta_ = current.delta + stepsize;
                  if (delta_ > maxDeltaCombined) continue;
                  const next_ = pointForDelta(delta_, false);
                  if (next === null || compare(next_.loss, next.loss) < 0) {
                    printPoint(next_);
                    next = next_;
                    stepsize_ = stepsize;
                  }
                }
                return { next, stepsize_ };
              };

              // let runAsserts = true;
              // let runAssertsFrom: bigint | null = null;
              // p2 is the point with the larger delta aka x-value
              const extrapolate = (
                p1: Point,
                p2: Point,
                // backwards = false,
              ): Point => {
                const x1 = p1.delta;
                const x2 = p2.delta;
                assert(x1 !== x2);
                if (x1 === x2) return p2;
                const n1 = p1.loss.numerator;
                const d1 = p1.loss.denominator;
                const n2 = p2.loss.numerator;
                const d2 = p2.loss.denominator;

                const a1 = d1 * n2;
                const a2 = d2 * n1;
                const stepsize = x2 - x1;
                if (a1 === a2) return p2; // TODO extrapolate to end here? (unimportant, almost never happens)
                let root = (a1 * x1 - a2 * x2) / (a1 - a2);
                const upwards = root < x1;
                if (upwards) {
                  throw new Error("wip");
                  // if (backwards) {
                  //   root = x1 - ((x1 - root) / stepsize) * stepsize;
                  //   if (root < x1 && root >= minDelta) {
                  //     const p3 = pointForDelta(root);
                  //     // assert(compare(p3.loss, p1.loss) <= 0);
                  //     if (compare(p3.loss, p1.loss) < 0) return p3;
                  //   }
                  //   return p1;
                  // } else {
                  //   root = x2 + ((x1 - root) / stepsize) * stepsize;
                  //   if (root > x2 && root <= maxDelta) {
                  //     if (logging) console.log("# extrapolated:");
                  //     const p3 = pointForDelta(root);
                  //     // assert(compare(p3.loss, p2.loss) <= 0);
                  //     return p3;
                  //   }
                  //   return p2;
                  // }
                } else {
                  root = x2 + ((root - x2) / stepsize) * stepsize;
                  if (root > x2) {
                    if (root > maxDeltaCombined) {
                      root = maxDeltaCombined;
                      if (logging) {
                        console.log("# trying to extrapolate to end:");
                      }
                      const p3 = pointForDelta(root);
                      if (compare(p3.loss, p2.loss) <= 0) {
                        // runAsserts = true;
                        // if (runAssertsFrom === null) runAssertsFrom = x2;
                        return p3;
                      }
                      return p2;
                    }
                    if (logging) console.log("# extrapolated:");
                    const p3 = pointForDelta(root);
                    assert(compare(p3.loss, p2.loss) <= 0);
                    return p3;
                  } else {
                    // if (logging) console.log(`
                    // root: ${root}
                    // x1: ${x1}
                    // x2: ${x2}
                    // stepsize: ${stepsize}
                    // `);
                  }
                  return p2;
                }
              };

              const printPoint = (p: Point) => {
                if (!logging) return;
                // let numerator = p.loss.numerator;
                // let denominator = p.loss.denominator;
                // let denominator_ = Number(denominator);
                // while (!isFinite(denominator_)) {
                //   numerator /= 10n;
                //   denominator /= 10n;
                //   denominator_ = Number(denominator);
                // }
                const otherDelta = otherAssetEquivalent(p.delta);
                const [buying, selling] = xAxis === "buying"
                  ? [p.delta, otherDelta]
                  : [otherDelta, p.delta];
                // const loss = Number(numerator) / denominator_;
                // console.log(`\t(${buying}, ${selling}, ${loss}),`);
                console.log(`\t(${buying}, ${selling}`);
              };

              const pointForDelta_ = (
                numerator: bigint,
                denominator: bigint,
                // tighten = (delta: bigint) => delta,
              ) =>
              (delta: bigint, print = true): Point => {
                // delta = tighten(delta);
                let remainder = (numerator * delta) % denominator;
                if (numerator < 0n) remainder += denominator;
                const loss = {
                  numerator: remainder,
                  denominator,
                };
                const point = { delta, loss };
                if (print) printPoint(point);
                return point;
              };

              let maxDeltaCombined: bigint;
              let minDeltaCombined: bigint;
              let minDeltaAlone: bigint;
              let maxDeltaAlone: bigint;
              let xAxis: "buying" | "selling";
              let otherAssetEquivalent: (delta: bigint) => bigint;
              let pointForDelta: (delta: bigint, print?: boolean) => Point;
              // const minimizeSelling = (selling: bigint): bigint => {
              //   const minimized = sellingForBuying(buyingForSelling(selling));
              //   assert(minimized === selling, `${minimized} !== ${selling}`); // TODO remove usage of this function
              //   return minimized;
              // }
              // const maximizeBuying = (buying: bigint): bigint =>
              //   buyingForSelling(sellingForBuying(buying));

              if (buyingMultiplier < sellingMultiplier) {
                xAxis = "selling";
                pointForDelta = pointForDelta_(
                  sellingMultiplier,
                  buyingMultiplier,
                  // minimizeSelling,
                );
                // TODO minimize/maximize?
                // otherAssetEquivalent = buyingForSelling;
                otherAssetEquivalent = buyingForSelling; //(delta:bigint) => buyingForSelling(minimizeSelling(delta));
                const maxForOtherMax = sellingForBuying(maxBuyingForExp);
                const minForOtherMin = sellingForBuying(b.minDelta);
                if (logging) console.log("maxForOtherMax", maxForOtherMax);
                if (logging) {
                  console.log("maxSellingForExp", maxSellingForExp);
                }
                maxDeltaCombined = min(maxForOtherMax, maxSellingForExp);
                minDeltaCombined = max(minForOtherMin, s.minDelta);
                minDeltaAlone = s.minDelta;
                maxDeltaAlone = maxSellingForExp;
                if (buyingForSelling(maxDeltaCombined) > maxBuyingForExp) {
                  maxDeltaCombined--;
                }
              } else {
                xAxis = "buying";
                pointForDelta = pointForDelta_(
                  -buyingMultiplier,
                  sellingMultiplier,
                );
                // TODO minimize/maximize?
                otherAssetEquivalent = sellingForBuying; //(delta:bigint) => minimizeSelling(sellingForBuying(delta));
                const maxForOtherMax = buyingForSelling(maxSellingForExp);
                // minimizeSelling(maxSellingForExp)
                //);
                const minForOtherMin = //maximizeBuying(
                  buyingForSelling(s.minDelta);
                //  );
                if (logging) console.log("minForOtherMin", minForOtherMin);
                if (logging) console.log("b.minDelta", b.minDelta);
                maxDeltaCombined = min(maxForOtherMax, maxBuyingForExp);
                minDeltaCombined = max(minForOtherMin, b.minDelta);
                if (sellingForBuying(minDeltaCombined) < s.minDelta) {
                  minDeltaCombined++;
                }
                minDeltaAlone = b.minDelta;
                maxDeltaAlone = maxBuyingForExp;
              }
              if (logging) console.log("minDeltaAlone", minDeltaAlone);
              if (logging) console.log("maxDeltaAlone", maxDeltaAlone);
              if (logging) console.log("minDeltaCombined", minDeltaCombined);
              if (logging) console.log("maxDeltaCombined", maxDeltaCombined);
              if (logging) console.log("stepping", xAxis);

              // minDeltaCombined = minDeltaAlone;

              let bestImperfectOption: PairOption | null = null;
              const foundImperfectSolution_ = (
                buying: bigint,
                selling: bigint,
              ) => {
                if (logging) {
                  console.log("found imperfect solution", buying, selling);
                }
                const maybeBetter = checkNewOption_(
                  buying,
                  selling,
                  false,
                );
                if (maybeBetter) {
                  bestImperfectOption = maybeBetter;
                }
              };
              const foundImperfectSolution = (delta: bigint) => {
                const otherDelta = otherAssetEquivalent(delta);
                const [buying, selling] = xAxis === "buying"
                  ? [delta, otherDelta]
                  : [otherDelta, delta];
                foundImperfectSolution_(buying, selling);
              };

              if (minDeltaCombined === maxDeltaCombined) {
                if (logging) {
                  console.log(`${minDeltaCombined} === ${maxDeltaCombined}`);
                }
                foundImperfectSolution(maxDeltaCombined);
              } else if (minDeltaCombined < maxDeltaCombined) {
                if (logging) {
                  console.log(`${minDeltaCombined} < ${maxDeltaCombined}`);
                }

                if (logging) {
                  console.log("m_b =", buyingMultiplier.toString());
                }
                if (logging) {
                  console.log("m_s =", sellingMultiplier.toString());
                }
                if (logging) {
                  console.log("min_delta_b =", b.minDelta.toString());
                }
                if (logging) {
                  console.log("min_delta_s =", s.minDelta.toString());
                }
                if (logging) {
                  console.log("max_delta_b =", maxBuyingForExp.toString());
                }
                if (logging) {
                  console.log("max_delta_s =", maxSellingForExp.toString());
                }
                if (logging) console.log(`stepping = "${xAxis}"`);

                const search = (minDelta: bigint): Point => {
                  if (logging) console.log("slopes = [[");
                  const stepsizes = [1n];
                  let current = pointForDelta(minDelta);
                  let optimum = current;
                  let prevWorsening = current;
                  while (true) {
                    let stepsize = 1n;
                    if (current.delta >= maxDeltaCombined) break;
                    let { next, stepsize_ } = bestStep(stepsizes, current);
                    next ??= pointForDelta(current.delta + 1n);
                    stepsize = stepsize_ ?? 1n;
                    const gotWorse = compare(next.loss, current.loss) > 0;
                    if (gotWorse) {
                      for (const vs of [prevWorsening, optimum]) {
                        const distance = current.delta - vs.delta;
                        if (logging) {
                          console.log(
                            "# worsened; distance:",
                            distance,
                            "stepsize:",
                            stepsize,
                          );
                        }
                        if (distance !== 0n) {
                          if (!stepsizes.includes(distance)) {
                            if (logging) {
                              console.log("# new stepsize:", distance);
                            }
                            stepsizes.push(distance);
                          }
                          // else if (distance === stepsize) {
                          //   let next_: Point | null = extrapolate(current, next);
                          //   next_ = bestStep(stepsizes, next_).next;
                          //   if (next_) {
                          //     const nextBak = next_;
                          //     next_ = bestStep(stepsizes, next_).next;
                          //     if (next_) {
                          //       next = extrapolate(nextBak, next_, true);
                          //     }
                          //   }
                          // }
                        }
                      }
                      let backStepSize = 0n;
                      // let backstepped = false;
                      // const nextBak = next;
                      for (let i = 0; i < stepsizes.length; i++) {
                        const stepsize_ = stepsizes[i];
                        if (stepsize_ >= stepsize) continue;
                        const delta_ = next.delta - stepsize_;
                        const next_ = pointForDelta(delta_, false);
                        if (compare(next_.loss, next.loss) < 0) {
                          printPoint(next_);
                          next = next_;
                          // backstepped = true;
                          backStepSize = stepsize_;
                        }
                      }
                      // if (backstepped) {
                      //   next = extrapolate(nextBak, next);
                      // }
                      if (backStepSize > 0n) {
                        while (true) {
                          const delta_ = next.delta - backStepSize;
                          const next_ = pointForDelta(delta_, false);
                          if (compare(next_.loss, next.loss) < 0) {
                            printPoint(next_);
                            next = next_;
                          } else break;
                        }
                      }
                      prevWorsening = current;
                    } else {
                      next = extrapolate(current, next);
                    }
                    if (compare(next.loss, optimum.loss) < 0) {
                      const distance = next.delta - optimum.delta;
                      if (logging) {
                        console.log(
                          "# new optimum; distance:",
                          distance,
                          "stepsize:",
                          stepsize,
                        );
                      }
                      if (distance !== 0n && !stepsizes.includes(distance)) {
                        if (logging) console.log("# new stepsize:", distance);
                        stepsizes.push(distance);
                      }

                      next = extrapolate(optimum, next);

                      optimum = next;
                      prevWorsening = next;
                    }
                    current = next;
                  }
                  if (logging) console.log("]]");
                  if (logging) console.log("stepsizes:", stepsizes);
                  return optimum;
                };
                const optimum = search(minDeltaCombined);
                foundImperfectSolution(optimum.delta);
              } else if (minDeltaAlone < minDeltaCombined) {
                if (logging) {
                  console.log(
                    "minDeltaAlone < minDeltaCombined",
                    minDeltaAlone,
                    minDeltaCombined,
                  );
                }
                if (xAxis === "buying") {
                  const selling = s.minDelta;
                  const buying = min(
                    buyingForSelling(selling),
                    maxBuyingForExp,
                  );
                  foundImperfectSolution_(buying, selling);
                } else {
                  const selling = sellingForBuying(b.minDelta);
                  if (selling <= maxSellingForExp) {
                    const buying = min(
                      buyingForSelling(selling),
                      maxBuyingForExp,
                    );
                    foundImperfectSolution_(buying, selling);
                  }
                }
              } else if (maxDeltaCombined < maxDeltaAlone) {
                if (logging) {
                  console.log(
                    "maxDeltaCombined < maxDeltaAlone",
                    maxDeltaCombined,
                    maxDeltaAlone,
                  );
                }
                if (xAxis === "selling") {
                  const buying = maxBuyingForExp;
                  const selling = max(sellingForBuying(buying), s.minDelta);
                  foundImperfectSolution_(buying, selling);
                }
              }

              // we're here because maxSelling < minSelling
              // else if (minSelling <= maxSellingForExp) {
              //   if (logging) console.log(`${minSelling} <= ${maxSellingForExp}`);
              //   const maybeBetter = findImperfectExhaustively(
              //     minSelling,
              //     maxSellingForExp,
              //   );
              //   if (maybeBetter) {
              //     bestImperfectOption = maybeBetter;
              //   }
              // } // otherwise no solution possible

              // here: assert that we can't find a better solution
              // if (logging) console.log("exhaustive search");
              // runAsserts = false;
              // runAsserts = true // TODO revert
              if (runAsserts) {
                let from_ = max(s.minDelta, sellingForBuying(b.minDelta));
                // let from = runAssertsFrom as bigint | null;
                // if (from) {
                //   if (xAxis === "buying") {
                //     const tmp = sellingForBuying(from)
                //     from = minimizeSelling(tmp);
                //     assert(from === tmp, `${from} !== ${tmp}`); // means we don't need minimizeSelling
                //   }
                //   from_ = max(from, from_);
                // }
                const maybeBetter = findImperfectExhaustively(
                  from_,
                  maxSellingForExp,
                );
                if (maybeBetter) {
                  if (logging) console.log("asserting");
                  assert(bestImperfectOption !== null, maybeBetter.show());
                  const best = bestImperfectOption as PairOption;
                  assert(
                    best.effectivePrice <= maybeBetter.effectivePrice,
                    `${best.effectivePrice} > ${maybeBetter.effectivePrice}
                     diff: ${best.effectivePrice - maybeBetter.effectivePrice}
                     best imperfect: ${best.show()}
                     exhaustive: ${maybeBetter.show()}}`,
                  );
                }
              }
            }
          }
        }

        if (continueExploringExps) {
          assert(b.maxDelta !== "oo");
          if (stepBuyingFirst) {
            if (maxBuyingForExp < b.maxDelta) {
              queue.push({ expBuying: expBuying + 1n, expSelling });
            }
            if (s.maxDelta === "oo" || maxSellingForExp < s.maxDelta) {
              queue.push({ expBuying, expSelling: expSelling + 1n });
            }
          } else {
            if (s.maxDelta === "oo" || maxSellingForExp < s.maxDelta) {
              queue.push({ expBuying, expSelling: expSelling + 1n });
            }
            if (maxBuyingForExp < b.maxDelta) {
              queue.push({ expBuying: expBuying + 1n, expSelling });
            }
          }
        }
      }
      if (bestAdheringOption) {
        if (logging) {
          console.log("found adhering solution:", bestAdheringOption);
        }
        break;
      }
    }

    // assert(!bestPriceOption || (bestPriceOption as PairOption).perfect); // fails, which means sometimes the best solution has rounding error
    const exceeding = bestExceedingOption as PairOption | null;
    const adhering = bestAdheringOption as PairOption | null;

    if (logging) console.log("best adhering option:", adhering?.show());
    if (logging) console.log("best exceeding option:", exceeding?.show());

    this.bestAdheringOption = adhering;
    this.maxIntegerImpacted = exceeding !== null; // && //adhering === null;
    // (adhering === null ||
    //   exceeding.deltaSelling * adhering.deltaBuying <
    //     adhering.deltaSelling * exceeding.deltaBuying); // not bothering with comparing deltas at this point
    // this.bestOverallOption = this.maxIntegerImpacted ? exceeding : adhering;

    if (logging) console.log("maxIntegerImpacted:", this.maxIntegerImpacted);
    // assert(!(this.maxIntegerImpacted && adhering)); // just verifying a curious obvervation, no reason to insist on this
    // if (!adhering) {
    //   // assert(!exceeding, `${this.maxIntegerImpacted}\n${exceeding?.show()}`); // fails
    // } else if (exceeding) {
    //   assert(exceeding.deltaSelling * adhering.deltaBuying >= adhering.deltaSelling * exceeding.deltaBuying) // different way to put it
    // }
  }
}
// }
