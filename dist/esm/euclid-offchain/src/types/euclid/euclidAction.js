import { PObject } from "../general/fundamental/container/object.js";
import { PRecord } from "../general/fundamental/container/record.js";
import { PSum } from "../general/fundamental/container/sum.js";
import { PSwap } from "./swap.js";
export class SwapRedeemer {
  constructor(swap) {
    Object.defineProperty(this, "swap", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: swap,
    });
  }
}
class PSwapRedeemer extends PObject {
  constructor() {
    super(
      new PRecord({
        "swap": PSwap.ptype,
      }),
      SwapRedeemer,
    );
  }
  static genPType() {
    return PSwapRedeemer.ptype;
  }
}
Object.defineProperty(PSwapRedeemer, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PSwapRedeemer(),
});
export class AdminRedeemer {
  constructor() {}
}
class PAdminRedeemer extends PObject {
  constructor() {
    super(new PRecord({}), AdminRedeemer);
  }
  static genPType() {
    return PAdminRedeemer.ptype;
  }
}
Object.defineProperty(PAdminRedeemer, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PAdminRedeemer(),
});
export class PEuclidAction extends PSum {
  constructor() {
    super([PSwapRedeemer.ptype, PAdminRedeemer.ptype]);
  }
  static genPType() {
    return PEuclidAction.ptype;
  }
}
Object.defineProperty(PEuclidAction, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PEuclidAction(),
});
