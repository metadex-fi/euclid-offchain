import {
  KeyHash,
  PKeyHash,
  PObject,
  PositiveValue,
  PPositiveValue,
  PRecord,
} from "../mod.ts";
import { IdNFT, PIdNFT } from "./idnft.ts";

export class Dirac {
  constructor(
    public readonly owner: KeyHash,
    public readonly threadNFT: IdNFT,
    public readonly paramNFT: IdNFT,
    public readonly lowestPrices: PositiveValue,
  ) {}
}

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
// }
