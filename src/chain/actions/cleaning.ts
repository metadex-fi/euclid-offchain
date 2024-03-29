// import { Lucid } from "../../../lucid.mod.ts";
// import { randomChoice } from "../../utils/generators.ts";
// import { PrePool } from "../pool.ts";
// import { User } from "../user.ts";

// export class Cleaning {
//   private constructor(
//     private readonly user: User,
//     private readonly prePool: PrePool,
//   ) {}

//   public get type(): string {
//     return "Cleaning";
//   }

//   public tx = (tx: Lucid.Tx): Lucid.Tx => {
//     return this.prePool.cleaningTx(tx, this.user.contract).addSigner(
//       this.user.address!,
//     );
//   };

//   static genOfUser = (user: User): Cleaning | undefined => {
//     // console.log(`attempting to close`);
//     const enoughForFees = user.availableBalance;
//     if (!enoughForFees) return undefined;
//     const prePools = user.contract.state?.invalidPools.get(user.paymentKeyHash);
//     if (!prePools) return undefined;
//     if (!prePools.size) return undefined;
//     const prePool = randomChoice([...prePools.values()]);
//     // console.log(`Cleaning`);
//     return new Cleaning(user, prePool);
//   };
// }
