import { Lucid } from "../../../lucid.mod.js";
import { Pool } from "../pool.js";
import { User } from "../user.js";
export declare class Switching {
    private readonly user;
    private readonly pool;
    constructor(user: User, pool: Pool);
    get type(): string;
    tx: (tx: Lucid.Tx) => Lucid.Tx;
}
