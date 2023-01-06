import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Constr } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Generators } from "../../../mod.ts";
import { PByteString } from "./bytestring.ts";
import { PConstr } from "./constr.ts";
import { PInteger } from "./integer.ts";
import { PList } from "./list.ts";
import { PMap } from "./map.ts";
import {
  f,
  PAny,
  PConstanted,
  PData,
  PLifted,
  PlutusOf,
  PlutusOfObject,
  PType,
  RecordOf,
  t,
} from "./mod.ts";
import { PRecord } from "./record.ts";

type PTypeOf<T> = T extends bigint ? PInteger
  : T extends string ? PByteString
  : T extends Array<infer E> ? PList<PTypeOf<E>>
  : T extends Map<infer K, infer V> ? PMap<PTypeOf<K>, PTypeOf<V>>
  : T extends Constr<infer F> ? PConstr<PTypeOf<F>>
  : T extends Object ? PObject<T>
  : PAny<PlutusOf<T>>;

type PFieldsOf<O> = PTypeOf<O[keyof O]>;

type AttributeTypes<T> = {
  [K in keyof T]: T[K] extends object ? AttributeTypes<T[K]> : T[K];
}[keyof T];

export class PObject<O extends Object> implements PType<PlutusOfObject<O>, O> {
  public population: number;
  // public precord: PRecord<PData>;
  constructor(
    public precord: PRecord<PData>, // TODO WIP
    public O: new (...args: any[]) => O,
  ) {
    this.population = precord.population;
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
    // const record: RecordOf<PData> = {};
    // const obj = new anew();
    // console.log(obj);
    // for (const [key, value] of Object.entries(obj)) {
    //   console.log(value.constructor.name);
    //   record[key] = PTypes[value.constructor.name];
    // }
    // this.precord = new PRecord(record);
  }

  public plift = (l: PlutusOfObject<O>): O => {
    const record: RecordOf<PLifted<PFieldsOf<O>>> = this.precord.plift(
      l as Array<PConstanted<PFieldsOf<O>>>,
    );
    const args = Object.values(record);
    return new (this.O)(...args as AttributeTypes<ExampleClass>[]) as O;
  };

  public pconstant = (
    data: O,
  ): PlutusOfObject<O> => {
    return this.precord.pconstant(
      data as RecordOf<PLifted<PFieldsOf<O>>>,
    ) as PlutusOfObject<O>;
  };

  public genData = (): O => {
    const record = this.precord.genData();
    // console.log(record, JSON.stringify(record));
    const o = new this.O(
      ...Object.values(record),
    );
    // console.log(o, JSON.stringify(o));
    return o;
  };

  public showData = (data: O, tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    return `Object: ${this.O.name} (
${ttf}${this.precord.showData(data, ttf)}
${tt})`;
  };

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    return `PObject (
${ttf}population: ${this.population},
${ttf}precord: ${this.precord.showPType(ttf)},
${ttf}O: ${this.O.name}
${tt})`;
  };

  static genPType(
    gen: Generators,
    maxDepth: bigint,
  ): PObject<any> {
    const precord = new PRecord<PData>(
      {
        s: PByteString.genPType(),
        i: PInteger.genPType(),
        ls: PList.genPType(gen, maxDepth),
        li: PList.genPType(gen, maxDepth),
        msli: PMap.genPType(gen, maxDepth),
        mlis: PMap.genPType(gen, maxDepth),
      },
    );
    return new PObject(precord, ExampleClass);
  }
}

class ExampleClass {
  constructor(
    public s: string,
    public i: bigint,
    public ls: string[],
    public li: bigint[],
    public msli: Map<string, bigint[]>,
    public mlis: Map<bigint[], string>,
  ) {}
}
