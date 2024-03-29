import { Lucid } from "../../../lucid.mod.ts";
import { randomChoice } from "../../utils/generators.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";

export class Switching {
  constructor(
    private readonly user: User,
    private readonly pool: Pool,
  ) {}

  public get type(): string {
    return "Switching";
  }

  public split = (): Switching[] => {
    throw new Error("Switching-split not implemented");
  };

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    return this.pool.switchingTx(tx, this.user.contract).addSigner(
      this.user.address!,
    );
  };

  public succeeded = (_txCore: Lucid.C.Transaction) => {};

  static genOfUser = (user: User): Switching | null => {
    // console.log(`attempting to switch`);
    const enoughForFees = user.availableBalance;
    if (!enoughForFees) return null;
    const pools = user.contract.state?.pools.get(user.paymentKeyHash);
    if (!pools) return null;
    if (!pools.size) return null;
    const pool = randomChoice([...pools.values()]);
    // console.log(`Switching`);
    return new Switching(user, pool);
  };
}
