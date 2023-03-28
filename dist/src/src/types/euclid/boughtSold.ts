import { maxInteger } from "../../utils/generators.js";
import { PPositive } from "../general/derived/bounded/positive.js";
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
    // leaving this as ppositive, because onchain rep should be positive
    // TODO high upper bound, but this is required by onchain. set maxInteger accordingly
    // TODO also the value is just artlessly, excessively high right now
    // needs to be less than weight * (virtual + balance) + jumpSize
    const ppositive = new PPositive(
      1n,
      maxInteger ** maxInteger,
    );
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
