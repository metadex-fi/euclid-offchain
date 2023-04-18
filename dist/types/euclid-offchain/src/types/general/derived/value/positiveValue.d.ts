import { Lucid } from "../../../../../lucid.mod.js";
import { AssocMap } from "../../fundamental/container/map.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { Asset } from "../asset/asset.js";
import { Assets } from "../asset/assets.js";
import { Currency } from "../asset/currency.js";
import { Token } from "../asset/token.js";
import { PPositive } from "../bounded/positive.js";
import { Value } from "./value.js";
export declare class PositiveValue {
  private value;
  constructor(value?: Value);
  initAmountOf: (asset: Asset, amount: bigint) => void;
  concise: (tabs?: string) => string;
  show: (tabs?: string) => string;
  get toMap(): AssocMap<Currency, AssocMap<Token, bigint>>;
  get assets(): Assets;
  get unsigned(): Value;
  get unit(): Value;
  get zeroed(): Value;
  get size(): bigint;
  get headAsset(): Asset;
  get smallestAmount(): bigint;
  get biggestAmount(): bigint;
  amountOf: (asset: Asset, defaultAmnt?: bigint) => bigint;
  drop: (asset: Asset) => void;
  ofAssets: (assets: Assets) => PositiveValue;
  intersect: (other: PositiveValue) => PositiveValue;
  setAmountOf: (asset: Asset, amount: bigint) => void;
  get clone(): PositiveValue;
  has: (asset: Asset) => boolean;
  fill: (assets: Assets, amount: bigint) => PositiveValue;
  addAmountOf: (asset: Asset, amount: bigint) => void;
  increaseAmountOf: (asset: Asset, amount: bigint) => void;
  boundedSubValue: (minSize?: bigint, maxSize?: bigint) => PositiveValue;
  plus: (other: PositiveValue) => PositiveValue;
  normedPlus: (other: PositiveValue) => PositiveValue;
  minus: (other: PositiveValue) => PositiveValue;
  normedMinus: (other: PositiveValue) => PositiveValue;
  divideBy: (other: PositiveValue) => PositiveValue;
  normedDivideBy: (other: PositiveValue) => PositiveValue;
  leq: (other: PositiveValue) => boolean;
  get toLucid(): Lucid.Assets;
  static fromLucid(assets: Lucid.Assets, idNFT?: string): PositiveValue;
  static maybeFromMap: (
    m?: AssocMap<Currency, AssocMap<Token, bigint>>,
  ) => PositiveValue | undefined;
  static genOfAssets: (assets: Assets, ppositive?: PPositive) => PositiveValue;
  static normed(value: Value): PositiveValue;
  static singleton(asset: Asset, amount: bigint): PositiveValue;
}
export declare const boundPositive: (value: Value) => Value;
export declare class PPositiveValue extends PWrapped<PositiveValue> {
  constructor();
  static ptype: PPositiveValue;
  static genPType(): PPositiveValue;
}
