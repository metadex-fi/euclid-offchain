import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { maybeNdef } from "../../mod.ts";
import { Asset, f, Param, PAsset, PMap, PObject, PRecord, t } from "../mod.ts";
import { PPrices, Prices } from "./prices.ts";

export class ActiveAssets {
  constructor(
    private activeAssets: Map<Prices, Asset>,
  ) {}

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    const ttff = ttf + f;
    const mn = this.activeAssets.size > 0 ? "\n" : "";
    return `ActiveAssets(
${ttf}activeAssets: {${mn}${
      [...this.activeAssets.entries()].map(([location, asset]) =>
        `${ttff}${location.concise(ttff)} => ${asset.show()}\n`
      ).join(",")
    }}
${tt})`;
  };

  public forEach(
    callbackfn: (value: Asset, key: Prices, map: Map<Prices, Asset>) => void,
  ): void {
    this.activeAssets.forEach(callbackfn);
  }

  static fresh(): ActiveAssets {
    return new ActiveAssets(new Map<Prices, Asset>());
  }

  static assertUsed = (param: Param) => (activeAssets: ActiveAssets): void => {
    activeAssets.forEach((asset, location) => {
      const defaultAsset = location.defaultActiveAsset(param.initialPrices);
      assert(
        asset !== defaultAsset,
        `default asset ${defaultAsset} should not be stored at location ${location}`,
      );
    });
  };

  // TODO this might lead to some paradoxes, let's see, we might learn something
  static generateUsed = (param: Param) => (): ActiveAssets => {
    const assets = param.initialPrices.assets();
    const activeAssets = new Map<Prices, Asset>();
    const pprices = PPrices.current(param);
    const locations: Prices[] = PMap.genKeys(pprices);
    for (const location of locations) {
      assert(
        location.assets().equals(assets),
        `location ${location} should have assets ${assets}`,
      );
      const defaultAsset = location.defaultActiveAsset(param.initialPrices);
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
    public readonly param?: Param,
  ) {
    super(
      new PRecord({
        "activeAssets": new PMap(
          param ? PPrices.current(param) : PPrices.initial(),
          PAsset.ptype,
        ), // TODO could constain PAsset more here, but that's nonessential
      }),
      ActiveAssets,
    );
  }

  static genPType(): PObject<ActiveAssets> {
    return new PActiveAssets(
      maybeNdef(Param.generate)?.(),
    );
  }
}
