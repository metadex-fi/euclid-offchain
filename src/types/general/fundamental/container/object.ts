import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Constr } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Generators,
  genNonNegative,
  maxInteger,
  PConstr,
  randomChoice,
} from "../../../../mod.ts";
import { PByteString, PInteger } from "../mod.ts";
import {
  Constanted,
  F,
  f,
  Lifted,
  Lmm,
  PType,
  RecordOfMaybe,
  t,
} from "../type.ts";
import { PRecord } from "./record.ts";

const filterFunctions = <O extends Object>(o: O) =>
  Object.fromEntries(
    Object.entries(o).filter(([_, v]) => typeof v !== "function"),
  );

export class PObject<O extends Object> implements PType<F<O>> {
  public readonly population: number;
  // public precord: PRecord<PData>;
  constructor(
    public readonly pinner: PConstr<F<O>> | PRecord<F<O>>,
    public readonly O: new (...args: Array<Lmm<F<O>> | undefined>) => O,
  ) {
    this.population = pinner.population;
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (
    l: Constanted<F<O>>,
  ): O => {
    let inner: RecordOfMaybe<Lmm<F<O>>>
    if (this.pinner instanceof PConstr) {
      assert(l instanceof Constr, `plift: expected Constr`);
      inner = this.pinner.plift(l as Constr<Constanted<Lmm<F<O>>>>);
    } else if (this.pinner instanceof PRecord) {
      assert(l instanceof Array, `plift: expected Array`);
      inner = this.pinner.plift(l as Constanted<Lmm<F<O>>>[]);
    } else {
      throw new Error(`Unexpected pinner type: ${this.pinner}`);
    }
    // const inner = this.pinner.plift(l);
    const args = Object.values(inner);
    return new (this.O)(...args);
  };

  public pconstant = (
    data: O,
  ): Constanted<O> => {
    const record = filterFunctions(data) as RecordOfMaybe<Lmm<F<O>>>;
    let c;
    if (this.pinner instanceof PConstr) {
      c = this.pinner.pconstant(record) as Constanted<LiftedObject>;
    } else if (this.pinner instanceof PRecord) {
      c = this.pinner.pconstant(record) as Constanted<LiftedObject>;
    } else {
      throw new Error(`Unexpected pinner type: ${this.pinner}`);
    }
    return c as Constanted<O>;
  };

  public genData = (): O => {
    const record = this.pinner.genData();
    try {
      const o = new this.O(
        ...Object.values(record),
      );
      return o;
    } catch (e) {
      throw new Error(
        `Error in genData for ${this.pinner.showData(record)}: ${e}`,
      );
    }
  };

  public showData = (data: O, tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    let inner: string;
    if (this.pinner instanceof PConstr) {
      inner = this.pinner.showData(
        filterFunctions(data) as RecordOfMaybe<Lmm<F<O>>>,
        ttf,
      );
    } else if (this.pinner instanceof PRecord) {
      inner = this.pinner.showData(
        filterFunctions(data) as RecordOfMaybe<Lmm<F<O>>>,
        ttf,
      );
    } else {
      throw new Error(`Unexpected pinner type: ${this.pinner}`);
    }

    return `Object: ${this.O.name} (
${ttf}${inner}
${tt})`;
  };

  public showPType = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;

    return `PObject (
${ttf}population: ${this.population},
${ttf}precord: ${this.pinner.showPType(ttf)},
${ttf}O: ${this.O.name}
${tt})`;
  };

  static genPType<O extends LiftedObject>(
    _gen: Generators,
    _maxDepth: bigint,
  ): PObject<O> {
    const precord = new PRecord<Lmm<F<ExampleClass>>>(
      {
        s: PByteString.genPType(),
        i: PInteger.genPType(),
        // ls: PList.genPType(gen, maxDepth),
        // li: PList.genPType(gen, maxDepth),
        // msli: PMap.genPType(gen, maxDepth),
        // mlis: PMap.genPType(gen, maxDepth),
      },
    );
    const pinner = randomChoice([() => precord, () => {
      const index = genNonNegative(maxInteger);
      return new PConstr(index, precord);
    }])();
    return new PObject(precord, ExampleClass) as unknown as PObject<O>;
  }
}

class ExampleClass extends LiftedObject {

  constructor(
    public s: string,
    public i: bigint,
    // public ls: string[],
    // public li: bigint[],
    // public msli: Map<string, bigint[]>,
    // public mlis: Map<bigint[], string>,
  ) {
    super()
  }
  // public show = () => {
  //   return `ExampleClass (${this.s}, ${this.i})`;
  // };
}
