import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNumber,
  PConstraint,
  PMap,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Asset, PAsset, randomAssetOf } from "./asset.ts";
import { PPrices, Prices } from "./prices.ts";
import {
  assetsOf,
  firstAmount,
  firstAssetInValue,
  lSubValues,
  mulAmounts,
  numAssetsInValue,
  tailValue,
} from "./value.ts";

export type ActiveAssets = Map<Prices, Asset>;
export type PActiveAssets = PConstraint<PMap<PPrices, PAsset>>;
export const newPActiveAssets = (
  initialPs: Prices,
  pprices: PPrices,
): PActiveAssets => {
  const pinner = new PMap(
    pprices,
    PAsset,
  );
  return new PConstraint(
    pinner,
    [newAssertNotDefault(initialPs)],
    newGenActiveAssets(initialPs, pprices),
  );
};

const newAssertNotDefault =
  (initialPs: Prices) => (activeAssets: ActiveAssets) => {
    for (const [location, asset] of activeAssets) {
      const defaultAsset = defaultActiveAsset(initialPs, location);
      assert(
        asset !== defaultAsset,
        `default asset ${defaultAsset} should not be stored at location ${location}`,
      );
    }
  };

// TODO this might lead to some paradoxes, let's see, we might learn something
const maxJumpStores = 2;
export const newGenActiveAssets = (
  initialPs: Prices,
  pprices: PPrices,
) =>
(): ActiveAssets => {
  const assets = assetsOf(initialPs);
  const storeSize = genNumber(maxJumpStores);
  const activeAssets = new Map<Prices, Asset>();
  const locations: Prices[] = PMap.genKeys(pprices, storeSize);
  for (const location of locations) {
    const defaultAsset = defaultActiveAsset(initialPs, location);
    const asset = randomAssetOf(assets);
    if (asset !== defaultAsset) {
      activeAssets.set(location, asset);
    }
  }
  return activeAssets;
};

function defaultActiveAsset(initPs: Prices, currentPs: Prices): Asset {
  const diff = lSubValues(currentPs, initPs);

  switch (numAssetsInValue(diff)) {
    case 0:
      return firstAssetInValue(initPs);
    case 1:
      return firstAssetInValue(diff);
    default: {
      let initPs_ = tailValue(initPs);
      let currentPs_ = tailValue(currentPs);
      const fstInitP = firstAmount(initPs_);
      const fstCurrentP = firstAmount(currentPs_);
      initPs_ = mulAmounts(initPs_, fstCurrentP);
      currentPs_ = mulAmounts(currentPs_, fstInitP);
      return defaultActiveAsset(initPs_, currentPs_);
    }
  }
}
