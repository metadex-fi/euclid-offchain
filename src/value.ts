// import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
// import { Asset, Assets } from "./types/asset.ts";
// import { CurrencySymbol, TokenName } from "./types/primitive.ts";
// import { Value } from "./types/value.ts";
// import { equal } from "./utils.ts";

// function compareMaps<X, Y, Z>(
//   a: Map<string, X>,
//   b: Map<string, Y>,
//   f: (x: X, y: Y) => boolean,
// ): boolean {
//   for (const key in a) {
//     const aVal = a.get(key);
//     const bVal = b.get(key);
//     if (aVal && bVal && !f(aVal, bVal)) return false;
//   }
//   return true;
// }

// export function compareValues(
//   a: Value,
//   b: Value,
//   f: (x: bigint, y: bigint) => boolean,
// ): boolean {
//   function compareTokens(a: Map<TokenName, bigint>, b: Map<TokenName, bigint>) {
//     return compareMaps(a, b, f);
//   }
//   return compareMaps(a, b, compareTokens);
// }

// function arithMaps<X, Y, Z>(
//   a: Map<string, X>,
//   b: Map<string, Y>,
//   f: (x: X, y: Y) => Z,
// ): Map<string, Z> {
//   const c = new Map<string, Z>();
//   for (const key in a) {
//     const aVal = a.get(key);
//     assert(aVal, "value not in first map");
//     const bVal = b.get(key);
//     assert(bVal, "value not in second map");
//     const cVal = f(aVal, bVal);
//     c.set(key, cVal);
//   }
//   for (const key in b) {
//     assert(a.has(key), "value not in first map but second");
//   }
//   return c;
// }

// export function arithValues(
//   a: Value,
//   b: Value,
//   f: (x: bigint, y: bigint) => bigint,
// ): Value {
//   function arithTokens(a: Map<TokenName, bigint>, b: Map<TokenName, bigint>) {
//     return arithMaps(a, b, f);
//   }
//   return arithMaps(a, b, arithTokens);
// }

// function unionMaps<T>(
//   a: Map<string, T>,
//   b: Map<string, T>,
//   def: T,
//   f: (x: T, y: T) => T,
// ): Map<string, T> {
//   const c = new Map<string, T>();
//   for (const key in a) {
//     const aVal = a.get(key) ?? def;
//     const bVal = b.get(key) ?? def;
//     const cVal = f(aVal, bVal);
//     if (!equal(cVal, def)) c.set(key, cVal);
//   }
//   for (const key in b) {
//     if (!a.has(key)) {
//       const bVal = b.get(key) ?? def;
//       const cVal = f(def, bVal);
//       if (!equal(cVal, def)) c.set(key, cVal);
//     }
//   }
//   return c;
// }
// export function unionValues(
//   a: Value,
//   b: Value,
//   f: (x: bigint, y: bigint) => bigint,
// ): Value {
//   function unionTokens(a: Map<TokenName, bigint>, b: Map<TokenName, bigint>) {
//     return unionMaps(a, b, 0n, f);
//   }
//   const emptyTokens = new Map<TokenName, bigint>();
//   return unionMaps(a, b, emptyTokens, unionTokens);
// }

// export function addValues(a: Value, b: Value): Value {
//   return unionValues(a, b, (x, y) => x + y);
// }

// // export function newValue(): Value {
// //   return new Map<string, Map<string, bigint>>();
// // }

// export function singleton(
//   ccy: CurrencySymbol,
//   tkn: TokenName,
//   amnt: bigint,
// ): Value {
//   const tkns = new Map<TokenName, bigint>();
//   tkns.set(tkn, amnt);
//   const val = new Map<CurrencySymbol, Map<TokenName, bigint>>();
//   val.set(ccy, tkns);
//   return val;
// }

// export function assetSingleton(asset: Asset, amnt: bigint) {
//   return singleton(asset.currencySymbol, asset.tokenName, amnt);
// }

// // export function amountOf(
// //   value: Value,
// //   ccy: CurrencySymbol,
// //   tkn: TokenName,
// // ): bigint | undefined {
// //   return value.get(ccy)?.get(tkn);
// // }

// // export function amountOfAsset(value: Value, asset: Asset): bigint | undefined {
// //   return amountOf(value, asset.currencySymbol, asset.tokenName);
// // }

// export function forEachValue(
//   value: Value,
//   f: (ccy: CurrencySymbol, tkn: TokenName, amnt: bigint) => void,
// ) {
//   value.forEach((tkns, ccy) => {
//     tkns.forEach((amnt, tkn) => {
//       f(ccy, tkn, amnt);
//     });
//   });
// }

// export function mapAmounts(
//   value: Value,
//   f: (amnt: bigint, ccy?: CurrencySymbol, tkn?: TokenName) => bigint,
// ): Value {
//   const value_ = newValue();
//   for (const [ccy, tkns] of value) {
//     const tkns_ = new Map<TokenName, bigint>();
//     for (const [tkn, amnt] of tkns) {
//       tkns_.set(tkn, f(amnt, ccy, tkn));
//     }
//     value_.set(ccy, tkns_);
//   }
//   return value_;
// }

// export function numAssets(value: Value): number {
//   let num = 0;
//   for (const [_, tkns] of value) {
//     num += tkns.size;
//   }
//   return num;
// }

// export function isSubSet(sub: Value, set: Value): boolean {
//   for (const [ccy, tkns] of sub) {
//     const tkns_ = set.get(ccy);
//     if (!tkns_) return false;
//     for (const [tkn, amnt] of tkns) {
//       assert(amnt != 0n, "zeroed amount");
//       if (!tkns_.has(tkn)) return false;
//       assert(tkns_.get(tkn) != 0n, "zeroed amount_");
//     }
//   }
//   return true;
// }

// export function sameAssets(a: Value, b: Value): boolean {
//   return isSubSet(a, b) && isSubSet(b, a);
// }

// export function positive(value: Value): boolean {
//   for (const [_, tkns] of value) {
//     assert(tkns.size > 0, "empty token map");
//     for (const [_, amnt] of tkns) {
//       assert(amnt != 0n, "zeroed amount");
//       if (amnt < 0n) return false;
//     }
//   }
//   return value.size > 0;
// }

// export function leq(a: Value, b: Value): boolean {
//   return compareValues(a, b, (x, y) => x <= y);
// }
