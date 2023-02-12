import { PPositive } from "../general/derived/bounded/positive.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";

export class BoughtSold {
  constructor(
    public readonly bought: bigint,
    public readonly sold: bigint,
  ) {}
}

export class PBoughtSold extends PObject<BoughtSold> {
  constructor() {
    const ppositive = new PPositive(); // leaving this as ppositive, because onchain rep should be positive
    super(
      new PRecord({
        bought: ppositive,
        sold: ppositive,
      }),
      BoughtSold,
    );
  }

  static ptype = new PBoughtSold();
  static genPType(): PBoughtSold {
    return PBoughtSold.ptype;
  }
}
