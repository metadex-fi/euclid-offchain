import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Generators } from "../../../../utils/generators.js";
import { Data, f, PData, PType, t } from "../type.js";
import { PRecord } from "./record.js";
import { PInteger } from "../primitive/integer.js";
import { PByteString } from "../primitive/bytestring.js";
import { Lucid } from "../../../../../lucid.mod.js";

export const filterFunctions = <O extends Object>(o: O) =>
  Object.fromEntries(
    Object.entries(o).filter(([_, v]) => typeof v !== "function"),
  );

export class PObject<O extends Object> implements PType<Lucid.Constr<Data>, O> {
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

  public setIndex = (index: number) => this.precord.setIndex(index);

  public plift = (
    l: Lucid.Constr<Data>,
  ): O => {
    assert(l instanceof Lucid.Constr, `plift: expected Constr`);
    const record = this.precord.plift(l);
    const args = Object.values(record);
    return new (this.O)(...args);
  };

  public pconstant = (
    data: O,
  ): Lucid.Constr<Data> => {
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
