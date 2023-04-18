import { Generators } from "../../../../utils/generators.js";
import { PConstanted, PData, PLifted, PType } from "../type.js";
export declare class PConstraint<PInner extends PData>
  implements PType<PConstanted<PInner>, PLifted<PInner>> {
  pinner: PInner;
  asserts: ((i: PLifted<PInner>) => void)[];
  genInnerData: () => PLifted<PInner>;
  details?: string | undefined;
  population: number;
  constructor(
    pinner: PInner,
    asserts: ((i: PLifted<PInner>) => void)[],
    genInnerData: () => PLifted<PInner>,
    details?: string | undefined,
  );
  plift: (data: PConstanted<PInner>) => PLifted<PInner>;
  pconstant: (data: PLifted<PInner>) => PConstanted<PInner>;
  genData: () => PLifted<PInner>;
  showData: (data: PLifted<PInner>, tabs?: string, maxDepth?: bigint) => string;
  showPType: (tabs?: string, maxDepth?: bigint) => string;
  static genPType(gen: Generators, maxDepth: bigint): PConstraint<PData>;
}
