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
  readonly adherenceImpacted: boolean;
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

  let postFit: PostFitAmnts | null = {
    buyingVars: args.buyingArgs.vars,
    sellingVars: args.sellingArgs.vars,
    adherenceImpacted: args.adherenceImpacted,
  };

  while (true) {
    postFit = fitMinAmnts({
      adhereMaxInteger: args.adhereMaxInteger,
      tmpMinBuying: args.tmpMinBuying,
      expLimit: args.expLimit,
      buying: {
        ...args.buyingArgs,
        vars: postFit.buyingVars,
      },
      selling: {
        ...args.sellingArgs,
        vars: postFit.sellingVars,
      },
    });
    if (postFit === null) return null;
    else if (args.expLimit === null) break;
    else {
      const postFitExps = fitExpLimit({
        expLimit: args.expLimit,
        buyingExp: postFit.buyingVars.exp,
        sellingExp: postFit.sellingVars.exp,
        maxBuying: postFit.buyingVars.max,
        maxSelling: postFit.sellingVars.max,
        calcBuyingSpot: args.buyingArgs.funcs.calcSpot_,
        calcSellingSpot: args.sellingArgs.funcs.calcSpot_,
        minSelling: args.sellingArgs.consts.min,
      });
      if (postFitExps === null) return null;
      else if (postFitExps === "unchanged") break;
      else {
        if (postFit.buyingVars.exp !== postFitExps.buyingExp) {
          postFit.buyingVars.exp = postFitExps.buyingExp;
          postFit.buyingVars.spot = args.buyingArgs.funcs.calcSpot_(
            postFitExps.buyingExp,
          );
        }
        if (postFit.sellingVars.exp !== postFitExps.sellingExp) {
          postFit.sellingVars.exp = postFitExps.sellingExp;
          postFit.sellingVars.spot = args.sellingArgs.funcs.calcSpot_(
            postFitExps.sellingExp,
          );
        }
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
    postFit.buyingVars.amnt !== null,
    `fittedAmnts.buyingVars.amnt is null`,
  );
  assert(
    postFit.sellingVars.amnt !== null,
    `fittedAmnts.sellingVars.amnt is null`,
  );

  const swapping = Swapping.boundary(
    args.adhereMaxInteger,
    args.adherenceImpacted,
    args.user,
    args.paramUtxo,
    args.diracUtxo,
    args.buyingArgs.consts.asset,
    args.sellingArgs.consts.asset,
    postFit.buyingVars.amnt,
    postFit.sellingVars.amnt,
    postFit.buyingVars.spot,
    postFit.sellingVars.spot,
    postFit.buyingVars.exp,
    postFit.sellingVars.exp,
    args.expLimit ?? null,
    args.buyingArgs.consts.available,
    args.sellingArgs.consts.available,
    args.buyingArgs.consts.min,
    args.sellingArgs.consts.min,
    args.tmpMinBuying ?? null,
  );

  return swapping;
};
