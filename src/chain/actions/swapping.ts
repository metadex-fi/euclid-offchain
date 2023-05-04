import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { BoughtSold } from "../../types/euclid/boughtSold.ts";
import {
  PEuclidAction,
  SwapRedeemer,
} from "../../types/euclid/euclidAction.ts";
import { DiracDatum } from "../../types/euclid/euclidDatum.ts";
import { Swap } from "../../types/euclid/swap.ts";
import { Asset } from "../../types/general/derived/asset/asset.ts";
import { Data } from "../../types/general/fundamental/type.ts";
import { genPositive, min, randomChoice } from "../../utils/generators.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";
import { Value } from "../../types/general/derived/value/value.ts";

export class Swapping {
  public readonly spotPrice: number; // uninverted
  public readonly effectivePrice: number; // uninverted
  public previous?: Swapping;
  public subsequent?: Swapping;

  private constructor(
    public readonly user: User | undefined,
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxo: DiracUtxo,
    public readonly boughtAsset: Asset,
    public readonly soldAsset: Asset,
    public readonly boughtAmount: bigint,
    public readonly soldAmount: bigint,
    public readonly boughtSpot: bigint, // inverted
    public readonly soldSpot: bigint, // inverted
    public readonly boughtExp: bigint,
    public readonly soldExp: bigint,
  ) {
    assert(boughtAmount > 0n, `boughtAmount must be positive`);
    assert(soldAmount > 0n, `soldAmount must be positive`);
    // assert(boughtAmount >= 0n, `boughtAmount must be nonnegative`);
    // assert(soldAmount >= 0n, `soldAmount must be nonnegative`);
    assert(boughtSpot > 0n, `boughtSpot must be positive`);
    assert(soldSpot > 0n, `soldSpot must be positive`);

    this.spotPrice = Number(soldSpot) / Number(boughtSpot);
    this.effectivePrice = Number(soldAmount) / Number(boughtAmount);
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
  boughtExp: ${this.boughtExp}
  soldExp: ${this.soldExp}
  spotPrice: ${this.spotPrice}
  effectivePrice: ${this.effectivePrice}
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
            this.boughtExp,
            this.soldExp,
          ),
        ),
      ),
    );

    const datum = this.diracUtxo.peuclidDatum.pconstant(
      new DiracDatum(this.diracUtxo.dirac),
    );

    return tx
      .readFrom([this.paramUtxo.utxo!])
      .collectFrom(
        [this.diracUtxo.utxo!],
        Data.to(swapRedeemer),
      )
      .payToContract(
        this.user!.contract.address,
        {
          inline: Data.to(datum),
        },
        retour,
      );
  };

  public subsequents = (maxSubsequents?: number): Swapping[] => {
    const swappings: Swapping[] = [this];
    let previous = swappings[0];
    let sellableAmount = this.user
      ? this.user.balance!.amountOf(this.soldAsset) -
        this.soldAmount
      : -1n;
    let diracUtxo = this.diracUtxo.applySwapping(this);

    while (sellableAmount != 0n) {
      if (maxSubsequents && swappings.length >= maxSubsequents) break;

      const subsequents = diracUtxo.swappingsFor(
        this.user,
        this.paramUtxo,
        Value.singleton(this.soldAsset, sellableAmount),
        this.boughtAsset,
      );
      if (subsequents.length === 0) break;
      assert(
        subsequents.length === 1,
        `subsequents.length must be 1, but got:\n${
          subsequents.map((s) => s.show()).join("\n")
        }`,
      );

      const swapping = subsequents[0];
      if (sellableAmount > 0) {
        sellableAmount -= swapping.soldAmount;
        assert(sellableAmount >= 0n, `sold too much: ${swapping.show()}`);
      }
      diracUtxo = diracUtxo.applySwapping(swapping);

      previous.subsequent = swapping;
      swapping.previous = previous;
      previous = swapping;
      swappings.push(swapping);
    }

    return swappings;
  };

  public subSwap = (
    amount: bigint,
    amntIsSold: boolean,
  ): Swapping | undefined => {
    const offerA0 = (amntIsSold ? this.boughtAmount : amount) * this.soldSpot;
    const demandA0 = (amntIsSold ? amount : this.soldAmount) * this.boughtSpot;
    const swapA0 = min(offerA0, demandA0);
    const boughtAmount = swapA0 / this.soldSpot;
    if (!boughtAmount) return undefined;
    const soldAmount = BigInt(Math.ceil(Number(boughtAmount) * this.spotPrice));

    assert(
      soldAmount <= this.soldAmount,
      `soldAmount cannot increase: ${soldAmount} > ${this.soldAmount}`,
    );
    assert(
      boughtAmount <= this.boughtAmount,
      `boughtAmount cannot increase: ${boughtAmount} > ${this.boughtAmount}`,
    );

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
      this.boughtExp,
      this.soldExp,
    );
  };

  // TODO should this rather be using subSwap for consistency?
  private randomSubSwap = (): Swapping => {
    const offerA0 = this.boughtAmount * this.soldSpot;
    const demandA0 = this.soldAmount * this.boughtSpot;
    const maxSwapA0 = min(offerA0, demandA0);
    const maxBought = maxSwapA0 / this.soldSpot;
    assert(
      maxBought > 0n,
      `Swapping.randomSubSwap: maxBought must be positive, but is ${maxBought} for ${this.show()}`,
    );
    // assert(
    //   maxBought >= 0n,
    //   `Swapping.randomSubSwap: maxBought must be nonnegative, but is ${maxBought} for ${this.show()}`,
    // );

    const boughtAmount = genPositive(maxBought);
    const soldAmount = BigInt(Math.ceil(Number(boughtAmount) * this.spotPrice));

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
      this.boughtExp,
      this.soldExp,
    );
  };

  static boundary(
    user: User | undefined,
    paramUtxo: ParamUtxo,
    diracUtxo: DiracUtxo,
    boughtAsset: Asset,
    soldAsset: Asset,
    boughtAmount: bigint,
    soldAmount: bigint,
    boughtSpot: bigint,
    soldSpot: bigint,
    boughtExp: bigint,
    soldExp: bigint,
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
      boughtExp,
      soldExp,
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

  // private static pricesFitDirac(
  //   spotBuying: bigint,
  //   spotSelling: bigint,
  //   buyingLowest: bigint,
  //   sellingLowest: bigint,
  //   buyingJumpSize: bigint,
  //   sellingJumpSize: bigint,
  // ): boolean {
  //   const fitBuying = (spotBuying - buyingLowest) % buyingJumpSize === 0n;
  //   const fitSelling = (spotSelling - sellingLowest) % sellingJumpSize === 0n;
  //   if (!fitBuying) {
  //     console.log(
  //       `pricesFitDirac:
  //       buying ${spotBuying}
  //       not fit for ${buyingLowest}
  //       with jump ${buyingJumpSize}`,
  //     );
  //   }
  //   if (!fitSelling) {
  //     console.log(
  //       `pricesFitDirac:
  //       selling ${spotSelling}
  //       not fit for ${sellingLowest}
  //       with jump ${sellingJumpSize}`,
  //     );
  //   }
  //   return fitBuying && fitSelling;
  // }

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
      console.error(
        `boughtAssetForSale (${oldNew}): 
        buyingAmm ${buyingAmm} > 
        spotBuying ${spotBuying}`,
      );
    }
    if (!fitsSelling) {
      console.error(
        `boughtAssetForSale (${oldNew}):
        sellingAmm ${sellingAmm} > 
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
      console.error(
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
    // buyingLowest: bigint,
    // sellingLowest: bigint,
    // buyingJumpSize: bigint,
    // sellingJumpSize: bigint,
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

    return true && // TODO check that exponents and spot prices fit together, either here or in constructor
      // Swapping.pricesFitDirac(
      //   spotBuying,
      //   spotSelling,
      //   buyingLowest,
      //   sellingLowest,
      //   buyingJumpSize,
      //   sellingJumpSize,
      // ) &&
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
