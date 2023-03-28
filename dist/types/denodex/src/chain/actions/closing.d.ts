import { Lucid } from "../../../lucid.mod.js";
import { User } from "../user.js";
export declare class Closing {
    private readonly user;
    private readonly pool;
    private constructor();
    get type(): string;
    tx: (tx: Lucid.Tx) => Lucid.Tx;
    static genOfUser: (user: User) => Closing | undefined;
}
