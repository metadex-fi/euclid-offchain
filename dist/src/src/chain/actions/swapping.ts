import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../lucid.mod.js";
import { BoughtSold } from "../../types/euclid/boughtSold.js";
import {
  PEuclidAction,
  SwapRedeemer,
} from "../../types/euclid/euclidAction.js";
import { DiracDatum } from "../../types/euclid/euclidDatum.js";
import { Swap } from "../../types/euclid/swap.js";
import { Asset } from "../../types/general/derived/asset/asset.js";
import { PositiveValue } from "../../types/general/derived/value/positiveValue.js";
import { Data } from "../../types/general/fundamental/type.js";
import {
  genPositive,
  maxInteger,
  min,
  randomChoice,
} from "../../utils/generators.js";
import { User } from "../user.js";
import { DiracUtxo, ParamUtxo } from "../utxo.js";

export class Swapping {
  private constructor(
    private readonly user: User,
    private readonly paramUtxo: ParamUtxo,
    private readonly diracUtxo: DiracUtxo,
    private readonly boughtAsset: Asset,
    private readonly soldAsset: Asset,
    private readonly boughtAmount: bigint,
    private readonly soldAmount: bigint,
    private readonly boughtSpot: bigint,
    private readonly soldSpot: bigint,
  ) {
    assert(boughtAmount > 0n, `boughtAmount must be positive`);
    assert(soldAmount > 0n, `soldAmount must be positive`);
    assert(boughtSpot > 0n, `boughtSpot must be positive`);
    assert(soldSpot > 0n, `soldSpot must be positive`);
  }

  public get type(): string {
    return "Swapping";
  }

  public show = (): string => {
    return `Swapping (
  paramUtxo: ${this.paramUtxo.show()}
  diracUtxo: ${this.diracUtxo.show()}
  boughtAsset: ${this.boughtAsset.show()}
  soldAsset: ${this.soldAsset.show()}
  boughtAmount: ${this.boughtAmount}
  soldAmount: ${this.soldAmount}
  boughtSpot: ${this.boughtSpot}
  soldSpot: ${this.soldSpot}
)`;
  };

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    console.log(this.show());
    const funds = this.diracUtxo.balance.clone; // TODO cloning probably not required here
    funds.addAmountOf(this.boughtAsset, -this.boughtAmount);
    funds.addAmountOf(this.soldAsset, this.soldAmount);
    const retour = funds.toLucid;
    retour[this.diracUtxo.dirac.threadNFT.toLucid] = 1n;

    const swapRedeemer = PEuclidAction.ptype.pconstant(
      new SwapRedeemer(
        new Swap(
          this.boughtAsset,
          this.soldAsset,
          new BoughtSold(
            this.boughtSpot,
            this.soldSpot,
          ),
        ),
      ),
    );

    const datum = this.diracUtxo.peuclidDatum.pconstant(
      new DiracDatum(this.diracUtxo.dirac),
    );

    console.log(PositiveValue.fromLucid(this.diracUtxo.utxo!.assets).concise());
    console.log(PositiveValue.fromLucid(retour).concise());
    console.log(this.diracUtxo.utxo!.assets);
    console.log(retour);

    return tx
      .readFrom([this.paramUtxo.utxo!])
      .collectFrom(
        [this.diracUtxo.utxo!],
        Data.to(swapRedeemer),
      )
      .payToContract(
        this.user.contract.address,
        {
          inline: Data.to(datum),
        },
        retour,
      );
  };

  private randomSubSwap = (): Swapping => {
    const offerA0 = this.boughtAmount * this.soldSpot;
    const demandA0 = this.soldAmount * this.boughtSpot;
    const maxSwapA0 = min(offerA0, demandA0); // those should be equal if freshly generated
    const maxBought = maxSwapA0 / this.soldSpot;
    assert(
      maxBought > 0n,
      `Swapping.randomSubSwap: maxBought must be positive, but is ${maxBought} for ${this.show()}`,
    );

    const boughtAmount = genPositive(maxBought);
    const price = Number(this.soldSpot) / Number(this.boughtSpot);
    const soldAmount = BigInt(Math.ceil(Number(boughtAmount) * price));

    return new Swapping(
      this.user,
      this.paramUtxo,
      this.diracUtxo,
      this.boughtAsset,
      this.soldAsset,
      boughtAmount,
      soldAmount,
      this.boughtSpot,
      this.soldSpot,
    );
  };

  static boundary(
    user: User,
    paramUtxo: ParamUtxo,
    diracUtxo: DiracUtxo,
    boughtAsset: Asset,
    soldAsset: Asset,
    boughtAmount: bigint,
    soldAmount: bigint,
    boughtSpot: bigint,
    soldSpot: bigint,
  ): Swapping {
    return new Swapping(
      user,
      paramUtxo,
      diracUtxo,
      boughtAsset,
      soldAsset,
      boughtAmount,
      soldAmount,
      boughtSpot,
      soldSpot,
    );
  }

  // TODO don't forget to update (poll) chain state somewhere beforehand
  static genOfUser(user: User): Swapping | undefined {
    // console.log(`attempting to swap`);
    const swappings = user.contract!.state!.swappingsFor(user);
    // console.log(`\tswappings: ${swappings}`);
    if (swappings.length < 1) return undefined;
    // console.log(`Swapping`);
    return randomChoice(swappings).randomSubSwap();
  }

  private static pricesFitDirac(
    spotBuying: bigint,
    spotSelling: bigint,
    buyingLowest: bigint,
    sellingLowest: bigint,
    buyingJumpSize: bigint,
    sellingJumpSize: bigint,
  ): boolean {
    const fitBuying = (spotBuying - buyingLowest) % buyingJumpSize === 0n;
    const fitSelling = (spotSelling - sellingLowest) % sellingJumpSize === 0n;
    if (!fitBuying) {
      console.log(
        `pricesFitDirac: 
        buying ${spotBuying} 
        not fit for ${buyingLowest} 
        with jump ${buyingJumpSize}`,
      );
    }
    if (!fitSelling) {
      console.log(
        `pricesFitDirac:
        selling ${spotSelling}
        not fit for ${sellingLowest}
        with jump ${sellingJumpSize}`,
      );
    }
    return fitBuying && fitSelling;
  }

  private static boughtAssetForSale(
    spotBuying: bigint,
    spotSelling: bigint,
    buyingAmm: bigint,
    sellingAmm: bigint,
    oldNew: string,
  ): boolean {
    const fitsBuying = spotBuying <= buyingAmm;
    const fitsSelling = sellingAmm <= spotSelling;
    if (!fitsBuying) {
      console.log(
        `boughtAssetForSale (${oldNew}): 
        buyingAmm ${buyingAmm} > 
        spotBuying ${spotBuying}`,
      );
    }
    if (!fitsSelling) {
      console.log(
        `boughtAssetForSale (${oldNew}):
        sellingAmm ${sellingAmm} < 
        spotSelling ${spotSelling}`,
      );
    }
    return fitsBuying && fitsSelling;
  }

  private static valueEquation(
    spotBuying: bigint,
    spotSelling: bigint,
    buyingAmount: bigint,
    sellingAmount: bigint,
  ): boolean {
    const addedBuyingA0 = buyingAmount * spotSelling;
    const addedSellingA0 = sellingAmount * spotBuying;
    if (addedBuyingA0 > addedSellingA0) {
      console.log(
        `valueEquation: 
        addedBuyingA0 ${addedBuyingA0} > 
        addedSellingA0 ${addedSellingA0}`,
      );
    }
    return addedBuyingA0 <= addedSellingA0;
  }

  static validates(
    spotBuying: bigint,
    spotSelling: bigint,
    buyingLowest: bigint,
    sellingLowest: bigint,
    buyingJumpSize: bigint,
    sellingJumpSize: bigint,
    buyingWeight: bigint,
    sellingWeight: bigint,
    buyingLiquidity: bigint,
    sellingLiquidity: bigint,
    buyingAmount: bigint,
    sellingAmount: bigint,
  ): boolean {
    const oldBuyingAmm = buyingWeight * buyingLiquidity;
    const oldSellingAmm = sellingWeight * sellingLiquidity;

    const newBuyingAmm = buyingWeight * (buyingLiquidity - buyingAmount);
    const newSellingAmm = sellingWeight * (sellingLiquidity + sellingAmount);

    return Swapping.pricesFitDirac(
      spotBuying,
      spotSelling,
      buyingLowest,
      sellingLowest,
      buyingJumpSize,
      sellingJumpSize,
    ) &&
      Swapping.boughtAssetForSale(
        spotBuying,
        spotSelling,
        oldBuyingAmm,
        oldSellingAmm,
        "old",
      ) &&
      Swapping.boughtAssetForSale(
        spotBuying,
        spotSelling,
        newBuyingAmm,
        newSellingAmm,
        "new",
      ) &&
      Swapping.valueEquation(
        spotBuying,
        spotSelling,
        buyingAmount,
        sellingAmount,
      );
    // TODO othersUnchanged
  }
}
