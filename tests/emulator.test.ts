import { Lucid } from "../lucid.mod.ts";
import { allActions } from "../src/chain/actions/action.ts";
import { Contract } from "../src/chain/contract.ts";
import { User } from "../src/chain/user.ts";
import {
  ParamDatum,
  PEuclidDatum,
  PPreEuclidDatum,
} from "../src/types/euclid/euclidDatum.ts";
import { Param, PParam } from "../src/types/euclid/param.ts";
import { KeyHash } from "../src/types/general/derived/hash/keyHash.ts";
import { Data } from "../src/types/general/fundamental/type.ts";
import { genPositive, randomChoice } from "../src/utils/generators.ts";

Deno.test("emulator", async () => {
  let trials = 5;
  const actionCounts_ = new Map<string, number>();
  while (trials > 0) {
    console.log(`trials: ${trials}`);
    const allUsers = await User.genSeveral(genPositive(10n), genPositive(10n)); // TODO more
    const accounts = allUsers.map((u) => u.account);
    console.log(`accounts: ${accounts.length}`);
    const emulator = new Lucid.Emulator(accounts);
    const traces: string[] = [];
    const actionCounts = new Map<string, number>();
    const iterations = 20;
    for (let i = 0; i < iterations; i++) {
      console.log(
        `\ntrials: ${trials} - iteration: ${i} - block: ${emulator.blockHeight}`,
      );
      const lucid = await Lucid.Lucid.new(emulator);
      const user = await User.fromPrivateKey(
        lucid,
        randomChoice(allUsers).privateKey!,
      );

      // TODO multiple parallel users and actions (requires logging of spent contract utxos or error handling)
      // const users = await Promise.all(
      //   randomSubset(allUsers).map(async (user) => {
      //     const lucid = await Lucid.Lucid.new(emulator);
      //     return User.from(lucid, user.privateKey);
      //   }),
      // );
      // console.log(`users: ${users.length}`);
      try {
        // for (const user of users) {
        const hashes = await user
          .generateActions()
          .then((actions) =>
            Promise.all(
              actions.map(async (action) => {
                const type = action.type;
                actionCounts.set(type, (actionCounts.get(type) ?? 0) + 1);
                const tx = action.tx(user.lucid.newTx());
                // console.log(tx);
                return await tx
                  .complete()
                  .then((completed) => {
                    // console.log(completed.txComplete.to_js_value());
                    return completed
                      .sign()
                      .complete()
                      .then((signed) => {
                        // console.log(signed.txSigned.to_js_value());
                        return signed.submit();
                      });
                  });
              }),
            )
          );
        // console.log(hashes);
        traces.push(...hashes);
        // }
      } catch (e) {
        console.error("---");
        for (const [type, count] of actionCounts_) {
          console.error(`${type}: ${count}`);
        }
        throw new Error(`Error: ${e}\n${e.stack}`);
      }
      emulator.awaitBlock(Number(genPositive(1000n))); // NOTE/TODO this arbitrary limit is a hotfix for block height overflow issue
    }
    console.log(`traces.length: ${traces.length}`);
    for (const [type, count] of actionCounts) {
      console.log(`${type}: ${count}`);
      actionCounts_.set(type, (actionCounts_.get(type) ?? 0) + count);
    }
    if (actionCounts.size === allActions.length) trials--;
    // for (const user of allUsers) {
    //   const lucid = await Lucid.Lucid.new(emulator);
    //   const user_ = await User.from(lucid, user.privateKey);
    //   console.log(await user_.lucid.wallet.getUtxos());
    // }
  }
  console.log("---");
  for (const [type, count] of actionCounts_) {
    console.log(`${type}: ${count}`);
  }
});

// Deno.test("constr", async () => {
//   for (let i = 0; i < 100; i++) {
//     const privateKey = Lucid.generatePrivateKey();

//     const address = await (await Lucid.Lucid.new(undefined, "Custom"))
//       .selectWalletFromPrivateKey(privateKey).wallet.address();

//     const emulator = new Lucid.Emulator([{
//       address,
//       assets: { lovelace: 3000000000n },
//     }]);

//     const lucid = await Lucid.Lucid.new(emulator);

//     lucid.selectWalletFromPrivateKey(privateKey);

//     const contract = new Contract(lucid);
//     const param = PParam.ptype.genData();
//     const param_ = new Param(
//       KeyHash.fromCredential(
//         lucid.utils.getAddressDetails(address).paymentCredential!,
//       ),
//       param.virtual,
//       param.weights,
//       param.jumpSizes,
//     );
//     const paramDatum = new ParamDatum(param_);
//     const peuclidDatum = PPreEuclidDatum.genPType(); //only need this for ParamDatum, so this is fine

//     const datum = peuclidDatum.pconstant(paramDatum);

//     console.log(datum);
//     (datum.fields[0] as Lucid.Constr<Data>).fields.forEach((f) => {
//       console.log(f);
//       console.log("---");
//     });
//     try {
//       const tx = lucid.newTx()
//         .payToContract(
//           contract.address,
//           {
//             inline: Data.to(datum),
//             scriptRef: contract.validator,
//           },
//           { lovelace: 42n },
//         );
//       const txComplete = await tx.complete();
//       const signedTx = await txComplete.sign().complete();
//       await signedTx.submit();

//       emulator.awaitBlock(4);

//       const utxos = await lucid.utxosAt(contract.address);
//       console.log(utxos);

//       const tx2 = lucid.newTx()
//         // .attachMintingPolicy(contract.mintingPolicy)
//         // .mintAssets(burningNFTs, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
//         .addSigner(address)
//         .collectFrom(
//           utxos,
//           Lucid.Data.void(),
//         );
//       const tx2complete = await tx2.complete();
//       const signedTx2 = await tx2complete.sign().complete();
//       await signedTx2.submit();
//       emulator.awaitBlock(4);
//     } catch (e) {
//       throw new Error(e);
//     }
//   }
// });

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
