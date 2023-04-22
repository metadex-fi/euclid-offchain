import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { randomChoice } from "../../../../utils/generators.js";
import { PObject } from "../../fundamental/container/object.js";
import { PRecord } from "../../fundamental/container/record.js";
import { Currency, PCurrency } from "./currency.js";
import { PToken, Token } from "./token.js";

export class Asset {
  constructor(
    public readonly currency: Currency,
    public readonly token: Token,
  ) {
    Asset.assertADAlovelace(this);
    // Asset.assertLength(this);
  }

  
  public show = (): string => {
    return `Asset(${this.currency.toString()}, ${this.token.name})`;
  };
  
  public concise = (): string => {
    return `${this.currency.concise()}.${this.token.concise()}`;
  };
  
  public equals = (other: Asset): boolean => {
    return this.concise() === other.concise();
  };

  public toLucid = (): string => {
    if (this.currency.symbol.length === 0) return "lovelace";
    else return Lucid.toUnit(this.currency.toLucid(), this.token.toLucid());
  };

  public toLucidWith = (amount: bigint): Lucid.Assets => {
    return { [this.toLucid()]: amount };
  };

  static fromLucid(hexAsset: string): Asset {
    try {
      if (hexAsset === "lovelace") return Asset.ADA;
      else {
        const unit = Lucid.fromUnit(hexAsset);
        return new Asset(
          Currency.fromLucid(unit.policyId),
          Token.fromLucid(unit.assetName ?? ""),
        );
      }
    } catch (e) {
      throw new Error(`Asset.fromLucid ${hexAsset}:\n${e}`);
    }
  }

  static assertADAlovelace(asset: Asset): void {
    if (Lucid.toHex(asset.currency.symbol) === "") {
      assert(
        asset.token.name === "",
        `ADA must have lovelace, got ${asset.show()}`,
      );
    }
  }

  // static maxLength = 64n;
  // static assertLength(asset: Asset): void {
  //   const ccy = asset.currency.symbol.length * 2;
  //   const tkn = asset.token.name.length;
  //   const ass = ccy + tkn;

  //   assert(
  //     ass <= Asset.maxLength,
  //     `Asset too long: ${asset.show()}, ${ass} = ${ccy} + ${tkn}`,
  //   );
  // }

  static ADA = new Asset(Currency.ADA, Token.lovelace);

  private static generateNonADA = (): Asset => {
    const ccy = PCurrency.ptype.genData();
    const tkn = PToken.ptype.genData();
    return new Asset(ccy, tkn);
  };

  static generate(): Asset {
    return randomChoice([
      () => Asset.ADA,
      Asset.generateNonADA,
    ])();
  }
}

export class PAsset extends PObject<Asset> {
  private constructor() {
    super(
      new PRecord(
        {
          "currency": PCurrency.ptype,
          "token": PToken.ptype,
        },
      ),
      Asset,
    );
  }

  public genData = Asset.generate;

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
  static genPType(): PObject<Asset> {
    return PAsset.ptype;
  }
}
