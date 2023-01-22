import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  fromHex,
  fromText,
  toHex,
  toText,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { genName } from "../../../../mod.ts";
import { PType } from "../type.ts";

export class PByteString implements PType<Uint8Array, string> {
  public readonly population = Infinity;

  constructor() {}

  public plift = (s: Uint8Array): string => {
    assert(
      s instanceof Uint8Array,
      `PByteString.plift: expected Uint8Array, got ${s} (${typeof s})`,
    );
    return toText(toHex(s));
  };

  public pconstant = (data: string): Uint8Array => {
    assert(
      typeof data === `string`,
      `PByteString.pconstant: expected String, got ${data} (${typeof data})`,
    );
    return fromHex(fromText(data));
  };

  public genData = (): string => {
    return genName();
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
    return new PByteString();
  }
}
