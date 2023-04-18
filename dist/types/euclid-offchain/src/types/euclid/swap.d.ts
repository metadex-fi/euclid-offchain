import { Asset } from "../general/derived/asset/asset.js";
import { PObject } from "../general/fundamental/container/object.js";
import { BoughtSold } from "./boughtSold.js";
export declare class Swap {
  readonly boughtAsset: Asset;
  readonly soldAsset: Asset;
  readonly prices: BoughtSold;
  constructor(boughtAsset: Asset, soldAsset: Asset, prices: BoughtSold);
}
export declare class PSwap extends PObject<Swap> {
  constructor();
  static ptype: PSwap;
  static genPType(): PSwap;
}
