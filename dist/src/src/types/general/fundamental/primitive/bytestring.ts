import { assert } from "../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import {
  genByteString,
  genNonNegative,
  gMaxStringBytes,
  maybeNdef,
} from "../../../../utils/generators.js";
import { PType } from "../type.js";

export class PByteString implements PType<Uint8Array, Uint8Array> {
  public readonly population;

  constructor(
    public readonly minBytes = 0n,
    public readonly maxBytes = gMaxStringBytes,
  ) {
    assert(
      minBytes >= 0n,
      `PByteString: minBytes must be non-negative, got ${minBytes}`,
    );
    assert(
      maxBytes >= minBytes,
      `PByteString: maxBytes must be greater than or equal to minBytes, got ${maxBytes} < ${minBytes}`,
    );
    this.population = maxBytes ? Infinity : 1; // NOTE inaccurate, but serves, and quickly
  }

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
    return new Uint8Array(data);
  };

  public genData = (): Uint8Array => {
    return genByteString(this.minBytes, this.maxBytes);
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
    const minBytes = maybeNdef(genNonNegative)?.(gMaxStringBytes);
    const maxBytes = maybeNdef(() =>
      (minBytes ??
        0n) + genNonNegative((gMaxStringBytes) - (minBytes ?? 0n))
    )?.();
    return new PByteString(minBytes, maxBytes);
  }
}
