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
    public pfields: RecordOf<PFields>,
  ) {
    let population = 1;
    Object.values(pfields).forEach((pfield) => {
      population *= pfield.population;
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
      r[key] = pvalue.plift(value) as PLifted<PFields>;
    });
    return r;
  };

  public pconstant = (
    data: RecordOf<PLifted<PFields>>,
  ): Array<PConstanted<PFields>> => {
    assert(data instanceof Object, `PRecord.pconstant: expected Object`);

    const pfieldsNames = Object.keys(this.pfields).join(`,\n${f}`);
    const dataFieldsNames = Object.keys(data).join(`,\n${f}`);
    assert(
      pfieldsNames === dataFieldsNames,
      `PRecord.pconstant:\nexpected fields:\n${f}${pfieldsNames},\ngot:\n${f}${dataFieldsNames}\n`,
    );

    const l = new Array<PConstanted<PFields>>();
    Object.entries(data).forEach(([key, value]) => {
      const pfield = this.pfields[key];
      assert(pfield, `field not found: ${key}`);
      l.push(pfield.pconstant(value) as PConstanted<PFields>);
    });
    return l;
  };

  public genData = (): RecordOf<PLifted<PFields>> => {
    const r: RecordOf<PLifted<PFields>> = {};
    Object.entries(this.pfields).forEach(([key, pfield]) => {
      r[key] = pfield.genData() as PLifted<PFields>;
    });
    return r;
  };

  public showData = (
    data: RecordOf<PLifted<PFields>>,
    tabs = "",
  ): string => {
    if (data.size === 0) return "MapRecord {}";
    const tt = tabs + t;
    const ttf = tt + f;
    const ttft = ttf + t;

    const fields = Object.entries(data).map(([key, value]) => {
      return `${ttf}${key.length === 0 ? "_" : key}: ${
        this.pfields[key].showData(value, ttft)
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
        pfield.showPType(ttff)
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
