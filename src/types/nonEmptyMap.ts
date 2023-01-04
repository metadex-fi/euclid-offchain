// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import {
//   Generators,
//   genPositive,
//   gMaxLength,
//   maybeNdef,
//   PConstraint,
//   PData,
//   PMap,
// } from "../../../refactor_parse/lucid/src/mod.ts";

// export class PNonEmptyMap<PKey extends PData, PValue extends PData>
//   extends PConstraint<
//     PMap<PKey, PValue>
//   > {
//   constructor(
//     pkey: PKey,
//     pvalue: PValue,
//     size?: bigint,
//   ) {
//     assert(!size || size > 0, "empty map");

//     super(
//       new PMap(pkey, pvalue, size),
//       [assertNonEmptyMap],
//       () => PMap.genMap(pkey, pvalue, size ?? genPositive(gMaxLength)),
//     );
//   }

//   static genPType(
//     gen: Generators,
//     maxDepth: bigint,
//   ): PConstraint<
//     PMap<PData, PData>
//   > { // additional maxDepth - 1n intentional
//     const pkey = gen.generate(maxDepth - 1n);
//     const pvalue = gen.generate(maxDepth - 1n);
//     const size = maybeNdef(genPositive(gMaxLength));
//     return new PNonEmptyMap(pkey, pvalue, size);
//   }
// }

// function assertNonEmptyMap<K, V>(m: Map<K, V>) {
//   assert(m.size > 0, "encountered empty Map");
// }
