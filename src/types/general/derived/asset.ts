import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  AssocMap,
  gMaxLength,
  Hash,
  KeyHash,
  minSizedSubset,
  nonEmptySubSet,
  randomChoice,
  randomSubset,
} from "../../../mod.ts";
import { f, PConstraint, PObject, PRecord, t } from "../mod.ts";
import { newGenInRange } from "./bounded.ts";
import { PNonEmptyList } from "./nonEmptyList.ts";
import {
  PByteString,
  PList,
  PMap,
  PString,
  PWrapped,
} from "../fundamental/mod.ts";
import {
  Assets as LucidAssets,
  fromHex,
  toHex,
  toText,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";

export class Currency {
  constructor(public readonly symbol: Uint8Array) {
    assert(symbol.length <= Currency.maxLength, `Currency too long: ${symbol}`);
  }

  public toString = (): string => {
    return toHex(this.symbol);
  };

  public show = (): string => {
    return `Currency(${this.toString()})`;
  };

  public valueOf = this.show;

  static fromHex = (hex: string): Currency => {
    return new Currency(fromHex(hex));
  };

  static maxLength = 32n;
  static ADA = new Currency(new Uint8Array(0));
}

export class PCurrency extends PWrapped<Currency> {
  constructor() {
    super(
      new PByteString(7n, 7n),
      Currency,
    );
  }

  static ptype = new PCurrency();
  static genPType(): PWrapped<Currency> {
    return PCurrency.ptype;
  }
}
export class Token {
  constructor(public readonly name: string) {
    assert(
      name.length <= Token.maxLength,
      `Token too long: ${name}, ${name.length}`,
    );
  }

  public show = (): string => {
    return `Token(${this.name})`;
  };

  public valueOf = this.show;

  public hash = (skip = 1n): Hash => {
    return new Hash(fromHex(this.name)).hash(skip);
  };

  static fromHash = (hash: Hash): Token => {
    return new Token(hash.toString());
  };

  static fromOwner = (owner: KeyHash) => {
    return new Token(toText(toHex(owner.bytes)));
  };

  static maxLength = 64n;
  static lovelace = new Token("");
}

export class PToken extends PWrapped<Token> {
  constructor() {
    super(
      new PString(0n, Token.maxLength),
      Token,
    );
  }

  static ptype = new PToken();
  static genPType(): PWrapped<Token> {
    return PToken.ptype;
  }
}

export class Asset {
  constructor(
    public readonly currency: Currency,
    public readonly token: Token,
  ) {
    Asset.assertADAlovelace(this);
  }

  public show = (): string => {
    return `Asset(${this.currency.toString()}, ${this.token.name})`;
  };

  public toLucid = (): string => {
    try {
      const ccy = toHex(this.currency.symbol);
      if (ccy === "") {
        return "lovelace";
      }
      const tkn = PToken.ptype.pconstant(this.token);
      console.log(`
    ccy: ${ccy}
    tkn: ${this.token}
    tkn: ${PToken.ptype.pconstant(this.token)}
    tkn: ${tkn}`);
      return `${ccy}${tkn}`;
    } catch (e) {
      throw new Error(`${e}\ncould not encode ${this.show()})`);
    }
  };

  public toLucidWith = (amount: bigint): LucidAssets => {
    return {
      [this.toLucid()]: amount,
    };
  };

  static fromLucid(name: string, ccyLength: number): Asset {
    try {
      if (name === "lovelace") {
        return Asset.ADA();
      }
      const ccy = name.slice(0, ccyLength);
      const tkn = PToken.ptype.plift(fromHex(name.slice(ccyLength)));
      return new Asset(Currency.fromHex(ccy), tkn);
    } catch (e) {
      throw new Error(`${e}\ncould not decode ${name} (${ccyLength}))`);
    }
  }

  static assertADAlovelace(asset: Asset): void {
    if (toHex(asset.currency.symbol) === "") {
      assert(
        asset.token.name === "",
        `ADA must have lovelace, got ${asset.show()}`,
      );
    }
  }

  private static ADA = (): Asset => {
    return new Asset(Currency.ADA, Token.lovelace);
  };

  private static generateNonADA = (): Asset => {
    const ccy = PCurrency.ptype.genData();
    const tkn = PToken.ptype.genData();
    return new Asset(ccy, tkn);
  };

  static generate(): Asset {
    return randomChoice([Asset.ADA, Asset.generateNonADA])();
  }
}

export class PAsset extends PConstraint<PObject<Asset>> {
  private constructor() {
    super(
      new PObject(
        new PRecord(
          {
            "currency": PCurrency.ptype,
            "token": PToken.ptype,
          },
        ),
        Asset,
      ),
      [Asset.assertADAlovelace],
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

export const ccysTkns = new AssocMap<PCurrency, PList<PToken>>(PCurrency.ptype);
const PNonEmptyTokenList = new PNonEmptyList(PToken.ptype);

export class Assets {
  constructor(
    private assets = ccysTkns.anew,
  ) {
    for (const [ccy, tkns] of this.assets) {
      assert(tkns.length > 0, `empty token list for ${ccy}`);
    }
  }

  public show = (tabs = ""): string => {
    const ttf = tabs + t + f;
    const ttff = ttf + f;
    const ccys = [`Assets:`];
    for (const [currency, tokens] of this.assets) {
      const symbol = currency.toString();
      ccys.push(
        `${ttf}${symbol === "" ? "ADA" : symbol}:`,
      );
      const tkns = [];
      for (const token of tokens) {
        tkns.push(
          `${ttff}${
            token.name === "" ? symbol === "" ? "lovelace" : "_" : token.name
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
        if (!tkns_.map((t) => t.name).includes(tkn.name)) return false;
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
    const { currency, token } = asset;
    const tkns = this.assets.get(currency) ?? [];
    assert(!tkns.includes(token), `${asset} already in ${this.show()}`);
    tkns.push(token);
    this.assets.set(currency, tkns);
  };

  public add = (asset: Asset): Assets => {
    const assets = this.clone();
    assets.insert(asset);
    return assets;
  };

  public remove = (asset: Asset): void => {
    const { currency, token } = asset;
    const tkns = this.assets.get(currency);
    assert(tkns !== undefined, `${asset.show()} not in ${this.show()}`);
    const i = tkns.indexOf(token);
    assert(i >= 0, `${asset.show()} not in ${this.show()}`);
    tkns.splice(i, 1);
    if (tkns.length === 0) {
      this.assets.delete(currency);
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
    const tail = this.assets.anew;
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

  public minSizedSubset = (minSize: bigint): Assets => {
    return Assets.fromList(minSizedSubset(this.toList(), minSize));
  };

  public has = (asset: Asset): boolean => {
    const { currency, token } = asset;
    const tkns = this.assets.get(currency);
    return tkns !== undefined && tkns.includes(token);
  };

  public toMap = (): Map<Currency, Token[]> => {
    const assets = new Map<Currency, Token[]>();
    for (const [ccy, tkns] of this.assets) {
      assets.set(ccy, tkns.slice());
    }
    return assets;
  };

  public empty = (): boolean => {
    return this.assets.size === 0;
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

  public intersect = (assets: Assets): Assets => {
    const shared = this.assets.anew;
    const other = assets.toMap();
    for (const [ccy, ownTkns] of this.assets) {
      const otherTkns = other.get(ccy);
      if (otherTkns) {
        const sharedTkns = ownTkns.filter((tkn) => otherTkns.includes(tkn));
        if (sharedTkns.length > 0) shared.set(ccy, sharedTkns);
      }
    }
    return new Assets(shared);
  };

  static assert(assets: Assets): void {
    assets.forEach((asset) => Asset.assertADAlovelace(asset));
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

  static singleton = (asset: Asset): Assets => {
    const assets = new Assets();
    assets.insert(asset);
    return assets;
  };
}

export class PAssets extends PConstraint<PWrapped<Assets>> {
  private constructor() {
    super(
      new PWrapped(
        new PMap(PCurrency.ptype, PNonEmptyTokenList),
        Assets,
      ),
      [Assets.assert],
      Assets.generate,
    );
  }

  static ptype = new PAssets();
  static genPType(): PConstraint<PWrapped<Assets>> {
    return PAssets.ptype;
  }
}
