import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import {
  genByteString,
  genNonNegative,
  gMaxStringBytes,
  maybeNdef,
} from "../../../../utils/generators.js";
export class PByteString {
  constructor(minBytes = 0n, maxBytes = gMaxStringBytes) {
    Object.defineProperty(this, "minBytes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: minBytes,
    });
    Object.defineProperty(this, "maxBytes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: maxBytes,
    });
    Object.defineProperty(this, "population", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "plift", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (s) => {
        assert(
          s instanceof Uint8Array,
          `PByteString.plift: expected Uint8Array, got ${s} (${typeof s})`,
        );
        return s;
      },
    });
    Object.defineProperty(this, "pconstant", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data) => {
        assert(
          data instanceof Uint8Array,
          `PByteString.pconstant: expected Uint8Array, got ${data} (${typeof data})`,
        );
        return new Uint8Array(data);
      },
    });
    Object.defineProperty(this, "genData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return genByteString(this.minBytes, this.maxBytes);
      },
    });
    Object.defineProperty(this, "showData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (data) => {
        assert(
          data instanceof Uint8Array,
          `PByteString.showData: expected Uint8Array, got ${data} (${typeof data})`,
        );
        return `ByteString: ${data}`;
      },
    });
    Object.defineProperty(this, "showPType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return `PByteString`;
      },
    });
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
  static genPType() {
    const minBytes = maybeNdef(genNonNegative)?.(gMaxStringBytes);
    const maxBytes = maybeNdef(() =>
      (minBytes ??
        0n) + genNonNegative((gMaxStringBytes) - (minBytes ?? 0n))
    )?.();
    return new PByteString(minBytes, maxBytes);
  }
}
Object.defineProperty(PByteString, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PByteString(),
});
