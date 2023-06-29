import { Lucid } from "../../../lucid.mod.js";
import { EuclidValue } from "../../types/euclid/euclidValue.js";
import { Param } from "../../types/euclid/param.js";
import { PositiveValue } from "../../types/general/derived/value/positiveValue.js";
import { Pool } from "../pool.js";
import { User } from "../user.js";
export declare class Opening {
    readonly user: User;
    readonly param: Param;
    readonly deposit: PositiveValue;
    readonly numTicks: EuclidValue;
    private poolCache?;
    constructor(user: User, param: Param, deposit: PositiveValue, // total of all Diracs
    numTicks: EuclidValue);
    get type(): string;
    tx: (tx: Lucid.Tx) => Lucid.Tx;
    pool: () => Pool;
    static genOfUser: (user: User) => Opening | undefined;
    static maxTicks: (virtual: bigint, weight: bigint, jumpSize: bigint) => bigint;
}
