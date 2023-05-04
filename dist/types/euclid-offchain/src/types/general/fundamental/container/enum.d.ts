import { Generators } from "../../../../utils/generators.js";
import { PConstanted, PData, PLifted, PType } from "../type.js";
export declare class PEnum<PT extends PData>
  implements PType<PConstanted<PT>, PLifted<PT>> {
  pliteral: PT;
  literals: PLifted<PT>[];
  population: number;
  private plutusLiterals;
  private strs;
  constructor(pliteral: PT, literals: PLifted<PT>[]);
  plift: (l: PConstanted<PT>) => PLifted<PT>;
  pconstant: (data: PLifted<PT>) => PConstanted<PT>;
  genData: () => PLifted<PT>;
  showData: (data: PLifted<PT>, tabs?: string, maxDepth?: bigint) => string;
  showPType: (tabs?: string, maxDepth?: bigint) => string;
  static genPType(gen: Generators, maxDepth: bigint): PEnum<PData>;
}
