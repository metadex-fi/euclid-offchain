import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
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
} from "../../mod.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";

// complete settings for opening a pool
export class Opening {
  private constructor(
    private readonly user: User,
    private readonly param: Param,
    private readonly deposit: PositiveValue, // total of all Diracs
    private readonly numTicks: EuclidValue,
  ) {
    // TODO asserts?
  }

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    return this.pool().openingTx(tx, this.user.contract);
  };

  private pool = (): Pool => {
    const assets = this.param.weights.assets;
    const minLowestPrices = this.param.minLowestPrices;
    const tickSizes = this.param.jumpSizes.divideBy(this.numTicks);

    const paramNFT = this.user.nextParamNFT;
    const paramUtxo = ParamUtxo.open(this.param, paramNFT);

    console.log(minLowestPrices.concise());
    console.log(PositiveValue.normed(minLowestPrices).concise());
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
          console.log(lowestPrices.concise());
          console.log(i * tickSize);
          lowestPrices.addAmountOf(
            asset,
            i * tickSize,
          );
          console.log(lowestPrices.concise());
          threadNFT = threadNFT.next();
          diracs_.push(
            new Dirac(
              this.user.paymentKeyHash,
              threadNFT,
              paramNFT,
              lowestPrices,
            ),
          );
          console.log("--------");
        }
      });
      diracs = diracs.concat(diracs_);
    });

    // TODO consider checking if balance has assets left over
    const balance = PositiveValue.normed(
      this.deposit.unsigned.divideByScalar(BigInt(diracs.length)),
    );
    const diracUtxos = diracs.map((dirac) => {
      return DiracUtxo.open(this.param, dirac, balance);
    });

    return Pool.open(
      paramUtxo,
      diracUtxos,
    );
  };

  // splitting it up this way to later use the same class to process actual user input
  static genOfUser = (user: User): Opening | undefined => {
    if (user.balance === undefined || user.balance.size < 1) return undefined;
    const deposit = user.balance.minSizedSubValue(1n);
    const providedAssets = deposit.assets;
    const emptyAssets = new Assets();
    const assets = providedAssets.clone;
    let numAssets = max(genNonNegative(gMaxLength), 2n) - providedAssets.size;
    while (numAssets > 0n) {
      const asset = Asset.generate();
      if (assets.has(asset)) continue;
      assets.insert(asset);
      emptyAssets.insert(asset);
      numAssets--;
    }

    const param = Param.genOf(user.paymentKeyHash, assets);
    const minTicks = 1n;
    const maxTicks = 5n;
    const numTicks = EuclidValue.genBelow(
      param.jumpSizes.bounded(minTicks + 1n, maxTicks + 1n),
    );

    return new Opening(
      user,
      param,
      deposit,
      numTicks,
    );
  };
}
