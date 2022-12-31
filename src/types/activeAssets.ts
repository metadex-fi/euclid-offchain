import { PConstraint, PMap } from "../../../refactor_parse/lucid/src/mod.ts";
import { Asset, Assets, newPAssetOf, PAsset } from "./asset.ts";
import { Amount } from "./primitive.ts";
import {
  firstAmount,
  firstAssetInValue,
  JumpSizes,
  lSubValues,
  mulAmounts,
  newPPrices,
  numAssetsInValue,
  PPrices,
  Prices,
  tailValue,
  Value,
} from "./value.ts";

export type ActiveAssets = Map<Prices, Asset>;
export type PActiveAssets = PConstraint<PMap<PPrices, PAsset>>;
export const newPActiveAssets = (
  assets: Assets,
  initialPrices: Prices,
  lowerPriceBounds: Prices,
  upperPriceBounds: Prices,
  jumpSizes: JumpSizes,
): PActiveAssets => {
  const pinner = new PMap(
    newPPrices(assets, lowerBounds, upperBounds),
    newPAssetOf(assets),
  );
  return new PConstraint(
    pinner,
    [], // TODO extra asserts (i.e. default active asset)
    newGenActiveAssets(assets, lowerBounds, upperBounds),
  );
};

const newAssertDefaultAsset = () => (activeAssets: ActiveAssets) => {
};

const newAssertJumpSizes = () => (activeAssets: ActiveAssets) => {
};

const newGenActiveAssets = (
  assets: Assets,
  lowerBounds: Value,
  upperBounds: Value,
): () => ActiveAssets => {
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

// NOTE just copypasted from generators
// TODO this might lead to some paradoxes, let's see, we might learn something
export function genActiveAssets(
  initialPrices: Value,
  jumpSizes: Value,
): ActiveAssets {
  const assets = assetsOf(initialPrices);
  const storeSize = genNumber(maxJumpStores);
  const maxJumps = maxJumpStores;
  const activeAssets = new Map<Prices, Asset>();
  const jumpLogs = new Map<string, bigint[]>();

  for (let i = 0; i < storeSize; i++) {
    let collides = true;
    const storedPrices = mapAmounts(initialPrices, (amnt, ccy, tkn) => {
      const assetName = ccy! + tkn!;
      const jump = randomChoice([-1n, 1n]) * BigInt(genNumber(maxJumps));
      let jumpLog = jumpLogs.get(assetName);
      if (jumpLog) {
        if (!jumpLog.includes(jump)) {
          jumpLog.push(jump);
          collides = false;
        }
      } else {
        jumpLog = [jump];
        jumpLogs.set(assetName, jumpLog);
        collides = false;
      }
      return amnt + jump * amountOf(jumpSizes, ccy!, tkn!)!;
    });
    if (!collides) {
      const storedAsset = randomChoice(assets);
      activeAssets.set(storedPrices, storedAsset);
    }
  }

  return activeAssets;
}
