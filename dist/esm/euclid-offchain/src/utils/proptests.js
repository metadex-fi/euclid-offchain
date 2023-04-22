import { assert, assertEquals, } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Data } from "../types/general/fundamental/type.js";
import { gMaxDepth } from "./generators.js";
export const maxShowDepth = 5n;
export function proptestPTypes(gen, iterations) {
    const popErrs = new Map();
    const dataErrs = new Map();
    const ptypeErrs = new Map();
    const otherErrs = new Map();
    for (let i = 0; i < iterations; i++) {
        const errs = popErrs.size + dataErrs.size + ptypeErrs.size + otherErrs.size;
        console.log(`${i}` + (errs ? ` (${errs} errors)` : ""));
        try {
            // console.log("generating ptype")
            const ptype = gen.generate(gMaxDepth);
            // console.log("generating data for " + ptype.showPType(t));
            const data = ptype.genData();
            // console.log("constanting " + ptype.showData(data));
            const plutusData = ptype.pconstant(data);
            // console.log(ptype.showData(data));
            // console.log(`testing population of ${ptype.showPType(t)}`)
            testPopulation(ptype, popErrs);
            // console.log("testing data parsing")
            testDataParse(plutusData, dataErrs);
            // console.log("testing ptype parsing")
            testPTypeParse(plutusData, data, ptype, ptypeErrs);
        }
        catch (err) {
            logError(err, otherErrs);
        }
    }
    let correct = iterations;
    correct -= printErrs(popErrs, "Population errors");
    correct -= printErrs(dataErrs, "Data parsing errors");
    correct -= printErrs(ptypeErrs, "PType parsing errors");
    correct -= printErrs(otherErrs, "other errors");
    console.log(correct + " x correct");
    assertEquals(correct, iterations);
}
function testDataParse(plutusData, errors) {
    try {
        assertEquals(plutusData, Data.from(Data.to(plutusData)));
    }
    catch (err) {
        logError(err, errors);
    }
}
function testPTypeParse(plutusData, data, ptype, errors) {
    try {
        const data_ = ptype.plift(plutusData);
        // Deno can't compare functions how we want it;
        // PObject wrongly fails because of that, so we have to do this:
        if (ptype.showPType().includes("PObject")) {
            assertEquals(ptype.showData(data), ptype.showData(data_));
        }
        else {
            try {
                assertEquals(data, data_);
            }
            catch (err) {
                throw new Error(ptype.showPType() + "\n" + err.message);
            }
        }
    }
    catch (err) {
        logError(err, errors);
    }
}
function logError(err, record) {
    const e = [
        // err.name,
        // err.message,
        // err.cause,
        err.stack,
    ].join("\n");
    const num = record.get(e);
    record.set(e, num ? num + 1 : 1);
}
function printErrs(record, name) {
    let total = 0;
    record.forEach((num, err) => {
        console.error(`\n${num} x ${err}`);
        total += num;
    });
    if (total) {
        console.log(`${name} ==> total: ${record.size} (${total})\n`);
    }
    else {
        console.log(`==> no ${name}\n`);
    }
    return total;
}
// this is required to prevent keyset population timeouts
function testSmallPopulation(ptype, errors) {
    const popStrings = [];
    let consecutive = 0;
    try {
        assert(ptype.population > 0, "population must be positive");
        while (popStrings.length < ptype.population) {
            const p = ptype.genData();
            const s = ptype.showData(p);
            if (!popStrings.includes(s)) {
                consecutive = 0;
                popStrings.push(s);
            }
            else {
                if (++consecutive > 10000) {
                    throw new Error(`could only achive population size ${popStrings.length} for ${ptype.showPType(undefined, maxShowDepth)}${popStrings.length < 20 ? ":\n" + popStrings.join(", ") : ""}`);
                }
            }
        }
    }
    catch (err) {
        logError(err, errors);
    }
}
function testPopulation(ptype, errors) {
    if (ptype.population > 20)
        return;
    else
        testSmallPopulation(ptype, errors);
}
