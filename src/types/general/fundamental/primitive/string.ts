import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../../../lucid.mod.ts";
import {
  genName,
  genNonNegative,
  maybeNdef,
} from "../../../../utils/generators.ts";
import { PType } from "../type.ts";
import { gMaxStringLength } from "../../../../utils/constants.ts";

export class PString implements PType<Uint8Array, string> {
  public readonly population;

  constructor(
    public readonly minLength = 0n,
    public readonly maxLength = gMaxStringLength,
  ) {
    assert(
      minLength >= 0n,
      `PString: minLength must be non-negative, got ${minLength}`,
    );
    assert(
      maxLength >= minLength,
      `PString: maxLength must be greater than or equal to minLength, got ${maxLength} < ${minLength}`,
    );
    this.population = maxLength ? undefined : 1n; // NOTE inaccurate, but serves, and quickly
  }

  public plift = (s: Uint8Array): string => {
    assert(
      s instanceof Uint8Array,
      `PString.plift: expected Uint8Array, got ${s} (${typeof s})`,
    );
    const data = Lucid.toText(Lucid.toHex(s));
    assert(
      data.length >= this.minLength,
      `PString.plift: data too short: ${data}`,
    );
    assert(
      data.length <= this.maxLength,
      `PString.plift: data too long: ${data}`,
    );
    return data;
  };

  public pconstant = (data: string): Uint8Array => {
    assert(
      typeof data === `string`,
      `PString.pconstant: expected string, got ${data} (${typeof data})`,
    );
    assert(
      data.length >= this.minLength,
      `PString.pconstant: data too short: ${data}`,
    );
    assert(
      data.length <= this.maxLength,
      `PString.pconstant: data too long: ${data}`,
    );
    return Lucid.fromHex(Lucid.fromText(data.toString()));
  };

  public genData = (): string => {
    return genName(this.minLength, this.maxLength);
  };

  public showData = (data: string): string => {
    assert(
      typeof data === `string`,
      `PString.showData: expected String, got ${data} (${typeof data})`,
    );
    return `PString: ${data}`;
  };

  public showPType = (): string => {
    return `PString`;
  };

  static ptype = new PString();

  static genPType(): PString {
    const minLength = maybeNdef(genNonNegative)?.(gMaxStringLength);
    const maxLength = maybeNdef(() =>
      (minLength ?? 0n) + genNonNegative(gMaxStringLength - (minLength ?? 0n))
    )?.();
    return new PString(minLength, maxLength);
  }
}
