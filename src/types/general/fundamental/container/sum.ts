import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../../../lucid.mod.ts";
import {
  boundedSubset,
  genPositive,
  randomChoice,
} from "../../../../utils/generators.ts";
import { Data, f, PType, t } from "../type.ts";
import { PObject } from "./object.ts";
import { PRecord } from "./record.ts";
import { PInteger } from "../primitive/integer.ts";
import { PByteString } from "../primitive/bytestring.ts";

export class PSum<Os extends Object> implements PType<Lucid.Constr<Data>, Os> {
  public readonly population: bigint | undefined;
  constructor(
    public readonly pconstrs: Array<Os extends Object ? PObject<Os> : never>,
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
      (acc: bigint | undefined, pconstr) =>
        pconstr.population && acc ? acc + pconstr.population : undefined,
      0n,
    );
    pconstrs.forEach((pconstr, i) => {
      pconstr.setIndex(i);
    });
  }

  public plift = (
    c: Lucid.Constr<Data>,
  ): Os => {
    // return {} as Os;
    assert(c instanceof Lucid.Constr, `plift: expected Constr`);
    assert(c.index < this.pconstrs.length, `plift: constr index out of bounds`);
    return this.pconstrs[Number(c.index)].plift(c) as Os;
  };

  private matchData = (data: Os): PObject<Os> => {
    assert(data instanceof Object, `PSum.matchData: expected Object`);
    const matches = new Array<PObject<Os>>();
    this.pconstrs.forEach((pconstr, i) => {
      if (data instanceof pconstr.O) {
        matches.push(pconstr);
      }
    });
    assert(
      matches.length === 1,
      `PSum.pconstant: expected exactly one match, got ${matches.length}: ${
        matches.map((pconstr) => pconstr.O.name)
      }`,
    );
    return matches[0];
  };

  public pconstant = (
    data: Os,
  ): Lucid.Constr<Data> => {
    return this.matchData(data).pconstant(data);
  };

  public genData = (): Os => {
    return randomChoice(this.pconstrs).genData() as Os;
  };

  public showData = (data: Os, tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "Sum ( … )";
    const tt = tabs + t;
    const ttf = tt + f;

    return `Sum (
${ttf}${
      this.matchData(data).showData(
        data,
        ttf,
        maxDepth ? maxDepth - 1n : maxDepth,
      )
    }
${tt})`;
  };

  public showPType(tabs = "", maxDepth?: bigint): string {
    if (maxDepth !== undefined && maxDepth <= 0n) return "PSum ( … )";
    const tt = tabs + t;
    const ttf = tt + f;

    return `PSum (
${ttf}${
      this.pconstrs.map((pconstr) =>
        pconstr.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)
      ).join(`,\n`)
    }
${tt})`;
  }

  static genPType(): PSum<any> {
    //minSizedSubset also serves as shuffle
    const pconstrs = [PConstr0, PConstr1, PConstr2, PConstr3];
    const len = genPositive(BigInt(pconstrs.length));
    const pconstrs_ = boundedSubset(pconstrs, len);

    return new PSum<Constr0 | Constr1 | Constr2 | Constr3>(pconstrs_);
  }
}

class Constr0 {
  constructor(
    public s: string,
    public i: bigint,
  ) {}
}

class Constr1 {
  constructor(
    public i: bigint,
    public s: string,
  ) {}
}

class Constr2 {
  constructor(
    public i: bigint,
  ) {}
}

class Constr3 {
  constructor(
    public s: string,
  ) {}
}

const PConstr0 = new PObject(
  new PRecord({
    s: PByteString.genPType(),
    i: PInteger.genPType(),
  }),
  Constr0,
);

const PConstr1 = new PObject(
  new PRecord({
    i: PInteger.genPType(),
    s: PByteString.genPType(),
  }),
  Constr1,
);

const PConstr2 = new PObject(
  new PRecord({
    i: PInteger.genPType(),
  }),
  Constr2,
);

const PConstr3 = new PObject(
  new PRecord({
    s: PByteString.genPType(),
  }),
  Constr3,
);
