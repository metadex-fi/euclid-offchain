import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { User } from "../../user.ts";
import { DiracUtxo, ParamUtxo } from "../../utxo.ts";
import { Swapping } from "../swapping.ts";
import { fitExpLimit } from "./fitExpLimit.ts";
import { fitMinAmnts } from "./fitMinAmnts.ts";
import { bestMultiplicationsAhead } from "./helpers.ts";
import { AssetArgs, PostFitAmnts } from "./assetArgs.ts";

interface SwappingForPairArgs {
  readonly adhereMaxInteger: boolean;
  readonly user: User | null;
  readonly paramUtxo: ParamUtxo;
  readonly diracUtxo: DiracUtxo;
  readonly tmpMinBuying: bigint | null;
  readonly expLimit: number | null;
  readonly buyingArgs: AssetArgs;
  readonly sellingArgs: AssetArgs;
}

export const swappingForPair = (args: SwappingForPairArgs): Swapping | null => {
  if (args.sellingArgs.consts.asset.equals(args.buyingArgs.consts.asset)) {
    return null;
  }
  // console.log(`
  //   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //   selling: ${args.sellingArgs.consts.asset.show()}
  //   buying: ${args.buyingArgs.consts.asset.show()}
  //   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // `);
  if (args.expLimit !== null) {
    const buyingMults = bestMultiplicationsAhead(
      Number(args.buyingArgs.vars.exp),
    );
    const sellingMults = bestMultiplicationsAhead(
      Number(args.sellingArgs.vars.exp),
    );
    if (buyingMults + sellingMults > args.expLimit) {
      console.log(
        `expLimit reached: ${buyingMults} + ${sellingMults} > ${args.expLimit}`,
      );
      return null;
    }
  }

  let maxIntImpacted = args.buyingArgs.consts.maxIntImpacted ||
    args.sellingArgs.consts.maxIntImpacted;
  let fitted: PostFitAmnts | null = {
    buyingVars: args.buyingArgs.vars,
    sellingVars: args.sellingArgs.vars,
    maxIntImpacted,
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
      maxIntImpacted ||= fitted.maxIntImpacted;
      break;
    } else {
      maxIntImpacted ||= fitted.maxIntImpacted;
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
        maxIntImpacted ||= fittedExps.maxIntImpacted;
      }
    }
  }

  // /// logging/debugging

  // const buyingJs = param.jumpSizes.amountOf(args.buying.asset);
  // const sellingJs = param.jumpSizes.amountOf(args.selling.asset);
  // const buyingAnchor = this.dirac.anchorPrices.amountOf(args.buying.asset);
  // const sellingAnchor = this.dirac.anchorPrices.amountOf(args.selling.asset);

  // const buyingJumpMultiplier = (Number(buyingJs) + 1) / Number(buyingJs);
  // const sellingJumpMultiplier = (Number(sellingJs) + 1) /
  //   Number(sellingJs);
  // const ammBuying = liquidity_.amountOf(args.buying.asset) *
  //   param.weights.amountOf(args.buying.asset);
  // const ammSelling = liquidity_.amountOf(args.selling.asset) *
  //   param.weights.amountOf(args.selling.asset);
  // const args.buying.exp = Math.log(Number(ammBuying) / Number(buyingAnchor)) /
  //   Math.log(buyingJumpMultiplier);
  // const args.selling.exp =
  //   Math.log(Number(ammSelling) / Number(sellingAnchor)) /
  //   Math.log(sellingJumpMultiplier);

  // console.log(
  //   `args.buying.exp: ${args.buying.exp} -> ${args.buying.exp}, args.selling.exp: ${args.selling.exp} -> ${args.selling.exp}`,
  // );

  // /// end logging/debugging

  assert(
    fitted.buyingVars.amnt !== null,
    `fittedAmnts.buyingVars.amnt is null`,
  );
  assert(
    fitted.sellingVars.amnt !== null,
    `fittedAmnts.sellingVars.amnt is null`,
  );

  const swapping = Swapping.boundary(
    args.adhereMaxInteger,
    maxIntImpacted,
    args.user,
    args.paramUtxo,
    args.diracUtxo,
    args.buyingArgs.consts.asset,
    args.sellingArgs.consts.asset,
    fitted.buyingVars.amnt,
    fitted.sellingVars.amnt,
    fitted.buyingVars.spot,
    fitted.sellingVars.spot,
    fitted.buyingVars.exp,
    fitted.sellingVars.exp,
    args.expLimit ?? null,
    args.buyingArgs.consts.available,
    args.sellingArgs.consts.available,
    args.buyingArgs.consts.min,
    args.sellingArgs.consts.min,
    args.tmpMinBuying ?? null,
  );

  return swapping;
};
