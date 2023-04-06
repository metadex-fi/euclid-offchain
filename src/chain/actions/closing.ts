import { Lucid } from "../../../lucid.mod.ts";
import { randomChoice } from "../../utils/generators.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";

export class Closing {
  constructor(
    private readonly user: User,
    private readonly pool: Pool,
  ) {}

  public get type(): string {
    return "Closing";
  }

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    return this.pool.closingTx(tx, this.user.contract).addSigner(
      this.user.address!,
    );
  };

  static genOfUser = (user: User): Closing | undefined => {
    // console.log(`attempting to close`);
    const enoughForFees = user.availableBalance;
    if (!enoughForFees) return undefined;
    const pools = user.contract.state?.pools.get(user.paymentKeyHash);
    if (!pools) return undefined;
    if (!pools.size) return undefined;
    const pool = randomChoice([...pools.values()]);
    // console.log(`Closing`);
    return new Closing(user, pool);
  };
}
