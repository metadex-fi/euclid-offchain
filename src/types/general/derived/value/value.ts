import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { fromHex, toHex } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { AssocMap, genPositive, max, maxInteger } from "../../../../mod.ts";
import { f, PConstraint, PMap, PWrapped, t } from "../../mod.ts";
import { Asset, Assets, Currency, PCurrency, PToken, Token } from "../asset.ts";
import { bothExtreme, PBounded } from "../bounded.ts";

export class Value {
  constructor(
    private value = new AssocMap<Currency, AssocMap<Token, bigint>>(),
  ) {
    assert(
      this.value instanceof AssocMap,
      `Value must be a AssocMap, not ${JSON.stringify(this.value)}`,
    );
  }

  public show = (tabs = ""): string => {
    const ttf = tabs + t + f;
    const ttff = ttf + f;
    const ccys = [`Value:`];
    for (const [currency, tokenMap] of this.value) {
      const symbol = currency.toString();
      ccys.push(
        `${ttf}${symbol === "" ? "ADA" : symbol}:`,
      );
      const t = [];
      for (const [token, amount] of tokenMap) {
        t.push(
          `${ttff}${
            token.name === "" ? symbol === "" ? "lovelace" : "_" : token.name
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
        amounts.push(
          `${tf}${ccy.toString()}_${tkn.name}: ${amount.toString()}`,
        );
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

  public scaledWith = (factor: bigint): Value => {
    return newMapAmounts((a) => a * factor)(this);
  };

  public increment = (): Value => {
    return newMapAmounts((a) => a + 1n)(this);
  };

  public flatDecrement = (): Value => {
    return newMapAmounts((a) => max(0n, a - 1n))(this);
  };

  public numAssets = (): number => {
    let n = 0;
    for (const tkns of this.value.values()) {
      n += tkns.size;
    }
    return n;
  };

  public assets = (): Assets => {
    const assets = new AssocMap<Currency, Token[]>();
    for (const [currencySymbol, tokens] of this.value) {
      assets.set(currencySymbol, [...tokens.keys()]);
    }
    return new Assets(assets);
  };

  public firstAsset = (): Asset => {
    assert(this.value.size > 0, `no currencies in value: ${this.show()}`);
    const ccy = [...this.value.keys()].sort()[0];
    const tkns = this.value.get(ccy);
    assert(tkns, `no tokens for currency ${ccy}`);
    assert(tkns.size > 0, `no tokens for currency ${ccy}`);
    const tkn = [...tkns.keys()].sort()[0];
    return new Asset(ccy, tkn);
  };

  public firstAmount = (): bigint => {
    assert(this.value.size > 0, `no currencies in value: ${this.show()}`);
    const ccy = [...this.value.keys()].sort()[0];
    const tkns = this.value.get(ccy);
    assert(tkns, `no tokens for currency ${ccy}`);
    assert(tkns.size > 0, `no tokens for currency ${ccy}`);
    const tkn = [...tkns.keys()].sort()[0];
    const amnt = tkns.get(tkn);
    assert(amnt, `no amount for token ${tkn}`);
    return amnt;
  };

  public tail = (): Value => {
    const size = this.size();
    assert(size > 0, "empty values tell no tails");
    const tail = new AssocMap<Currency, AssocMap<Token, bigint>>();
    let first = true;
    for (const ccy of [...this.value.keys()].sort()) {
      const tkns = this.value.get(ccy);
      assert(tkns, `no tokens for currency ${ccy}`);
      if (first) {
        assert(tkns.size > 0, "empty token map");
        if (tkns.size > 1) {
          const tail_ = new AssocMap<Token, bigint>();
          for (const tkn of [...tkns.keys()].sort().slice(1)) {
            const amnt = tkns.get(tkn);
            assert(amnt, `no amount for token ${tkn}`);
            tail_.set(tkn, amnt);
          }
          tail.set(ccy, tail_);
        }
        first = false;
      } else tail.set(ccy, tkns);
    }
    const tail_ = new Value(tail);
    assert(
      tail_.size() === size - 1n,
      `tail size ${tail_.size()} != ${size} - 1`,
    );
    return tail_;
  };

  public pop = (asset: Asset): bigint => {
    const tkns = this.value.get(asset.currency);
    assert(tkns, `no tokens for currency ${asset.currency}`);
    const amnt = tkns.get(asset.token);
    assert(amnt, `no amount for token ${asset.token}`);
    tkns.delete(asset.token);
    if (tkns.size === 0) this.value.delete(asset.currency);
    return amnt;
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
    return this.value.get(asset.currency)?.get(asset.token);
  };

  public amountOf = (
    asset: Asset,
    defaultAmnt?: bigint,
  ): bigint => {
    const amount = this.maybeAmountOf(asset) ??
      defaultAmnt;
    assert(
      amount !== undefined,
      `amountOf: amount not found for asset\n${asset.show()}\nin ${this.concise()}`,
    );
    return amount;
  };

  public setAmountOf = (asset: Asset, amount: bigint): void => {
    const tokens = this.value.get(asset.currency);
    assert(
      tokens,
      `setAmountOf: tokens not found for asset ${asset.show()} in ${this.show()}`,
    );
    assert(
      tokens.has(asset.token),
      `setAmountOf: amount not found for asset ${asset.show()} in ${this.show()}`,
    );
    tokens.set(asset.token, amount);
  };

  public initAmountOf = (asset: Asset, amount: bigint): void => {
    const tokens = this.value.get(asset.currency);
    if (tokens) {
      assert(
        !tokens.has(asset.token),
        `initAmountOf: amount already set for asset ${asset.show()} in ${this.show()}`,
      );
      tokens.set(asset.token, amount);
    } else {
      const tokens = new AssocMap<Token, bigint>();
      tokens.set(asset.token, amount);
      this.value.set(asset.currency, tokens);
    }
  };

  public fillAmountOf = (asset: Asset, amount: bigint): void => {
    const tokens = this.value.get(asset.currency);
    if (tokens) {
      if (!tokens.has(asset.token)) {
        tokens.set(asset.token, amount);
      }
    } else {
      const tokens = new AssocMap<Token, bigint>();
      tokens.set(asset.token, amount);
      this.value.set(asset.currency, tokens);
    }
  };

  public ofAssets = (assets: Assets): Value => {
    const value = new Value();
    for (const [currencySymbol, tokens] of this.value) {
      const assets_ = assets.toMap();
      if (assets_.has(currencySymbol)) {
        const tokens_ = new AssocMap<Token, bigint>();
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

  public toMap = (): AssocMap<Currency, AssocMap<Token, bigint>> => {
    const map = new AssocMap<Currency, AssocMap<Token, bigint>>();
    for (const [currencySymbol, tokens] of this.value) {
      const tokens_ = new AssocMap<Token, bigint>();
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

  public clone = (): Value => new Value(this.toMap());

  public addAmountOf = (asset: Asset, amount: bigint): void => {
    this.setAmountOf(asset, this.amountOf(asset) + amount);
  };

  public fill = (assets: Assets, amount: bigint): Value => {
    const value = this.clone();
    assets.forEach((asset) => {
      value.fillAmountOf(asset, amount);
    });
    return value;
  };

  public smallestAmount = (): bigint => {
    let smallest: bigint | undefined = undefined;
    for (const amounts of this.value.values()) {
      for (const amount of amounts.values()) {
        if (!smallest || amount < smallest) {
          smallest = amount;
        }
      }
    }
    assert(smallest, `smallestAmount: no smallest found in ${this.concise()}`);
    return smallest;
  };

  public biggestAmount = (): bigint => {
    let biggest: bigint | undefined = undefined;
    for (const amounts of this.value.values()) {
      for (const amount of amounts.values()) {
        if (!biggest || biggest < amount) {
          biggest = amount;
        }
      }
    }
    assert(biggest, `biggestAmount: no biggest found in ${this.concise()}`);
    return biggest;
  };

  static nullOfAssets = (assets: Assets): Value => {
    const value = new AssocMap<Currency, AssocMap<Token, bigint>>();
    for (const [currencySymbol, tokens] of assets.toMap()) {
      const tokens_ = new AssocMap<Token, bigint>();
      for (const tokenName of tokens) {
        tokens_.set(tokenName, 0n);
      }
      value.set(currencySymbol, tokens_);
    }
    return new Value(value);
  };

  static assert(value: Value): void {
    Assets.assert(value.assets());
  }

  static generateWith = (bounded: PBounded) => (): Value => {
    const assets = Assets.generate();
    const value = new Value();
    assets.forEach((asset) => {
      value.initAmountOf(asset, bounded.genData());
    });
    return value;
  };
}

export class PValue extends PConstraint<PWrapped<Value>> {
  constructor(
    public pbounded: PBounded,
  ) {
    super(
      new PWrapped(
        new PMap(
          PCurrency.ptype,
          new PMap(PToken.ptype, pbounded),
        ),
        Value,
      ),
      [Value.assert],
      Value.generateWith(pbounded),
    );
  }
  static genPType(): PConstraint<PWrapped<Value>> {
    return new PValue(PBounded.genPType() as PBounded);
  }
}

export function assetsOf(
  ...values: Value[]
): Assets {
  const assets = new AssocMap<Currency, Token[]>();
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
  const value = new AssocMap<Currency, AssocMap<Token, bigint>>();
  const tokens = new AssocMap<Token, bigint>();
  tokens.set(asset.token, amount);
  value.set(asset.currency, tokens);
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

export const addValues = newUnionWith((a, b) => a + b);
export const mulValues = newUnionWith((a, b) => a * b);
export const mulValues_ = newUnionWith((a, b) => a * b, undefined, 0n);
export const divValues = newUnionWith((a, b) => a / b);

export const lSubValues = newUnionWith((a, b) => a > b ? a - b : 0n, 0n);
export const lSubValues_ = newUnionWith(
  (a, b) => a > b ? a - b : 0n,
  undefined,
  undefined,
  0n,
);

export const generateWithin = newUnionWith(
  (a, b) => new PBounded(a, b).genData(),
);

export const newBoundedWith = (bounds: PBounded) => (value: Value): Value => {
  const bounded = new Value();
  for (const [currencySymbol, tokens] of value.toMap()) {
    for (const [tokenName, amount] of tokens) {
      bounded.initAmountOf(
        new Asset(currencySymbol, tokenName),
        amount < bounds.lowerBound
          ? bounds.lowerBound
          : amount > bounds.upperBound
          ? bounds.upperBound
          : amount,
      );
    }
  }
  return bounded;
};

export const newMapAmounts = (op: (arg: bigint) => bigint) =>
  newUnionWith(
    (a) => op(a),
  );

export function newSetAmounts(amount: bigint): (value: Value) => Value {
  return newMapAmounts(() => amount);
}
