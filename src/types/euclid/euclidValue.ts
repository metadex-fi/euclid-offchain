import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Assets, PositiveValue, PPositiveValue, Value } from "../mod.ts";
import { PWrapped } from "../general/fundamental/container/wrapped.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { IdNFT } from "./idnft.ts";

export class EuclidValue {
  constructor(
    private readonly value: PositiveValue,
  ) {
    EuclidValue.asserts(this);
  }

  public assets = (): Assets => this.value.assets();
  public unsigned = (): Value => this.value.unsigned();
  public unit = (): Value => this.value.unit();
  public concise = (tabs = ""): string => this.value.concise(tabs);
  public popIdNFT = (nft: IdNFT) => this.value.popIdNFT(nft);

  static asserts(euclidValue: EuclidValue): void {
    assert(euclidValue.assets().size >= 2n, "at least two assets are required");
  }

  static generate(): EuclidValue {
    const assets = Assets.generate(2n);
    const value = PositiveValue.genOfAssets(assets);
    return new EuclidValue(value);
  }

  static genOfAssets(assets: Assets): EuclidValue {
    return new EuclidValue(PositiveValue.genOfAssets(assets));
  }

  static fromValue = (value: Value): EuclidValue =>
    new EuclidValue(new PositiveValue(value));
  static fromLucid = (assets: Lucid.Assets): EuclidValue =>
    new EuclidValue(PositiveValue.fromLucid(assets));
}

export class PEuclidValue extends PWrapped<EuclidValue> {
  constructor() {
    super(
      PPositiveValue.ptype,
      EuclidValue,
    );
  }

  public genData = EuclidValue.generate;

  static ptype = new PEuclidValue();
  static genPType(): PEuclidValue {
    return PEuclidValue.ptype;
  }
}
