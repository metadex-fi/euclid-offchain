import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { genPositive, gMaxLength, maybeNdef, } from "../../../utils/generators.js";
import { PList } from "../fundamental/container/list.js";
import { PConstraint } from "../fundamental/container/constraint.js";
export class PNonEmptyList extends PConstraint {
    constructor(pelem, length) {
        assert(!length || length > 0, "empty list");
        super(new PList(pelem, length), [assertNonEmptyList], () => PList.genList(pelem.genData, length ?? genPositive(gMaxLength)));
    }
    static genPType(gen, maxDepth) {
        const length = maybeNdef(genPositive(gMaxLength));
        const pelem = gen.generate(maxDepth);
        return new PNonEmptyList(pelem, length);
    }
}
function assertNonEmptyList(l) {
    assert(l.length > 0, "encountered empty List");
}
// TODO something here or in nonEmptyMap or both to ensure
// at least two assets in pool
