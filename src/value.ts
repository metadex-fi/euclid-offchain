import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Asset, CurrencySymbol, TokenName, Value } from "./types.ts";
import { equal } from "./utils.ts";

function arithMaps<T>(
  f: (x: T, y: T) => T,
  a: Map<string, T>,
  b: Map<string, T>,
): Map<string, T> {
  const c = new Map<string, T>();
  for (const key in a) {
    const aVal = a.get(key);
    assert(aVal, "value not in first map");
    const bVal = b.get(key);
    assert(bVal, "value not in second map");
    const cVal = f(aVal, bVal);
    c.set(key, cVal);
  }
  for (const key in b) {
    assert(a.has(key), "value not in first map but second");
  }
  return c;
}

export function arithValues(
  a: Value,
  b: Value,
  f: (x: bigint, y: bigint) => bigint,
): Value {
  function arithTokens(a: Map<TokenName, bigint>, b: Map<TokenName, bigint>) {
    return arithMaps(f, a, b);
  }
  return arithMaps(arithTokens, a, b);
}

function unionMaps<T>(
  f: (x: T, y: T) => T,
  def: T,
  a: Map<string, T>,
  b: Map<string, T>,
): Map<string, T> {
  const c = new Map<string, T>();
  for (const key in a) {
    const aVal = a.get(key) ?? def;
    const bVal = b.get(key) ?? def;
    const cVal = f(aVal, bVal);
    if (!equal(cVal, def)) c.set(key, cVal);
  }
  for (const key in b) {
    if (!a.has(key)) {
      const bVal = b.get(key) ?? def;
      const cVal = f(def, bVal);
      if (!equal(cVal, def)) c.set(key, cVal);
    }
  }
  return c;
}
export function unionValues(
  a: Value,
  b: Value,
  f: (x: bigint, y: bigint) => bigint,
): Value {
  function unionTokens(a: Map<TokenName, bigint>, b: Map<TokenName, bigint>) {
    return unionMaps(f, 0n, a, b);
  }
  const emptyTokens = new Map<TokenName, bigint>();
  return unionMaps(unionTokens, emptyTokens, a, b);
}

export function addValues(a: Value, b: Value): Value {
  return unionValues(a, b, (x, y) => x + y);
}

export function newValue(): Value {
  return new Map<string, Map<string, bigint>>();
}

export function singleton(
  ccy: CurrencySymbol,
  tkn: TokenName,
  amnt: bigint,
): Value {
  const tkns = new Map<TokenName, bigint>();
  tkns.set(tkn, amnt);
  const val = new Map<CurrencySymbol, Map<TokenName, bigint>>();
  val.set(ccy, tkns);
  return val;
}

export function assetSingleton(asset: Asset, amnt: bigint) {
  return singleton(asset.currencySymbol, asset.tokenName, amnt);
}

export function amountOf(
  value: Value,
  ccy: CurrencySymbol,
  tkn: TokenName,
): bigint | undefined {
  return value.get(ccy)?.get(tkn);
}

export function amountOfAsset(value: Value, asset: Asset): bigint | undefined {
  return amountOf(value, asset.currencySymbol, asset.tokenName);
}

export function forEachValue(
  value: Value,
  f: (ccy: CurrencySymbol, tkn: TokenName, amnt: bigint) => void,
) {
  value.forEach((tkns, ccy) => {
    tkns.forEach((amnt, tkn) => {
      f(ccy, tkn, amnt);
    });
  });
}

export function mapAmounts(
  value: Value,
  f: (amnt: bigint, ccy?: CurrencySymbol, tkn?: TokenName) => bigint,
): Value {
  const value_ = newValue();
  for (const [ccy, tkns] of value) {
    const tkns_ = new Map<TokenName, bigint>();
    for (const [tkn, amnt] of tkns) {
      tkns_.set(tkn, f(amnt, ccy, tkn));
    }
    value_.set(ccy, tkns_);
  }
  return value_;
}

export function setAmount(
  value: Value,
  ccy: CurrencySymbol,
  tkn: TokenName,
  amnt: bigint,
): Value {
  const value_ = newValue();
  let foundCcy = false;
  for (const [ccy_, tkns] of value) {
    if (ccy_ === ccy) {
      foundCcy = true;
      const tkns_ = new Map<TokenName, bigint>();
      let foundTkn = false;
      for (const [tkn_, amnt_] of tkns) {
        if (tkn_ === tkn) {
          foundTkn = true;
          tkns_.set(tkn_, amnt);
        } else {
          tkns_.set(tkn_, amnt_);
        }
      }
      if (!foundTkn) {
        tkns_.set(tkn, amnt);
      }
      value_.set(ccy, tkns_);
    }
  }
  if (!foundCcy) {
    const tkns_ = new Map<TokenName, bigint>();
    tkns_.set(tkn, amnt);
    value_.set(ccy, tkns_);
  }
  return value_;
}

export function setAssetAmount(value: Value, asset: Asset, amnt: bigint) {
  return setAmount(value, asset.currencySymbol, asset.tokenName, amnt);
}

export function addAmount(
  value: Value,
  ccy: CurrencySymbol,
  tkn: TokenName,
  add: bigint,
): Value {
  const value_ = newValue();
  let foundCcy = false;
  for (const [ccy_, tkns] of value) {
    if (ccy_ === ccy) {
      foundCcy = true;
      const tkns_ = new Map<TokenName, bigint>();
      let foundTkn = false;
      for (const [tkn_, amnt_] of tkns) {
        if (tkn_ === tkn) {
          foundTkn = true;
          tkns_.set(tkn_, amnt_ + add);
        } else {
          tkns_.set(tkn_, amnt_);
        }
      }
      assert(foundTkn, "token not found");
    }
  }
  assert(foundCcy, "currency not found");
  return value_;
}

export function addAssetAmount(value: Value, asset: Asset, add: bigint): Value {
  return addAmount(value, asset.currencySymbol, asset.tokenName, add);
}

export function assetsOf(value: Value): Asset[] {
  const assets = new Array<Asset>();
  value.forEach((tkns, ccy) => {
    tkns.forEach((_, tkn) => {
      assets.push(new Asset(ccy, tkn));
    });
  });
  return assets;
}

export function tailValue(value: Value): Value {
  assert(value.size > 0, "empty values tell no tails");
  const tail = newValue();
  let first = true;
  for (const [ccy, tkns] of value) {
    if (first) {
      assert(tkns.size > 0, "empty token map");
      if (tkns.size > 1) {
        const tail_ = new Map<TokenName, bigint>();
        let first_ = true;
        for (const [tkn, amnt] of tkns) {
          if (first_) first_ = false;
          else tail_.set(tkn, amnt);
        }
        tail.set(ccy, tail_);
      }
      first = false;
    } else tail.set(ccy, tkns);
  }
  return tail;
}

export function firstAmnt(value: Value): bigint {
  for (const [_, tkns] of value) {
    for (const [_, amnt] of tkns) {
      return amnt;
    }
  }
  throw new Error("unexpected empty Value");
}

export function firstAsset(value: Value): Asset {
  for (const [ccy, tkns] of value) {
    for (const tkn in tkns) {
      return new Asset(ccy, tkn);
    }
  }
  throw new Error("unexpected empty Value");
}

export function numAssets(value: Value): number {
  let num = 0;
  for (const [_, tkns] of value) {
    num += tkns.size;
  }
  return num;
}
