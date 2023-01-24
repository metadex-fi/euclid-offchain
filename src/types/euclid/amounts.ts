import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Asset,
  Assets,
  IdNFT,
  mulValues_,
  Param,
  PObject,
  PRecord,
  Value,
} from "../mod.ts";
import { Prices } from "./prices.ts";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.ts";
import { Lucid } from "../../../lucid.mod.ts";

export class Amounts {
  constructor(
    private value: PositiveValue,
  ) {}

  public unsigned = (): Value => this.value.unsigned();
  public concise = (tabs = ""): string => `Amounts ${this.value.concise(tabs)}`;
  public size = (): bigint => this.value.size();
  public assets = (): Assets => this.value.assets();
  public firstAsset = (): Asset => this.value.firstAsset();
  public firstAmount = (): bigint => this.value.firstAmount();
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public popIdNFT = (nft: IdNFT) => this.value.popIdNFT(nft);
  public smallestAmount = (): bigint => this.value.smallestAmount();
  public increaseAmountOf = (asset: Asset, amount: bigint): void =>
    this.value.increaseAmountOf(asset, amount);
  public addAmountOf = (asset: Asset, amount: bigint): void =>
    this.value.addAmountOf(asset, amount);
  public clone = (): Amounts => new Amounts(this.value.clone());
  public initAmountOf = (asset: Asset, amount: bigint): void =>
    this.value.initAmountOf(asset, amount);

  public minSizedSubAmounts = (minSize: bigint): Amounts => {
    return new Amounts(this.value.minSizedSubValue(minSize));
  };

  public equivalentA0 = (prices: PositiveValue): bigint => {
    return mulValues_(this.unsigned(), prices.unsigned()).sumAmounts();
  };

  public toLucid = (): Lucid.Assets => {
    const assets: Lucid.Assets = {};
    this.assets().forEach((asset) => {
      assets[asset.toLucid()] = this.amountOf(asset);
    });
    return assets;
  };

  static fromLucid(assets: Lucid.Assets): Amounts {
    try {
      const value = new Value();
      Object.entries(assets).forEach(([name, amount]) => {
        const asset = Asset.fromLucid(name);
        value.initAmountOf(asset, amount);
      });
      return new Amounts(new PositiveValue(value));
    } catch (e) {
      throw new Error(
        `Amounts.fromLucid ${
          Object.entries(assets).map(([ass, amnt]) => `${ass}: ${amnt}\n`)
        }:${e}`,
      );
    }
  }

  static empty = (): Amounts => new Amounts(new PositiveValue());

  static fresh(param: Param, prices: Prices): Amounts {
    const activeAsset = prices.defaultActiveAsset(param.initialPrices);
    const amount = param.baseAmountA0 / prices.amountOf(activeAsset); // as in onchain
    assert(
      amount > 0n,
      `Amounts.fresh: amount ${amount} <= 0 with ${param.concise()} and ${prices.concise()}}`,
    );
    const amounts = new PositiveValue();
    amounts.initAmountOf(activeAsset, amount);
    return new Amounts(amounts);
  }

  // static generateUsed = (param: Param) => (prices: Prices): Amounts => {
  //   assert(
  //     prices.size() >= 2n,
  //     `genAmounts: less than two assets in ${prices.concise()}`,
  //   );
  //   const assets = prices.assets();
  //   const A1 = assets.head();
  //   const p1 = prices.amountOf(A1);
  //   let netWorth = param.baseAmountA0;
  //   const amounts = new PositiveValue();

  //   for (const asset of assets.tail().toList()) {
  //     const p = prices.amountOf(asset);
  //     const received = genNonNegative(netWorth / p);
  //     const spent = received * p;
  //     if (received <= maxInteger && received > 0n && spent > 0n) {
  //       netWorth -= spent;
  //       amounts.initAmountOf(asset, received);
  //     }
  //   }
  //   const amountA1 = netWorth / p1;
  //   netWorth % p1 === 0n ? 0n : 1n;
  //   if (amountA1 > 0n) amounts.initAmountOf(A1, amountA1);
  //   return new Amounts(amounts);
  // };

  static genOfAssets(assets: Assets): Amounts {
    return new Amounts(
      PositiveValue.genOfAssets(assets),
    );
  }
}

export class PAmounts extends PObject<Amounts> {
  private constructor() {
    super(
      new PRecord({
        value: new PPositiveValue(),
      }),
      Amounts,
    );
    // this.population = 1; //probably far too conservative, but nonissue
  }

  static ptype = new PAmounts();
  static genPType(): PObject<Amounts> {
    return PAmounts.ptype;
  }
}
