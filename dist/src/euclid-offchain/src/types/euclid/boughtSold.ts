import { maxInteger } from "../../utils/generators.js";
import { PBounded } from "../general/derived/bounded/bounded.js";
import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";

export class BoughtSold {
  constructor(
    public readonly bought: bigint,
    public readonly sold: bigint,
  ) {}
}

export class PBoughtSold extends PObject<BoughtSold> {
  constructor() {
    // TODO high upper bound, but this is required by onchain. set maxInteger accordingly
    // TODO also the value is just artlessly, excessively high right now
    // needs to be less than weight * (virtual + balance) + jumpSize
    const pbounded = new PBounded(
      0n,
      maxInteger,
    );
    super(
      new PRecord({
        bought: pbounded,
        sold: pbounded,
      }),
      BoughtSold,
    );
  }

  static ptype = new PBoughtSold();
  static genPType(): PBoughtSold {
    return PBoughtSold.ptype;
  }
}
