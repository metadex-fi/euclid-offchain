// import { Data } from "https://deno.land/x/lucid@0.8.6/mod.ts";
// import {
// Dirac,
//   DiracDatum,
//   Param,
//   ParamDatum,
//   PConstraint,
//   PDiracDatum,
//   PList,
//   PMap,
//   PObject,
//   PParamDatum,
//   PRecord,
//   PSum,
// } from "../mod.ts";

// export type EuclidDatum = ParamDatum | DiracDatum;

// export class PEuclidDatum extends PSum<EuclidDatum> {
//   constructor(
//     public pparamDatum: PParamDatum,
//     public pdiracDatum: PDiracDatum,
//   ) {
//     super([
//       pparamDatum,
//       pdiracDatum,
//     ]);
//   }

//   // TODO this is wrong, needs to be entangled:
//   static genPType(): PEuclidDatum {
//     const pparamDatum = PParamDatum.genPType() as PParamDatum;
//     const pdiracDatum = PDiracDatum.genPType() as PDiracDatum;
//     return new PEuclidDatum(pparamDatum, pdiracDatum);
//   }
// }

// export class AAAA extends PConstraint<PEuclidDatum> {
//   private constructor(
//     public pparamDatum: PParamDatum,
//     public pdiracDatum: PDiracDatum,
//   ) {
//     super(
//      new PEuclidDatum(pparamDatum, pdiracDatum),
//       [],
//       () => {
//         return PEuclidDatum.genPType().genData();
//       },
//     );
//   }
// }

// /*
// for parsing: We want a map from params to list of diracs
// - first sort incoming Constrs by index
// - then get the params and parse them
// - then get the diracs, and for each, find the associated param via paramNFT, and use it to parse it
// - catch all parsing-failures of the above, and store them somewhere else

// for generating: Likewise, but with a random param
// - generate param(s)
// - generate diracs with the param(s)

// */

// export class Euclid {
//   constructor(
//     public readonly valid: Map<Param, Dirac[]>,
//     // public readonly invalid: Data[],
//   ) {}

//   static fromData() {

//   }

// }

// export class PEuclid extends PConstraint<PObject<Euclid>> {
//   constructor() {
//     super(
//       new PObject(
//         new PRecord({
//           "valid": new PMap(
//             PParam.ptype,
//             new PList(PDiracDatum.genPType()),
//           ),
//           // "invalid": new PList(PData),
//         }),
//         Euclid,
//       ),
//       [Euclid.assert],
//       () => {},
//     );
//   }
// }
