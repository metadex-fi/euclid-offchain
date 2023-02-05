import { PPositive, PRecord } from "../mod.ts";
import { PObject } from "../general/fundamental/container/object.ts";

export class BoughtSold {
  constructor(
    public readonly bought: bigint,
    public readonly sold: bigint,
  ) {}
}

export class PBoughtSold extends PObject<BoughtSold> {
  constructor() {
    const ppositive = new PPositive();
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
