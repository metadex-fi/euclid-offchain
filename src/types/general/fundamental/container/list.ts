import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Generators,
  genNonNegative,
  gMaxLength,
  maybeNdef,
} from "../../../../mod.ts";
import { Constanted, f, Lifted, Lmm, PType, t } from "../type.ts";

export class PList<E extends Lifted> implements PType<Lmm<E>[]> {
  public readonly population: number;

  constructor(
    public readonly pelem: PType<Lmm<E>>,
    public readonly length?: bigint,
  ) {
    assert(!length || length >= 0, "negative length");
    if (!length || length === 0n) this.population = 1; // worst case, consider preventing this by setting minimum size
    else this.population = pelem.population ** Number(length);
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (l: Constanted<Lmm<E>>[]): Lmm<E>[] => {
    assert(l instanceof Array, `List.plift: expected List: ${l}`);
    assert(
      !this.length || this.length === BigInt(l.length),
      `plift: wrong length - ${this.length} vs. ${l.length}`,
    );
    const data = l.map((elem) => this.pelem.plift(elem));
    return data;
  };

  public pconstant = (
    data: Lmm<E>[],
  ): Constanted<Lmm<E>>[] => {
    assert(data instanceof Array, `pconstant: expected Array`);
    assert(
      !this.length || this.length === BigInt(data.length),
      `pconstant: wrong length`,
    );
    return data.map(this.pelem.pconstant);
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

  public genData = (): Lmm<E>[] => {
    const length = this.length ? this.length : genNonNegative(gMaxLength);
    return PList.genList(this.pelem.genData, length);
  };

  public showData = (data: Lmm<E>[], tabs = ""): string => {
    assert(
      data instanceof Array,
      `PList.showData: expected Array, got ${data}`,
    );
    const tt = tabs + t;
    const ttf = tt + f;

    return `List [
${data.map((d) => `${ttf}${this.pelem.showData(d, ttf)}`).join(",\n")}
${tt}]`;
  };

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    return `PList (
${ttf}population: ${this.population},
${ttf}pelem: ${this.pelem.showPType(ttf)},
${ttf}length?: ${this.length}
${tt})`;
  };

  static genPType<E extends Lifted>(
    gen: Generators,
    maxDepth: bigint,
  ): PList<E> {
    const length = maybeNdef(genNonNegative(gMaxLength));
    const pelem: PType<Lmm<E>> = gen.generate(maxDepth);
    return new PList<E>(pelem, length);
  }
}
