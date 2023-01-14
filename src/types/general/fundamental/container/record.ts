import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Generators,
  genName,
  genNonNegative,
  gMaxLength,
  maybeNdef,
} from "../../../../mod.ts";
import {
  Constanted,
  f,
  Lifted,
  Lmm,
  PType,
  RecordOfMaybe,
  t,
} from "../type.ts";

export class PRecord<F extends Lifted> implements PType<RecordOfMaybe<Lmm<F>>> {
  public readonly population: number;

  constructor(
    public readonly pfields: RecordOfMaybe<PType<Lmm<F>>>,
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
    l: Constanted<Lmm<F>>[],
  ): RecordOfMaybe<Lmm<F>> => {
    assert(
      l instanceof Array,
      `Record.plift: expected Array, got ${l} (${typeof l})\nfor ${this.showPType()})`,
    );
    const r: RecordOfMaybe<Lmm<F>> = {};
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
        r[key] = pfield.plift(value);
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

  private checkFields = (data: RecordOfMaybe<Lmm<F>>) => {
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
    data: RecordOfMaybe<Lmm<F>>,
  ): Constanted<Lmm<F>>[] => {
    this.checkFields(data);

    const l = new Array<Constanted<Lmm<F>>>();
    Object.entries(this.pfields).forEach(([key, pfield]) => {
      const value = data[key];
      if (pfield) {
        assert(
          value !== undefined,
          `cannot constant ${value} with pfield: ${pfield.showPType()}`,
        );
        l.push(pfield.pconstant(value));
      } else {
        assert(
          value === undefined,
          `cannot constant ${value} with undefined pfield`,
        );
      }
    });
    return l;
  };

  public genData = (): RecordOfMaybe<Lmm<F>> => {
    const r: RecordOfMaybe<Lmm<F>> = {};
    Object.entries(this.pfields).forEach(([key, pfield]) => {
      r[key] = pfield?.genData();
    });
    return r;
  };

  public showData = (
    data: RecordOfMaybe<Lmm<F>>,
    tabs = "",
  ): string => {
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
          pfield.showData(value, ttft)
        }`;
      }
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

  static genPType<F extends Lifted>(
    gen: Generators,
    maxDepth: bigint,
  ): PRecord<F> {
    const pfields: RecordOfMaybe<PType<Lmm<F>>> = {};
    const maxi = genNonNegative(gMaxLength);
    for (let i = 0; i < maxi; i++) {
      const key = genName();
      const pvalue = maybeNdef(() => gen.generate(maxDepth))?.();
      pfields[key] = pvalue;
    }
    return new PRecord(pfields);
  }
}
