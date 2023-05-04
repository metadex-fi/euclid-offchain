import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { PByteString } from "../../fundamental/primitive/bytestring.js";
export class Currency {
  constructor(symbol) {
    Object.defineProperty(this, "symbol", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: symbol,
    });
    Object.defineProperty(this, "toString", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return Lucid.toHex(this.symbol);
      },
    });
    Object.defineProperty(this, "show", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return `Currency(${this.toString()})`;
      },
    });
    Object.defineProperty(this, "concise", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        if (this.symbol.length === 0) {
          return "ADA";
        } else {
          return this.toString();
        }
      },
    });
    Object.defineProperty(this, "equals", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return this.concise() === other.concise();
      },
    });
    Object.defineProperty(this, "valueOf", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.show,
    });
    Object.defineProperty(this, "toLucid", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return Lucid.toHex(this.symbol);
      },
    });
    assert( // TODO reactivate if true
      symbol.length === 0 || symbol.length === Number(Currency.numBytes),
      `Currency wrong size - ${symbol}: ${symbol.length}`,
    );
  }
  static fromLucid(hexCurrencySymbol) {
    return new Currency(Lucid.fromHex(hexCurrencySymbol));
  }
}
Object.defineProperty(Currency, "fromHex", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: (hex) => {
    return new Currency(Lucid.fromHex(hex));
  },
});
Object.defineProperty(Currency, "numBytes", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 28n,
});
Object.defineProperty(Currency, "ADA", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new Currency(new Uint8Array(0)),
});
Object.defineProperty(Currency, "dummy", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new Currency(Lucid.fromHex("cc".repeat(Number(Currency.numBytes)))),
});
export class PCurrency extends PWrapped {
  constructor() {
    super(new PByteString(Currency.numBytes, Currency.numBytes), Currency);
  }
  static genPType() {
    return PCurrency.ptype;
  }
}
Object.defineProperty(PCurrency, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PCurrency(),
});
