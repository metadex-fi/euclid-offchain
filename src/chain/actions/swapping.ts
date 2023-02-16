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
import { genPositive, max, min, randomChoice } from "../../utils/generators.ts";
import { User } from "../user.ts";
import { DiracUtxo, ParamUtxo } from "../utxo.ts";

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
    assert(
      boughtAmount > 0n,
      `boughtAmount must be positive, but is ${boughtAmount}`,
    );
    assert(
      soldAmount > 0n,
      `soldAmount must be positive, but is ${soldAmount}`,
    );
    assert(
      boughtSpot > 0n,
      `boughtSpot must be positive, but is ${boughtSpot}`,
    );
    assert(soldSpot > 0n, `soldSpot must be positive, but is ${soldSpot}`);
  }

  public get spendsContractUtxos(): Lucid.UTxO[] {
    return [this.diracUtxo.utxo!];
  }

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    const funds = this.diracUtxo.balance.clone; // TODO cloning probably not required here
    funds.addAmountOf(this.boughtAsset, -this.boughtAmount);
    funds.addAmountOf(this.soldAsset, this.soldAmount);

    const swapRedeemer = PEuclidAction.ptype.pconstant(
      new SwapRedeemer(
        new Swap(
          this.boughtAsset,
          this.soldAsset,
          new BoughtSold(
            this.boughtAmount,
            this.soldAmount,
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
        this.user.contract.address,
        {
          inline: Data.to(datum),
        },
        funds.toLucid,
      );
  };

  private randomSubSwap = (): Swapping => {
    const offerA0 = this.boughtAmount * this.boughtSpot;
    const demandA0 = this.soldAmount * this.soldSpot;
    const maxSwapA0 = min(offerA0, demandA0); // those should be equal if freshly generatee
    const maxBought = maxSwapA0 / this.boughtSpot;
    assert(
      maxBought > 0n,
      `Swapping.randomSubSwap: maxBought must be positive, but is ${maxBought}`,
    );

    const boughtAmount = genPositive(maxBought);
    const price = Number(this.boughtSpot) / Number(this.soldSpot);
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
    console.log(`attempting to swap`);
    const swappings = user.contract!.state!.swappingsFor(user);
    console.log(`\tswappings: ${swappings}`);
    if (swappings.length < 1) return undefined;
    console.log(`Swapping`);
    return randomChoice(swappings).randomSubSwap();
  }
}
