import { PObject, PRecord } from "../mod.ts";
import { PSwap, Swap } from "./swap.ts";

export class SwapRedeemer {
  constructor(
    public readonly swap: Swap,
  ) {}
}
"";
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

// TODO
// export class PAdminRedeemer extends PObject<SwapRedeemer> {
//     private constructor(
//       pswap: PSwap,
//     ) {
//       super(
//         new PRecord({
//           "swap": pswap,
//         }),
//         SwapRedeemer,
//       );
//     }

//     static ptype = new PSwapRedeemer(PSwap.ptype);
//     static genPType(): PSwapRedeemer {
//       return PSwapRedeemer.ptype;
//     }
//   }
