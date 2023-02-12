import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import {
  Asset,
  BoughtSold,
  Data,
  genPositive,
  PSwapRedeemer,
  randomChoice,
  Swap,
  SwapRedeemer,
} from "../../mod.ts";
import { DiracUtxo } from "../mod.ts";
import { User } from "../user.ts";

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
    const swappings = user.contract!.state!.swappingsFor(user);
    if (swappings.length < 1) return undefined;
    else return randomChoice(swappings).randomSubSwap();
  }
}
