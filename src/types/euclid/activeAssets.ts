import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNonNegative } from "../../mod.ts";
import { Asset, lSubValues, PAsset, PConstraint, PMap } from "../mod.ts";
import { PPrices, Prices } from "./prices.ts";

export type ActiveAssets = Map<Prices, Asset>;
export class PActiveAssets extends PConstraint<PMap<PPrices, PAsset>> {
  private constructor(
    public pprices: PPrices,
  ) {
    super(
      new PMap(pprices, PAsset.ptype),
      [newAssertNotDefault(pprices.initialPrices)],
      newGenActiveAssets(pprices),
    );
    this.population = 1; //probably far too conservative, but nonissue TODO generated, look at it
  }

  static genPType(): PConstraint<PMap<PPrices, PAsset>> {
    const pprices = PPrices.genPType();
    return new PActiveAssets(pprices as PPrices);
  }
}

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
const maxJumpStores = 3n;
export const newGenActiveAssets = (
  pprices: PPrices,
) =>
(): ActiveAssets => {
  const assets = pprices.initialPrices.assets();
  const storeSize = genNonNegative(maxJumpStores);
  const activeAssets = new Map<Prices, Asset>();
  const locations: Prices[] = PMap.genKeys(pprices, storeSize);
  for (const location of locations) {
    const defaultAsset = defaultActiveAsset(pprices.initialPrices, location);
    const asset = assets.randomChoice();
    if (asset !== defaultAsset) {
      activeAssets.set(location, asset);
    }
  }
  return activeAssets;
};

function defaultActiveAsset(initPs: Prices, currentPs: Prices): Asset {
  const current = currentPs.unsigned();
  const init = initPs.unsigned();

  const diff = lSubValues(current, init);

  switch (diff.size()) {
    case 0n:
      return initPs.assets().head();
    case 1n:
      return diff.assets().head();
    default: {
      let init_ = init.tail();
      let current_ = current.tail();
      const fstInit = init_.firstAmount();
      const fstCurrent = current_.firstAmount();
      init_ = init_.scaledWith(fstCurrent);
      current_ = current_.scaledWith(fstInit);
      return defaultActiveAsset(
        Prices.fromValue(init_),
        Prices.fromValue(current_),
      );
    }
  }
}
