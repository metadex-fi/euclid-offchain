import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Assets } from "../../../types/general/derived/asset/assets.ts";
import { Value } from "../../../types/general/derived/value/value.ts";
import { User } from "../../user.ts";
import { DiracUtxo, ParamUtxo } from "../../utxo.ts";
import { Swapping } from "../swapping.ts";
import { AssetArgs, BaseArgs, calcBaseArgs, cloneArgs } from "./assetArgs.ts";
import { fitExp } from "./helpers.ts";
import { swappingForPair } from "./findForPair.ts";
import { Asset } from "../../../types/general/derived/asset/asset.ts";
import { max } from "../../../utils/generators.ts";

// this is supposed to account for potential differences in minAda, which sometimes
// yields more than a few lovelaces, which in turn fucks with the new-Amm-comparison onchain
const getMinSelling = (
  asset: Asset,
  minSelling: bigint | null,
): bigint => max(minSelling ?? 1n, asset.equals(Asset.ADA) ? 1000000n : 1n); // TODO arbitary aka both excessive and edge-casing

export const findForDirac = (
  adhereMaxInteger: boolean,
  user: User | null,
  paramUtxo: ParamUtxo,
  diracUtxo: DiracUtxo,
  optimizeAmnts: boolean,
  minBuying = 1n,
  minSelling_ = 1n,
  availableSelling_: Value | null, // subset of pool-assets. NOTE: Null if infinite for any asset, -1 if infinite for a specific asset
  buyingAssets: Assets | null, // for subsequent swappings we want only a single direction. Assets instead of Asset for simulator in webapp
  availableBuying: bigint | null, // for the new subSwapA-calculator, in concert with buyingAsset.
  expLimit: number | null,
): Swapping[] => {
  const baseArgs_: Map<number, BaseArgs> = new Map(); // for both buying and selling
  const buyingArgs_: Map<number, AssetArgs> = new Map();
  const swappings: Swapping[] = [];

  const assets = paramUtxo.param.assets;
  assets.forEach((sellingAsset, sellingIndex) => {
    const asset = sellingAsset;
    const available = availableSelling_?.amountOf(asset, 0n) ?? -1n;
    if (available === 0n) return;

    let baseSelling = baseArgs_.get(sellingIndex);
    if (!baseSelling) {
      baseSelling = calcBaseArgs(
        asset,
        paramUtxo.param,
        diracUtxo,
        adhereMaxInteger,
      );
      baseArgs_.set(sellingIndex, baseSelling);
    }
    const minSelling = getMinSelling(asset, minSelling_);
    const fittedSelling = fitExp({
      adhereMaxInteger,
      available,
      min_: minSelling,
      calcSpot_: baseSelling.calcSpot_,
      calcDelta_: baseSelling.calcDelta_,
      exp: baseSelling.exp,
      direction: 1n,
      expLimit,
    });
    if (!fittedSelling) return;
    if (fittedSelling === "cannotAdhere") {
      console.error(`adherence violated for selling`);
      // TODO consider a better notification here
      return;
    }

    const sellingArgs: AssetArgs = {
      consts: {
        asset,
        available,
        min: minSelling,
        adherenceImpacted: baseSelling.adherenceImpacted,
      },
      funcs: {
        calcSpot_: baseSelling.calcSpot_,
        calcDelta_: baseSelling.calcDelta_,
      },
      vars: {
        exp: fittedSelling.exp,
        spot: fittedSelling.spot,
        max: fittedSelling.max,
        amnt: null,
      },
    };

    assets.forEach((buyingAsset, buyingIndex) => {
      if (buyingIndex === sellingIndex) return;

      let buyingArgs = buyingArgs_.get(buyingIndex);
      if (!buyingArgs) {
        const asset = buyingAsset;
        if (buyingAssets && !buyingAssets.has(asset)) return;
        const available = availableBuying ??
          diracUtxo.available.amountOf(asset, 0n);
        if (available === 0n) return;

        let baseBuying = baseArgs_.get(buyingIndex);
        if (!baseBuying) {
          baseBuying = calcBaseArgs(
            asset,
            paramUtxo.param,
            diracUtxo,
            adhereMaxInteger,
          );
          baseArgs_.set(buyingIndex, baseBuying);
        }

        const fittedBuying = fitExp({
          adhereMaxInteger,
          available,
          min_: minBuying,
          calcSpot_: baseBuying.calcSpot_,
          calcDelta_: baseBuying.calcDelta_,
          exp: baseBuying.exp,
          direction: -1n,
          expLimit,
        });
        if (!fittedBuying) return;
        assert(
          fittedBuying !== "cannotAdhere",
          `adherence should never be violated for buying`,
        );

        buyingArgs = {
          consts: {
            asset,
            available,
            min: minBuying,
            adherenceImpacted: baseBuying.adherenceImpacted,
          },
          funcs: {
            calcSpot_: baseBuying.calcSpot_,
            calcDelta_: baseBuying.calcDelta_,
          },
          vars: {
            exp: fittedBuying.exp,
            spot: fittedBuying.spot,
            max: fittedBuying.max,
            amnt: null,
          },
        };
        buyingArgs_.set(buyingIndex, buyingArgs);
      }

      const adherenceImpacted = buyingArgs.consts.adherenceImpacted ||
        sellingArgs.consts.adherenceImpacted;

      const getSwappingForPair = (
        buyingArgs: AssetArgs,
        tmpMinBuying: bigint | null,
      ): Swapping | null => {
        if (tmpMinBuying === null) {
          buyingArgs = cloneArgs(buyingArgs);
        } else {
          const fittedBuying = fitExp({
            adhereMaxInteger,
            available,
            min_: tmpMinBuying, // sole difference
            calcSpot_: buyingArgs.funcs.calcSpot_,
            calcDelta_: buyingArgs.funcs.calcDelta_,
            exp: buyingArgs.vars.exp,
            direction: -1n,
            expLimit,
          });
          if (fittedBuying === null) return null;
          assert(
            fittedBuying !== "cannotAdhere",
            `adherence should never be violated for buying`,
          );
          buyingArgs = {
            ...buyingArgs,
            vars: {
              exp: fittedBuying.exp,
              spot: fittedBuying.spot,
              max: fittedBuying.max,
              amnt: buyingArgs.vars.amnt,
            },
          };
        }

        return swappingForPair({
          adhereMaxInteger,
          adherenceImpacted,
          user,
          paramUtxo,
          diracUtxo,
          tmpMinBuying,
          expLimit,
          buyingArgs,
          sellingArgs: cloneArgs(sellingArgs),
        });
      };

      let swapping = getSwappingForPair(buyingArgs, null);

      if (swapping) {
        // TODO revert
        // if (optimizeAmnts) {
        //   let i = 0;
        //   while (true) {
        //     console.log(`trying to find better effective price (${i})`);
        //     const tmpMinBuying: bigint = swapping.buyingAmnt + 1n;
        //     const maybeBetterFast = getSwappingForPair(
        //       buyingArgs,
        //       tmpMinBuying,
        //     );
        //     const maybeBetter = maybeBetterFast;
        //     if (
        //       maybeBetter &&
        //       maybeBetter.effectivePrice <= swapping.effectivePrice
        //     ) {
        //       console.log(
        //         `found swapping with better or equal effective price (${i++}): ${maybeBetter.effectivePrice} <= ${swapping.effectivePrice}`,
        //       );
        //       // TODO copy over the whole comparison with maybeBetterSlow and confirm equivalence
        //       swapping = maybeBetter;
        //     } else break;
        //   }
        // }
        swappings.push(swapping);
      }
    });
  });

  return swappings;
};
