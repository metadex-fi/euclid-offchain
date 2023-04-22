import { Generators } from "../../../utils/generators.js";
import { PList } from "../fundamental/container/list.js";
import { PData } from "../fundamental/type.js";
import { PConstraint } from "../fundamental/container/constraint.js";
export declare class PNonEmptyList<PElem extends PData> extends PConstraint<PList<PElem>> {
    constructor(pelem: PElem, length?: bigint);
    static genPType(gen: Generators, maxDepth: bigint): PConstraint<PList<PData>>;
}
