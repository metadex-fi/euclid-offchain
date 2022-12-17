import { Asset, Prices } from "./types.ts";
import {
  arithValues,
  firstAmnt,
  firstAsset,
  mapAmounts,
  numAssets,
  tailValue,
} from "./value.ts";

export function defaultActiveAsset(initPs: Prices, currentPs: Prices): Asset {
  const diff = arithValues(initPs, currentPs, (x: bigint, y: bigint) => {
    return x > y ? x - y : 0n;
  });

  const eligible = numAssets(diff);
  switch (eligible) {
    case 0:
      return firstAsset(initPs);
    case 1:
      return firstAsset(diff);
    default: {
      let initPs_ = tailValue(initPs);
      let currentPs_ = tailValue(currentPs);
      const fstInitP = firstAmnt(initPs_);
      const fstCurrentP = firstAmnt(currentPs_);
      initPs_ = mapAmounts(initPs_, (amnt) => fstCurrentP * amnt);
      currentPs_ = mapAmounts(currentPs_, (amnt) => fstInitP * amnt);
      return defaultActiveAsset(initPs_, currentPs_);
    }
  }
}
