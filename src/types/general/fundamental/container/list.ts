import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Generators,
  genNonNegative,
  maybeNdef,
} from "../../../../utils/generators.ts";
import { f, PConstanted, PData, PLifted, PType, t } from "../type.ts";
import { gMaxLength } from "../../../../utils/constants.ts";

export class PList<PElem extends PData>
  implements PType<PConstanted<PElem>[], PLifted<PElem>[]> {
  public readonly population: bigint | undefined;

  constructor(
    public readonly pelem: PElem,
    public readonly length?: bigint,
  ) {
    assert(!length || length >= 0, "negative length");
    if (!length || length === 0n) this.population = 1n; // worst case, consider preventing this by setting minimum size
    else {this.population = pelem.population
        ? pelem.population ** length
        : undefined;}
    assert(
      !this.population || this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (l: PConstanted<PElem>[]): PLifted<PElem>[] => {
    assert(l instanceof Array, `List.plift: expected List: ${l}`);
    assert(
      !this.length || this.length === BigInt(l.length),
      `plift: wrong length - ${this.length} vs. ${l.length}`,
    );
    const data = l.map((elem) => this.pelem.plift(elem));
    return data as PLifted<PElem>[];
  };

  public pconstant = (
    data: PLifted<PElem>[],
  ): PConstanted<PElem>[] => {
    assert(data instanceof Array, `pconstant: expected Array`);
    assert(
      !this.length || this.length === BigInt(data.length),
      `pconstant: wrong length`,
    );
    return data.map(this.pelem.pconstant) as PConstanted<PElem>[];
  };

  static genList<T>(
    elemGenerator: () => T,
    length: bigint,
  ): Array<T> {
    const l = new Array<T>();
    for (let i = 0; i < length; i++) {
      l.push(elemGenerator());
    }
    return l;
  }

  public genData = (): PLifted<PElem>[] => {
    const length = this.length ? this.length : genNonNegative(gMaxLength);
    return PList.genList(this.pelem.genData, length) as PLifted<PElem>[];
  };

  public showData = (
    data: PLifted<PElem>[],
    tabs = "",
    maxDepth?: bigint,
  ): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "List [ … ]";
    assert(
      data instanceof Array,
      `PList.showData: expected Array, got ${data}`,
    );
    const tt = tabs + t;
    const ttf = tt + f;

    return `List [
${
      data.map((d) =>
        `${ttf}${
          this.pelem.showData(d, ttf, maxDepth ? maxDepth - 1n : maxDepth)
        }`
      ).join(",\n")
    }
${tt}]`;
  };

  public showPType = (tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "PList ( … )";
    const tt = tabs + t;
    const ttf = tt + f;

    return `PList (
${ttf}population: ${this.population},
${ttf}pelem: ${this.pelem.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)},
${ttf}length?: ${this.length}
${tt})`;
  };

  static genPType<PElem extends PData>(
    gen: Generators,
    maxDepth: bigint,
  ): PList<PElem> {
    const length = maybeNdef(genNonNegative(gMaxLength));
    const pelem: PElem = gen.generate(maxDepth) as PElem;
    return new PList<PElem>(pelem, length);
  }
}
