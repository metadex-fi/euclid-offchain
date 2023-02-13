import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";
import { PSum } from "../general/fundamental/container/sum.ts";
import { PSwap, Swap } from "./swap.ts";

export class SwapRedeemer {
  constructor(
    public readonly swap: Swap,
  ) {}
}

class PSwapRedeemer extends PObject<SwapRedeemer> {
  private constructor() {
    super(
      new PRecord({
        "swap": PSwap.ptype,
      }),
      SwapRedeemer,
    );
  }

  static ptype = new PSwapRedeemer();
  static genPType(): PSwapRedeemer {
    return PSwapRedeemer.ptype;
  }
}

export class AdminRedeemer {
  constructor() {}
}

class PAdminRedeemer extends PObject<AdminRedeemer> {
  private constructor() {
    super(
      new PRecord({}),
      AdminRedeemer,
    );
  }

  static ptype = new PAdminRedeemer();
  static genPType(): PAdminRedeemer {
    return PAdminRedeemer.ptype;
  }
}

export type EuclidAction = SwapRedeemer | AdminRedeemer;

export class PEuclidAction extends PSum<EuclidAction> {
  private constructor() {
    super([PSwapRedeemer.ptype, PAdminRedeemer.ptype]);
  }

  static ptype = new PEuclidAction();
  static genPType(): PEuclidAction {
    return PEuclidAction.ptype;
  }
}
