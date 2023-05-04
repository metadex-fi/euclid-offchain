import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import {
  boundedSubset,
  gMaxLength,
  max,
  nonEmptySubSet,
  randomChoice,
  randomSubset,
} from "../../../../utils/generators.js";
import { AssocMap, PMap } from "../../fundamental/container/map.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { f, t } from "../../fundamental/type.js";
import { newGenInRange } from "../bounded/bounded.js";
import { PNonEmptyList } from "../nonEmptyList.js";
import { Asset, PAsset } from "./asset.js";
import { PCurrency } from "./currency.js";
import { PToken } from "./token.js";
export const ccysTkns = new AssocMap((ccy) => ccy.show());
const PNonEmptyTokenList = new PNonEmptyList(PToken.ptype);
export class Assets {
  constructor(assets = ccysTkns.anew) {
    Object.defineProperty(this, "assets", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: assets,
    });
    Object.defineProperty(this, "show", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tabs = "") => {
        const ttf = tabs + t + f;
        const ttff = ttf + f;
        const ccys = [`Assets:`];
        for (const [currency, tokens] of this.assets) {
          const symbol = currency.toString();
          ccys.push(`${ttf}${symbol === "" ? "ADA" : symbol}:`);
          const tkns = [];
          for (const token of tokens) {
            tkns.push(
              `${ttff}${
                token.name === ""
                  ? symbol === "" ? "lovelace" : "_"
                  : token.name
              }`,
            );
          }
          ccys.push(tkns.join(",\n"));
        }
        return ccys.join(`\n`);
      },
    });
    Object.defineProperty(this, "equals", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return this.subsetOf(other) && other.subsetOf(this);
      },
    });
    Object.defineProperty(this, "insert", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (asset) => {
        const { currency, token } = asset;
        const ownTkns = this.assets.get(currency) ?? [];
        assert(
          !ownTkns.some((own) => own.name === token.name),
          `${asset} already in ${this.show()}`,
        );
        ownTkns.push(token);
        this.assets.set(currency, ownTkns);
      },
    });
    Object.defineProperty(this, "add", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (asset) => {
        const assets = this.clone;
        assets.insert(asset);
        return assets;
      },
    });
    Object.defineProperty(this, "drop", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (asset) => {
        const { currency, token } = asset;
        const tkns = this.assets.get(currency);
        assert(tkns !== undefined, `${asset.show()} not in ${this.show()}`);
        const i = tkns.findIndex((tkn) => tkn.name === token.name);
        assert(i >= 0, `${asset.show()} not in ${this.show()}`);
        tkns.splice(i, 1);
        if (tkns.length === 0) {
          this.assets.delete(currency);
        }
        return this;
      },
    });
    Object.defineProperty(this, "head", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        assert(this.assets.size > 0, "empty assets have no head");
        const ccy = [...this.assets.keys()].sort()[0];
        const tkn = this.assets.get(ccy).slice(0).sort()[0];
        return new Asset(ccy, tkn);
      },
    });
    Object.defineProperty(this, "tail", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        assert(this.assets.size > 0, "empty assets tell no tails");
        const tail = this.assets.anew;
        let first = true;
        for (const ccy of [...this.assets.keys()].sort()) {
          const tkns = this.assets.get(ccy).slice(0).sort();
          if (first) {
            assert(tkns.length > 0, "empty token map");
            if (tkns.length > 1) {
              const tail_ = tkns.slice(1);
              tail.set(ccy, tail_);
            }
            first = false;
          } else {
            tail.set(ccy, tkns);
          }
        }
        const tail_ = new Assets(tail);
        assert(tail_.add(this.head()).equals(this), "tail is not tail");
        return tail_;
      },
    });
    Object.defineProperty(this, "randomChoice", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const ccy = randomChoice([...this.assets.keys()]);
        const tkn = randomChoice(this.assets.get(ccy));
        return new Asset(ccy, tkn);
      },
    });
    Object.defineProperty(this, "randomSubset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const assets_ = new Assets();
        const ccys = randomSubset([...this.assets.keys()]);
        for (const ccy of ccys) {
          const tkns = nonEmptySubSet(this.assets.get(ccy));
          assets_.assets.set(ccy, tkns);
        }
        return assets_;
      },
    });
    Object.defineProperty(this, "boundedSubset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (minSize, maxSize) => {
        return Assets.fromList(boundedSubset(this.toList, minSize, maxSize));
      },
    });
    Object.defineProperty(this, "has", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (asset) => {
        const { currency, token } = asset;
        const ownTkns = this.assets.get(currency);
        return ownTkns !== undefined &&
          ownTkns.some((own) => own.name === token.name);
      },
    });
    Object.defineProperty(this, "subsetOf", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        for (const [ccy, ownTkns] of this.assets) {
          const otherTkns = other.toMap.get(ccy);
          if (otherTkns === undefined) {
            return false;
          }
          for (const own of ownTkns) {
            if (!otherTkns.some((other) => own.name === other.name)) {
              return false;
            }
          }
        }
        return true;
      },
    });
    Object.defineProperty(this, "forEach", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (f) => this.toList.forEach(f),
    });
    Object.defineProperty(this, "intersect", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (assets) => {
        const shared = this.assets.anew;
        const other = assets.toMap;
        for (const [ccy, ownTkns] of this.assets) {
          const otherTkns = other.get(ccy);
          if (otherTkns) {
            const sharedTkns = ownTkns.filter((own) =>
              otherTkns.some((other) => other.name === own.name)
            );
            if (sharedTkns.length > 0) {
              shared.set(ccy, sharedTkns);
            }
          }
        }
        return new Assets(shared);
      },
    });
    Object.defineProperty(this, "union", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (assets) => {
        const union = this.assets.anew;
        const other = assets.toMap;
        for (const [ccy, ownTkns] of this.assets) {
          const otherTkns = other.get(ccy);
          if (otherTkns) {
            const unionTkns = ownTkns.concat(otherTkns.filter((other) => {
              return !ownTkns.some((own) => own.name === other.name);
            }));
            union.set(ccy, unionTkns);
          } else {
            union.set(ccy, ownTkns);
          }
        }
        for (const [ccy, otherTkns] of other) {
          if (!this.assets.has(ccy)) {
            union.set(ccy, otherTkns);
          }
        }
        return new Assets(union);
      },
    });
    Object.defineProperty(this, "toLucidWith", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (amount) => {
        const assets = {};
        this.forEach((asset) => assets[asset.toLucid()] = amount);
        return assets;
      },
    });
    Assets.assert(this);
  }
  get clone() {
    const assets = new Assets();
    for (const [ccy, tkns] of this.assets) {
      assets.assets.set(ccy, tkns.slice());
    }
    return assets;
  }
  get toMap() {
    const assets = ccysTkns.anew;
    for (const [ccy, tkns] of this.assets) {
      assets.set(ccy, tkns.slice());
    }
    return assets;
  }
  get empty() {
    return this.assets.size === 0;
  }
  get size() {
    let size = 0n;
    for (const tkns of this.assets.values()) {
      size += BigInt(tkns.length);
    }
    return size;
  }
  get toList() {
    const assets = [];
    for (const [ccy, tkns] of this.assets) {
      for (const tkn of tkns) {
        assets.push(new Asset(ccy, tkn));
      }
    }
    return assets;
  }
  static fromList(assets) {
    const assets_ = new Assets();
    for (const asset of assets) {
      assets_.insert(asset);
    }
    return assets_;
  }
  static assert(assets) {
    for (const [ccy, tkns] of assets.assets) {
      assert(tkns.length > 0, `empty token list for ${ccy}`);
    }
    assets.forEach((asset) => Asset.assertADAlovelace(asset));
  }
}
Object.defineProperty(Assets, "generate", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: (minLength = 0n, maxLength) => {
    const assets = PMap.genKeys(
      PAsset.ptype,
      newGenInRange(minLength, maxLength ?? max(minLength, gMaxLength))(),
    );
    assert(assets.length >= minLength, `generated ${assets} too small`);
    const assets_ = Assets.fromList(assets);
    assert(assets_.size >= minLength, `generated ${assets_.show()} too small`);
    return assets_;
  },
});
Object.defineProperty(Assets, "singleton", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: (asset) => {
    const assets = new Assets();
    assets.insert(asset);
    return assets;
  },
});
export class PAssets extends PWrapped {
  constructor() {
    super(new PMap(PCurrency.ptype, PNonEmptyTokenList), Assets);
    Object.defineProperty(this, "genData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: Assets.generate,
    });
  }
  static genPType() {
    return PAssets.ptype;
  }
}
Object.defineProperty(PAssets, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PAssets(),
});
