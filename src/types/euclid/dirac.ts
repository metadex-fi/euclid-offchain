import {
  KeyHash,
  PKeyHash,
  PObject,
  PositiveValue,
  PPositiveValue,
  PRecord,
} from "../mod.ts";
import { IdNFT, PIdNFT } from "./idnft.ts";

// export class Dirac {
//   constructor(
//     public readonly owner: KeyHash,
//     public readonly threadNFT: IdNFT,
//     public readonly paramNFT: IdNFT,
//     public readonly lowestPrices: PositiveValue,
//   ) {
//     Dirac.asserts(this);
//   }

//   static asserts(dirac: Dirac): void {
//     dirac.paramNFT.assertFitsOwner(dirac.owner);
//     dirac.threadNFT.assertFitsParamNFT(dirac.paramNFT);
//   }

//   static generate(): Dirac {
//   }
// }

// export class PDirac extends PObject<Dirac> {
//   private constructor() {
//     super(
//       new PRecord({
//         owner: PKeyHash.ptype,
//         threadNFT: PIdNFT.ptype,
//         paramNFT: PIdNFT.ptype,
//         lowestPrices: PPositiveValue.ptype,
//       }),
//       Dirac,
//     );
//   }

//   public genData = Dirac.generate;

//   static genPType(): PDirac {
//   }
// }
