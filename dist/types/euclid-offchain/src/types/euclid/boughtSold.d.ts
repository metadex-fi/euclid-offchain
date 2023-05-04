import { PObject } from "../general/fundamental/container/object.js";
export declare class BoughtSold {
  readonly bought: bigint;
  readonly sold: bigint;
  constructor(bought: bigint, sold: bigint);
}
export declare class PBoughtSold extends PObject<BoughtSold> {
  constructor();
  static ptype: PBoughtSold;
  static genPType(): PBoughtSold;
}
