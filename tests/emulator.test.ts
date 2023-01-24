// import {
//   Emulator,
//   fromHex,
//   fromText,
//   generatePrivateKey,
//   getAddressDetails,
//   Lucid,
//   toHex,
//   toUnit,
//   TxHash,
// } from "https://deno.land/x/lucid@0.8.6/mod.ts";
// import {
//   genName,
//   genUsers,
//   maxInteger,
//   randomChoice,
//   User,
// } from "../src/mod.ts";

// Deno.test("lucid-example", async () => {
//   const privateKey = generatePrivateKey();

//   const address = await (await Lucid.new(undefined, "Custom"))
//     .selectWalletFromPrivateKey(privateKey).wallet.address();

//   const { paymentCredential } = getAddressDetails(address);

//   const emulator = new Emulator([{
//     address,
//     assets: { lovelace: 3000000000n },
//   }]);

//   const lucid = await Lucid.new(emulator);

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
//   console.log(fromHex(policyId));
//   console.log(policyId);
//   const l = 32n; // empirical maximum
//   const token = genName(l, l);
//   console.log(token);
//   console.log(fromText(token));

//   async function mint(): Promise<TxHash> {
//     const tx = await lucid.newTx()
//       .mintAssets({
//         [toUnit(policyId, fromText(token))]: 123n,
//       })
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
//   const users = await genUsers();
//   const emulator = new Emulator(users.map((u) => u.account()));
//   const iterations = 10;
//   const timeout = 10;
//   let timeout_ = timeout;
//   const trace = [];
//   while (trace.length < iterations) {
//     const lucid = await Lucid.new(emulator);
//     const user = await User.from(lucid, randomChoice(users).privateKey);
//     const options = await user.txOptions();
//     if (options.length) {
//       timeout_ = timeout;
//       const txHash = await user.genEuclidTx(options);
//       trace.push(txHash);
//     } else if (timeout_-- < 0) throw new Error("timeout");
//   }
// });
