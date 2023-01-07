import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Generators,
  genName,
  genNonNegative,
  gMaxLength,
} from "../../../mod.ts";
import { f, PConstanted, PData, PLifted, PType, RecordOf, t } from "./type.ts";

export class PRecord<PFields extends PData>
  implements PType<Array<PConstanted<PFields>>, RecordOf<PLifted<PFields>>> {
  public population: number;

  constructor(
    public pfields: RecordOf<PFields | undefined>,
  ) {
    let population = 1;
    Object.values(pfields).forEach((pfield) => {
      if (pfield) population *= pfield.population;
    });
    this.population = population;
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (
    l: Array<PConstanted<PFields>>,
  ): RecordOf<PLifted<PFields>> => {
    assert(
      l instanceof Array,
      `Record.plift: expected List: ${l}`,
    );
    const r: Record<string, PLifted<PFields>> = {};

    const pfields = Object.entries(this.pfields);
    l.forEach((value, i) => {
      const key = pfields[i][0];
      const pvalue = pfields[i][1];
      assert(pvalue, `cannot lift undefined fields: ${key}`);
      r[key] = pvalue.plift(value) as PLifted<PFields>;
    });
    return r;
  };

  private checkFields = (data: RecordOf<PLifted<PFields>>) => {
    assert(
      data instanceof Object,
      `PRecord: expected Object, got ${data}`,
    );
    const pfieldsNames = Object.keys(this.pfields).join(`,\n${f}`);
    const dataFieldsNames = Object.keys(data).join(`,\n${f}`);
    assert(
      pfieldsNames === dataFieldsNames,
      `PRecord:\nexpected fields:\n${f}${pfieldsNames},\ngot:\n${f}${dataFieldsNames}\n`,
    );
  };

  public pconstant = (
    data: RecordOf<PLifted<PFields>>,
  ): Array<PConstanted<PFields>> => {
    this.checkFields(data);

    const l = new Array<PConstanted<PFields>>();
    Object.entries(data).forEach(([key, value]) => {
      assert(
        Object.keys(this.pfields).includes(key),
        `field not found: ${key}`,
      );
      const pfield = this.pfields[key];
      assert(pfield, `cannot constant undefined fields: ${key}`);
      l.push(pfield.pconstant(value) as PConstanted<PFields>);
    });
    return l;
  };

  public genData = (): RecordOf<PLifted<PFields>> => {
    const r: RecordOf<PLifted<PFields>> = {};
    Object.entries(this.pfields).forEach(([key, pfield]) => {
      r[key] = pfield?.genData() as PLifted<PFields>;
    });
    return r;
  };

  public showData = (
    data: RecordOf<PLifted<PFields>>,
    tabs = "",
  ): string => {
    this.checkFields(data);
    if (data.size === 0) return "Record {}";
    const tt = tabs + t;
    const ttf = tt + f;
    const ttft = ttf + t;

    const fields = Object.entries(data).map(([key, value]) => {
      return `${ttf}${key.length === 0 ? "_" : key}: ${
        this.pfields[key]?.showData(value, ttft) ?? "undefined"
      }`;
    }).join(",\n");
    return `Record {
${fields}
${tt}}`;
  };

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    const ttff = ttf + f;

    const fields = Object.entries(this.pfields).map(([key, pfield]) => {
      return `\n${ttff}${key.length === 0 ? "_" : key}: ${
        pfield?.showPType(ttff) ?? "undefined"
      }`;
    });
    return `PRecord (
${ttf}population: ${this.population},
${ttf}pfields: {${fields.length > 0 ? `${fields.join(`,`)}\n${ttf}` : ""}}
${tt})`;
  };

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
