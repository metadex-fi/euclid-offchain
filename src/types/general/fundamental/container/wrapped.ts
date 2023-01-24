import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Generators } from "../../../../mod.ts";
import { Data, f, PData, PType, t } from "../type.ts";
import { filterFunctions } from "./object.ts";

// like PObject, but only one field in the PRecord.
// Purpose is removing the extra Arrays around pconstanted wrappers.
export class PWrapped<O extends Object> implements PType<Data, O> {
  population: number;

  constructor(
    public readonly pinner: PData,
    public readonly O: new (arg: any) => O,
  ) {
    this.population = pinner.population;
    assert(
      this.population > 0,
      `Population not positive in ${this.showPType()}`,
    );
  }

  public plift = (data: Data): O => {
    const inner = this.pinner.plift(data);
    return new (this.O)(inner);
  };

  public pconstant = (data: O): Data => {
    const inner = filterFunctions(data);
    const values = Object.values(inner);
    assert(values.length === 1, `pconstant: expected one value`);
    return this.pinner.pconstant(values[0]);
  };

  public genData = (): O => {
    const inner = this.pinner.genData();
    return new (this.O)(inner);
  };

  public showData = (data: O, tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) return "Wrapped ( … )";
    const tt = tabs + t;
    const ttf = tt + f;

    const inner = filterFunctions(data);
    const values = Object.values(inner);
    assert(values.length === 1, `showData: expected one value`);

    return `Wrapped: ${this.O.name} (
${ttf}${
      this.pinner.showData(
        values[0],
        ttf,
        maxDepth ? maxDepth - 1n : maxDepth,
      )
    }
${tt})`;
  };

  public showPType = (tabs = "", maxDepth?: bigint): string => {
    if (maxDepth !== undefined && maxDepth <= 0n) {
      return "PObject: PWrapped ( … )";
    }
    const tt = tabs + t;
    const ttf = tt + f;

    return `PObject: PWrapped (
${ttf}population: ${this.population},
${ttf}pinner: ${
      this.pinner.showPType(ttf, maxDepth ? maxDepth - 1n : maxDepth)
    },
${ttf}O: ${this.O.name}
${tt})`;
  };

  static genPType(
    gen: Generators,
    maxDepth: bigint,
  ): PWrapped<any> {
    const pinner = gen.generate(maxDepth);

    return new PWrapped(pinner, WrapperClass);
  }
}

class WrapperClass {
  constructor(
    public inner: any,
  ) {}
  public show = () => {
    return `WrapperClass (${this.inner})`;
  };
}
