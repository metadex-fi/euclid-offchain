import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { abs, genNonNegative, leq, min, randomChoice } from "../../mod.ts";
import {
  Asset,
  Assets,
  CurrencySymbol,
  generateWithin,
  lSubValues,
  newCompareWith,
  newUnionWith,
  Param,
  PConstraint,
  PObject,
  PRecord,
  TokenName,
  Value,
} from "../mod.ts";
import { JumpSizes } from "./jumpSizes.ts";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.ts";

export class Prices {
  constructor(private value: PositiveValue) {
    Prices.assertInitial(this)
  }

  public defaultActiveAsset = (param:Param): Asset => {
    function inner(initPs: Value, currentPs: Value): Asset {
      let branch = "none";
      try {
        const diff = lSubValues(currentPs, initPs);
        switch (diff.size()) {
          case 0n:
            branch = `0n with ${initPs.concise()}`;
            return initPs.firstAsset();
          case 1n:
            branch = `1n with ${diff.concise()}`;
            return diff.firstAsset();
          default: {
            branch = `default with \n${initPs.concise()}\n${currentPs.concise()}`;
            let initTail = initPs.tail();
            let currentTail = currentPs.tail();
            const fstInit = initTail.firstAmount();
            const fstCurrent = currentTail.firstAmount();
            initTail = initTail.scaledWith(fstCurrent);
            currentTail = currentTail.scaledWith(fstInit);
            return inner(
              initTail,
              currentTail,
            );
          }
        }
      } catch (e) {
        throw new Error(
          `defaultActiveAsset(
    initPs: ${initPs.concise()},
    currentPs: ${currentPs.concise()},
    branch: ${branch}
    ): ${e}`,
        );
      }
    }
    return inner(param.initialPrices.unsigned(), this.unsigned());
  }

  public signed = (): PositiveValue => new PositiveValue(this.unsigned());
  public unsigned = (): Value => this.value.unsigned();
  public assets = (): Assets => this.value.assets();
  public unit = (): Value => this.value.unit();
  public concise = (tabs = ""): string => `Prices ${this.value.concise(tabs)}`;
  public show = (tabs = ""): string => `Prices (\n${this.value.show(tabs)}\n)`;
  public size = (): bigint => this.value.size();
  public amountOf = (asset: Asset): bigint => this.value.amountOf(asset);
  public setAmountOf = (asset: Asset, amount: bigint): void =>
    this.value.setAmountOf(asset, amount);
  public clone = (): Prices => new Prices(this.value.clone());
  public addAmountOf = (asset: Asset, amount: bigint): Prices =>
    new Prices(this.value.addAmountOf(asset, amount));
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
  }

  static assertCurrent =
    (param: Param) => (prices: Prices): void => {
      Prices.assertInitial(prices);
      assert(leq(param.lowerPriceBounds.unsigned(), prices.unsigned()), `Prices: ${prices.show()} < ${param.lowerPriceBounds.show()}`);
      assert(leq(prices.unsigned(), param.upperPriceBounds.unsigned()), `Prices: ${prices.show()} > ${param.upperPriceBounds.show()}`);
    };

  static generateInitial(): Prices {
    const assets = Assets.generate(2n);
    const value = PositiveValue.genOfAssets(assets);
    return new Prices(value);
  }

  static generateCurrent =
    (param: Param) => (): Prices => {
      return Prices.fromValue(generateWithin(param.lowerPriceBounds.unsigned(), param.upperPriceBounds.unsigned()));
    }
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
        param
          ? Prices.assertCurrent(param)
          : Prices.assertInitial,
      ],
      param
        ? Prices.generateCurrent(param)
        : Prices.generateInitial,
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
