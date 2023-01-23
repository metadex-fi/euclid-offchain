import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Generators,
  genName,
  genNonNegative,
  gMaxLength,
  maybeNdef,
} from "../../../../mod.ts";
import {
  f,
  PConstanted,
  PData,
  PLifted,
  PType,
  RecordOfMaybe,
  t,
} from "../type.ts";

export class PRecord<PFields extends PData>
  implements PType<PConstanted<PFields>[], RecordOfMaybe<PLifted<PFields>>> {
  public readonly population: number;

  constructor(
    public readonly pfields: RecordOfMaybe<PFields>,
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
    l: PConstanted<PFields>[],
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
        r[key] = pfield.plift(value) as PLifted<PFields>;
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
  ): PConstanted<PFields>[] => {
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
    maxDepth?: bigint,
  ): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "Record { … }";
    this.checkFields(data);
    if (data.size === 0) return "Record {}";
    const tt = tabs + t;
    const ttf = tt + f;
    const ttft = ttf + t;

    const fields = Object.entries(data).map(([key, value]) => {
      const pfield = this.pfields[key];
      if (pfield === undefined) {
        assert(
          value === undefined,
          `PRecord.showData: value ${value} for undefined pfield at key ${key}`,
        );
        return `${ttf}${key.length === 0 ? "_" : key}: undefined`;
      } else {
        assert(
          value !== undefined,
          `PRecord.showData: value undefined for pfield ${pfield.showPType()} at key ${key}`,
        );
        return `${ttf}${key.length === 0 ? "_" : key}: ${
          pfield.showData(value, ttft, maxDepth ? maxDepth - 1n : maxDepth)
        }`;
      }
    }).join(",\n");
    return `Record {
${fields}
${tt}}`;
  };

  public showPType = (tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "PRecord ( … )";
    const tt = tabs + t;
    const ttf = tt + f;
    const ttff = ttf + f;

    const fields = Object.entries(this.pfields).map(([key, pfield]) => {
      return `\n${ttff}${key.length === 0 ? "_" : key}: ${
        pfield?.showPType(ttff, maxDepth ? maxDepth - 1n : maxDepth) ??
          "undefined"
      }`;
    });
    return `PRecord (
${ttf}population: ${this.population},
${ttf}pfields: {${fields.length > 0 ? `${fields.join(`,`)}\n${ttf}` : ""}}
${tt})`;
  };

  static genPType<PFields extends PData>(
    gen: Generators,
    maxDepth: bigint,
  ): PRecord<PFields> {
    const pfields: RecordOfMaybe<PFields> = {};
    const maxi = genNonNegative(gMaxLength);
    for (let i = 0; i < maxi; i++) {
      const key = genName();
      const pvalue = maybeNdef(() => gen.generate(maxDepth))?.();
      pfields[key] = pvalue as PFields;
    }
    return new PRecord(pfields) as PRecord<PFields>;
  }
}
