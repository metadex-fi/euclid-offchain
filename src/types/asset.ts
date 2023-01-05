import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  f,
  genNonNegative,
  gMaxLength,
  PConstraint,
  PLifted,
  PMap,
  PObject,
  PRecord,
  randomChoice,
  t,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { nonEmptySubSet, randomSubset } from "../../tests/generators.ts";
import { PNonEmptyList } from "./nonEmptyList.ts";
import {
  CurrencySymbol,
  PCurrencySymbol,
  PTokenName,
  TokenName,
} from "./primitive.ts";

const assertADAlovelace = (a: Asset): void => {
  if (a.currencySymbol === "") {
    assert(a.tokenName === "", "ADA must have lovelace");
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
  ) {}
}
export class PAsset extends PConstraint<PObject<Asset>> {
  constructor() {
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

  static ptype = new PAsset();
  static genPType(): PConstraint<PObject<Asset>> {
    return PAsset.ptype;
  }
}

const PNonEmptyTokenList = new PNonEmptyList(PTokenName);

export class Assets {
  constructor(
    public assets: Map<CurrencySymbol, Array<TokenName>> = new Map(),
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
        tkns.push(`${ttff}${tokenName === "" ? "lovelace" : tokenName}`);
      }
      ccys.push(tkns.join(",\n"));
    }
    return ccys.join(`\n`);
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

  public numAssets = (): number => {
    let n = 0;
    for (const tkns of this.assets.values()) {
      n += tkns.length;
    }
    return n;
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

const genAssets = (): PLifted<PAssets> => {
  const assets = new Map<CurrencySymbol, TokenName[]>();
  const numAssets = genNonNegative(gMaxLength);
  for (let i = 0; i < numAssets; i++) {
    const asset = genAsset();
    if (assets.has(asset.currencySymbol)) {
      const tokens = assets.get(asset.currencySymbol)!;
      if (!tokens.includes(asset.tokenName)) {
        tokens.push(asset.tokenName);
      }
    } else {
      assets.set(asset.currencySymbol, [asset.tokenName]);
    }
  }
  return assets;
};

export class PAssets
  extends PConstraint<PMap<PCurrencySymbol, PNonEmptyList<PTokenName>>> {
  constructor() {
    super(
      new PMap(PCurrencySymbol, PNonEmptyTokenList),
      [assertADAlovelaces],
      genAssets,
    );
  }

  static ptype = new PAssets();
  static genPType(): PConstraint<
    PMap<PCurrencySymbol, PNonEmptyList<PTokenName>>
  > {
    return PAssets.ptype;
  }
}
