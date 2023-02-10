import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Asset } from "../../mod.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";

export class Swapping {
    private constructor(
        private readonly user: User,
        private readonly pool: Pool,
        private readonly boughtAsset: Asset,
        private readonly soldAsset: Asset,
        private readonly soldAmount: bigint,
        private readonly boughtAmount: bigint,
    ) {}

    // TODO don't forget to update (poll) chain state somewhere beforehand
    static genOfUser(user: User): Swapping {
        assert(user.contract.state, `Swapping.genOfUser: user.contract.state is undefined`)
        assert(user.balance, `Swapping.genOfUser: user.balance is undefined`)
        assert(user.balance.size, `no assets for ${user.address}`);
        const eligiblePools = user.contract.state.eligibleFor(user)
    }
}