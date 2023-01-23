import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Generators } from "../../../../mod.ts";
import { f, PConstanted, PData, PLifted, PType, t } from "../type.ts";

export type PMaybeLiteral<T extends PData> = T | PLiteral<T>;

export class PLiteral<PT extends PData>
  implements PType<PConstanted<PT>, PLifted<PT>> {
  public population = 1;
  private plutusLiteral: PConstanted<PT>;
  private str: string;
  constructor(
    public pliteral: PT,
    public literal: PLifted<PT>,
  ) {
    this.plutusLiteral = pliteral.pconstant(literal) as PConstanted<PT>;
    this.str = pliteral.showData(literal);
  }

  public plift = (l: PConstanted<PT>): PLifted<PT> => {
    assert(
      this.pliteral.showData(this.pliteral.plift(l)) === this.str,
      "Literal does not match",
    );
    return this.literal;
  };
  public pconstant = (data: PLifted<PT>): PConstanted<PT> => {
    assert(
      this.pliteral.showData(data) === this.str,
      "Literal does not match",
    );
    return this.plutusLiteral;
  };
  public genData = (): PLifted<PT> => {
    return this.literal;
  };

  public showData = (
    data: PLifted<PT>,
    tabs = "",
    maxDepth?: bigint,
  ): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "…";
    assert(
      this.pliteral.showData(data) === this.str,
      `Literal.showData: Literal does not match, got:\n${
        this.pliteral.showData(data)
      },\nexpected:\n${this.str}.`,
    );
    const tt = tabs + t;
    const ttf = tt + f;

    return `Literal (
${ttf}${this.pliteral.showData(data, ttf, maxDepth ? maxDepth - 1n : maxDepth)}
${tt})`;
  };

  public showPType = (tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "…";
    const tt = tabs + t;
    const ttf = tt + f;

    return `PLiteral (
${ttf}population: ${this.population},
${ttf}pliteral: ${
      this.pliteral.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)
    },
${ttf}literal: ${
      this.pliteral.showData(
        this.literal,
        ttf,
        maxDepth ? maxDepth - 1n : maxDepth,
      )
    }
${tt})`;
  };

  static genPType(
    gen: Generators,
    maxDepth: bigint,
  ): PLiteral<PData> {
    const pliteral = gen.generate(maxDepth);
    const literal = pliteral.genData();
    return new PLiteral(pliteral, literal);
  }
}
