import { Asset, PAsset } from "../general/derived/asset/asset.ts";
import { PBounded } from "../general/derived/bounded/bounded.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";

export class Swap {
  constructor(
    public readonly boughtAsset: Asset,
    public readonly soldAsset: Asset,
    public readonly expBought: bigint,
    public readonly expSold: bigint,
  ) {}
}

export class PSwap extends PObject<Swap> {
  constructor() {
    super(
      new PRecord({
        boughtAsset: PAsset.ptype,
        soldAsset: PAsset.ptype,
        expBought: new PBounded(0n),
        expSold: new PBounded(0n),
      }),
      Swap,
    );
  }

  static ptype = new PSwap();
  static genPType(): PSwap {
    return PSwap.ptype;
  }
}
