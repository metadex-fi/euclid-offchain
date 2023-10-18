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
import { compareVariants } from "../../../utils/constants.ts";

// this is supposed to account for potential differences in minAda, which sometimes
// yields more than a few lovelaces, which in turn fucks with the new-Amm-comparison onchain
const getMinSelling = (
  asset: Asset,
  minSelling: bigint | null,
): bigint => max(minSelling ?? 1n, asset.equals(Asset.ADA) ? 1000000n : 1n); // TODO arbitary aka both excessive and edge-casing

interface FindForDiracArgs {
  readonly adhereMaxInteger: boolean;
  readonly user: User | null;
  readonly paramUtxo: ParamUtxo;
  readonly diracUtxo: DiracUtxo;
  readonly optimizeAmnts: boolean;
  readonly minBuying: bigint;
  readonly minSelling_: bigint;
  readonly availableSelling_: Value | null; // subset of pool-assets. NOTE: Null if infinite for any asset, -1 if infinite for a specific asset
  readonly buyableAssets: Assets | null; // for subsequent swappings we want only a single direction. Assets instead of Asset for simulator in webapp
  readonly availableBuying: bigint | null; // for the new subSwapA-calculator, in concert with buyingAsset.
  readonly expLimit: number | null;
}
export const findForDirac = (args: FindForDiracArgs): Swapping[] => {
  const baseArgs_: Map<number, BaseArgs> = new Map(); // for both buying and selling
  const buyingArgs_: Map<number, AssetArgs> = new Map();
  const swappings: Swapping[] = [];

  const assets = args.paramUtxo.param.assets;
  assets.forEach((sellingAsset, sellingIndex) => {
    const availableSelling =
      args.availableSelling_?.amountOf(sellingAsset, 0n) ?? -1n;
    if (availableSelling === 0n) return;

    let baseSelling = baseArgs_.get(sellingIndex);
    if (!baseSelling) {
      baseSelling = calcBaseArgs(
        sellingAsset,
        args.paramUtxo.param,
        args.diracUtxo,
        args.adhereMaxInteger,
      );
      baseArgs_.set(sellingIndex, baseSelling);
    }
    const minSelling = getMinSelling(sellingAsset, args.minSelling_);
    const fittedSelling = fitExp({
      adhereMaxInteger: args.adhereMaxInteger,
      available: availableSelling,
      min_: minSelling,
      calcSpot_: baseSelling.calcSpot_,
      calcDelta_: baseSelling.calcDelta_,
      exp: baseSelling.exp,
      direction: 1n,
      expLimit: args.expLimit,
    });
    if (!fittedSelling) return;
    if (fittedSelling === "cannotAdhere") {
      console.error(`adherence violated for selling`);
      // TODO consider a better notification here
      return;
    }

    const sellingArgs: AssetArgs = {
      consts: {
        asset: sellingAsset,
        available: availableSelling,
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
      assert(
        !buyingAsset.equals(sellingAsset),
        `buying and selling asset must be different: ${buyingAsset.show()} === ${sellingAsset.show()}`,
      );

      let buyingArgs = buyingArgs_.get(buyingIndex);
      if (!buyingArgs) {
        if (args.buyableAssets && !args.buyableAssets.has(buyingAsset)) return;
        const availableBuying = args.availableBuying ??
          args.diracUtxo.available.amountOf(buyingAsset, 0n);
        if (availableBuying === 0n) return;

        let baseBuying = baseArgs_.get(buyingIndex);
        if (!baseBuying) {
          baseBuying = calcBaseArgs(
            buyingAsset,
            args.paramUtxo.param,
            args.diracUtxo,
            args.adhereMaxInteger,
          );
          baseArgs_.set(buyingIndex, baseBuying);
        }

        const fittedBuying = fitExp({
          adhereMaxInteger: args.adhereMaxInteger,
          available: availableBuying,
          min_: args.minBuying,
          calcSpot_: baseBuying.calcSpot_,
          calcDelta_: baseBuying.calcDelta_,
          exp: baseBuying.exp,
          direction: -1n,
          expLimit: args.expLimit,
        });
        if (!fittedBuying) return;
        assert(
          fittedBuying !== "cannotAdhere",
          `adherence should never be violated for buying`,
        );

        buyingArgs = {
          consts: {
            asset: buyingAsset,
            available: availableBuying,
            min: args.minBuying,
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

      const getSwappingForPair = (
        buyingArgs: AssetArgs,
        tmpMinBuying: bigint | null,
      ): Swapping | null => {
        if (tmpMinBuying === null) {
          buyingArgs = cloneArgs(buyingArgs);
        } else {
          const fittedBuying = fitExp({
            adhereMaxInteger: args.adhereMaxInteger,
            available: buyingArgs.consts.available,
            min_: tmpMinBuying, // sole difference
            calcSpot_: buyingArgs.funcs.calcSpot_,
            calcDelta_: buyingArgs.funcs.calcDelta_,
            exp: buyingArgs.vars.exp,
            direction: -1n,
            expLimit: args.expLimit,
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
          adhereMaxInteger: args.adhereMaxInteger,
          user: args.user,
          paramUtxo: args.paramUtxo,
          diracUtxo: args.diracUtxo,
          tmpMinBuying,
          expLimit: args.expLimit,
          buyingArgs,
          sellingArgs: cloneArgs(sellingArgs),
        });
      };

      let swapping = getSwappingForPair(buyingArgs, null);

      if (swapping) {
        // TODO revert
        if (args.optimizeAmnts) {
          let i = 0;
          let availableSelling_: Value | null = null;
          let buyableAssets: Assets | null = null;
          if (compareVariants) {
            availableSelling_ = Value.singleton(
              sellingAsset,
              args.availableSelling_?.amountOf(sellingAsset, 0n) ?? -1n,
            );
            buyableAssets = Assets.singleton(buyingAsset);
          }
          while (true) {
            console.log(`trying to find better effective price (${i})`);
            const tmpMinBuying: bigint = swapping.buyingAmnt + 1n;
            const maybeBetterFast = getSwappingForPair(
              buyingArgs,
              tmpMinBuying,
            );
            if (compareVariants) {
              const maybeBetters: Swapping[] = findForDirac({
                ...args,
                availableSelling_,
                buyableAssets,
                optimizeAmnts: false,
                minBuying: tmpMinBuying,
              });
              console.log(`maybeBetters: ${maybeBetters.length}`);
              assert(
                maybeBetters.length <= 1,
                `maybeBetters.length must be <= 1, but got:\n${
                  maybeBetters.map((s) => s.show()).join("\n")
                }`,
              );
              const maybeBetterSlow: Swapping | null = maybeBetters?.length
                ? maybeBetters[0]
                : null;
              console.log(`maybeBetterSlow: ${maybeBetterSlow?.show()}`);
              if (maybeBetterFast) {
                assert(maybeBetterSlow, `maybeBetterSlow not found`);
                assert(
                  maybeBetterFast.equals(maybeBetterSlow, true, false, true),
                  `maybeBetterFast must equal maybeBetterSlow:\n${maybeBetterFast.show()}\n!==\n${maybeBetterSlow.show()}`,
                );
              } else assert(!maybeBetterSlow, `maybeBetterFast not found`);
            }
            const maybeBetter = maybeBetterFast;
            if (
              maybeBetter &&
              maybeBetter.effectivePrice <= swapping.effectivePrice
            ) {
              console.log(
                `found swapping with better or equal effective price (${i++}): ${maybeBetter.effectivePrice} <= ${swapping.effectivePrice}`,
              );
              // TODO copy over the whole comparison with maybeBetterSlow and confirm equivalence
              swapping = maybeBetter;
            } else break;
          }
        }
        swappings.push(swapping);
      } else console.log(`no swapping found for pair`);
    });
  });

  const pairs = swappings.map((swapping) =>
    `${swapping.sellingAsset.concise()} -> ${swapping.buyingAsset.concise()}`
  );
  console.log(`pairs:\n${pairs.join("\n")}`);
  pairs.forEach((pair, i) => {
    assert(pairs.lastIndexOf(pair) === i, `duplicate pair: ${pair}`);
  });
  return swappings;
};
