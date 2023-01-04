import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  f,
  PMap,
  PObject,
  PRecord,
  randomChoice,
  t,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { randomSubset } from "../../tests/generators.ts";
import { PNonEmptyList } from "./nonEmptyList.ts";
import {
  CurrencySymbol,
  PCurrencySymbol,
  PTokenName,
  TokenName,
} from "./primitive.ts";

export class Asset {
  constructor(
    public currencySymbol: CurrencySymbol,
    public tokenName: TokenName,
  ) {}
}
export class PAsset extends PObject<Asset> {
  constructor() {
    super(
      new PRecord(
        {
          "currencySymbol": PCurrencySymbol,
          "tokenName": PTokenName,
        },
      ),
      Asset,
    );
  }

  static ptype = new PAsset();
  static genPType(): PObject<Asset> {
    return PAsset.ptype;
  }
}

// export class PAssetOf extends PConstraint<PAsset> {
//   constructor(assets: Assets) {
//     assert(assets.size > 0, "assets must be non-empty");
//     super(
//       PAsset.ptype,
//       [newAssertAssetOf(assets)],
//       () => {
//         return randomAssetOf(assets);
//       },
//     );
//   }

//   static genPType(): PConstraint<PAsset> {
//     const timeout = 1000;
//     for (let i = 0; i < timeout; i++) {
//       const assets = PAssets.genPType().genData();
//       if (assets.size > 0) {
//         return new PAssetOf(assets);
//       }
//     }
//     throw new Error("failed to generate non-empty assets");
//   }
// }

// const newAssertAssetOf = (assets: Assets) => (asset: Asset): void => {
//   assert(assets.has(asset.currencySymbol), "currencySymbol not in assets");
//   assert(
//     assets.get(asset.currencySymbol)!.includes(asset.tokenName),
//     "tokenName not in assets",
//   );
// };

const PNonEmptyTokenList = new PNonEmptyList(PTokenName);

export class Assets {
  constructor(
    public assets: Map<CurrencySymbol, Array<TokenName>> = new Map(),
  ) {}

  public show = (tabs = ""): string => {
    const ttf = tabs + t + f;
    const ttftf = ttf + t + f;
    let s = `Assets:\n`;
    for (const [currencySymbol, tokens] of this.assets) {
      s += `${ttf}${currencySymbol}:\n`;
      for (const tokenName of tokens) {
        s += `${ttftf}${tokenName},\n`;
      }
    }
    return s;
  };

  public head = (): Asset => {
    for (const [ccy, tkns] of this.assets) {
      for (const tkn in tkns) {
        return new Asset(ccy, tkn);
      }
    }
    throw new Error("unexpected empty Asset");
  };

  public tail = (): Assets => {
    assert(this.assets.size > 0, "empty assets tell no tails");
    const tail = new Assets();
    let first = true;
    for (const [ccy, tkns] of this.assets) {
      if (first) {
        assert(tkns.length > 0, "empty token map");
        if (tkns.length > 1) {
          const tail_ = tkns.slice(1);
          tail.assets.set(ccy, tail_);
        }
        first = false;
      } else tail.assets.set(ccy, tkns);
    }
    return tail;
  };

  public randomAsset = (): Asset => {
    const ccy = randomChoice([...this.assets.keys()]);
    const tkn = randomChoice(this.assets.get(ccy)!);
    return new Asset(ccy, tkn);
  };

  public randomAssets = (): Assets => {
    const assets_ = new Assets();
    const ccys = randomSubset([...this.assets.keys()]);
    for (const ccy of ccys) {
      const tkns = randomSubset(this.assets.get(ccy)!);
      assets_.assets.set(ccy, tkns);
    }
    return assets_;
  };

  public numAssets = (): number => {
    let n = 0;
    for (const tkns of this.assets.values()) {
      n += tkns.length;
    }
    return n;
  };
}

export class PAssets extends PMap<PCurrencySymbol, PNonEmptyList<PTokenName>> {
  constructor() {
    super(PCurrencySymbol, PNonEmptyTokenList);
  }

  static ptype = new PAssets();
  static genPType(): PMap<PCurrencySymbol, PNonEmptyList<PTokenName>> {
    return PAssets.ptype;
  }

  // static genAssets(): Assets {
  //   const timeout = 1000;
  //   for (let i = 0; i < timeout; i++) {
  //     const assets = PAssets.genPType().genData();
  //     if (assets.size > 0) return assets
  //   }
  //   throw new Error("failed to generate non-empty assets");
  // }
}
