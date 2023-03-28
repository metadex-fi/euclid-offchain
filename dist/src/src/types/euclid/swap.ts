import { Asset, PAsset } from "../general/derived/asset/asset.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { BoughtSold, PBoughtSold } from "./boughtSold.js";

export class Swap {
  constructor(
    public readonly boughtAsset: Asset,
    public readonly soldAsset: Asset,
    public readonly prices: BoughtSold,
  ) {}
}

export class PSwap extends PObject<Swap> {
  constructor() {
    super(
      new PRecord({
        boughtAsset: PAsset.ptype,
        soldAsset: PAsset.ptype,
        prices: PBoughtSold.ptype,
      }),
      Swap,
    );
  }

  static ptype = new PSwap();
  static genPType(): PSwap {
    return PSwap.ptype;
  }
}
