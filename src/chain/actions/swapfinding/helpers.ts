import { ceilDiv, min } from "../../../utils/generators.ts";
import { maxInteger } from "../../../utils/constants.ts";
import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { AssetArgs, PostFitAmnts } from "./assetArgs.ts";
import { fitMinAmnts } from "./fitMinAmnts.ts";
import { fitExpLimit } from "./fitExpLimit.ts";

export const calcDelta = (w: bigint, l: bigint) => (s: bigint) =>
  (s - l * w) / w;

export const calcSpot = (a: bigint, j: bigint) => (e: bigint) =>
  (0 <= e)
    ? (a * ((j + 1n) ** e)) / (j ** e)
    : (a * (j ** -e)) / ((j + 1n) ** -e);

export const calcExp = (anchor: number, amm: number, jumpMultiplier: number) =>
  Math.log(amm / anchor) /
  Math.log(jumpMultiplier);

interface FitExpArgs {
  readonly adhereMaxInteger: boolean;
  readonly available: bigint;
  readonly min_: bigint;
  readonly calcSpot_: (exp: bigint) => bigint;
  readonly calcDelta_: (spot: bigint) => bigint;
  exp: bigint;
  readonly direction: -1n | 1n;
  readonly expLimit: number | null;
}

export const fitExp = (args: FitExpArgs):
  | {
    exp: bigint;
    spot: bigint;
    max: bigint;
  }
  | "cannotAdhere"
  | null => {
  const infiniteAvailable = args.available === null || args.available === -1n;
  if (infiniteAvailable || args.available >= args.min_) {
    let spot = args.calcSpot_(args.exp);
    while (
      spot > 0n &&
      (args.expLimit === null ||
        bestMultiplicationsAhead(Number(args.exp)) <= args.expLimit)
    ) {
      const delta = args.direction * args.calcDelta_(spot);
      const max = infiniteAvailable ? delta : min(args.available, delta);
      if (max >= args.min_) {
        return { exp: args.exp, spot, max };
      } else {
        args.exp += args.direction;
        spot = args.calcSpot_(args.exp);
        // if maxBuying is 0, then d is too low, which means that
        // we are too close at the amm-price. So we ~increase~ the
        // (uninverted) price we are willing to ~buy~ at stepwise
        // until either we hit the bounds or find a d >= 1.
        // if maxSelling is 0, then d is too low, which means that
        // we are too close at the amm-price. So we ~decrease~ the
        // (uninverted) price we are willing to ~sell~ at stepwise
        // until we hit the bounds or find a d >= 1.
        // NOTE/TODO: This should never result in an infite loop,
        // as decreasing uninverted selling price should eventually
        // result in some delta.
        if (args.adhereMaxInteger && spot > maxInteger) {
          return "cannotAdhere";
        }
      }
    }
    console.log(
      `fitExp: expLimit reached: ${
        bestMultiplicationsAhead(Number(args.exp))
      } > ${args.expLimit}`,
    );
    return null;
  }
  console.log(`fitExp: not enough available: ${args.available} < ${args.min_}`);
  return null;
};

// NOTE: below not strictly A0, but want to avoid divisions.
// Ok, since only relative value matters. Assume it's a different A0', derived from:
//  const maxBuyingA0 = (maxBuying / buyingSpot) * (sellingSpot * buyingSpot);
//  const maxSellingA0 = (maxSelling / sellingSpot) * (sellingSpot * buyingSpot);
//  (sellingSpot * buyingSpot) are the same for both and added so we can remove divisions.
export const updatedAmnts = (
  buyingSpot: bigint,
  sellingSpot: bigint,
  maxBuying: bigint,
  maxSelling: bigint | null,
): {
  newMaxSwapA0: bigint;
  newMaxBuyingA0: bigint;
  newMaxSellingA0: bigint | null;
  newBuyingAmnt: bigint;
  newSellingAmnt: bigint;
} => {
  const infiniteSellable = maxSelling === null || maxSelling === -1n;
  const newMaxBuyingA0 = maxBuying * sellingSpot;
  const newMaxSellingA0 = infiniteSellable ? null : maxSelling * buyingSpot;
  const newMaxSwapA0 = newMaxSellingA0 === null
    ? newMaxBuyingA0
    : min(newMaxSellingA0, newMaxBuyingA0);

  const newBuyingAmnt = newMaxSwapA0 / sellingSpot;
  assert(
    newBuyingAmnt <= maxBuying,
    `newBuyingAmnt > maxBuying: ${newBuyingAmnt} > ${maxBuying}`,
  );
  const newSellingAmnt = ceilDiv(
    newBuyingAmnt * sellingSpot,
    buyingSpot,
  );
  assert(
    infiniteSellable || newSellingAmnt <= maxSelling,
    `newSellingAmnt > maxSelling: ${newSellingAmnt} > ${maxSelling}`,
  );

  return {
    newMaxSwapA0,
    newMaxBuyingA0,
    newMaxSellingA0,
    newBuyingAmnt,
    newSellingAmnt,
  };
};

interface FitAmntsArgs {
  readonly adhereMaxInteger: boolean;
  readonly tmpMinBuying: bigint | null;
  readonly expLimit: number | null;
  readonly buyingArgs: AssetArgs;
  readonly sellingArgs: AssetArgs;
}

export const fitAmnts = (args: FitAmntsArgs): PostFitAmnts | null => {
  let fitted: PostFitAmnts | null = {
    buyingVars: args.buyingArgs.vars,
    sellingVars: args.sellingArgs.vars,
    maxIntImpacted: args.buyingArgs.consts.maxIntImpacted ||
      args.sellingArgs.consts.maxIntImpacted,
  };

  while (true) {
    fitted = fitMinAmnts({
      adhereMaxInteger: args.adhereMaxInteger,
      tmpMinBuying: args.tmpMinBuying,
      expLimit: args.expLimit,
      buying: {
        ...args.buyingArgs,
        vars: fitted.buyingVars,
      },
      selling: {
        ...args.sellingArgs,
        vars: fitted.sellingVars,
      },
    });
    if (fitted === null) {
      console.log(`could not fit minAmnts`);
      return null;
    } else if (args.expLimit === null) {
      fitted.maxIntImpacted ||= fitted.maxIntImpacted;
      break;
    } else {
      fitted.maxIntImpacted ||= fitted.maxIntImpacted;
      const fittedExps = fitExpLimit({
        adhereMaxInteger: args.adhereMaxInteger,
        expLimit: args.expLimit,
        buyingExp: fitted.buyingVars.exp,
        sellingExp: fitted.sellingVars.exp,
        maxBuying: fitted.buyingVars.max,
        maxSelling: fitted.sellingVars.max,
        calcBuyingSpot: args.buyingArgs.funcs.calcSpot_,
        calcSellingSpot: args.sellingArgs.funcs.calcSpot_,
      });
      if (fittedExps === null) {
        console.log(`could not fit expLimit`);
        return null;
      } else if (fittedExps === "unchanged") break;
      else {
        if (fitted.buyingVars.exp !== fittedExps.buyingExp) {
          fitted.buyingVars.exp = fittedExps.buyingExp;
          fitted.buyingVars.spot = args.buyingArgs.funcs.calcSpot_(
            fittedExps.buyingExp,
          );
        }
        if (fitted.sellingVars.exp !== fittedExps.sellingExp) {
          fitted.sellingVars.exp = fittedExps.sellingExp;
          fitted.sellingVars.spot = args.sellingArgs.funcs.calcSpot_(
            fittedExps.sellingExp,
          );
        }
        fitted.maxIntImpacted ||= fittedExps.maxIntImpacted;
      }
    }
  }
  return fitted;
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
