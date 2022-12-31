import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNumber,
  PConstraint,
  PType,
} from "../../../refactor_parse/lucid/src/mod.ts";
import {
  Asset,
  Assets,
  firstAsset,
  randomAssetsOf,
  tailAssets,
} from "./asset.ts";
import {
  Amount,
  CurrencySymbol,
  newPAmount,
  PAmount,
  TokenName,
} from "./primitive.ts";

export type Value = Map<CurrencySymbol, Map<TokenName, Amount>>;
// export const emptyValue: Value = new Map<string, Map<string, bigint>>();
export const newValue = (): Value => {
  return new Map<string, Map<string, bigint>>();
};

export class PValue implements PType<Value, Value> {
  public pamounts: Map<CurrencySymbol, Map<TokenName, PAmount>>;

  constructor(
    public assets: Assets,
    public lowerBounds?: Value,
    public upperBounds?: Value,
    public globalLowerBound = 0n,
  ) {
    // TODO some assertions
    const pamounts = new Map<CurrencySymbol, Map<TokenName, PAmount>>();
    for (const [currencySymbol, tokens] of assets) {
      assert(tokens.length > 0, "found empty token list");
      const ccyLowerBounds = lowerBounds?.get(currencySymbol);
      const ccyUpperBounds = upperBounds?.get(currencySymbol);
      const tokenAmounts = new Map<TokenName, PAmount>();
      for (const tokenName of tokens) {
        const tknLowerBound = ccyLowerBounds?.get(tokenName) ??
          globalLowerBound;
        const tknLowerBound_ =
          !tknLowerBound || tknLowerBound < globalLowerBound
            ? globalLowerBound
            : tknLowerBound;
        const tknUpperBound = ccyUpperBounds?.get(tokenName);
        const pamount = newPAmount(tknLowerBound_, tknUpperBound);
        tokenAmounts.set(tokenName, pamount);
      }
      pamounts.set(currencySymbol, tokenAmounts);
    }
    this.pamounts = pamounts;
  }

  private valueAsserts = (v: Value): void => {
    for (const [currencySymbol, tokens] of v) {
      if (!this.assets.has(currencySymbol)) {
        throw new Error(
          `Currency symbol ${currencySymbol} not in assets`,
        );
      }
      for (const [tokenName, amount] of tokens) {
        if (!this.assets.get(currencySymbol)?.includes(tokenName)) {
          throw new Error(
            `Token name ${tokenName} not in assets for currency symbol ${currencySymbol}`,
          );
        }
        const pamount = this.pamounts.get(currencySymbol)?.get(tokenName);
        if (pamount) {
          pamount.asserts.forEach((assert) => assert(amount));
        } else {
          throw new Error(
            `PAmount not found for currency symbol ${currencySymbol} and token name ${tokenName}`,
          );
        }
      }
    }
  };

  public plift = (v: Value): Value => {
    this.valueAsserts(v);
    return v;
  };
  public pconstant = (data: Value): Value => {
    this.valueAsserts(data);
    return data;
  };

  public genData = (): Value => {
    const value = new Map<CurrencySymbol, Map<TokenName, Amount>>();
    for (const [currencySymbol, tokens] of this.assets) {
      const tokenAmounts = new Map<TokenName, Amount>();
      for (const tokenName of tokens) {
        const pamount = this.pamounts.get(currencySymbol)?.get(tokenName);
        assert(
          pamount,
          `PAmount not found for currency symbol ${currencySymbol} and token name ${tokenName}`,
        );
        const amount = pamount.genData();
        tokenAmounts.set(tokenName, amount);
      }
      value.set(currencySymbol, tokenAmounts);
    }
    return value;
  };
}

export type Amounts = Value;
export type PAmounts = PConstraint<PValue>;
export const newPAmounts = (
  baseAmountA0: bigint,
  pprices: PPrices,
): PAmounts => {
  const assets = assetsOf(pprices.pamounts);
  const pinner = new PValue(assets);
  // const asserts = []; // TODO asserts, ideally inverse to the other stuff

  return new PConstraint(
    pinner,
    [],
    newGenAmounts(baseAmountA0, pprices),
  );
};

const newGenAmounts = (baseAmountA0: bigint, pprices: PPrices) => (): Value => {
  const prices = pprices.genData();
  return genAmounts(baseAmountA0, prices);
};

export function genAmounts(
  baseAmountA0: bigint,
  prices: Prices,
): Value {
  const assets = assetsOf(prices);
  const denom = firstAsset(assets)!;
  const nonzero = randomAssetsOf(assets);
  const p0 = amountOf(prices, denom)!;
  const amounts = newValue();
  let amountA0 = baseAmountA0;
  for (const [ccy, tkns] of tailAssets(nonzero)) {
    for (const tkn of tkns) {
      const asset = new Asset(ccy, tkn);
      const tradedA0 = BigInt(genNumber(Number(amountA0)));
      amountA0 -= tradedA0;
      const p = amountOf(prices, asset)!;
      setAmountOf(amounts, asset, (tradedA0 * p) / p0);
    }
  }
  const p = amountOf(prices, firstAsset(nonzero))!;
  setAmountOf(amounts, firstAsset(nonzero), (amountA0 * p) / p0);
  return amounts;
}

export type JumpSizes = Prices;
export type PJumpSizes = PPrices;
export const newPJumpSizes = newPPrices;

export function assetsOf(
  value: Map<CurrencySymbol, Map<TokenName, unknown>>,
): Assets {
  const assets = new Map<CurrencySymbol, TokenName[]>();
  for (const [currencySymbol, tokens] of value) {
    assets.set(currencySymbol, [...tokens.keys()]);
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

export function singleton(asset: Asset, amount: Amount): Value {
  const value = newValue();
  const tokens = new Map<TokenName, Amount>();
  tokens.set(asset.tokenName, amount);
  value.set(asset.currencySymbol, tokens);
  return value;
}

const newUnionWith = (
  op: (a: Amount, b: Amount) => Amount,
  defaultOut?: Amount,
  defaultA?: Amount,
  defaultB?: Amount,
) =>
(
  a: Value,
  b: Value,
): Value => {
  const assets = assetsOf(a);
  const value = newValue();
  for (const [currencySymbol, tokens] of assets) {
    for (const tokenName of tokens) {
      const asset = new Asset(currencySymbol, tokenName);
      const amountA = amountOf(a, asset, defaultA);
      const amountB = amountOf(b, asset, defaultB);
      const amountOut = op(amountA, amountB);
      if (amountOut !== defaultOut) {
        setAmountOf(value, asset, op(amountA, amountB));
      }
    }
  }
  return value;
};

export const addStrict = newUnionWith((a, b) => a + b, 0n);
export const subStrict = newUnionWith((a, b) => a - b, 0n);
export const mulStrict = newUnionWith((a, b) => a * b, 0n);
export const divStrict = newUnionWith((a, b) => a / b, 0n);

export const lSubValues = newUnionWith((a, b) => a > b ? a - b : 0n, 0n);

export const addValues = newUnionWith((a, b) => a + b, 0n, 0n, 0n);
export const subValues = newUnionWith((a, b) => a - b, 0n, 0n, 0n);
export const mulValues = newUnionWith((a, b) => a * b, 0n, 0n, 0n);
export const divValues = newUnionWith((a, b) => a / b, 0n, 0n);

export const minValues = newUnionWith(
  (a, b) => a === 0n ? b : b === 0n ? a : a < b ? a : b,
  0n,
  0n,
  0n,
);


export const addAmount = (v: Value, asset: Asset, amount: Amount): Value => {
  const add = newUnionWith((a, b) => a + b, 0n, undefined, 0n);
  const value = add(v, singleton(asset, amount));
  return value;
};

function mapAmounts(
  value: Value,
  f: (amount: Amount) => Amount,
): Value {
  const value_ = newValue();
  for (const [ccy, tknAmnts] of value) {
    const tknAmnts_ = new Map<TokenName, Amount>();
    for (const [tkn, amnt] of tknAmnts) {
      tknAmnts_.set(tkn, f(amnt));
    }
    value_.set(ccy, tknAmnts_);
  }
  return value_;
}

export function setAmounts(value: Value, amount: Amount): Value {
  return mapAmounts(value, () => amount);
}

export function mulAmounts(value: Value, factor: Amount): Value {
  return mapAmounts(value, (amount) => amount * factor);
}

export function maxAmounts(value: Value, max: Amount): Value {
  return mapAmounts(value, (amnt: Amount) => max > amnt ? amnt : max);
}

export function negate(value: Value): Value {
  return mapAmounts(value, (amount) => -amount);
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
