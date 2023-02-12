import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../../../lucid.mod.ts";
import {
  boundedSubset,
  gMaxLength,
  nonEmptySubSet,
  randomChoice,
  randomSubset,
} from "../../../../utils/generators.ts";
import { AssocMap, PMap } from "../../fundamental/container/map.ts";
import { PWrapped } from "../../fundamental/container/wrapped.ts";
import { f, t } from "../../fundamental/type.ts";
import { newGenInRange } from "../bounded/bounded.ts";
import { PNonEmptyList } from "../nonEmptyList.ts";
import { Asset, PAsset } from "./asset.ts";
import { Currency, PCurrency } from "./currency.ts";
import { PToken, Token } from "./token.ts";

export const ccysTkns = new AssocMap<Currency, Token[]>((ccy) => ccy.show());
const PNonEmptyTokenList = new PNonEmptyList(PToken.ptype);

export class Assets {
  constructor(
    private assets = ccysTkns.anew,
  ) {
    Assets.assert(this);
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

  public get clone(): Assets {
    const assets = new Assets();
    for (const [ccy, tkns] of this.assets) {
      assets.assets.set(ccy, tkns.slice());
    }
    return assets;
  }

  public insert = (asset: Asset): void => {
    const { currency, token } = asset;
    const tkns = this.assets.get(currency) ?? [];
    assert(!tkns.includes(token), `${asset} already in ${this.show()}`);
    tkns.push(token);
    this.assets.set(currency, tkns);
  };

  public add = (asset: Asset): Assets => {
    const assets = this.clone;
    assets.insert(asset);
    return assets;
  };

  public drop = (asset: Asset): Assets => {
    const { currency, token } = asset;
    const tkns = this.assets.get(currency);
    assert(tkns !== undefined, `${asset.show()} not in ${this.show()}`);
    const i = tkns.indexOf(token);
    assert(i >= 0, `${asset.show()} not in ${this.show()}`);
    tkns.splice(i, 1);
    if (tkns.length === 0) {
      this.assets.delete(currency);
    }
    return this;
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

  public boundedSubset = (minSize?: bigint, maxSize?: bigint): Assets => {
    return Assets.fromList(boundedSubset(this.toList(), minSize, maxSize));
  };

  public has = (asset: Asset): boolean => {
    const { currency, token } = asset;
    const tkns = this.assets.get(currency);
    return tkns !== undefined && tkns.includes(token);
  };

  public get toMap(): AssocMap<Currency, Token[]> {
    const assets = ccysTkns.anew;
    for (const [ccy, tkns] of this.assets) {
      assets.set(ccy, tkns.slice());
    }
    return assets;
  }

  public get empty(): boolean {
    return this.assets.size === 0;
  }

  public get size(): bigint {
    let size = 0n;
    for (const tkns of this.assets.values()) {
      size += BigInt(tkns.length);
    }
    return size;
  }

  public subsetOf = (superSet: Assets): boolean => {
    for (const [ccy, tkns] of this.assets) {
      const tkns_ = superSet.toMap.get(ccy);
      if (tkns_ === undefined) return false;
      for (const tkn of tkns) {
        const target = tkn.show();
        if (!tkns_.some((tkn_) => tkn_.show() === target)) return false;
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

  public forEach = (
    f: (value: Asset, index?: number, array?: Asset[]) => void,
  ) => this.toList().forEach(f);

  static fromList(assets: Asset[]): Assets {
    const assets_ = new Assets();
    for (const asset of assets) {
      assets_.insert(asset);
    }
    return assets_;
  }

  public intersect = (assets: Assets): Assets => {
    const shared = this.assets.anew;
    const other = assets.toMap;
    for (const [ccy, ownTkns] of this.assets) {
      const otherTkns = other.get(ccy);
      if (otherTkns) {
        const sharedTkns = ownTkns.filter((tkn) => otherTkns.includes(tkn));
        if (sharedTkns.length > 0) shared.set(ccy, sharedTkns);
      }
    }
    return new Assets(shared);
  };

  public toLucidWith = (amount: bigint): Lucid.Assets => {
    const assets: Lucid.Assets = {};
    this.forEach((asset) => assets[asset.toLucid()] = amount);
    return assets;
  };

  static assert(assets: Assets): void {
    for (const [ccy, tkns] of assets.assets) {
      assert(tkns.length > 0, `empty token list for ${ccy}`);
    }
    assets.forEach((asset) => Asset.assertADAlovelace(asset));
  }

  static generate = (minLength = 0n, maxLength = gMaxLength): Assets => {
    const assets = PMap.genKeys(
      PAsset.ptype,
      newGenInRange(minLength, maxLength)(),
    );
    assert(assets.length >= minLength, `generated ${assets} too small`);
    const assets_ = Assets.fromList(assets);
    assert(
      assets_.size >= minLength,
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

export class PAssets extends PWrapped<Assets> {
  private constructor() {
    super(
      new PMap(PCurrency.ptype, PNonEmptyTokenList),
      Assets,
    );
  }

  public genData = Assets.generate;

  static ptype = new PAssets();
  static genPType(): PWrapped<Assets> {
    return PAssets.ptype;
  }
}
