import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Constr, Data } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  genPositive,
  minSizedSubset,
  PByteString,
  PInteger,
  PRecord,
  randomChoice,
} from "../../../../mod.ts";
import { f, PType, t } from "../type.ts";
import { PObject } from "./object.ts";

export class PSum<O extends Object> implements PType<Constr<Data>, O> {
  public readonly population; // because not implemented

  constructor(
    public readonly pconstrs: Array<PObject<O>>,
  ) {
    assert(
      pconstrs.length > 0,
      `PSum: expected at least one PObject`,
    );
    assert(
      pconstrs.every((pconstr) => pconstr instanceof PObject),
      `PSum: expected all pconstrs to be PObjects`,
    );
    this.population = pconstrs.reduce(
      (acc, pconstr) => acc + pconstr.population,
      0,
    );
  }

  public plift = (
    c: Constr<Data>,
  ): O => {
    assert(c instanceof Constr, `plift: expected Constr`);
    assert(c.index < this.pconstrs.length, `plift: constr index out of bounds`);
    return this.pconstrs[Number(c.index)].plift(c.fields);
  };

  private matchData = (data: O): [number, PObject<O>] => {
    assert(data instanceof Object, `PSum.matchData: expected Object`);
    const matches = new Array<PObject<O>>();
    let index = -1;
    this.pconstrs.forEach((pconstr, i) => {
      if (data instanceof pconstr.O) {
        matches.push(pconstr);
        index = i;
      }
    });
    assert(
      matches.length === 1,
      `PSum.pconstant: expected exactly one match, got ${matches.length}: ${
        matches.map((pconstr) => pconstr.O.name)
      }`,
    );
    return [index, matches[0]];
  };

  public pconstant = (
    data: O,
  ): Constr<Data> => {
    const [index, match] = this.matchData(data);
    return new Constr(index, match.pconstant(data));
  };

  public genData = (): O => {
    return randomChoice(this.pconstrs).genData();
  };

  public showData(data: O, tabs = ""): string {
    const tt = tabs + t;
    const ttf = tt + f;

    const [index, match] = this.matchData(data);
    return `Sum (
${ttf}index: ${index}, 
${ttf}object: ${match.showData(data, ttf)}
${tt})`;
  }

  public showPType(tabs = ""): string {
    const tt = tabs + t;
    const ttf = tt + f;

    return `PSum (
${ttf}${this.pconstrs.map((pconstr) => pconstr.showPType(ttf)).join(`,\n`)}
${tt})`;
  }

  static genPType(): PSum<any> {
    //minSizedSubset also serves as shuffle
    const objects = [Sum0, Sum1, Sum2, Sum3];
    const len = genPositive(BigInt(objects.length));
    const objects_ = minSizedSubset([Sum0, Sum1, Sum2, Sum3], len);
    const pconstrs = objects_.map((O) =>
      new PObject(
        new PRecord({
          s: PByteString.genPType(),
          i: PInteger.genPType(),
        }),
        O,
      )
    );
    return new PSum(pconstrs);
  }
}

class Sum0 {
  constructor(
    public s: string,
    public i: bigint,
  ) {}
  public show = () => {
    return `Sum0 (${this.s}, ${this.i})`;
  };
}

class Sum1 {
  constructor(
    public s: string,
    public i: bigint,
  ) {}
  public show = () => {
    return `Sum1 (${this.s}, ${this.i})`;
  };
}

class Sum2 {
  constructor(
    public s: string,
    public i: bigint,
  ) {}
  public show = () => {
    return `Sum2 (${this.s}, ${this.i})`;
  };
}

class Sum3 {
  constructor(
    public s: string,
    public i: bigint,
  ) {}
  public show = () => {
    return `Sum3 (${this.s}, ${this.i})`;
  };
}
