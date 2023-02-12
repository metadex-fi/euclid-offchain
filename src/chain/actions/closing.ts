import { Lucid } from "../../../lucid.mod.ts";
import { randomChoice } from "../../utils/generators.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";

export class Closing {
  private constructor(
    private readonly pool: Pool,
  ) {}

  public get spendsContractUtxos(): Lucid.UTxO[] {
    return this.pool.utxos;
  }

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    return this.pool.closingTx(tx);
  };

  static genOfUser = (user: User): Closing | undefined => {
    console.log(`attempting to close`);
    const pools = user.contract.state?.pools.get(user.paymentKeyHash);
    console.log(`pools: ${pools}`);
    if (!pools) return undefined;
    const pool = randomChoice([...pools.values()]);
    console.log(`Closing`);
    return new Closing(pool);
  };
}
