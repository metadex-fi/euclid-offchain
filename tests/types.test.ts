// import { PBoughtSold } from "../src/types/euclid/boughtSold.ts";
// import { PDirac, PPreDirac } from "../src/types/euclid/dirac.ts";
// import { PEuclidAction } from "../src/types/euclid/euclidAction.ts";
// import {
//   PEuclidDatum,
//   PPreEuclidDatum,
// } from "../src/types/euclid/euclidDatum.ts";
// import { PEuclidValue } from "../src/types/euclid/euclidValue.ts";
// import { PIdNFT } from "../src/types/euclid/idnft.ts";
// import { PParam } from "../src/types/euclid/param.ts";
// import { PSwap } from "../src/types/euclid/swap.ts";
// import { PAsset } from "../src/types/general/derived/asset/asset.ts";
// import { PAssets } from "../src/types/general/derived/asset/assets.ts";
// import { PCurrency } from "../src/types/general/derived/asset/currency.ts";
// import { PToken } from "../src/types/general/derived/asset/token.ts";
// import { PBounded } from "../src/types/general/derived/bounded/bounded.ts";
// import { PPositive } from "../src/types/general/derived/bounded/positive.ts";
// import { PHash } from "../src/types/general/derived/hash/hash.ts";
// import { PKeyHash } from "../src/types/general/derived/hash/keyHash.ts";
// import { PNonEmptyList } from "../src/types/general/derived/nonEmptyList.ts";
// import { PPositiveValue } from "../src/types/general/derived/value/positiveValue.ts";
// import { PValue } from "../src/types/general/derived/value/value.ts";
// import { PConstraint } from "../src/types/general/fundamental/container/constraint.ts";
// import { PEnum } from "../src/types/general/fundamental/container/enum.ts";
// import { PList } from "../src/types/general/fundamental/container/list.ts";
// import { PLiteral } from "../src/types/general/fundamental/container/literal.ts";
// import { PMap } from "../src/types/general/fundamental/container/map.ts";
// import { PObject } from "../src/types/general/fundamental/container/object.ts";
// import { PRecord } from "../src/types/general/fundamental/container/record.ts";
// import { PSum } from "../src/types/general/fundamental/container/sum.ts";
// import { PWrapped } from "../src/types/general/fundamental/container/wrapped.ts";
// import { PByteString } from "../src/types/general/fundamental/primitive/bytestring.ts";
// import { PInteger } from "../src/types/general/fundamental/primitive/integer.ts";
// import { PString } from "../src/types/general/fundamental/primitive/string.ts";
// import { Generators } from "../src/utils/generators.ts";
// import { proptestPTypes } from "../src/utils/proptests.ts";

// Deno.test("euclid data/types tests", () => {
//   const gen = new Generators(
//     // @ts-ignore TODO type instantiation is excessively deep and possibly infinite
//     [
//       ...fundamentalPrimitiveGenerators,
//       ...derivedPrimitiveGenerators,
//       ...euclidPrimitiveGenerators,
//     ],
//     [
//       ...fundamentalContainerGenerators,
//       ...derivedContainerGenerators,
//     ],
//   );
//   proptestPTypes(gen, 1000);
// });

// const fundamentalPrimitiveGenerators = [
//   // PAny.genPType,
//   PInteger.genPType,
//   PByteString.genPType,
//   PString.genPType,
// ];

// const fundamentalContainerGenerators = [
//   PLiteral.genPType,
//   PEnum.genPType,
//   PConstraint.genPType,
//   PList.genPType,
//   PMap.genPType,
//   // PMapRecord.genPType,
//   PRecord.genPType,
//   PObject.genPType,
//   PSum.genPType,
//   PWrapped.genPType,
// ];

// const derivedPrimitiveGenerators = [
//   PBounded.genPType,
//   PPositive.genPType,
//   PHash.genPType,
//   PKeyHash.genPType,
//   PCurrency.genPType,
//   PToken.genPType,
//   PAsset.genPType,
//   PAssets.genPType,
//   PValue.genPType,
//   PPositiveValue.genPType,
// ];

// const derivedContainerGenerators = [
//   PNonEmptyList.genPType,
// ];

// const euclidPrimitiveGenerators = [
//   PBoughtSold.genPType,
//   PSwap.genPType,
//   PEuclidValue.genPType,
//   PIdNFT.genPType,
//   PParam.genPType,
//   PPreDirac.genPType,
//   PDirac.genPType,
//   PEuclidAction.genPType,
//   PEuclidDatum.genPType,
//   PPreEuclidDatum.genPType,
// ];
