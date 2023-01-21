import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { leq, randomChoice } from "../../mod.ts";
import {
  Asset,
  Assets,
  CurrencySymbol,
  generateWithin,
  lSubValues,
  Param,
  PConstraint,
  PObject,
  PRecord,
  TokenName,
  Value,
} from "../mod.ts";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.ts";

export class Prices {
  constructor(private value: PositiveValue) {
    Prices.assertInitial(this);
  }

  public defaultActiveAsset = (initialPrices: Prices): Asset => {
    function inner(initPs: Value, currentPs: Value): Asset {
      const initNorm = initPs.tail().scaledWith(currentPs.firstAmount());
      const currentNorm = currentPs.tail().scaledWith(initPs.firstAmount());
      const diff = lSubValues(initNorm, currentNorm);
      switch (diff.size()) {
        case 0n:
          return initPs.firstAsset();
        case 1n:
          return diff.firstAsset();
        default: {
          return inner(
            initNorm,
            currentNorm,
          );
        }
      }
    }
    return inner(initialPrices.unsigned(), this.unsigned());
  };

  public signed = (): PositiveValue => new PositiveValue(this.unsigned());
  public unsigned = (): Value => this.value.unsigned();
  public assets = (): Assets => this.value.assets();
  public unit = (): Value => this.value.unit();
  public zeroed = (): Value => this.value.zeroed();
  public concise = (tabs = ""): string => `Prices ${this.value.concise(tabs)}`;
  public show = (tabs = ""): string => `Prices (\n${this.value.show(tabs)}\n)`;
  public size = (): bigint => this.value.size();
  public firstAmount = (): bigint => this.value.firstAmount();
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public setAmountOf = (asset: Asset, amount: bigint): void =>
    this.value.setAmountOf(asset, amount);
  public clone = (): Prices => new Prices(this.value.clone());
  public toMap = (): Map<CurrencySymbol, Map<TokenName, bigint>> =>
    this.value.toMap();

  static fromValue = (prices: Value): Prices => {
    return new Prices(new PositiveValue(prices));
  };
  static fromMap = (
    prices: Map<CurrencySymbol, Map<TokenName, bigint>>,
  ): Prices => {
    return Prices.fromValue(new Value(prices));
  };

  static assertInitial = (prices: Prices): void => {
    assert(
      prices.size() >= 2n,
      `Prices: less than two assets in ${prices.show()}`,
    );
  };

  static assertCurrent = (param: Param) => (prices: Prices): void => {
    Prices.assertInitial(prices);
    assert(
      leq(param.lowerPriceBounds.unsigned(), prices.unsigned()),
      `exceeding lowerPriceBounds: ${prices.show()} < ${param.lowerPriceBounds.show()}`,
    );
    assert(
      leq(prices.unsigned(), param.upperPriceBounds.unsigned()),
      `exceeding upperPriceBounds: ${prices.show()} > ${param.upperPriceBounds.show()}`,
    );
  };

  static genOfAssets = (assets: Assets): Prices => {
    assert(
      assets.size() >= 2n,
      `Prices: less than two assets in ${assets.show()}`,
    );
    const value = PositiveValue.genOfAssets(assets);
    return new Prices(value);
  };

  static generateInitial(): Prices {
    const assets = Assets.generate(2n);
    return Prices.genOfAssets(assets);
  }

  static generateCurrent = (param: Param) => (): Prices => {
    return Prices.fromValue(
      generateWithin(
        param.filledLowerBounds().unsigned(),
        param.upperPriceBounds.unsigned(),
      ),
    );
  };
}

export class PPrices extends PConstraint<PObject<Prices>> {
  private constructor(
    public readonly param?: Param,
  ) {
    super(
      new PObject(
        new PRecord({
          value: new PPositiveValue(),
        }),
        Prices,
      ),
      [
        param ? Prices.assertCurrent(param) : Prices.assertInitial,
      ],
      param ? Prices.generateCurrent(param) : Prices.generateInitial,
    );
  }

  static initial(): PPrices {
    return new PPrices();
  }

  static current(param: Param): PPrices {
    return new PPrices(param);
  }

  static genPType(): PConstraint<PObject<Prices>> {
    return randomChoice([
      PPrices.initial,
      () => {
        const param = Param.generate();
        return PPrices.current(param);
      },
    ])();
  }
}
