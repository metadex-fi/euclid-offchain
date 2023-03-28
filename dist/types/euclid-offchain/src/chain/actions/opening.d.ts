import { Lucid } from "../../../lucid.mod.js";
import { User } from "../user.js";
export declare class Opening {
    private readonly user;
    private readonly param;
    private readonly deposit;
    private readonly numTicks;
    private constructor();
    get type(): string;
    tx: (tx: Lucid.Tx) => Lucid.Tx;
    private pool;
    static genOfUser: (user: User) => Opening | undefined;
}
