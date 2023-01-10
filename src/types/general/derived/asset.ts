import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  gMaxLength,
  nonEmptySubSet,
  randomChoice,
  randomSubset,
} from "../../../mod.ts";
import { f, PConstraint, PLifted, PObject, PRecord, t } from "../mod.ts";
import { newGenInRange } from "./bounded.ts";
import { PNonEmptyList } from "./nonEmptyList.ts";
import { PByteString, PMap } from "../fundamental/mod.ts";

export type CurrencySymbol = string;
export type PCurrencySymbol = PByteString;
export const PCurrencySymbol = new PByteString();

export type TokenName = string;
export type PTokenName = PByteString;
export const PTokenName = new PByteString();

const assertADAlovelace = (a: Asset): void => {
  if (a.currencySymbol === "") {
    assert(a.tokenName === "", `ADA must have lovelace, got ${a.tokenName}`);
  }
};

const genAsset = (): Asset => {
  const ccy = randomChoice([() => "", PCurrencySymbol.genData])();
  const tkn = ccy === "" ? "" : PTokenName.genData();
  return new Asset(ccy, tkn);
};

export class Asset {
  constructor(
    public currencySymbol: CurrencySymbol,
    public tokenName: TokenName,
  ) {
    assertADAlovelace(this);
  }

  public show = (): string => {
    return `Asset(${this.currencySymbol}, ${this.tokenName})`;
  };
}
// @ts-ignore TODO consider fixing this, or leaving as is
export class PAsset extends PConstraint<PObject<Asset>> {
  private constructor() {
    super(
      new PObject(
        new PRecord(
          {
            "currencySymbol": PCurrencySymbol,
            "tokenName": PTokenName,
          },
        ),
        Asset,
      ),
      [assertADAlovelace],
      genAsset,
    );
  }

  public showData = (data: Asset): string => {
    assert(
      data instanceof Asset,
      `PAsset.showData: expected Asset, got ${data}`,
    );
    return data.show();
  };

  public showPType = (): string => {
    return `PObject: PAsset`;
  };

  static ptype = new PAsset();
  static genPType(): PConstraint<PObject<Asset>> {
    return PAsset.ptype;
  }
}

const PNonEmptyTokenList = new PNonEmptyList(PTokenName);

export class Assets {
  constructor(
    private assets: Map<CurrencySymbol, Array<TokenName>> = new Map(),
  ) {
    for (const [ccy, tkns] of this.assets) {
      assert(tkns.length > 0, `empty token list for ${ccy}`);
    }
  }

  public show = (tabs = ""): string => {
    const ttf = tabs + t + f;
    const ttff = ttf + f;
    const ccys = [`Assets:`];
    for (const [currencySymbol, tokens] of this.assets) {
      ccys.push(`${ttf}${currencySymbol === "" ? "ADA" : currencySymbol}:`);
      const tkns = [];
      for (const tokenName of tokens) {
        tkns.push(
          `${ttff}${
            tokenName === ""
              ? currencySymbol === "" ? "lovelace" : "_"
              : tokenName
          }`,
        );
      }
      ccys.push(tkns.join(",\n"));
    }
    return ccys.join(`\n`);
  };

  public equals = (other: Assets): boolean => {
    if (this.assets.size !== other.assets.size) return false;
    for (const [ccy, tkns] of this.assets) {
      const tkns_ = other.assets.get(ccy);
      if (tkns_ === undefined) return false;
      if (tkns.length !== tkns_.length) return false;
      for (const tkn of tkns) {
        if (!tkns_.includes(tkn)) return false;
      }
    }
    return true;
  };

  public copy = (): Assets => {
    const assets = new Assets();
    for (const [ccy, tkns] of this.assets) {
      assets.assets.set(ccy, tkns.slice());
    }
    return assets;
  };

  public add = (asset: Asset): Assets => {
    const assets = this.copy();
    const { currencySymbol, tokenName } = asset;
    const tkns = assets.assets.get(currencySymbol) ?? [];
    assert(!tkns.includes(tokenName), `${asset} already in ${assets.show()}`);
    tkns.push(tokenName);
    assets.assets.set(currencySymbol, tkns);
    return assets;
  };

  public head = (): Asset => {
    assert(this.assets.size > 0, "empty assets have no head");
    const ccy = [...this.assets.keys()].sort()[0];
    const tkn = this.assets.get(ccy)!.slice(0).sort()[0];
    return new Asset(ccy, tkn);
  };

  public tail = (): Assets => {
    assert(this.assets.size > 0, "empty assets tell no tails");
    const tail = new Map<CurrencySymbol, TokenName[]>();
    let first = true;
    for (const ccy of [...this.assets.keys()].sort()) {
      const tkns = this.assets.get(ccy)!.slice(0).sort();
      if (first) {
        assert(tkns.length > 0, "empty token map");
        if (tkns.length > 1) {
          const tail_ = tkns.slice(1);
          tail.set(ccy, tail_);
        }
        first = false;
      } else tail.set(ccy, tkns);
    }
    const tail_ = new Assets(tail);
    assert(tail_.add(this.head()).equals(this), "tail is not tail");
    return tail_;
  };

  public randomChoice = (): Asset => {
    const ccy = randomChoice([...this.assets.keys()]);
    const tkn = randomChoice(this.assets.get(ccy)!);
    return new Asset(ccy, tkn);
  };

  public randomSubset = (): Assets => {
    const assets_ = new Assets();
    const ccys = randomSubset([...this.assets.keys()]);
    for (const ccy of ccys) {
      const tkns = nonEmptySubSet(this.assets.get(ccy)!);
      assets_.assets.set(ccy, tkns);
    }
    return assets_;
  };

  public nonEmptySubset = (): Assets => {
    const assets_ = new Assets();
    const ccys = nonEmptySubSet([...this.assets.keys()]);
    for (const ccy of ccys) {
      const tkns = nonEmptySubSet(this.assets.get(ccy)!);
      assets_.assets.set(ccy, tkns);
    }
    return assets_;
  };

  // public missesOf = (assets: Assets): Assets => {
  //   const misses = new Map<CurrencySymbol, TokenName[]>();
  //   for (const [ccy, tkns] of assets.toMap()) {
  //     const tkns_ = this.assets.get(ccy);
  //     if (tkns_ === undefined) {
  //       misses.set(ccy, tkns);
  //     } else {
  //       const tkns__ = tkns.filter((tkn) => !tkns_.includes(tkn));
  //       if (tkns__.length > 0) misses.set(ccy, tkns__);
  //     }
  //   }
  //   return new Assets(misses);
  // };

  public has = (asset: Asset): boolean => {
    const { currencySymbol, tokenName } = asset;
    const tkns = this.assets.get(currencySymbol);
    return tkns !== undefined && tkns.includes(tokenName);
  };

  public toMap = (): Map<CurrencySymbol, TokenName[]> => {
    const assets = new Map<CurrencySymbol, TokenName[]>();
    for (const [ccy, tkns] of this.assets) {
      assets.set(ccy, tkns.slice());
    }
    return assets;
  };

  public size = (): number => {
    let size = 0;
    for (const tkns of this.assets.values()) {
      size += tkns.length;
    }
    return size;
  };

  public subsetOf = (assets: Assets): boolean => {
    for (const [ccy, tkns] of this.assets) {
      const tkns_ = assets.toMap().get(ccy);
      if (tkns_ === undefined) return false;
      for (const tkn of tkns) {
        if (!tkns_.includes(tkn)) return false;
      }
    }
    return true;
  };

  public toList = (): Asset[] => {
    const assets: Asset[] = [];
    for (const [ccy, tkns] of this.assets) {
      for (const tkn of tkns) {
        assets.push(new Asset(ccy, tkn));
      }
    }
    return assets;
  };
}

const assertADAlovelaces = (assets: PLifted<PAssets>): void => {
  for (const [ccy, tkns] of assets) {
    if (ccy === "") {
      assert(tkns.includes(""), "Assets: ADA must have lovelace");
      assert(tkns.length === 1, "Assets: ADA must have only lovelace");
    }
  }
};

const newGenAssets =
  (genNumAssets: (maxNum: bigint) => bigint) => (): PLifted<PAssets> => {
    const assets = new Map<CurrencySymbol, TokenName[]>();
    const numAssets = genNumAssets(gMaxLength);
    let i = 0;
    while (i < numAssets) {
      const asset = genAsset();
      if (assets.has(asset.currencySymbol)) {
        const tokens = assets.get(asset.currencySymbol)!;
        if (!tokens.includes(asset.tokenName)) {
          tokens.push(asset.tokenName);
          i++;
        }
      } else {
        assets.set(asset.currencySymbol, [asset.tokenName]);
        i++;
      }
    }
    return assets;
  };

export class PAssets
  extends PConstraint<PMap<PCurrencySymbol, PNonEmptyList<PTokenName>>> {
  private constructor() {
    super(
      new PMap(PCurrencySymbol, PNonEmptyTokenList),
      [assertADAlovelaces],
      newGenAssets(genNonNegative),
    );
  }

  static genAssets = (minLength = 0n): Assets => {
    const genNumAssets = (maxNum: bigint) => newGenInRange(minLength, maxNum)();
    const genAssets = newGenAssets(genNumAssets);
    const assets = new Assets(
      genAssets(),
    );
    assert(
      assets.size() >= minLength,
      `genAssets: minLength: ${minLength} not met by ${assets.show()}`,
    );
    return assets;
  };

  static ptype = new PAssets();
  static genPType(): PConstraint<
    PMap<PCurrencySymbol, PNonEmptyList<PTokenName>>
  > {
    return PAssets.ptype;
  }
}
