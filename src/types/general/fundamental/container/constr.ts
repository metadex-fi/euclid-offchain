// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import { Constr } from "https://deno.land/x/lucid@0.8.6/mod.ts";
// import { Generators, genNonNegative, maxInteger } from "../../../../mod.ts";
// import {
//   Constanted,
//   f,
//   Lifted,
//   Lmm,
//   PType,
//   RecordOfMaybe,
//   t,
// } from "../type.ts";
// import { PRecord } from "./record.ts";

// export class PConstr<F extends Lifted> implements PType<RecordOfMaybe<Lmm<F>>> {
//   public readonly population: number;

//   constructor(
//     public readonly index: bigint,
//     public readonly pfields: PRecord<F>,
//   ) {
//     this.population = pfields.population;
//     assert(
//       this.population > 0,
//       `Population not positive in ${this.showPType()}`,
//     );
//   }

//   public plift = (
//     c: Constr<Constanted<Lmm<F>>>,
//   ): RecordOfMaybe<Lmm<F>> => {
//     assert(c instanceof Constr, `plift: expected Constr`);
//     assert(
//       this.index === BigInt(c.index),
//       `plift: wrong constr index: ${this} vs. ${c}`,
//     );
//     const fields = c.fields;
//     return this.pfields.plift(fields);
//   };

//   public pconstant = (
//     data: RecordOfMaybe<Lmm<F>>,
//   ): Constr<Constanted<Lmm<F>>> => {
//     assert(data instanceof Object, `PConstr.pconstant: expected Object`);
//     assert(
//       !(data instanceof Array),
//       `PConstr.pconstant: unexpected Array: ${data}`,
//     );
//     const index = Number(this.index);
//     assert(
//       BigInt(index) === this.index,
//       `PConstr.pconstant: index too large: ${this.index} vs. ${index}`,
//     );
//     return new Constr(index, this.pfields.pconstant(data));
//   };

//   public genData = (): RecordOfMaybe<Lmm<F>> => {
//     return this.pfields.genData();
//   };

//   public showData = (data: RecordOfMaybe<Lmm<F>>, tabs = ""): string => {
//     const tt = tabs + t;
//     const ttf = tt + f;

//     return `Constr (
// ${ttf}${this.pfields.showData(data, ttf)}},
// ${tt})`;
//   };

//   public showPType = (tabs = ""): string => {
//     const tt = tabs + t;
//     const ttf = tt + f;

//     return `PConstr (
// ${ttf}population: ${this.population},
// ${ttf}index: ${this.index.toString()},
// ${ttf}pfields: ${this.pfields.showPType(ttf)}
// ${tt})`;
//   };

//   static genPType<F extends Lifted>(
//     gen: Generators,
//     maxDepth: bigint,
//   ): PConstr<F> {
//     const index = genNonNegative(maxInteger);
//     const pfields = PRecord.genPType(gen, maxDepth);
//     return new PConstr(index, pfields);
//   }
// }
