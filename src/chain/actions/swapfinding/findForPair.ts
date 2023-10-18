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
  console.log(`
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    args.buying.asset: ${args.buyingArgs.consts.asset.show()}
    args.selling.asset: ${args.sellingArgs.consts.asset.show()}
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  `);
  if (
    args.expLimit !== null &&
    bestMultiplicationsAhead(Number(args.buyingArgs.vars.exp)) +
          bestMultiplicationsAhead(Number(args.sellingArgs.vars.exp)) >
      args.expLimit
  ) return null;

  let adherenceImpacted = args.buyingArgs.consts.adherenceImpacted || args.sellingArgs.consts.adherenceImpacted;
  let fitted: PostFitAmnts | null = {
    buyingVars: args.buyingArgs.vars,
    sellingVars: args.sellingArgs.vars,
    adherenceImpacted,
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
    if (fitted === null) return null;
    else if (args.expLimit === null) {
      adherenceImpacted ||= fitted.adherenceImpacted;
      break;
    } else {
      adherenceImpacted ||= fitted.adherenceImpacted;
      const fittedExps = fitExpLimit({
        adhereMaxInteger: args.adhereMaxInteger,
        expLimit: args.expLimit,
        buyingExp: fitted.buyingVars.exp,
        sellingExp: fitted.sellingVars.exp,
        maxBuying: fitted.buyingVars.max,
        maxSelling: fitted.sellingVars.max,
        calcBuyingSpot: args.buyingArgs.funcs.calcSpot_,
        calcSellingSpot: args.sellingArgs.funcs.calcSpot_,
        minSelling: args.sellingArgs.consts.min,
      });
      if (fittedExps === null) return null;
      else if (fittedExps === "unchanged") break;
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
        adherenceImpacted ||= fittedExps.adherenceImpacted;
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
    adherenceImpacted,
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
