import { PBounded } from "../general/derived/bounded/bounded.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";
import { PPositive } from "../mod.ts";

export class SubSwap {
  constructor(
    public readonly deltaBought: bigint,
    public readonly deltaSold: bigint,
    public readonly expBought: bigint,
    public readonly expSold: bigint,
  ) {}
}

export class PSubSwap extends PObject<SubSwap> {
  constructor() {
    super(
      new PRecord({
        deltaBought: new PPositive(),
        deltaSold: new PPositive(),
        expBought: new PBounded(0n),
        expSold: new PBounded(0n),
      }),
      SubSwap,
    );
  }

  static ptype = new PSubSwap();
  static genPType(): PSubSwap {
    return PSubSwap.ptype;
  }
}
