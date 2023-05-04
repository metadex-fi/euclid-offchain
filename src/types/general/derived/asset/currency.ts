import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../../../lucid.mod.ts";
import { PWrapped } from "../../fundamental/container/wrapped.ts";
import { PByteString } from "../../fundamental/primitive/bytestring.ts";

export class Currency {
  constructor(public readonly symbol: Uint8Array) {
    assert( // TODO reactivate if true
      symbol.length === 0 || symbol.length === Number(Currency.numBytes),
      `Currency wrong size - ${symbol}: ${symbol.length}`,
    );
  }

  public toString = (): string => {
    return Lucid.toHex(this.symbol);
  };

  public show = (): string => {
    return `Currency(${this.toString()})`;
  };

  public concise = (): string => {
    if (this.symbol.length === 0) {
      return "ADA";
    } else {
      return this.toString();
    }
  };

  public equals = (other: Currency): boolean => {
    return this.concise() === other.concise();
  };

  public valueOf = this.show;

  public toLucid = (): string => {
    return Lucid.toHex(this.symbol);
  };

  static fromLucid(hexCurrencySymbol: string): Currency {
    return new Currency(Lucid.fromHex(hexCurrencySymbol));
  }

  static fromHex = (hex: string): Currency => {
    return new Currency(Lucid.fromHex(hex));
  };

  static numBytes = 28n;
  static ADA = new Currency(new Uint8Array(0));
  static dummy = new Currency(
    Lucid.fromHex("cc".repeat(Number(Currency.numBytes))),
  );
}

export class PCurrency extends PWrapped<Currency> {
  constructor() {
    super(
      new PByteString(Currency.numBytes, Currency.numBytes),
      Currency,
    );
  }

  static ptype = new PCurrency();
  static genPType(): PWrapped<Currency> {
    return PCurrency.ptype;
  }
}
