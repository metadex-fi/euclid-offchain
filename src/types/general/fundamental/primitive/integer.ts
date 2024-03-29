import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNumber } from "../../../../utils/generators.ts";
import { PType } from "../type.ts";
import { maxInteger } from "../../../../utils/constants.ts";

export class PInteger implements PType<bigint, bigint> {
  public readonly population = maxInteger * 2n + 1n;

  public plift = (i: bigint): bigint => {
    assert(
      typeof i === `bigint`,
      `.PInteger.plift: expected Integer, got ${i} (${typeof i})`,
    );
    return i;
  };

  public pconstant = (data: bigint): bigint => {
    assert(
      typeof data === `bigint`,
      `PInteger.pconstant: expected Integer, got ${data} (${typeof data})`,
    );
    return data;
  };

  public genData = (): bigint => {
    return genNumber();
  };

  public showData = (data: bigint): string => {
    assert(
      typeof data === `bigint`,
      `PInteger.showData: expected Integer, got ${data} (${typeof data})`,
    );
    return `Integer: ${data}`;
  };

  public showPType = (): string => {
    return `PInteger`;
  };

  static ptype = new PInteger();
  static genPType(): PInteger {
    return PInteger.ptype;
  }
}
