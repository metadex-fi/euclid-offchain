import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Param } from "../../../types/euclid/param.ts";
import { Asset } from "../../../types/general/derived/asset/asset.ts";
import { DiracUtxo } from "../../utxo.ts";
import { calcDelta, calcExp, calcSpot } from "./helpers.ts";
import { maxInteger } from "../../../utils/constants.ts";

interface AssetConsts {
  readonly asset: Asset;
  readonly available: bigint;
  readonly min: bigint;
  readonly adherenceImpacted: boolean;
}

interface AssetFuncs {
  readonly calcSpot_: (exp: bigint) => bigint;
  readonly calcDelta_: (spot: bigint) => bigint;
}

// things that change during swap-finding
interface AssetVars {
  exp: bigint;
  spot: bigint;
  max: bigint;
  amnt: bigint | null;
}

export interface AssetArgs {
  readonly consts: AssetConsts;
  readonly funcs: AssetFuncs;
  readonly vars: AssetVars;
}

export interface PostFitAmnts {
  readonly buyingVars: AssetVars;
  readonly sellingVars: AssetVars;
  readonly adherenceImpacted: boolean;
}

export const cloneArgs = (args: AssetArgs): AssetArgs => {
  return {
    ...args,
    vars: {
      exp: args.vars.exp,
      spot: args.vars.spot,
      max: args.vars.max,
      amnt: args.vars.amnt,
    },
  };
};

// Without yet knowing if we're buying or selling.
// Note that we are rounding up exp, so it's implicitly for selling.
// We get it for buying by subtracting 1n, unless adherence was impacted.
export interface BaseArgs {
  readonly exp: bigint;
  readonly spot: bigint;
  readonly calcSpot_: (exp: bigint) => bigint;
  readonly calcDelta_: (spot: bigint) => bigint;
  readonly adherenceImpacted: boolean;
}

export const calcBaseArgs = (
  asset: Asset,
  param: Param,
  diracUtxo: DiracUtxo,
  adhereMaxInteger: boolean,
): BaseArgs => {
  const virtual = param.virtual.amountOf(asset);
  const weight = param.weights.amountOf(asset); // NOTE: inverted

  const liquidity = virtual + diracUtxo.funds.amountOf(asset, 0n);
  assert(liquidity > 0n, `liquidity <= 0n`); // assert is new, previously just returned null
  const calcDelta_ = calcDelta(weight, liquidity);

  const jumpSize = param.jumpSizes.amountOf(asset);
  const anchor = diracUtxo.dirac.anchorPrices.amountOf(asset); // NOTE: inverted aka "price when selling for A0"
  const calcSpot_ = calcSpot(anchor, jumpSize);

  const amm = liquidity * weight; // NOTE: inverted aka "price when selling for A0"
  assert(amm > 0n, `amm <= 0n`);

  const jumpMultiplier = (Number(jumpSize) + 1) / Number(jumpSize);
  const exp_ = calcExp(Number(anchor), Number(amm), jumpMultiplier);

  let exp = BigInt(Math.ceil(exp_));
  let spot = calcSpot_(exp);
  let adherenceImpacted = false;
  while (adhereMaxInteger && spot > maxInteger) {
    adherenceImpacted = true;
    exp--;
    spot = calcSpot_(exp);
  }
  return {
    exp,
    spot,
    calcSpot_,
    calcDelta_,
    adherenceImpacted,
  };
};
