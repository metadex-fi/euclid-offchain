import { Lucid } from "../../../lucid.mod.js";
import { randomChoice } from "../../utils/generators.js";
import { Pool } from "../pool.js";
import { User } from "../user.js";

export class Switching {
  constructor(
    private readonly user: User,
    private readonly pool: Pool,
  ) {}

  public get type(): string {
    return "Switching";
  }

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    return this.pool.switchingTx(tx, this.user.contract).addSigner(
      this.user.address!,
    );
  };

  // TODO implement and test
//   static genOfUser = (user: User): Switching | undefined => {
//     // console.log(`attempting to switch`);
//     const enoughForFees = user.availableBalance;
//     if (!enoughForFees) return undefined;
//     const pools = user.contract.state?.pools.get(user.paymentKeyHash);
//     if (!pools) return undefined;
//     if (!pools.size) return undefined;
//     const pool = randomChoice([...pools.values()]);
//     // console.log(`Switching`);
//     return new Switching(user, pool);
//   };
}
