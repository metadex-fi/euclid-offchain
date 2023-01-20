import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  gMaxLength,
  minSizedSubset,
  nonEmptySubSet,
  randomChoice,
  randomSubset,
} from "../../../mod.ts";
import { f, PConstraint, PObject, PRecord, t } from "../mod.ts";
import { newGenInRange } from "./bounded.ts";
import { PNonEmptyList } from "./nonEmptyList.ts";
import { PByteString, PMap } from "../fundamental/mod.ts";
import { Assets as LucidAssets } from "https://deno.land/x/lucid@0.8.6/mod.ts";

export type CurrencySymbol = string;
export type PCurrencySymbol = PByteString;
export const PCurrencySymbol = new PByteString();

export type TokenName = string;
export type PTokenName = PByteString;
export const PTokenName = new PByteString();

export class Asset {
  constructor(
    public readonly currencySymbol: CurrencySymbol,
    public readonly tokenName: TokenName,
  ) {
    Asset.assert(this);
  }

  public show = (): string => {
    return `Asset(${this.currencySymbol}, ${this.tokenName})`;
  };

  public toLucid = (): string => {
    return this.currencySymbol === ""
      ? "lovelace"
      : `${this.currencySymbol}${this.tokenName}`;
  };

  public toLucidWith = (amount: bigint): LucidAssets => {
    return {
      [this.toLucid()]: amount,
    };
  };

  static fromLucid(name: string): Asset {
    if (name === "lovelace") {
      return new Asset("", "");
    }
    return new Asset(name, ""); // TODO ccy should be prefix of fixed length, look that up
  }

  static assert(asset: Asset): void {
    if (asset.currencySymbol === "") {
      assert(
        asset.tokenName === "",
        `ADA must have lovelace, got ${asset.tokenName}`,
      );
    }
  }

  static generate(): Asset {
    const ccy = randomChoice([() => "", PCurrencySymbol.genData])();
    const tkn = ccy === "" ? "" : PTokenName.genData();
    return new Asset(ccy, tkn);
  }
}

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
      [Asset.assert],
      Asset.generate,
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

  public clone = (): Assets => {
    const assets = new Assets();
    for (const [ccy, tkns] of this.assets) {
      assets.assets.set(ccy, tkns.slice());
    }
    return assets;
  };

  public insert = (asset: Asset): void => {
    const { currencySymbol, tokenName } = asset;
    const tkns = this.assets.get(currencySymbol) ?? [];
    assert(!tkns.includes(tokenName), `${asset} already in ${this.show()}`);
    tkns.push(tokenName);
    this.assets.set(currencySymbol, tkns);
  };

  public add = (asset: Asset): Assets => {
    const assets = this.clone();
    assets.insert(asset);
    return assets;
  };

  public remove = (asset: Asset): void => {
    const { currencySymbol, tokenName } = asset;
    const tkns = this.assets.get(currencySymbol);
    assert(tkns !== undefined, `${asset.show()} not in ${this.show()}`);
    const i = tkns.indexOf(tokenName);
    assert(i >= 0, `${asset.show()} not in ${this.show()}`);
    tkns.splice(i, 1);
    if (tkns.length === 0) {
      this.assets.delete(currencySymbol);
    }
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

  public minSizedSubset = (minSize: bigint): Asset[] => {
    return minSizedSubset(this.toList(), minSize);
  };

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

  public toLucidWith = (amount: bigint): LucidAssets => {
    const names: string[] = [];
    const assets: LucidAssets = {};
    this.forEach((asset) => {
      const name = asset.toLucid();
      assert(!names.includes(name), `duplicate asset name ${name}`);
      names.push(name);
      assets[name] = amount;
    });
    return assets;
  };

  public forEach = (
    f: (value: Asset, index?: number, array?: Asset[]) => void,
  ) => this.toList().forEach(f);

  static fromList(assets: Asset[]): Assets {
    const assets_ = new Assets();
    for (const asset of assets) {
      assets_.insert(asset);
    }
    assert(
      assets_.size() === assets.length,
      `fromList ${assets} resulted in ${assets_.show()}`,
    );
    return assets_;
  }

  static assert(assets: Assets): void {
    assets.forEach((asset) => Asset.assert(asset));
  }

  static generate = (minLength = 0n): Assets => {
    const assets = PMap.genKeys(
      PAsset.ptype,
      newGenInRange(minLength, gMaxLength)(),
    );
    assert(assets.length >= minLength, `generated ${assets} too small`);
    const assets_ = Assets.fromList(assets);
    assert(
      assets_.size() >= minLength,
      `generated ${assets_.show()} too small`,
    );
    return assets_;
  };
}

export class PAssets extends PConstraint<PObject<Assets>> {
  private constructor() {
    super(
      new PObject(
        new PRecord({
          assets: new PMap(PCurrencySymbol, PNonEmptyTokenList),
        }),
        Assets,
      ),
      [Assets.assert],
      Assets.generate,
    );
  }

  static ptype = new PAssets();
  static genPType(): PConstraint<PObject<Assets>> {
    return PAssets.ptype;
  }
}
