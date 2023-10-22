import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  bestMultiplicationsAhead,
  countMultiplications,
  updatedAmnts,
} from "./helpers.ts";
import { maxInteger } from "../../../utils/constants.ts";

interface FitExpLimitArgs {
  readonly adhereMaxInteger: boolean;
  readonly expLimit: number;
  buyingExp: bigint;
  sellingExp: bigint;
  readonly maxBuying: bigint;
  readonly maxSelling: bigint | null;
  readonly calcBuyingSpot: (exp: bigint) => bigint;
  readonly calcSellingSpot: (exp: bigint) => bigint;
}

export const fitExpLimit = (args: FitExpLimitArgs):
  | {
    buyingExp: bigint;
    sellingExp: bigint;
    maxIntImpacted: boolean;
  }
  | "unchanged"
  | null => {
  let buyingMults = countMultiplications(Number(args.buyingExp));
  let sellingMults = countMultiplications(Number(args.sellingExp));

  if (buyingMults + sellingMults <= args.expLimit) {
    return "unchanged";
  } else {
    console.log(
      `multiplications-limit reached, optimizing: ${buyingMults} + ${sellingMults} > ${args.expLimit}`,
    );

    const buyingBest = bestMultiplicationsAhead(Number(args.buyingExp));
    const sellingBest = bestMultiplicationsAhead(Number(args.sellingExp));
    let maxIntImpacted = false;

    if (buyingBest + sellingBest > args.expLimit) {
      console.log(
        `can optimize neither: ${buyingBest} + ${sellingBest} > ${args.expLimit}`,
      );
      return null;
    } else if (buyingMults <= buyingBest) {
      console.log(`can only optimize sellingExp`);
      const sellingLimit = args.expLimit - buyingMults;
      while (sellingMults > sellingLimit) {
        args.sellingExp++;
        sellingMults = countMultiplications(Number(args.sellingExp));
      }
    } else if (sellingMults <= sellingBest) {
      console.log(`can only optimize buyingExp`);
      const buyingLimit = args.expLimit - sellingMults;
      while (buyingMults > buyingLimit) {
        args.buyingExp--;
        buyingMults = countMultiplications(Number(args.buyingExp));
      }
    } else {
      console.log(`can optimize one or both`);
      //...so we are going to find all the better exps and then pick the best combination
      const buyings = [{ exp: args.buyingExp, mults: buyingMults }];
      const sellings = [{ exp: args.sellingExp, mults: sellingMults }];
      let buyingNextExp = args.buyingExp;
      let buyingNextMults = buyingMults;
      while (buyingNextMults > buyingBest) {
        buyingNextExp--;
        const nextMults = countMultiplications(Number(buyingNextExp));
        if (nextMults < buyingNextMults) {
          buyings.push({ exp: buyingNextExp, mults: nextMults });
          buyingNextMults = nextMults;
        }
      }
      let sellingNextExp = args.sellingExp;
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
          if (buying.mults + selling.mults <= args.expLimit) {
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
      frontier = frontier.flatMap((f) => {
        const buyingSpot = args.calcBuyingSpot(f.buyingExp);
        const sellingSpot = args.calcSellingSpot(f.sellingExp);
        if (args.adhereMaxInteger && sellingSpot > maxInteger) {
          maxIntImpacted = true;
          return [];
        }

        const newAmounts = updatedAmnts(
          buyingSpot,
          sellingSpot,
          args.maxBuying,
          args.maxSelling,
        );

        const effectivePrice = Number(newAmounts.newSellingAmnt) /
          Number(newAmounts.newBuyingAmnt);
        if (bestPrice === undefined || effectivePrice < bestPrice) {
          bestPrice = effectivePrice;
        }

        return {
          ...f,
          effectivePrice,
        };
      });
      if (frontier.length === 0) {
        assert(
          maxIntImpacted,
          `no frontier, but adherence not impacted either`,
        );
        return null;
      }
      console.log(`bestPrice: ${bestPrice!}`);
      const optimum = frontier.find((f) => f.effectivePrice === bestPrice);
      assert(optimum, `optimum === undefined`);
      args.buyingExp = optimum.buyingExp;
      args.sellingExp = optimum.sellingExp;
    }

    console.log(`
          fitted expLimit:
      ---------------------------
      buyingExp:        ${args.buyingExp}
      sellingExp:       ${args.sellingExp}
      ---------------------------
    `);
    return {
      buyingExp: args.buyingExp,
      sellingExp: args.sellingExp,
      maxIntImpacted,
    };
  }
};
