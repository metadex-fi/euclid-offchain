import { Generators } from "../../../../utils/generators.js";
import { PConstanted, PData, PLifted, PType } from "../type.js";
export declare type PMaybeLiteral<T extends PData> = T | PLiteral<T>;
export declare class PLiteral<PT extends PData>
  implements PType<PConstanted<PT>, PLifted<PT>> {
  pliteral: PT;
  literal: PLifted<PT>;
  population: number;
  private plutusLiteral;
  private str;
  constructor(pliteral: PT, literal: PLifted<PT>);
  plift: (l: PConstanted<PT>) => PLifted<PT>;
  pconstant: (data: PLifted<PT>) => PConstanted<PT>;
  genData: () => PLifted<PT>;
  showData: (data: PLifted<PT>, tabs?: string, maxDepth?: bigint) => string;
  showPType: (tabs?: string, maxDepth?: bigint) => string;
  static genPType(gen: Generators, maxDepth: bigint): PLiteral<PData>;
}
