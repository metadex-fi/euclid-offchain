import { Lucid } from "../../../lucid.mod.ts";
import { Dirac } from "../../types/euclid/dirac.ts";
import { EuclidValue } from "../../types/euclid/euclidValue.ts";
import { Param } from "../../types/euclid/param.ts";
import { Asset } from "../../types/general/derived/asset/asset.ts";
import { Assets } from "../../types/general/derived/asset/assets.ts";
import { PositiveValue } from "../../types/general/derived/value/positiveValue.ts";
import { genNonNegative, gMaxLength, max } from "../../utils/generators.ts";
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

  public get spendsContractUtxos(): Lucid.UTxO[] {
    return [];
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
      return DiracUtxo.open(this.param, dirac, balance);
    });

    return Pool.open(
      paramUtxo,
      diracUtxos,
    );
  };

  // splitting it up this way to later use the same class to process actual user input
  static genOfUser = (user: User): Opening | undefined => {
    console.log(`attempting to open`);
    const balance = user.availableBalance;
    if (balance.size < 1) return undefined;
    const maxAssets = 5n;
    const deposit = balance.boundedSubValue(1n, maxAssets);
    console.log("deposit", deposit.concise());
    const providedAssets = deposit.assets;
    const emptyAssets = new Assets();
    const assets = providedAssets.clone;
    let addAssets = max(genNonNegative(maxAssets), 2n) - providedAssets.size;
    while (addAssets > 0n) {
      const asset = Asset.generate();
      if (assets.has(asset)) continue;
      assets.insert(asset);
      emptyAssets.insert(asset);
      addAssets--;
    }

    const param = Param.genOf(user.paymentKeyHash, assets);
    const minTicks = 1n;
    const maxTicks = gMaxLength;
    const numTicks = EuclidValue.genBelow(
      param.jumpSizes.bounded(minTicks + 1n, maxTicks + 1n),
    );

    console.log(`numDiracs: ${numTicks.unsigned.mulAmounts()}`);
    console.log(numTicks.concise());
    // NOTE 27 diracs slightly exceeds the max tx size (17444 vs. 16384)
    // TODO consider splitting up the tx
    console.log(`Opening`);
    return new Opening(
      user,
      param,
      deposit,
      numTicks,
    );
  };
}
