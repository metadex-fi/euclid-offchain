import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Generators,
  genName,
  genNonNegative,
  gMaxLength,
  maybeNdef,
} from "../../../mod.ts";
import {
  f,
  PConstanted,
  PData,
  PLifted,
  PType,
  RecordOf,
  RecordOfMaybe,
  t,
} from "./type.ts";

export class PRecord<PFields extends PData>
  implements
    PType<Array<PConstanted<PFields>>, RecordOfMaybe<PLifted<PFields>>> {
  public population: number;

  constructor(
    public pfields: RecordOfMaybe<PFields>,
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
  ): RecordOfMaybe<PLifted<PFields>> => {
    assert(
      l instanceof Array,
      `Record.plift: expected Array, got ${l} (${typeof l})\nfor ${this.showPType()})`,
    );
    const r: RecordOfMaybe<PLifted<PFields>> = {};
    let i = 0;
    Object.entries(this.pfields).forEach(([key, pfield]) => {
      if (pfield !== undefined) {
        assert(
          i < l.length,
          `Record.plift: too few elements at
key = ${key}
i = ${i}
pfield = ${pfield.showPType()}
in [${l}] of length ${l.length}
for ${this.showPType()};
status: ${Object.keys(r).join(`,\n${f}`)}`,
        );
        const value = l[i++];
        assert(
          value !== undefined,
          `Record.plift: undefined value <${value}> at
key = ${key}
i = ${i}
pfield = ${pfield.showPType()}
in [${l}] of length ${l.length}
for ${this.showPType()};
status: ${Object.keys(r).join(`,\n${f}`)}`,
        );
        r[key] = pfield.plift(value) as PConstanted<PFields>;
      } else {
        r[key] = undefined;
      }
    });
    assert(
      i === l.length,
      `Record.plift: too many elements (${l.length}) for ${this.showPType()}`,
    );
    return r;
  };

  private checkFields = (data: RecordOfMaybe<PLifted<PFields>>) => {
    assert(
      data instanceof Object,
      `PRecord.checkFields: expected Object, got ${data}\nfor ${this.showPType()}`,
    );
    const pfieldsNames = Object.keys(this.pfields).join(`,\n${f}`);
    const dataFieldsNames = Object.keys(data).join(`,\n${f}`);
    assert(
      pfieldsNames === dataFieldsNames,
      `PRecord.checkFields: expected fields:\n${f}${pfieldsNames},\ngot:\n${f}${dataFieldsNames}\nfor ${this.showPType()}\n`,
    );
  };

  public pconstant = (
    data: RecordOfMaybe<PLifted<PFields>>,
  ): Array<PConstanted<PFields>> => {
    this.checkFields(data);

    const l = new Array<PConstanted<PFields>>();
    Object.entries(this.pfields).forEach(([key, pfield]) => {
      const value = data[key];
      if (pfield) {
        assert(
          value !== undefined,
          `cannot constant ${value} with pfield: ${pfield.showPType()}`,
        );
        l.push(pfield.pconstant(value) as PConstanted<PFields>);
      } else {
        assert(
          value === undefined,
          `cannot constant ${value} with undefined pfield`,
        );
      }
    });
    return l;
  };

  public genData = (): RecordOfMaybe<PLifted<PFields>> => {
    const r: RecordOfMaybe<PLifted<PFields>> = {};
    Object.entries(this.pfields).forEach(([key, pfield]) => {
      r[key] = pfield?.genData() as PLifted<PFields>;
    });
    return r;
  };

  public showData = (
    data: RecordOfMaybe<PLifted<PFields>>,
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
    const pfields: RecordOfMaybe<PData> = {};
    const maxi = genNonNegative(gMaxLength);
    for (let i = 0; i < maxi; i++) {
      const key = genName();
      const pvalue = maybeNdef(() => gen.generate(maxDepth))?.();
      pfields[key] = pvalue;
    }
    return new PRecord(pfields);
  }
}
