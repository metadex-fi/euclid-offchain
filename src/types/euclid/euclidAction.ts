import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";
import { PSwap, Swap } from "./swap.ts";

export class SwapRedeemer {
  constructor(
    public readonly swap: Swap,
  ) {}
}

export class PSwapRedeemer extends PObject<SwapRedeemer> {
  private constructor(
    pswap: PSwap,
  ) {
    super(
      new PRecord({
        "swap": pswap,
      }),
      SwapRedeemer,
    );
  }

  static ptype = new PSwapRedeemer(PSwap.ptype);
  static genPType(): PSwapRedeemer {
    return PSwapRedeemer.ptype;
  }
}

export class AdminRedeemer {
  constructor() {}
}

export class PAdminRedeemer extends PObject<AdminRedeemer> {
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
