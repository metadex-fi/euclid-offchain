import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genNumber, maxInteger } from "../../../../mod.ts";
import { PType } from "../type.ts";

export class PInteger implements PType<bigint> {
  public readonly population = Number(maxInteger) * 2 + 1;

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

  static genPType(): PInteger {
    return new PInteger();
  }
}
