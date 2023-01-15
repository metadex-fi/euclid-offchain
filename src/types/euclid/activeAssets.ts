import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Asset,
  lSubValues,
  Param,
  PAsset,
  PMap,
  PObject,
  PRecord,
  Value,
} from "../mod.ts";
import { PPrices, Prices } from "./prices.ts";

export class ActiveAssets {
  constructor(
    private activeAssets: Map<Prices, Asset>,
  ) {}

  public forEach(
    callbackfn: (value: Asset, key: Prices, map: Map<Prices, Asset>) => void,
  ): void {
    this.activeAssets.forEach(callbackfn);
  }

  static assertWith =
    (initialPrices: Prices) => (activeAssets: ActiveAssets): void => {
      activeAssets.forEach((asset, location) => {
        const defaultAsset = defaultActiveAsset(
          initialPrices.unsigned(),
          location.unsigned(),
        );
        assert(
          asset !== defaultAsset,
          `default asset ${defaultAsset} should not be stored at location ${location}`,
        );
      });
    };

  // TODO this might lead to some paradoxes, let's see, we might learn something
  static generateWith =
    (param: Param, initialPrices: Prices) => (): ActiveAssets => {
      const assets = initialPrices.assets();
      const activeAssets = new Map<Prices, Asset>();
      const pprices = PPrices.current(param, initialPrices);
      const locations: Prices[] = PMap.genKeys(pprices);
      for (const location of locations) {
        assert(
          location.assets().equals(assets),
          `location ${location} should have assets ${assets}`,
        );
        const defaultAsset = defaultActiveAsset(
          initialPrices.unsigned(),
          location.unsigned(),
        );
        const asset = assets.randomChoice();
        if (asset !== defaultAsset) {
          activeAssets.set(location, asset);
        }
      }
      return new ActiveAssets(activeAssets);
    };
}

export class PActiveAssets extends PObject<ActiveAssets> {
  constructor(
    public readonly param: Param,
  ) {
    super(
      new PRecord({
        "activeAssets": new PMap(PPrices.initial(param), PAsset.ptype), // TODO could constain PAsset more here, but that's nonessential
      }),
      ActiveAssets,
    );
  }

  static genPType(): PObject<ActiveAssets> {
    return new PActiveAssets(Param.generate());
  }
}

function defaultActiveAsset(initPs: Value, currentPs: Value): Asset {
  let branch = "none";
  try {
    const diff = lSubValues(currentPs, initPs);
    switch (diff.size()) {
      case 0n:
        branch = `0n with ${initPs.concise()}`;
        return initPs.firstAsset();
      case 1n:
        branch = `1n with ${diff.concise()}`;
        return diff.firstAsset();
      default: {
        branch = `default with \n${initPs.concise()}\n${currentPs.concise()}`;
        let initTail = initPs.tail();
        let currentTail = currentPs.tail();
        const fstInit = initTail.firstAmount();
        const fstCurrent = currentTail.firstAmount();
        initTail = initTail.scaledWith(fstCurrent);
        currentTail = currentTail.scaledWith(fstInit);
        return defaultActiveAsset(
          initTail,
          currentTail,
        );
      }
    }
  } catch (e) {
    throw new Error(
      `defaultActiveAsset(
initPs: ${initPs.concise()},
currentPs: ${currentPs.concise()},
branch: ${branch}
): ${e}`,
    );
  }
}
