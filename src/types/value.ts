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
  bothExtreme,
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
    const ttff = ttf + f;
    const ccys = [`Value:`];
    for (const [currencySymbol, tokenMap] of this.value) {
      ccys.push(`${ttf}${currencySymbol === "" ? "ADA" : currencySymbol}:`);
      const t = [];
      for (const [tokenName, amount] of tokenMap) {
        t.push(
          `${ttff}${
            tokenName === ""
              ? currencySymbol === "" ? "lovelace" : "_"
              : tokenName
          }: ${amount}`,
        );
      }
      ccys.push(t.join(",\n"));
    }
    return ccys.join(`\n`);
  };

  public zeroed = (): Value => {
    return newSetAmounts(0n)(this);
  };

  public unit = (): Value => {
    return newSetAmounts(1n)(this);
  };

  public maxxed = (): Value => {
    return newSetAmounts(maxInteger)(this);
  };

  // public minned = (): Value => {
  //   return newSetAmounts(-maxInteger)(this);
  // };

  public scaled = (amount: Amount): Value => {
    return newMapAmounts((a) => a * amount)(this);
  };

  public increment = (): Value => {
    return newMapAmounts((a) => a + 1n)(this);
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

  public foldWith =
    (init: bigint, op: (a: bigint, b: bigint) => bigint) => (): bigint => {
      let agg = init;
      for (const [_, tokens] of this.value) {
        for (const [_, amount] of tokens) {
          agg = op(agg, amount);
        }
      }
      return agg;
    };

  public sumAmounts = this.foldWith(0n, (a, b) => a + b);
  public mulAmounts = this.foldWith(1n, (a, b) => a * b);

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
    defaultAmnt?: bigint,
  ): Amount => {
    const amount = this.value.get(asset.currencySymbol)?.get(asset.tokenName) ??
      defaultAmnt;
    assert(
      amount !== undefined,
      `amountOf: amount not found for asset\n${
        JSON.stringify(asset)
      }\nin ${this.show()}`,
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

  public ofAssets = (assets: Assets): Value => {
    const value = new Value();
    for (const [currencySymbol, tokens] of this.value) {
      if (assets.assets.has(currencySymbol)) {
        const tokens_ = new Map<TokenName, Amount>();
        for (const tokenName of tokens.keys()) {
          if (assets.assets.get(currencySymbol)?.includes(tokenName)) {
            tokens_.set(tokenName, tokens.get(tokenName)!);
          }
        }
        value.value.set(currencySymbol, tokens_);
      }
    }
    return value;
  };
}

// @ts-ignore TODO consider fixing this, or leaving as is
export class PValue<N extends PNum> extends PMapRecord<PMapRecord<N>> {
  constructor(
    public pnum: new (lowerBound?: bigint, upperBound?: bigint) => N,
    public assets: Assets,
    public lowerBounds?: Value,
    public upperBounds?: Value,
  ) {
    assert(
      !lowerBounds || !upperBounds || leq(lowerBounds, upperBounds),
      `lowerBounds ${lowerBounds?.show()} must be leq upperBounds ${upperBounds?.show()}
maxInteger: ${maxInteger}`,
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
        pamounts[tokenName] = new pnum(lowerBound, upperBound);
      }
      value[currencySymbol] = new PMapRecord(pamounts);
    }
    super(value);
  }

  static newGenPValue = <N extends PNum>(
    pnum: new (lowerBound?: bigint, upperBound?: bigint) => N,
    assets = new Assets(PAssets.genPType().genData()),
  ) =>
  (): PValue<N> => {
    const lowerBoundedAssets = assets.randomSubset();
    const upperBoundedAssets = assets.randomSubset();
    const lowerBounds = maybeNdef(() =>
      // @ts-ignore TODO consider fixing this, or leaving as is
      new Value(new PValue(pnum, lowerBoundedAssets)
        .genData())
    )?.();
    const upperBounds = maybeNdef(() =>
      new Value(
        new PValue(
          pnum,
          upperBoundedAssets,
          lowerBounds?.ofAssets(upperBoundedAssets),
        )
          .genData(),
      )
    )?.();
    return new PValue(pnum, assets, lowerBounds, upperBounds);
  };

  static genPType = PValue.newGenPValue(PBounded);
}

export class PPositiveValue extends PValue<PPositive> {
  constructor(
    public assets: Assets,
    public lowerBounds?: Value,
    public upperBounds?: Value,
  ) {
    assert(
      !lowerBounds || allPositive(lowerBounds),
      "lowerBounds must be positive",
    );
    super(PPositive, assets, lowerBounds, upperBounds);
  }

  static genOfAssets(assets: Assets) {
    return PValue.newGenPValue(PPositive, assets)();
  }
  static genPType = PValue.newGenPValue(PPositive);
}

export class JumpSizes {
  constructor(public value: Value) {}
}
export class PJumpSizes extends PPositiveValue {}

export function assetsOf(
  ...values: Value[]
): Assets {
  const assets = new Assets();
  for (const value of values) {
    for (const [currencySymbol, tokenMap] of value.value) {
      if (!assets.assets.has(currencySymbol)) {
        assets.assets.set(currencySymbol, []);
      }
      for (const tokenName of tokenMap.keys()) {
        const tokens = assets.assets.get(currencySymbol)!;
        if (!tokens.includes(tokenName)) {
          tokens.push(tokenName);
        }
      }
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
  (a, b) => a < b || bothExtreme(a, b),
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

export const addValues = newUnionWith((a, b) => a + b, 0n, 0n, 0n);
// export const subValues = newUnionWith((a, b) => a - b);
// export const mulValues = newUnionWith((a, b) => a * b);
// export const divValues = newUnionWith((a, b) => a / b);

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

export function newSetAmounts(amount: Amount): (value: Value) => Value {
  return newMapAmounts(() => amount);
}
