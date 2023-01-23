import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Generators } from "../../../../mod.ts";
import { f, PConstanted, PData, PLifted, PType, t } from "../type.ts";

export class PConstraint<PInner extends PData>
  implements PType<PConstanted<PInner>, PLifted<PInner>> {
  public population: number;

  constructor(
    public pinner: PInner,
    public asserts: ((i: PLifted<PInner>) => void)[],
    public genInnerData: () => PLifted<PInner>,
    public details?: string,
  ) {
    this.population = pinner.population;
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (data: PConstanted<PInner>): PLifted<PInner> => {
    const plifted = this.pinner.plift(data) as PLifted<PInner>;
    this.asserts.forEach((assertion) => {
      assertion(plifted);
    });
    return plifted;
  };

  public pconstant = (data: PLifted<PInner>): PConstanted<PInner> => {
    this.asserts.forEach((assertion) => {
      try {
        assertion(data);
      } catch (e) {
        throw new Error(
          `Assertion failed in pconstant: ${e.message} of ${this.showPType()}`,
        );
      }
    });
    return this.pinner.pconstant(data) as PConstanted<PInner>;
  };

  public genData = (): PLifted<PInner> => {
    return this.genInnerData();
  };

  public showData = (
    data: PLifted<PInner>,
    tabs = "",
    maxDepth?: bigint,
  ): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "…";
    const tt = tabs + t;
    const ttf = tt + f;

    return `Constraint (
${ttf}${this.pinner.showData(data, ttf, maxDepth ? maxDepth - 1n : maxDepth)}
${tt})`;
  };

  public showPType = (tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "…";
    const tt = tabs + t;
    const ttf = tt + f;

    const asserts = `[\n
      ${ttf}` + this.asserts.map((a) => {
      return `(${a.toString()})`;
    }).join(`,\n${ttf}`) + `\n
    ${ttf}]`;

    return `PConstraint (${
      this.details ? `\n${ttf}details: ${this.details}` : ""
    }
${ttf}population: ${this.population},
${ttf}pinner: ${
      this.pinner.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)
    },
${tt})`;
    // ${ttf}asserts: \${asserts},
    // ${ttf}genInnerData: \${this.genInnerData.toString()}
  };

  static genPType(
    gen: Generators,
    maxDepth: bigint,
  ): PConstraint<PData> {
    const pinner = gen.generate(maxDepth);
    const genInnerData = pinner.genData;
    return new PConstraint(pinner, [], genInnerData);
  }
}
