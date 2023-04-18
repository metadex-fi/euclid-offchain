import { Assets } from "../general/derived/asset/assets.js";
import { KeyHash } from "../general/derived/hash/keyHash.js";
import { PositiveValue } from "../general/derived/value/positiveValue.js";
import { Value } from "../general/derived/value/value.js";
import { PObject } from "../general/fundamental/container/object.js";
import { EuclidValue } from "./euclidValue.js";
export declare class Param {
  readonly owner: KeyHash;
  readonly virtual: PositiveValue;
  readonly weights: EuclidValue;
  readonly jumpSizes: EuclidValue;
  readonly active: bigint;
  constructor(
    owner: KeyHash,
    virtual: PositiveValue,
    weights: EuclidValue, // NOTE those are actually inverted
    jumpSizes: EuclidValue,
    active: bigint,
  );
  get minAnchorPrices(): Value;
  get assets(): Assets;
  get switched(): Param;
  sharedAssets: (assets: Assets) => Assets;
  concise: (tabs?: string) => string;
  static asserts(param: Param): void;
  static generate(): Param;
  static genOf(owner: KeyHash, allAssets: Assets, virtualAssets: Assets): Param;
}
export declare class PParam extends PObject<Param> {
  private constructor();
  genData: typeof Param.generate;
  static ptype: PParam;
  static genPType(): PParam;
}
