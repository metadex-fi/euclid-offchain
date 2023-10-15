import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { ceilDiv, maxInteger, min } from "./generators.ts";
import { Asset } from "../types/general/derived/asset/asset.ts";
import { Dirac } from "../types/euclid/dirac.ts";
import { Param } from "../types/euclid/param.ts";
import { Swapping } from "../chain/actions/swapping.ts";

export const delta = (w: bigint, l: bigint) => (s: bigint) => (s - l * w) / w;

export const findBuyingExp = (
  anchor: bigint,
  jumpSize: bigint,
  buyable: bigint,
  minBuying: bigint,
  delta_: (s: bigint) => bigint,
  buyingExp: bigint,
  expLimit?: number,
): {
  buyingExp: bigint;
  buyingSpot: bigint;
  maxBuying: bigint;
} | null => {
  if (buyable >= minBuying) {
    let buyingSpot = Swapping.spot(anchor, jumpSize, buyingExp);
    while (
      buyingSpot > 0n &&
      (expLimit === undefined ||
        bestMultiplicationsAhead(Number(buyingExp)) <= expLimit)
    ) {
      const d = delta_(buyingSpot);
      const maxBuying = min(buyable, -d);
      // console.log(`
      //   buyable: ${buyable}
      //   d: ${d}
      //   maxBuying: ${maxBuying}
      // `);

      if (maxBuying >= minBuying) {
        return { buyingExp, buyingSpot, maxBuying };
      } else {
        buyingExp--;
        buyingSpot = Swapping.spot(anchor, jumpSize, buyingExp);
        // if maxBuying is 0, then d is too low, which means that
        // we are too close at the amm-price. So we ~increase~ the
        // (uninverted) price we are willing to ~buy~ at stepwise
        // until either we hit the bounds or find a d >= 1.
      }
    }
  }
  return null;
};

export const findSellingExp = (
  adhereMaxInteger: boolean,
  anchor: bigint,
  jumpSize: bigint,
  sellable: bigint | undefined,
  minSelling: bigint,
  delta_: (s: bigint) => bigint,
  sellingExp: bigint,
  expLimit?: number,
):
  | {
    sellingExp: bigint;
    sellingSpot: bigint;
    maxSelling: bigint;
  }
  | "cannotAdhere"
  | null => {
  const infiniteSellable = sellable === undefined || sellable === -1n;
  if (infiniteSellable || sellable >= minSelling) {
    let sellingSpot = Swapping.spot(anchor, jumpSize, sellingExp);
    if (sellingSpot > 0n) {
      while (
        expLimit === undefined ||
        bestMultiplicationsAhead(Number(sellingExp)) <= expLimit
      ) {
        const d = delta_(sellingSpot);
        const maxSelling = infiniteSellable ? d : min(sellable, d);
        if (maxSelling >= minSelling) {
          return { sellingExp, sellingSpot, maxSelling };
        } else {
          sellingExp++;
          sellingSpot = Swapping.spot(anchor, jumpSize, sellingExp);
          // if maxSelling is 0, then d is too low, which means that
          // we are too close at the amm-price. So we ~decrease~ the
          // (uninverted) price we are willing to ~sell~ at stepwise
          // until we hit the bounds or find a d >= 1.
          // NOTE/TODO: This should never result in an infite loop,
          // as decreasing uninverted selling price should eventually
          // result in some delta.
          if (adhereMaxInteger && sellingSpot > maxInteger) {
            return "cannotAdhere";
          }
          if (
            expLimit &&
            bestMultiplicationsAhead(Number(sellingExp)) > expLimit
          ) return null;
        }
      }
    }
  }
  return null;
};

// each power of 2 is a multiplication.
export const countMultiplications = (exp: number): number => {
  exp = Math.abs(exp);

  const binaryRepresentation = exp.toString(2).slice(1);
  const b = binaryRepresentation.length; // Total bits
  const k = (binaryRepresentation.match(/1/g) || []).length; // Count of '1' bits

  return b + k;
};

// best we can do to decrease the number of multiplications is reaching the next power of 2
export const bestMultiplicationsAhead = (exp: number): number =>
  Math.abs(exp - 1).toString(2).length;

export const fitSellingLimit = (
  param: Param,
  dirac: Dirac,
  buyingAsset: Asset,
  sellingAsset: Asset,
  buyingExp: bigint,
  sellingExp: bigint,
  expLimit: number,
  maxBuying: bigint,
  maxSelling: bigint | null,
  minSelling: bigint,
):
  | {
    buyingExp: bigint;
    sellingExp: bigint;
    buyingSpot: bigint;
    sellingSpot: bigint;
  }
  | "unchanged"
  | null => {
  let buyingMults = countMultiplications(Number(buyingExp));
  let sellingMults = countMultiplications(Number(sellingExp));

  if (buyingMults + sellingMults <= expLimit) {
    return "unchanged";
  } else {
    console.log(
      `multiplications limit reached, optimizing: ${buyingMults} + ${sellingMults} > ${expLimit}`,
    );

    const buyingAnchor = dirac.anchorPrices.amountOf(buyingAsset);
    const sellingAnchor = dirac.anchorPrices.amountOf(sellingAsset);

    const buyingJumpSize = param.jumpSizes.amountOf(buyingAsset);
    const sellingJumpSize = param.jumpSizes.amountOf(sellingAsset);

    const buyingBest = bestMultiplicationsAhead(Number(buyingExp));
    const sellingBest = bestMultiplicationsAhead(Number(sellingExp));

    if (buyingBest + sellingBest > expLimit) {
      console.log(
        `can optimize neither: ${buyingBest} + ${sellingBest} > ${expLimit}`,
      );
      return null;
    } else if (buyingMults <= buyingBest) {
      console.log(`can only optimize sellingExp`);
      const sellingLimit = expLimit - buyingMults;
      while (sellingMults > sellingLimit) {
        sellingExp++;
        sellingMults = countMultiplications(Number(sellingExp));
      }
    } else if (sellingMults <= sellingBest) {
      console.log(`can only optimize buyingExp`);
      const buyingLimit = expLimit - sellingMults;
      while (buyingMults > buyingLimit) {
        buyingExp--;
        buyingMults = countMultiplications(Number(buyingExp));
      }
    } else {
      console.log(`can optimize both`);
      //...so we are going to find all the better exps and then pick the best combination
      const buyings: { exp: bigint; mults: number }[] = [];
      const sellings: { exp: bigint; mults: number }[] = [];
      let buyingNextExp = buyingExp;
      let buyingNextMults = buyingMults;
      while (buyingNextMults > buyingBest) {
        buyingNextExp--;
        const nextMults = countMultiplications(Number(buyingNextExp));
        if (nextMults < buyingNextMults) {
          buyings.push({ exp: buyingNextExp, mults: nextMults });
          buyingNextMults = nextMults;
        }
      }
      let sellingNextExp = sellingExp;
      let sellingNextMults = sellingMults;
      while (sellingNextMults > sellingBest) {
        sellingNextExp++;
        const nextMults = countMultiplications(Number(sellingNextExp));
        if (nextMults < sellingNextMults) {
          sellings.push({ exp: sellingNextExp, mults: nextMults });
          sellingNextMults = nextMults;
        }
      }
      console.log(`buyings: ${buyings.length}`);
      console.log(`sellings: ${sellings.length}`);
      let frontier: {
        buyingExp: bigint;
        sellingExp: bigint;
        buyingMults: number;
        sellingMults: number;
        effectivePrice: number;
      }[] = [];
      for (const buying of buyings) {
        for (const selling of sellings) {
          if (buying.mults + selling.mults <= expLimit) {
            frontier.push({
              buyingExp: buying.exp,
              sellingExp: selling.exp,
              buyingMults: buying.mults,
              sellingMults: selling.mults,
              effectivePrice: -1,
            });
            break;
          }
        }
      }
      console.log(`frontier: ${frontier.length}`);
      assert(frontier.length, `frontier.length === 0`);
      let bestPrice: number;
      frontier = frontier.map((f) => {
        const buyingSpot = Swapping.spot(
          buyingAnchor,
          buyingJumpSize,
          f.buyingExp,
        );
        const sellingSpot = Swapping.spot(
          sellingAnchor,
          sellingJumpSize,
          f.sellingExp,
        );

        const newMaxBuyingA0 = maxBuying * sellingSpot;
        const newMaxSellingA0 = maxSelling === null
          ? null
          : maxSelling * buyingSpot;
        const newMaxSwapA0 = newMaxSellingA0 === null
          ? newMaxBuyingA0
          : min(newMaxSellingA0, newMaxBuyingA0);

        const newBuyingAmount = newMaxSwapA0 / sellingSpot;
        let newSellingAmount = ceilDiv(
          newBuyingAmount * sellingSpot,
          buyingSpot,
        );
        if (newSellingAmount < minSelling) newSellingAmount = minSelling;

        const effectivePrice = Number(newSellingAmount) /
          Number(newBuyingAmount);
        if (bestPrice === undefined || effectivePrice < bestPrice) {
          bestPrice = effectivePrice;
        }

        return {
          ...f,
          effectivePrice,
        };
      });
      console.log(`bestPrice: ${bestPrice!}`);
      const optimum = frontier.find((f) => f.effectivePrice === bestPrice);
      assert(optimum, `optimum === undefined`);
      buyingExp = optimum.buyingExp;
      sellingExp = optimum.sellingExp;
    }
    const buyingSpot = Swapping.spot(
      buyingAnchor,
      buyingJumpSize,
      buyingExp,
    );
    const sellingSpot = Swapping.spot(
      sellingAnchor,
      sellingJumpSize,
      sellingExp,
    );
    return { buyingExp, sellingExp, buyingSpot, sellingSpot };
  }
};
