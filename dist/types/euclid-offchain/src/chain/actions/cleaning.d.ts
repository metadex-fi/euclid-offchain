import { Lucid } from "../../../lucid.mod.js";
import { User } from "../user.js";
export declare class Cleaning {
  private readonly user;
  private readonly prePool;
  private constructor();
  get type(): string;
  tx: (tx: Lucid.Tx) => Lucid.Tx;
  static genOfUser: (user: User) => Cleaning | undefined;
}
