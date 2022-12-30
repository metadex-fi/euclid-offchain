import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  PMap,
  PObject,
  PRecord,
  randomChoice,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { randomSubset } from "../../tests/generators.ts";
import { mkPNonEmptyList, PNonEmptyList } from "./nonEmptyList.ts";
import { mkPNonEmptyMap, PNonEmptyMap } from "./nonEmptyMap.ts";
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
export type PAsset = PObject<Asset>;
export const PAsset: PAsset = new PObject(
  new PRecord(
    {
      "currencySymbol": PCurrencySymbol,
      "tokenName": PTokenName,
    },
  ),
  Asset,
);

const NonEmptyTokenList = mkPNonEmptyList(PTokenName);

export type Assets = Map<CurrencySymbol, TokenName[]>;
export type PAssets = PMap<PCurrencySymbol, PNonEmptyList<PTokenName>>;
export const PAssets: PAssets = new PMap(
  PCurrencySymbol,
  NonEmptyTokenList,
);

export type PNonEmptyAssets = PNonEmptyMap<
  PCurrencySymbol,
  PNonEmptyList<PTokenName>
>;
export const PNonEmptyAssets: PNonEmptyAssets = mkPNonEmptyMap(
  PCurrencySymbol,
  NonEmptyTokenList,
);

export function firstAsset(assets: Assets): Asset {
  for (const [ccy, tkns] of assets) {
    for (const tkn in tkns) {
      return new Asset(ccy, tkn);
    }
  }
  throw new Error("unexpected empty Value");
}

export function tailAssets(assets: Assets): Assets {
  assert(assets.size > 0, "empty assets tell no tails");
  const tail = new Map();
  let first = true;
  for (const [ccy, tkns] of assets) {
    if (first) {
      assert(tkns.length > 0, "empty token map");
      if (tkns.length > 1) {
        const tail_ = tkns.slice(1);
        tail.set(ccy, tail_);
      }
      first = false;
    } else tail.set(ccy, tkns);
  }
  return tail;
}

export function randomAsset(assets: Assets): Asset {
  const ccy = randomChoice([...assets.keys()]);
  const tkn = randomChoice(assets.get(ccy)!);
  return new Asset(ccy, tkn);
}

export function randomAssets(assets: Assets): Assets {
  const assets_ = new Map();
  const ccys = randomSubset([...assets.keys()]);
  for (const ccy of ccys) {
    const tkns = randomSubset(assets.get(ccy)!);
    assets_.set(ccy, tkns);
  }
  return assets_;
}
