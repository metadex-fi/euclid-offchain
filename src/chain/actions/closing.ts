import { Lucid } from "../../../lucid.mod.ts";
import { Asset } from "../../types/general/derived/asset/asset.ts";
import { closingFees } from "../../utils/constants.ts";
import { randomChoice } from "../../utils/generators.ts";
import { Pool } from "../pool.ts";
import { User } from "../user.ts";

export class Closing {
  constructor(
    public readonly user: User,
    private readonly pool: Pool,
  ) {}

  public get type(): string {
    return "Closing";
  }

  public split = (): Closing[] => {
    throw new Error("Closing-split not implemented");
  };

  public tx = (tx: Lucid.Tx): Lucid.Tx => {
    return this.pool.closingTx(tx, this.user.contract).addSigner(
      this.user.address!,
    );
  };

  public succeeded = (_txCore: Lucid.C.Transaction) => {};

  static genOfUser = (user: User): Closing | null => {
    // console.log(`attempting to close`);
    const balance = user.balance!;
    if (balance.amountOf(Asset.ADA, 0n) < closingFees) return null;
    const pools = user.contract.state?.pools.get(user.paymentKeyHash);
    if (!pools) return null;
    if (!pools.size) return null;
    const pool = randomChoice([...pools.values()]);
    // console.log(`Closing`);
    return new Closing(user, pool);
  };
}
