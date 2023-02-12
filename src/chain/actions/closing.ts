import { randomChoice } from "../../utils/generators.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";

export class Closing {
  private constructor(
    private readonly user: User,
    private readonly pool: Pool,
  ) {}

  //   public tx = (tx: Lucid.Tx): Lucid.Tx => {
  //     return this.pool.closingTx(tx, this.user.contract);
  //   };

  static genOfUser = (user: User): Closing | undefined => {
    const pools = user.contract.state?.pools.get(user.paymentKeyHash);
    if (!pools) return undefined;
    const pool = randomChoice([...pools.values()]);
    return new Closing(user, pool);
  };
}
