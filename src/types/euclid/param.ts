import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { abs, gMaxHashes, maxInteger, min, Prices, User } from "../../mod.ts";
import {
  Amount,
  Amounts,
  boundPositive,
  f,
  JumpSizes,
  lSubValues_,
  newUnionWith,
  PByteString,
  PConstraint,
  PObject,
  PositiveValue,
  PPositive,
  PPositiveValue,
  PPrices,
  PRecord,
  t,
  Value,
} from "../mod.ts";
import { PJumpSizes } from "./jumpSizes.ts";
import { PPaymentKeyHash } from "./owner.ts";

// TODO a flag somewhere to deactivate it, so owner can start closing.
// or can we just "break" it?

const gMaxJumps = 3n;

export class Param {
  constructor(
    public owner: PaymentKeyHash,
    public jumpSizes: JumpSizes,
    public initialPrices: Prices,
    public lowerPriceBounds: PositiveValue,
    public upperPriceBounds: PositiveValue,
    public baseAmountA0: Amount,
  ) {
    const assets = jumpSizes.assets();
    this.lowerPriceBounds = this.lowerPriceBounds.fill(assets, 1n);
    Param.assert(this);
  }

  public concise = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Param(
${ttf}owner: ${this.owner}, 
${ttf}jumpSizes: ${this.jumpSizes.concise(ttf)}, 
${ttf}initialPrices: ${this.initialPrices.concise(ttf)}, 
${ttf}lowerPriceBounds: ${this.lowerPriceBounds.concise(ttf)}, 
${ttf}upperPriceBounds: ${this.upperPriceBounds.concise(ttf)}, 
${ttf}baseAmountA0: ${this.baseAmountA0}
${tt})`;
  };

  private maxJumpsFromTo = (
    from: PositiveValue,
    to: PositiveValue,
    maxJumps = gMaxJumps,
  ): Value => {
    // jump the price of each asset from initial price,
    // a random number of times,
    // with the respective jump size,
    // while respecting the bounds
    const maxSingleAsset = (
      from: bigint,
      to: bigint,
      jumpSize: bigint,
    ): bigint =>
      // jumpSize === 0n ? 0n :
      min(
        maxJumps,
        abs(from - to) / jumpSize,
      );
    const maxAllAssets = newUnionWith(maxSingleAsset);
    return maxAllAssets(
      from.unsigned(),
      to.unsigned(),
      this.jumpSizes.unsigned(),
    );
  };

  public filledLowerBounds = (): PositiveValue => {
    return this.lowerPriceBounds.fill(this.initialPrices.assets(), 1n);
  };

  public maxJumps = (): Value => {
    const lowerBounds = this.filledLowerBounds();
    return this.maxJumpsFromTo(
      lowerBounds,
      this.upperPriceBounds,
      maxInteger,
    );
  };

  // i.e. in case of tickSizes >= jumpSizes
  public minDiracs = (): bigint => {
    return this.maxJumps().increment().mulAmounts();
  };

  public boundedMinDiracs = (): bigint => {
    return min(gMaxHashes, this.minDiracs());
  };

  static assert(param: Param): void {
    const assets = param.jumpSizes.assets();
    assert(
      param.lowerPriceBounds.assets().equals(assets),
      `assets must match, got ${param.lowerPriceBounds.concise()}, expected ${assets.show()}`,
    );
    assert(
      param.upperPriceBounds.assets().equals(assets),
      `assets must match, got ${param.upperPriceBounds.concise()}, expected ${assets.show()}`,
    );
    // TODO assert leq, and more
  }

  static assertForUser = (user: User) => (param: Param): void => {
    Param.assert(param);
    assert(
      user.address === param.owner,
      `owner must match, got ${param.owner}, expected ${user.address}`,
    );
  };

  static generate(): Param {
    const owner = PPaymentKeyHash.genData();

    const initialPrices = Prices.generateInitial();
    const assets = initialPrices.assets();
    const jumpSizes = JumpSizes.genOfAssets(assets);

    const upperBounds = PositiveValue.genOfAssets(assets);
    const lowerBounds = upperBounds.minSizedSubValue(0n);

    const baseAmountA0 = new PPositive().genData();

    return new Param(
      owner,
      jumpSizes,
      initialPrices,
      lowerBounds,
      upperBounds,
      baseAmountA0,
    );
  }

  static generateForUser(user: User): [Param, Amounts] {
    assert(user.balance, `user balance not initialized for ${user.address}`);
    assert(
      user.balance.size() >= 2,
      `balance must be at least 2, got ${user.balance.concise()}`,
    );
    const deposit = user.balance.minSizedSubAmounts(2n);
    const assets = deposit.assets();

    const initialPrices = Prices.genOfAssets(assets);
    const jumpSizes = JumpSizes.genOfAssets(assets);
    const upperBounds = PositiveValue.genOfAssets(assets);
    const lowerBounds = upperBounds.minSizedSubValue(0n);
    const param = new Param(
      user.address,
      jumpSizes,
      initialPrices,
      lowerBounds,
      upperBounds,
      1n,
    );
    let minDiracs = param.minDiracs();
    while (minDiracs > deposit.lowest()) {
      param.jumpSizes.doubleRandom();
      minDiracs = param.minDiracs();
    }
    param.baseAmountA0 = min(
      maxInteger, // TODO
      deposit.equivalentA0(param.filledLowerBounds()) /
        minDiracs,
    );
    return [param, deposit];
  }
}
export class PParam extends PConstraint<PObject<Param>> {
  private constructor() {
    super(
      new PObject(
        new PRecord({
          "owner": new PByteString(1n),
          "jumpSizes": PJumpSizes.ptype,
          "initialPrices": PPrices.initial(),
          "lowerPriceBounds": new PPositiveValue(),
          "upperPriceBounds": new PPositiveValue(),
          "baseAmountA0": new PPositive(),
        }),
        Param,
      ),
      [Param.assert],
      Param.generate,
    );
  }

  static ptype = new PParam();
  static genPType(): PConstraint<PObject<Param>> {
    return PParam.ptype;
  }
}

export class ParamDatum {
  constructor(
    public readonly _0: Param,
  ) {}
}
export class PParamDatum extends PObject<ParamDatum> {
  private constructor(
    public readonly pparam: PParam,
  ) {
    super(
      new PRecord({
        "_0": pparam,
      }),
      ParamDatum,
    );
  }

  static ptype = new PParamDatum(PParam.ptype);
  static genPType(): PObject<ParamDatum> {
    return PParamDatum.ptype;
  }
}
