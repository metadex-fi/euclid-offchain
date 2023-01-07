import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { maxInteger, maybeNdef } from "../../utils/testing/generators.ts";
import {
  bothExtreme,
  f,
  PBounded,
  PLiteral,
  PMapRecord,
  PNum,
  PPositive,
  RecordOf,
  t,
} from "../mod.ts";
import { Asset, Assets, PAssets } from "./asset.ts";
import { CurrencySymbol, TokenName } from "./primitive.ts";

export class Value {
  constructor(
    private value: Map<CurrencySymbol, Map<TokenName, bigint>> = new Map(),
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

  public concise = (tabs = ""): string => {
    const tf = tabs + f;
    const amounts = [];
    for (const [ccy, tokenMap] of this.value) {
      for (const [tkn, amount] of tokenMap) {
        amounts.push(`${tf}${ccy}_${tkn}: ${amount.toString()}`);
      }
    }
    if (amounts.length === 0) return `[]`;
    else return `[\n${amounts.join(`,\n`)}\n${tabs}]`;
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

  public scaled = (amount: bigint): Value => {
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

  public assets = (): Assets => {
    const assets = new Map<CurrencySymbol, TokenName[]>();
    for (const [currencySymbol, tokens] of this.value) {
      assets.set(currencySymbol, [...tokens.keys()]);
    }
    return new Assets(assets);
  };

  public firstAsset = (): Asset => {
    for (const [currencySymbol, tokens] of this.value) {
      for (const tokenName in tokens) {
        return new Asset(currencySymbol, tokenName);
      }
    }
    throw new Error("no assets in value");
  };

  public firstAmount = (): bigint => {
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
          const tail_ = new Map<TokenName, bigint>();
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

  public exactAssets = (assets: Assets): boolean => {
    return this.assets().equals(assets);
  };

  public maybeAmountOf = (asset: Asset): bigint | undefined => {
    return this.value.get(asset.currencySymbol)?.get(asset.tokenName);
  };

  public amountOf = (
    asset: Asset,
    defaultAmnt?: bigint,
  ): bigint => {
    const amount = this.maybeAmountOf(asset) ??
      defaultAmnt;
    assert(
      amount !== undefined,
      `amountOf: amount not found for asset\n${asset.show()}\nin ${this.show()}`,
    );
    return amount;
  };

  public setAmountOf = (asset: Asset, amount: bigint): void => {
    const tokens = this.value.get(asset.currencySymbol);
    assert(
      tokens,
      `setAmountOf: tokens not found for asset ${asset.show()} in ${this.show()}`,
    );
    assert(
      tokens.has(asset.tokenName),
      `setAmountOf: amount not found for asset ${asset.show()} in ${this.show()}`,
    );
    tokens.set(asset.tokenName, amount);
  };

  public initAmountOf = (asset: Asset, amount: bigint): void => {
    const tokens = this.value.get(asset.currencySymbol);
    if (tokens) {
      assert(
        !tokens.has(asset.tokenName),
        `initAmountOf: amount already set for asset ${asset.show()} in ${this.show()}`,
      );
      tokens.set(asset.tokenName, amount);
    } else {
      const tokens = new Map<TokenName, bigint>();
      tokens.set(asset.tokenName, amount);
      this.value.set(asset.currencySymbol, tokens);
    }
  };

  public ofAssets = (assets: Assets): Value => {
    const value = new Value();
    for (const [currencySymbol, tokens] of this.value) {
      const assets_ = assets.toMap();
      if (assets_.has(currencySymbol)) {
        const tokens_ = new Map<TokenName, bigint>();
        for (const tokenName of tokens.keys()) {
          if (assets_.get(currencySymbol)?.includes(tokenName)) {
            tokens_.set(tokenName, tokens.get(tokenName)!);
          }
        }
        value.value.set(currencySymbol, tokens_);
      }
    }
    return value;
  };

  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> => {
    const map = new Map<CurrencySymbol, Map<TokenName, bigint>>();
    for (const [currencySymbol, tokens] of this.value) {
      const tokens_ = new Map<TokenName, bigint>();
      for (const [tokenName, amount] of tokens) {
        tokens_.set(tokenName, amount);
      }
      map.set(currencySymbol, tokens_);
    }
    return map;
  };

  public size = (): bigint => {
    let size = 0n;
    for (const [_, tokens] of this.value) {
      size += BigInt(tokens.size);
    }
    return size;
  };

  public has = (assets: Assets): boolean => {
    return this.assets().subsetOf(assets);
  };

  static nullOfAssets = (assets: Assets): Value => {
    const value = new Map<CurrencySymbol, Map<TokenName, bigint>>();
    for (const [currencySymbol, tokens] of assets.toMap()) {
      const tokens_ = new Map<TokenName, bigint>();
      for (const tokenName of tokens) {
        tokens_.set(tokenName, 0n);
      }
      value.set(currencySymbol, tokens_);
    }
    return new Value(value);
  };
}

// @ts-ignore TODO consider fixing this, or leaving as is
export class PValue<N extends PNum> extends PMapRecord<PMapRecord<N>> {
  protected constructor(
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
      assert(
        lowerBounds.has(assets),
        `lowerBounds missing from ${assets.show()}
  lower bounds ${lowerBounds.show()}`,
      );
    }

    if (upperBounds) {
      assert(
        upperBounds.has(assets),
        `upperBounds missing from ${assets.show()}
  upper bounds ${upperBounds.show()}`,
      );
    }

    const value: RecordOf<PMapRecord<N>> = {};
    for (const [currencySymbol, tokens] of assets.toMap()) {
      const pamounts: RecordOf<N> = {};
      for (const tokenName of tokens) {
        const asset = new Asset(currencySymbol, tokenName);
        const lowerBound = lowerBounds?.maybeAmountOf(asset);
        const upperBound = upperBounds?.maybeAmountOf(asset);
        pamounts[tokenName] = new pnum(lowerBound, upperBound);
      }
      value[currencySymbol] = new PMapRecord(pamounts);
    }
    super(value);
  }

  public genValue = (): Value => {
    return new Value(this.genData());
  };

  static newGenPValue = <N extends PNum>(
    pnum: new (lowerBound?: bigint, upperBound?: bigint) => N,
    assets = new Assets(PAssets.genPType().genData()),
  ) =>
  (): PValue<N> => {
    const lowerBoundedAssets = assets.randomSubset();
    const upperBoundedAssets = assets.randomSubset();
    const lowerBounds = maybeNdef(() =>
      new PValue(pnum, lowerBoundedAssets).genValue()
    )?.();
    const upperBounds = maybeNdef(() =>
      new PValue(
        pnum,
        upperBoundedAssets,
        lowerBounds?.ofAssets(upperBoundedAssets),
      ).genValue()
    )?.();
    return new PValue(pnum, assets, lowerBounds, upperBounds);
  };

  static genPType = PValue.newGenPValue(PBounded);
}

export class PositiveValue {
  constructor(
    private value = new Value(),
  ) {
    assert(allPositive(value), "value must be positive");
  }

  public initAmountOf = (asset: Asset, amount: bigint): void => {
    assert(
      amount >= 0n,
      `initAmountOf: amount must be positive, got ${amount} for asset ${asset.show()}`,
    );
    this.value?.initAmountOf(asset, amount);
  };

  public concise = (tabs = ""): string => `+${this.value.concise(tabs)}`;
  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> =>
    this.value.toMap();
  public assets = (): Assets => this.value.assets();
  public unsigned = (): Value => new Value(this.value.toMap());
  public unit = (): Value => this.value.unit();
  public size = (): bigint => this.value.size();
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);

  static maybeFromMap = (
    m?: Map<CurrencySymbol, Map<TokenName, bigint>>,
  ): PositiveValue | undefined => {
    if (m === undefined) return undefined;
    else return new PositiveValue(new Value(m));
  };
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

  public genPositiveValue = (): PositiveValue => {
    return new PositiveValue(this.genValue());
  };

  static genOfAssets(assets: Assets) {
    return PValue.newGenPValue(PPositive, assets)();
  }
  static genPType = PValue.newGenPValue(PPositive);

  static maybePLiteral(
    value?: PositiveValue,
  ): PLiteral<PPositiveValue> | undefined {
    if (value === undefined) return undefined;
    else {return new PLiteral(
        new PPositiveValue(value.assets(), value.unsigned(), value.unsigned()),
        value.toMap(),
      );}
  }
}

export class JumpSizes {
  private constructor(private value: PositiveValue) {}

  public assets = (): Assets => this.value.assets();
  public unsigned = (): Value => this.value.unsigned();
  public concise = (tabs = ""): string => this.value.concise(tabs);
  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> =>
    this.value.toMap();

  static genOfAssets(assets: Assets): JumpSizes {
    return new JumpSizes(
      (PPositiveValue.genOfAssets(assets) as PPositiveValue).genPositiveValue(),
    );
  }

  static nullOfAssets(assets: Assets): JumpSizes {
    return new JumpSizes(new PositiveValue(Value.nullOfAssets(assets)));
  }

  static fromMap(m: Map<CurrencySymbol, Map<TokenName, bigint>>): JumpSizes {
    return new JumpSizes(new PositiveValue(new Value(m)));
  }
}
export class PJumpSizes extends PPositiveValue {
  constructor(
    public assets: Assets,
    public lowerBounds?: Value,
    public upperBounds?: Value,
  ) {
    super(assets, lowerBounds, upperBounds);
  }
}

export function assetsOf(
  ...values: Value[]
): Assets {
  const assets = new Map<CurrencySymbol, TokenName[]>();
  for (const value of values) {
    for (const [currencySymbol, tokenMap] of value.toMap()) {
      if (!assets.has(currencySymbol)) {
        assets.set(currencySymbol, []);
      }
      for (const tokenName of tokenMap.keys()) {
        const tokens = assets.get(currencySymbol)!;
        if (!tokens.includes(tokenName)) {
          tokens.push(tokenName);
        }
      }
    }
  }
  return new Assets(assets);
}

export function singleton(asset: Asset, amount: bigint): Value {
  const value = new Map<CurrencySymbol, Map<TokenName, bigint>>();
  const tokens = new Map<TokenName, bigint>();
  tokens.set(asset.tokenName, amount);
  value.set(asset.currencySymbol, tokens);
  return new Value(value);
}

export const newCompareWith = (
  op: (arg: bigint, ...args: Array<bigint>) => boolean,
  ...defaultIns: Array<bigint | undefined>
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
    for (const [currencySymbol, tokens] of assets.toMap()) {
      for (const tokenName of tokens) {
        const asset = new Asset(currencySymbol, tokenName);
        const amountsIn = new Array<bigint>();
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

export const newAmountsCheck = (op: (arg: bigint) => boolean) =>
  newCompareWith(
    (a) => op(a),
  );

export const allPositive = newAmountsCheck((a) => a > 0n);

export const newUnionWith = (
  op: (arg: bigint, ...args: Array<bigint>) => bigint,
  defaultOut?: bigint,
  ...defaultIns: Array<bigint | undefined>
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
    for (const [currencySymbol, tokens] of assets.toMap()) {
      for (const tokenName of tokens) {
        const asset = new Asset(currencySymbol, tokenName);
        const amountsIn = new Array<bigint>();
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

export const addAmount = (v: Value, asset: Asset, amount: bigint): Value => {
  const add = newUnionWith((a, b) => a + b, 0n, undefined, 0n);
  const value = add(v, singleton(asset, amount));
  return value;
};

export const newMapAmounts = (op: (arg: bigint) => bigint) =>
  newUnionWith(
    (a) => op(a),
  );

export function newSetAmounts(amount: bigint): (value: Value) => Value {
  return newMapAmounts(() => amount);
}
