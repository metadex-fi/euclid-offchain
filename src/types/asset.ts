import {
  PMap,
  PObject,
  PRecord,
} from "../../../refactor_parse/lucid/src/mod.ts";
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
