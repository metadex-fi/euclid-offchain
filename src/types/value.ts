import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNumber,
  PConstraint,
  PType,
} from "../../../refactor_parse/lucid/src/mod.ts";
import {
  amountOf,
  amountOfAsset,
  firstAsset,
  newValue,
  setAmount,
  setAssetAmount,
} from "../value.ts";
import { Assets, randomAssets, tailAssets } from "./asset.ts";
import {
  Amount,
  CurrencySymbol,
  mkPAmount,
  PAmount,
  TokenName,
} from "./primitive.ts";

export type Value = Map<CurrencySymbol, Map<TokenName, Amount>>;
export const emptyValue: Value = new Map<string, Map<string, bigint>>();

export function assetsOf(value: Value): Assets {
  const assets = new Map<CurrencySymbol, TokenName[]>();
  for (const [currencySymbol, tokens] of value) {
    assets.set(currencySymbol, [...tokens.keys()]);
  }
  return assets;
}

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
        const pamount = mkPAmount(tknLowerBound_, tknUpperBound);
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

  public genPlutusData = (): Value => {
    return this.genData();
  };
}

export type Prices = Value;
export type PPrices = PValue;
export const mkPPrices = (
  assets: Assets,
  lowerBounds?: Value,
  upperBounds?: Value,
): PValue => {
  return new PValue(assets, lowerBounds, upperBounds, 1n);
};

function genAmounts(baseAmountA0: bigint, prices: Prices): Value {
  const assets = assetsOf(prices);
  const denom = firstAsset(assets)!;
  const nonzero = randomAssets(assets);
  const p0 = amountOfAsset(prices, denom)!;
  let amounts = newValue();
  let amountA0 = baseAmountA0;
  for (const [ccy, tkns] of tailAssets(nonzero)) {
    for (const tkn of tkns) {
      const tradedA0 = BigInt(genNumber(Number(amountA0)));
      amountA0 -= tradedA0;
      const p = amountOf(prices, ccy, tkn)!;
      amounts = setAmount(amounts, ccy, tkn, (tradedA0 * p) / p0);
    }
  }
  const p = amountOfAsset(prices, firstAsset(nonzero))!;
  amounts = setAssetAmount(amounts, firstAsset(nonzero), (amountA0 * p) / p0);
  return amounts;
}

export type Amounts = Prices;
export type PAmounts = PConstraint<PPrices>;
export const mkPAmounts = (baseAmountA0: bigint, prices: Prices): PAmounts => {
  const assets = assetsOf(prices);
  const pinner = new PValue(assets);
  // const asserts = []; // TODO asserts, ideally inverse to the other stuff

  return new PConstraint(
    pinner,
    [],
    () => genAmounts(baseAmountA0, prices),
    () => genAmounts(baseAmountA0, prices),
  );
};

export type JumpSizes = Prices;
export type PJumpSizes = PPrices;
export const mkPJumpSizes = mkPPrices;
