import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { BoughtSold } from "../../types/euclid/boughtSold.ts";
import {
  PSwapRedeemer,
  SwapRedeemer,
} from "../../types/euclid/euclidAction.ts";
import { Swap } from "../../types/euclid/swap.ts";
import { Asset } from "../../types/general/derived/asset/asset.ts";
import { Data } from "../../types/general/fundamental/type.ts";
import { genPositive, randomChoice } from "../../utils/generators.ts";
import { User } from "../user.ts";
import { DiracUtxo } from "../utxo.ts";

export class Swapping {
  private constructor(
    private readonly user: User,
    private readonly diracUtxo: DiracUtxo,
    private readonly boughtAsset: Asset,
    private readonly soldAsset: Asset,
    private readonly boughtAmount: bigint,
    private readonly soldAmount: bigint,
    private readonly boughtSpot: bigint,
    private readonly soldSpot: bigint,
  ) {}

  public get spendsContractUtxos(): Lucid.UTxO[] {
    return [this.diracUtxo.utxo!];
  }

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    assert(
      this.diracUtxo.utxo,
      `Swapping.tx: this.diracUtxo.utxo is undefined`,
    );

    const funds = this.diracUtxo.balance.clone; // TODO cloning probably not required here
    funds.addAmountOf(this.boughtAsset, this.boughtAmount);
    funds.addAmountOf(this.soldAsset, -this.soldAmount);

    const swapRedeemer = PSwapRedeemer.ptype.pconstant(
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

    return tx
      .collectFrom(
        [this.diracUtxo.utxo],
        Data.to(swapRedeemer),
      )
      .payToContract(
        this.user.contract.address,
        {
          inline: Data.to(this.diracUtxo.datum),
        },
        funds.toLucid,
      );
  };

  private randomSubSwap = (): Swapping => {
    const soldSpot = Number(this.soldSpot);
    const boughtSpot = Number(this.boughtSpot);
    let soldAmount = Number(genPositive(this.soldAmount));
    let boughtAmount = soldAmount * soldSpot / boughtSpot;
    if (boughtAmount > this.boughtAmount) {
      boughtAmount = Number(this.boughtAmount);
      soldAmount = boughtAmount * boughtSpot / soldSpot;
    }
    return new Swapping(
      this.user,
      this.diracUtxo,
      this.boughtAsset,
      this.soldAsset,
      BigInt(Math.floor(boughtAmount)),
      BigInt(Math.ceil(soldAmount)),
      this.boughtSpot,
      this.soldSpot,
    );
  };

  static boundary(
    user: User,
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
    console.log(`swappings: ${swappings}`);
    if (swappings.length < 1) return undefined;
    console.log(`Swapping`);
    return randomChoice(swappings).randomSubSwap();
  }
}
