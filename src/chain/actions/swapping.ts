import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../lucid.mod.ts";
import { Asset, genPositive, randomChoice } from "../../mod.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";

export class Swapping {
  private constructor(
    private readonly user: User,
    private readonly pool: Pool,
    private readonly boughtAsset: Asset,
    private readonly soldAsset: Asset,
    private readonly boughtAmount: bigint,
    private readonly soldAmount: bigint,
    private readonly boughtSpot: bigint,
    private readonly soldSpot: bigint,
  ) {}

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
  };

  public randomSubSwap = (): Swapping => {
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
        this.pool,
        this.boughtAsset,
        this.soldAsset,
        BigInt(Math.floor(boughtAmount)),
        BigInt(Math.ceil(soldAmount)),
        this.boughtSpot,
        this.soldSpot,
    );
  };

  static limit(
    user: User,
    pool: Pool,
    boughtAsset: Asset,
    soldAsset: Asset,
    boughtAmount: bigint,
    soldAmount: bigint,
    boughtSpot: bigint,
    soldSpot: bigint,
  ): Swapping {
    return new Swapping(
      user,
      pool,
      boughtAsset,
      soldAsset,
      boughtAmount,
      soldAmount,
      boughtSpot,
      soldSpot,
    );
  }

  // TODO don't forget to update (poll) chain state somewhere beforehand
  static genOfUser(user: User): Swapping {
    assert(
      user.contract.state,
      `Swapping.genOfUser: user.contract.state is undefined`,
    );
    assert(user.balance, `Swapping.genOfUser: user.balance is undefined`);
    assert(user.balance.size, `no assets for ${user.address}`);
    const swappings = user.contract.state.swappingsFor(user);
    return randomChoice(swappings).randomSubSwap();
  }
}
