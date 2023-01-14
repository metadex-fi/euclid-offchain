import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Constr, Data } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Generators,
  genName,
  genNonNegative,
  gMaxLength,
  randomChoice,
} from "../../../../mod.ts";
import { PConstanted, PData, PLifted, PType, RecordOf } from "../type.ts";
import { PObject } from "./object.ts";
import { PRecord } from "./record.ts";

export class PSum<O extends Object> implements PType<Constr<Data>, O> {
  public population = 0; // because not implemented

  constructor(
    public pconstrs: Array<PObject<O>>,
  ) {}

  public plift = (
    c: Constr<DataOf<O>>,
  ): O => {
    assert(c instanceof Constr, `plift: expected Constr`);
    assert(c.index < this.pconstrs.length, `plift: constr index out of bounds`);
    return this.pconstrs[Number(c.index)].plift(c.fields);
  };

  public pconstant = (
    data: O,
  ): Constr<Data> => {
    assert(data instanceof Object, `PSum.pconstant: expected Object`);
    assert(
      !(data instanceof Array),
      `PSum.pconstant: unexpected Array: ${data}`,
    );
    throw new Error(`pconstant: not implemented`); // TODO something about matching maybe
  };

  public genData = (): RecordOf<PLifted<PFields>> => {
    return randomChoice(this.pconstrs).genData();
  };

  public showData(data: PLifted<PSum<PData>>): string {
    throw new Error(`show: not implemented`);
  }

  public showPType(): string {
    throw new Error(`show: not implemented`);
  }

  static genPType(
    gen: Generators,
    maxDepth: bigint,
  ): PRecord<PData> {
    const pfields: RecordOf<PData> = {};
    const maxi = genNonNegative(gMaxLength);
    for (let i = 0; i < maxi; i++) {
      const key = genName();
      const pvalue = gen.generate(maxDepth);
      pfields[key] = pvalue;
    }
    return new PRecord(pfields);
  }
}
