import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { fromHex } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { genByteString } from "../../../../mod.ts";
import { PType } from "../type.ts";

export class PByteString implements PType<Uint8Array, Uint8Array> {
  public readonly population = Infinity;

  constructor() {}

  public plift = (s: Uint8Array): Uint8Array => {
    assert(
      s instanceof Uint8Array,
      `PByteString.plift: expected Uint8Array, got ${s} (${typeof s})`,
    );
    return s;
  };

  public pconstant = (data: Uint8Array): Uint8Array => {
    assert(
      data instanceof Uint8Array,
      `PByteString.pconstant: expected Uint8Array, got ${data} (${typeof data})`,
    );
    return data;
  };

  public genData = (): Uint8Array => {
    return genByteString();
  };

  public showData = (data: Uint8Array): string => {
    assert(
      data instanceof Uint8Array,
      `PByteString.showData: expected Uint8Array, got ${data} (${typeof data})`,
    );
    return `ByteString: ${data}`;
  };

  public showPType = (): string => {
    return `PByteString`;
  };

  static ptype = new PByteString();
  static genPType(): PByteString {
    return PByteString.ptype;
  }
}
