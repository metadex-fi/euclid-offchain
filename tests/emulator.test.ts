// import { Lucid } from "../lucid.mod.ts";
// import { User } from "../src/chain/user.ts";
// import { genName, genPositive, randomSubset } from "../src/utils/generators.ts";

// Deno.test("lucid-example", async () => {
//   const l = 32n; // empirical maximum = 32n
//   console.log(l);
//   const privateKey = Lucid.generatePrivateKey();

//   const address = await (await Lucid.Lucid.new(undefined, "Custom"))
//     .selectWalletFromPrivateKey(privateKey).wallet.address();

//   const { paymentCredential } = Lucid.getAddressDetails(address);

//   const emulator = new Lucid.Emulator([{
//     address,
//     assets: { lovelace: 3000000000n },
//   }]);

//   const lucid = await Lucid.Lucid.new(emulator);

//   lucid.selectWalletFromPrivateKey(privateKey);

//   const mintingPolicy = lucid.utils.nativeScriptFromJson({
//     type: "all",
//     scripts: [
//       {
//         type: "before",
//         slot: lucid.utils.unixTimeToSlot(emulator.now() + 60000),
//       },
//       { type: "sig", keyHash: paymentCredential?.hash! },
//     ],
//   });

//   const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);

//   const token = genName(1n, l);
//   const assets = {
//     [Lucid.toUnit(policyId, Lucid.fromText(token))]: 123n,
//   };

//   console.log(mintingPolicy.type);
//   console.log(mintingPolicy.script);
//   console.log(policyId);
//   console.log(token);
//   console.log(assets);

//   async function mint(): Promise<Lucid.TxHash> {
//     const tx = await lucid.newTx()
//       .mintAssets(assets)
//       .validTo(emulator.now() + 30000)
//       .attachMintingPolicy(mintingPolicy)
//       .complete();
//     const signedTx = await tx.sign().complete();

//     return signedTx.submit();
//   }
//   await mint();

//   emulator.awaitBlock(4);

//   console.log(await lucid.wallet.getUtxos());
// });

// Deno.test("emulator", async () => {
//   const allUsers = await User.genSeveral();
//   const accounts = allUsers.map((u) => u.account);
//   console.log(`accounts: ${accounts}`);
//   const emulator = new Lucid.Emulator(accounts);
//   const traces: string[] = [];
//   const iterations = 100;
//   for (let i = 0; i < iterations; i++) {
//     console.log(`\niteration: ${i} - block: ${emulator.blockHeight}`);
//     const users = await Promise.all(
//       randomSubset(allUsers).map(async (user) => {
//         const lucid = await Lucid.Lucid.new(emulator);
//         return User.from(lucid, user.privateKey);
//       }),
//     );
//     console.log(`users: ${users.length}`);
//     const spentContractUtxos = new Array<Lucid.UTxO>();
//     for (const user of users) {
//       const hashes = await user
//         .generateActions(spentContractUtxos)
//         .then((actions) =>
//           Promise.all(
//             actions.map(async (action) => {
//               spentContractUtxos.push(...action.spendsContractUtxos);
//               return await action
//                 .tx(user.lucid.newTx())
//                 .complete()
//                 .then((tx) =>
//                   tx
//                     .sign()
//                     .complete()
//                     .then((signed) => signed.submit())
//                 );
//             }),
//           )
//         );
//       console.log(hashes);
//       traces.push(...hashes);
//     }
//     emulator.awaitBlock(Number(genPositive()));
//   }
//   console.log(`traces.length: ${traces.length}`);
// });
