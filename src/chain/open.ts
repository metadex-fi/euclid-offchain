import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Asset,
  Assets,
  Dirac,
  EuclidValue,
  genNonNegative,
  gMaxLength,
  max,
  Param,
  PositiveValue,
} from "../mod.ts";
import { DiracUtxo, ParamUtxo } from "./mod.ts";
import { Pool } from "./pool.ts";
import { User } from "./user.ts";

// complete settings for opening a pool
export class Open {
  constructor(
    private readonly user: User,
    private readonly virtual: PositiveValue,
    private readonly weights: EuclidValue,
    private readonly jumpSizes: EuclidValue,
    private readonly deposit: PositiveValue, // total of all Diracs
    private readonly numTicks: EuclidValue,
  ) {
    // TODO asserts?
  }

  public pool = (): Pool => {
    const param = new Param(
      this.user.paymentKeyHash,
      this.virtual,
      this.weights,
      this.jumpSizes,
    );

    const assets = this.weights.assets;
    const minLowestPrices = param.minLowestPrices;
    const tickSizes = this.jumpSizes.divideBy(this.numTicks);

    const paramNFT = this.user.nextParamNFT;
    const paramUtxo = ParamUtxo.open(param, paramNFT);

    let threadNFT = paramNFT.next();
    let diracs = [
      new Dirac(
        this.user.paymentKeyHash,
        threadNFT,
        paramNFT,
        PositiveValue.normed(minLowestPrices),
      ),
    ];

    // for each asset and for each existing dirac, "spread" that dirac
    // in that asset's dimension. "spread" means: add all other tick
    // offsets for that asset's lowest price.
    assets.forEach((asset) => {
      // if (numJumps.amountOf(asset) === 0n) return;
      const ticks = this.numTicks.amountOf(asset);
      const tickSize = tickSizes.amountOf(asset);
      const diracs_ = new Array<Dirac>();
      diracs.forEach((dirac) => {
        for (let i = 1n; i < ticks; i++) {
          const lowestPrices = dirac.lowestPrices.clone;
          lowestPrices.addAmountOf(
            asset,
            i * tickSize,
          );
          threadNFT = threadNFT.next();
          diracs_.push(
            new Dirac(
              this.user.paymentKeyHash,
              threadNFT,
              paramNFT,
              lowestPrices,
            ),
          );
        }
      });
      diracs = diracs.concat(diracs_);
    });

    // TODO consider checking if balance has assets left over
    const balance = PositiveValue.normed(
      this.deposit.unsigned.divideByScalar(BigInt(diracs.length)),
    );
    const diracUtxos = diracs.map((dirac) => {
      return DiracUtxo.open(param, dirac, balance);
    });

    return Pool.open(
      paramUtxo,
      diracUtxos,
    );
  };

  // splitting it up this way to later use the same class to process actual user input
  static genOfUser = (user: User): Open => {
    assert(user.balance, `user balance not initialized for ${user.address}`);
    assert(user.balance.size, `no assets for ${user.address}`);
    const deposit = user.balance.minSizedSubValue(1n);
    const providedAssets = deposit.assets;
    const emptyAssets = new Assets();
    const assets = providedAssets.clone();
    let numAssets = max(genNonNegative(gMaxLength), 2n) - providedAssets.size;
    while (numAssets > 0n) {
      const asset = Asset.generate();
      if (assets.has(asset)) continue;
      assets.insert(asset);
      emptyAssets.insert(asset);
      numAssets--;
    }
    const emptyVirtual = PositiveValue.genOfAssets(emptyAssets);
    const providedVirtual = PositiveValue.genOfAssets(
      providedAssets.randomSubset(),
    );
    const virtual = emptyVirtual.normedPlus(providedVirtual);
    const weights = EuclidValue.genOfAssets(assets);
    const jumpSizes = EuclidValue.genOfAssets(assets);
    const numTicks = EuclidValue.genOfAssets(assets);

    return new Open(
      user,
      virtual,
      weights,
      jumpSizes,
      deposit,
      numTicks,
    );
  };
}
