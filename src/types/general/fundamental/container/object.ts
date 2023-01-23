import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Generators } from "../../../../mod.ts";
import { PByteString, PInteger } from "../mod.ts";
import { Data, f, PData, PType, t } from "../type.ts";
import { PRecord } from "./record.ts";

export const filterFunctions = <O extends Object>(o: O) =>
  Object.fromEntries(
    Object.entries(o).filter(([_, v]) => typeof v !== "function"),
  );

export class PObject<O extends Object> implements PType<Array<Data>, O> {
  public readonly population: number;
  constructor(
    public readonly precord: PRecord<PData>,
    public readonly O: new (...args: Array<any>) => O,
  ) {
    this.population = precord.population;
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (
    l: Array<Data>,
  ): O => {
    assert(l instanceof Array, `plift: expected Array`);
    const record = this.precord.plift(l);
    const args = Object.values(record);
    return new (this.O)(...args);
  };

  public pconstant = (
    data: O,
  ): Array<Data> => {
    const record = filterFunctions(data);
    return this.precord.pconstant(record);
  };

  public genData = (): O => {
    const record = this.precord.genData();
    try {
      const o = new this.O(
        ...Object.values(record),
      );
      return o;
    } catch (e) {
      throw new Error(
        `Error in genData for ${this.precord.showData(record)}: ${e}`,
      );
    }
  };

  public showData = (data: O, tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "Object ( … )";
    const tt = tabs + t;
    const ttf = tt + f;

    const record = this.precord.showData(
      filterFunctions(data),
      ttf,
      maxDepth ? maxDepth - 1n : maxDepth,
    );

    return `Object: ${this.O.name} (
${ttf}${record}
${tt})`;
  };

  public showPType = (tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "PObject ( … )";
    const tt = tabs + t;
    const ttf = tt + f;

    return `PObject (
${ttf}population: ${this.population},
${ttf}precord: ${
      this.precord.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)
    },
${ttf}O: ${this.O.name}
${tt})`;
  };

  static genPType(
    _gen: Generators,
    _maxDepth: bigint,
  ): PObject<any> {
    const precord = new PRecord<PByteString | PInteger>(
      {
        s: PByteString.genPType(),
        i: PInteger.genPType(),
        // ls: PList.genPType(gen, maxDepth),
        // li: PList.genPType(gen, maxDepth),
        // msli: PMap.genPType(gen, maxDepth),
        // mlis: PMap.genPType(gen, maxDepth),
      },
    );
    return new PObject(precord, ExampleClass);
  }
}

class ExampleClass {
  constructor(
    public s: string,
    public i: bigint,
    // public ls: string[],
    // public li: bigint[],
    // public msli: Map<string, bigint[]>,
    // public mlis: Map<bigint[], string>,
  ) {}
  public show = () => {
    return `ExampleClass (${this.s}, ${this.i})`;
  };
}
