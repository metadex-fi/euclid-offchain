import { PSum } from "../general/fundamental/container/sum.js";
import { Swap } from "./swap.js";
export declare class SwapRedeemer {
    readonly swap: Swap;
    constructor(swap: Swap);
}
export declare class AdminRedeemer {
    constructor();
}
export declare type EuclidAction = SwapRedeemer | AdminRedeemer;
export declare class PEuclidAction extends PSum<EuclidAction> {
    private constructor();
    static ptype: PEuclidAction;
    static genPType(): PEuclidAction;
}
