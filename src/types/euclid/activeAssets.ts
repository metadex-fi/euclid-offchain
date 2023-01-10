import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNonNegative } from "../../mod.ts";
import {
  Asset,
  f,
  lSubValues,
  PAsset,
  PConstraint,
  PEnum,
  PMap,
} from "../mod.ts";
import { PPrices, Prices } from "./prices.ts";

export type ActiveAssets = Map<Prices, Asset>;
export class PActiveAssets extends PConstraint<PMap<PPrices, PEnum<PAsset>>> {
  private constructor(
    public pprices: PPrices,
  ) {
    super(
      new PMap(
        pprices,
        new PEnum(PAsset.ptype, pprices.initialPrices.assets().toList()),
      ),
      [newAssertNotDefault(pprices.initialPrices)],
      newGenActiveAssets(pprices),
    );
    this.population = 1; //probably far too conservative, but nonissue TODO generated, look at it
  }

  static genPType(): PConstraint<PMap<PPrices, PEnum<PAsset>>> {
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
export const newGenActiveAssets = (
  pprices: PPrices,
) =>
(): ActiveAssets => {
  const assets = pprices.initialPrices.assets();
  const activeAssets = new Map<Prices, Asset>();
  const locations: Prices[] = PMap.genKeys(pprices);
  for (const location of locations) {
    assert(
      location.assets().equals(assets),
      `location ${location} should have assets ${assets}`,
    );
    const defaultAsset = defaultActiveAsset(pprices.initialPrices, location);
    const asset = assets.randomChoice();
    if (asset !== defaultAsset) {
      activeAssets.set(location, asset);
    }
  }
  return activeAssets;
};

function defaultActiveAsset(initPs: Prices, currentPs: Prices): Asset {
  let branch = "none";
  try {
    const current = currentPs.unsigned();
    const init = initPs.unsigned();

    const diff = lSubValues(current, init);
    switch (diff.size()) {
      case 0n:
        branch = `0n with ${init.concise()}`;
        return init.firstAsset();
      case 1n:
        branch = `1n with ${diff.concise()}`;
        return diff.firstAsset();
      default: {
        branch = `default with \n${init.concise()}\n${current.concise()}`;
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
