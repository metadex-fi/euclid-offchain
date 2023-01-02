import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNumber,
  maxInteger,
  PConstraint,
  PMapRecord,
  RecordOf,
} from "../../../refactor_parse/lucid/src/mod.ts";
import {
  Asset,
  Assets,
  firstAsset,
  randomAssetsOf,
  tailAssets,
} from "./asset.ts";
import { newPPrices, PPrices, Prices } from "./prices.ts";
import {
  Amount,
  CurrencySymbol,
  newPBounded,
  PBounded,
  PNum,
  TokenName,
} from "./primitive.ts";

export type Value = Map<CurrencySymbol, Map<TokenName, bigint>>;
// export const emptyValue: Value = new Map<string, Map<string, bigint>>();
export const newValue = (): Value => {
  return new Map<string, Map<string, bigint>>();
};

export type PValue<A extends PNum> = 
  PMapRecord<PMapRecord<PBounded<A>>>
export const newNewPValue =
  <A extends PNum>(A: A) =>
  (assets: Assets, lowerBounds?: Value, upperBounds?: Value): PValue<A> => {
    assert(
      !lowerBounds || !upperBounds || lt(lowerBounds, upperBounds),
      "lowerBounds must be less than upperBounds",
    );
    const value: RecordOf<PMapRecord<PBounded<A>>> = {};
    for (const [currencySymbol, tokens] of assets) {
      const pamounts: RecordOf<PBounded<A>> = {};
      for (const tokenName of tokens) {
        const lowerBound = lowerBounds?.get(currencySymbol)?.get(tokenName);
        const upperBound = upperBounds?.get(currencySymbol)?.get(tokenName);
        pamounts[tokenName] = newPBounded(A, lowerBound, upperBound);
      }
      value[currencySymbol] = new PMapRecord(pamounts);
    }
    return new PMapRecord(value);
  };

export type JumpSizes = Prices;
export type PJumpSizes = PPrices;
export const newPJumpSizes = newPPrices;

export function assetsOf(
  ...values: Array<Map<CurrencySymbol, Map<TokenName, unknown>>>
): Assets {
  const assets = new Map<CurrencySymbol, TokenName[]>();
  for (const value of values) {
    for (const [currencySymbol, tokenMap] of value) {
      const tokens = assets.get(currencySymbol) ?? [];
      assets.set(currencySymbol, [...tokens, ...tokenMap.keys()]);
    }
  }
  return assets;
}

export function amountOf(
  value: Value,
  asset: Asset,
  defaultAmnt?: Amount,
): Amount {
  const amount = value.get(asset.currencySymbol)?.get(asset.tokenName) ??
    defaultAmnt;
  assert(amount, `amount not found for asset ${asset}`);
  return amount;
}

export function setAmountOf(value: Value, asset: Asset, amount: Amount): void {
  const tokens = value.get(asset.currencySymbol);
  assert(tokens, `tokens not found for asset ${asset}`);
  assert(tokens.has(asset.tokenName), `amount not found for asset ${asset}`);
  tokens.set(asset.tokenName, amount);
}

export function initAmountOf(value: Value, asset: Asset, amount: Amount): void {
  const tokens = value.get(asset.currencySymbol);
  if (tokens) {
    assert(
      !tokens.has(asset.tokenName),
      `amount already set for asset ${asset}`,
    );
    tokens.set(asset.tokenName, amount);
  } else {
    const tokens = new Map<TokenName, Amount>();
    tokens.set(asset.tokenName, amount);
    value.set(asset.currencySymbol, tokens);
  }
}

export function singleton(asset: Asset, amount: Amount): Value {
  const value = newValue();
  const tokens = new Map<TokenName, Amount>();
  tokens.set(asset.tokenName, amount);
  value.set(asset.currencySymbol, tokens);
  return value;
}

export const newCompareWith = (
  op: (arg: Amount, ...args: Array<Amount>) => boolean,
  ...defaultIns: Array<Amount | undefined>
) => {
  assert(
    defaultIns.length <= op.arguments.length,
    "more defaultIns than op arguments",
  );
  return (arg: Value, ...args: Array<Value>): boolean => {
    assert(
      1 + args.length === op.arguments.length,
      "args length must match op arguments length",
    );
    const assets = assetsOf(arg, ...args);
    for (const [currencySymbol, tokens] of assets) {
      for (const tokenName of tokens) {
        const asset = new Asset(currencySymbol, tokenName);
        const amountsIn = new Array<Amount>();
        [arg, ...args].forEach((v, i) => {
          const defaultIn = defaultIns[i];
          const amountIn = amountOf(v, asset, defaultIn);
          amountsIn.push(amountIn);
        });
        if (!op(amountsIn[0], ...amountsIn.slice(1))) {
          return false;
        }
      }
    }
    return true;
  };
};

export const lt = newCompareWith(
  (a, b) => a < b,
  -BigInt(Infinity),
  BigInt(Infinity),
);

export const newUnionWith = (
  op: (arg: Amount, ...args: Array<Amount>) => Amount,
  defaultOut?: Amount,
  ...defaultIns: Array<Amount | undefined>
) => {
  assert(
    defaultIns.length <= op.arguments.length,
    "more defaultIns than op arguments",
  );
  return (arg: Value, ...args: Array<Value>): Value => {
    assert(
      1 + args.length === op.arguments.length,
      "args length must match op arguments length",
    );
    const assets = assetsOf(arg, ...args);
    const value = newValue();
    for (const [currencySymbol, tokens] of assets) {
      for (const tokenName of tokens) {
        const asset = new Asset(currencySymbol, tokenName);
        const amountsIn = new Array<Amount>();
        [arg, ...args].forEach((v, i) => {
          const defaultIn = defaultIns[i];
          amountsIn.push(amountOf(v, asset, defaultIn));
        });
        const amountOut = op(amountsIn[0], ...amountsIn.slice(1));
        if (amountOut !== defaultOut) {
          initAmountOf(value, asset, amountOut);
        }
      }
    }
    return value;
  };
};

export const addValues = newUnionWith((a, b) => a + b);
export const subValues = newUnionWith((a, b) => a - b);
export const mulValues = newUnionWith((a, b) => a * b);
export const divValues = newUnionWith((a, b) => a / b);

export const lSubValues = newUnionWith((a, b) => a > b ? a - b : 0n, 0n);

export const addAmount = (v: Value, asset: Asset, amount: Amount): Value => {
  const add = newUnionWith((a, b) => a + b, 0n, undefined, 0n);
  const value = add(v, singleton(asset, amount));
  return value;
};

export const newMapAmounts = (op: (arg: Amount) => Amount) =>
  newUnionWith(
    (a) => op(a),
  );

export function setAmounts(amount: Amount): (value: Value) => Value {
  return newMapAmounts(() => amount);
}

export function zeroAmounts(): (value: Value) => Value {
  return setAmounts(0n);
}

export function infAmounts(): (value: Value) => Value {
  return setAmounts(BigInt(maxInteger));
}

export function numAssetsInValue(v: Value): number {
  let n = 0;
  for (const tkns of v.values()) {
    n += tkns.size;
  }
  return n;
}

export function firstAssetInValue(v: Value): Asset {
  for (const [currencySymbol, tokens] of v) {
    for (const tokenName in tokens) {
      return new Asset(currencySymbol, tokenName);
    }
  }
  throw new Error("no assets in value");
}

export function firstAmount(v: Value): Amount {
  for (const [_, tokens] of v) {
    for (const [_, amount] of tokens) {
      return amount;
    }
  }
  throw new Error("no assets in value");
}

export function tailValue(v: Value): Value {
  assert(v.size > 0, "empty values tell no tails");
  const tail = new Map();
  let first = true;
  for (const [ccy, tkns] of v) {
    if (first) {
      assert(tkns.size > 0, "empty token map");
      if (tkns.size > 1) {
        const tail_ = new Map<TokenName, Amount>();
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
