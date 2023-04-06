import { Lucid } from "../../../lucid.mod.js";
export declare class Switching {
    private readonly user;
    private readonly pool;
    private constructor();
    get type(): string;
    tx: (tx: Lucid.Tx) => Lucid.Tx;
}
