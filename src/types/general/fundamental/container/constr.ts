import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Constr } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Generators, genNonNegative, maxInteger } from "../../../../mod.ts";
import {
  f,
  PConstanted,
  PData,
  PLifted,
  PType,
  RecordOf,
  RecordOfMaybe,
  t,
} from "../type.ts";
import { PRecord } from "./record.ts";

export class PConstr<PFields extends PData>
  implements
    PType<Constr<PConstanted<PFields>>, RecordOfMaybe<PLifted<PFields>>> {
  public population: number;

  constructor(
    public index: bigint,
    public pfields: PRecord<PFields>,
  ) {
    this.population = pfields.population;
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (
    c: Constr<PConstanted<PFields>>,
  ): RecordOfMaybe<PLifted<PFields>> => {
    assert(c instanceof Constr, `plift: expected Constr`);
    assert(
      this.index === BigInt(c.index),
      `plift: wrong constr index: ${this} vs. ${c}`,
    );
    return this.pfields.plift(c.fields);
  };

  public pconstant = (
    data: RecordOf<PLifted<PFields>>,
  ): Constr<PConstanted<PFields>> => {
    assert(data instanceof Object, `PConstr.pconstant: expected Object`);
    assert(
      !(data instanceof Array),
      `PConstr.pconstant: unexpected Array: ${data}`,
    );
    const index = Number(this.index);
    assert(
      BigInt(index) === this.index,
      `PConstr.pconstant: index too large: ${this.index} vs. ${index}`,
    );
    return new Constr(index, this.pfields.pconstant(data));
  };

  public genData = (): RecordOfMaybe<PLifted<PFields>> => {
    return this.pfields.genData();
  };

  public showData = (data: RecordOf<PLifted<PFields>>, tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    return `Constr (
${ttf}${this.pfields.showData(data, ttf)}},
${tt})`;
  };

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    return `PConstr (
${ttf}population: ${this.population},
${ttf}index: ${this.index.toString()},
${ttf}pfields: ${this.pfields.showPType(ttf)}
${tt})`;
  };

  static genPType(
    gen: Generators,
    maxDepth: bigint,
  ): PConstr<PData> {
    const index = genNonNegative(maxInteger);
    const pfields = PRecord.genPType(gen, maxDepth);
    return new PConstr(index, pfields);
  }
}
