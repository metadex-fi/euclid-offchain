import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genString,
  gMaxStringBytes,
  maybeNdef,
} from "../../../../mod.ts";
import { PType } from "../type.ts";

export class PByteString implements PType<string, string> {
  public population = Infinity;

  constructor(
    public minBytes = 0n,
  ) {}

  public plift = (s: string): string => {
    assert(
      typeof s === `string`,
      `PByteString.plift: expected String, got ${s} (${typeof s})`,
    );
    return s;
  };

  public pconstant = (data: string): string => {
    assert(
      typeof data === `string`,
      `PByteString.pconstant: expected String, got ${data} (${typeof data})`,
    );
    return data;
  };

  public genData = (): string => {
    return genString("abcdef", this.minBytes);
  };

  public showData = (data: string): string => {
    assert(
      typeof data === `string`,
      `PByteString.showData: expected String, got ${data} (${typeof data})`,
    );
    return `ByteString: ${data}`;
  };

  public showPType = (): string => {
    return `PByteString`;
  };

  static genPType(): PByteString {
    const minBytes = maybeNdef(() => genNonNegative(gMaxStringBytes))?.();
    return new PByteString(minBytes);
  }
}
