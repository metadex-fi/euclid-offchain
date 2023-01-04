import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  f,
  maxInteger,
  maybeNdef,
  PMapRecord,
  RecordOf,
  t,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Asset, Assets, PAssets } from "./asset.ts";
import {
  Amount,
  CurrencySymbol,
  PBounded,
  PNum,
  PPositive,
  TokenName,
} from "./primitive.ts";

export class Value {
  constructor(
    public value: Map<CurrencySymbol, Map<TokenName, bigint>> = new Map(),
  ) {}

  public show = (tabs = ""): string => {
    const ttf = tabs + t + f;
    const ttftf = ttf + t + f;
    let s = `Value:\n`;
    for (const [currencySymbol, tokenMap] of this.value) {
      s += `${ttf}${currencySymbol}:\n`;
      for (const [tokenName, amount] of tokenMap) {
        s += `${ttftf}${tokenName}: ${amount},\n`;
      }
    }
    return s;
  };

  public zeroed = (): Value => {
    return setAmounts(0n)(this);
  };

  public maxxed = (): Value => {
    return setAmounts(BigInt(maxInteger))(this);
  };

  public scaled = (amount: Amount): Value => {
    return newMapAmounts((a) => a * amount)(this);
  };

  public numAssets = (): number => {
    let n = 0;
    for (const tkns of this.value.values()) {
      n += tkns.size;
    }
    return n;
  };

  public firstAsset = (): Asset => {
    for (const [currencySymbol, tokens] of this.value) {
      for (const tokenName in tokens) {
        return new Asset(currencySymbol, tokenName);
      }
    }
    throw new Error("no assets in value");
  };

  public firstAmount = (): Amount => {
    for (const [_, tokens] of this.value) {
      for (const [_, amount] of tokens) {
        return amount;
      }
    }
    throw new Error("no assets in value");
  };

  public tail = (): Value => {
    assert(this.value.size > 0, "empty values tell no tails");
    const tail = new Value();
    let first = true;
    for (const [ccy, tkns] of this.value) {
      if (first) {
        assert(tkns.size > 0, "empty token map");
        if (tkns.size > 1) {
          const tail_ = new Map<TokenName, Amount>();
          let first_ = true;
          for (const [tkn, amnt] of tkns) {
            if (first_) first_ = false;
            else tail_.set(tkn, amnt);
          }
          tail.value.set(ccy, tail_);
        }
        first = false;
      } else tail.value.set(ccy, tkns);
    }
    return tail;
  };

  public sumAmounts = (): bigint => {
    let sum = 0n;
    for (const [_, tokens] of this.value) {
      for (const [_, amount] of tokens) {
        sum += amount;
      }
    }
    return sum;
  };

  public unknownAssetsOf = (assets: Assets): Assets => {
    const unknownAssets = new Assets();
    for (const [currencySymbol, tokens] of this.value) {
      if (!assets.assets.has(currencySymbol)) {
        unknownAssets.assets.set(currencySymbol, [...tokens.keys()]);
      } else {
        const unknownTokens = [...tokens.keys()].filter((tokenName) =>
          !assets.assets.get(currencySymbol)?.includes(tokenName)
        );
        if (unknownTokens.length > 0) {
          unknownAssets.assets.set(currencySymbol, unknownTokens);
        }
      }
    }
    return unknownAssets;
  };

  public exactAssets = (assets: Assets): boolean => {
    for (const [currencySymbol, tokens] of this.value) {
      if (!assets.assets.has(currencySymbol)) {
        return false;
      }
      if (assets.assets.get(currencySymbol)?.length !== tokens.size) {
        return false;
      }
      for (const tokenName of tokens.keys()) {
        if (!assets.assets.get(currencySymbol)?.includes(tokenName)) {
          return false;
        }
      }
    }
    return true;
  };

  public amountOf = (
    asset: Asset,
    defaultAmnt?: Amount,
  ): Amount => {
    const amount = this.value.get(asset.currencySymbol)?.get(asset.tokenName) ??
      defaultAmnt;
    assert(
      amount,
      `amountOf: amount not found for asset ${
        JSON.stringify(asset)
      } in ${this.show()}`,
    );
    return amount;
  };

  public setAmountOf = (asset: Asset, amount: Amount): void => {
    const tokens = this.value.get(asset.currencySymbol);
    assert(
      tokens,
      `setAmountOf: tokens not found for asset ${
        JSON.stringify(asset)
      } in ${this.show()}`,
    );
    assert(
      tokens.has(asset.tokenName),
      `setAmountOf: amount not found for asset ${
        JSON.stringify(asset)
      } in ${this.show()}`,
    );
    tokens.set(asset.tokenName, amount);
  };

  public initAmountOf = (asset: Asset, amount: Amount): void => {
    const tokens = this.value.get(asset.currencySymbol);
    if (tokens) {
      assert(
        !tokens.has(asset.tokenName),
        `initAmountOf: amount already set for asset ${
          JSON.stringify(asset)
        } in ${this.show()}`,
      );
      tokens.set(asset.tokenName, amount);
    } else {
      const tokens = new Map<TokenName, Amount>();
      tokens.set(asset.tokenName, amount);
      this.value.set(asset.currencySymbol, tokens);
    }
  };
}

// @ts-ignore TODO consider fixing this, or leaving as is
export class PValue<N extends PNum> extends PMapRecord<PMapRecord<N>> {
  constructor(
    public PNum: new (lowerBound?: bigint, upperBound?: bigint) => N,
    public assets: Assets,
    public lowerBounds?: Value,
    public upperBounds?: Value,
  ) {
    assert(
      !lowerBounds || !upperBounds || lt(lowerBounds, upperBounds),
      "lowerBounds must be less than upperBounds",
    );
    if (lowerBounds) {
      const unknownLowerBounds = lowerBounds.unknownAssetsOf(assets);
      assert(
        unknownLowerBounds.assets.size === 0,
        `lowerBounds has unknown ${unknownLowerBounds.show()}
  ${assets.show()}
  lower bounds ${lowerBounds.show()}`,
      );
    }

    if (upperBounds) {
      const unknownUpperBounds = upperBounds.unknownAssetsOf(assets);
      assert(
        unknownUpperBounds.assets.size === 0,
        `upperBounds has unknown ${unknownUpperBounds.show()}
  ${assets.show()}
  upper bounds ${upperBounds.show()}`,
      );
    }

    const value: RecordOf<PMapRecord<N>> = {};
    for (const [currencySymbol, tokens] of assets.assets) {
      const pamounts: RecordOf<N> = {};
      for (const tokenName of tokens) {
        const lowerBound = lowerBounds?.value.get(currencySymbol)?.get(
          tokenName,
        );
        const upperBound = upperBounds?.value.get(currencySymbol)?.get(
          tokenName,
        );
        pamounts[tokenName] = new PNum(lowerBound, upperBound);
      }
      value[currencySymbol] = new PMapRecord(pamounts);
    }
    super(value);
  }

  static genPType(): PMapRecord<PMapRecord<PBounded>> {
    const assets = new Assets(PAssets.genPType().genData());
    const lowerBounds = maybeNdef(() =>
      new Value(new PValue(PBounded, assets.randomAssets())
        .genData())
    )?.();
    const upperBounds = maybeNdef(() =>
      new Value(new PValue(PBounded, assets.randomAssets(), lowerBounds)
        .genData())
    )?.();
    return new PValue(PBounded, assets, lowerBounds, upperBounds);
  }
}

export type PPositiveValue = PValue<PPositive>;
export const newPPositiveValue = (
  assets: Assets,
  lowerBounds?: Value,
  upperBounds?: Value,
): PPositiveValue => {
  assert(
    !lowerBounds || allPositive(lowerBounds),
    "lowerBounds must be positive",
  );
  return new PValue(PPositive, assets, lowerBounds, upperBounds);
};

export type JumpSizes = Value;
export type PJumpSizes = PPositiveValue;
export const newPJumpSizes = newPPositiveValue;

export function assetsOf(
  ...values: Value[]
): Assets {
  const assets = new Assets();
  for (const value of values) {
    for (const [currencySymbol, tokenMap] of value.value) {
      const tokens = assets.assets.get(currencySymbol) ?? [];
      assets.assets.set(currencySymbol, [...tokens, ...tokenMap.keys()]);
    }
  }
  return assets;
}

export function singleton(asset: Asset, amount: Amount): Value {
  const value = new Value();
  const tokens = new Map<TokenName, Amount>();
  tokens.set(asset.tokenName, amount);
  value.value.set(asset.currencySymbol, tokens);
  return value;
}

export const newCompareWith = (
  op: (arg: Amount, ...args: Array<Amount>) => boolean,
  ...defaultIns: Array<Amount | undefined>
) => {
  // assert( // TODO FIXME
  //   defaultIns.length <= op.arguments.length,
  //   "more defaultIns than op arguments",
  // );
  return (arg = new Value(), ...args: Array<Value | undefined>): boolean => {
    // assert( // TODO FIXME
    //   1 + args.length === op.arguments.length,
    //   "args length must match op arguments length",
    // );
    const args_ = args.map((v) => v ?? new Value());
    const assets = assetsOf(arg, ...args_);
    for (const [currencySymbol, tokens] of assets.assets) {
      for (const tokenName of tokens) {
        const asset = new Asset(currencySymbol, tokenName);
        const amountsIn = new Array<Amount>();
        [arg, ...args_].forEach((v, i) => {
          const defaultIn = defaultIns[i];
          const amountIn = v.amountOf(asset, defaultIn);
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

// TODO better "infinity" values. Maybe use onchain maximum?
export const lt = newCompareWith(
  (a, b) => a < b,
  -BigInt(maxInteger),
  BigInt(maxInteger),
);
export const leq = newCompareWith(
  (a, b) => a <= b,
  -BigInt(maxInteger),
  BigInt(maxInteger),
);

export const newAmountsCheck = (op: (arg: Amount) => boolean) =>
  newCompareWith(
    (a) => op(a),
  );

export const allPositive = newAmountsCheck((a) => a > 0n);

export const newUnionWith = (
  op: (arg: Amount, ...args: Array<Amount>) => Amount,
  defaultOut?: Amount,
  ...defaultIns: Array<Amount | undefined>
) => {
  // assert( // TODO FIXME
  //   defaultIns.length <= op.arguments.length,
  //   "more defaultIns than op arguments",
  // );
  return (
    arg: Value = new Value(),
    ...args: Array<Value | undefined>
  ): Value => {
    // assert( TODO FIXME
    //   1 + args.length === op.arguments.length,
    //   "args length must match op arguments length",
    // );
    const args_ = args.map((v) => v ?? new Value());
    const assets = assetsOf(arg, ...args_);
    const value = new Value();
    for (const [currencySymbol, tokens] of assets.assets) {
      for (const tokenName of tokens) {
        const asset = new Asset(currencySymbol, tokenName);
        const amountsIn = new Array<Amount>();
        [arg, ...args_].forEach((v, i) => {
          const defaultIn = defaultIns[i];
          amountsIn.push(v.amountOf(asset, defaultIn));
        });
        const amountOut = op(amountsIn[0], ...amountsIn.slice(1));
        if (amountOut !== defaultOut) {
          value.initAmountOf(asset, amountOut);
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
