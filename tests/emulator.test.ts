import { Lucid } from "../lucid.mod.ts";
import { Action, allActions } from "../src/chain/actions/action.ts";
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
  // return;
  let trials = 1;
  const actionCounts_ = new Map<string, number>();
  // const errors = [];
  while (trials > 0) {
    console.log(`trials left: ${trials}`);
    let allUsers;
    let generationTries = 100; // TODO consider fixing this
    while (!allUsers) {
      try {
        allUsers = await User.genSeveral(genPositive(10n), genPositive(10n)); // TODO more
      } catch (e) {
        if (generationTries-- <= 0) throw e;
      }
    }
    const accounts = allUsers.map((u) => u.account);
    console.log(`accounts: ${accounts.length}`);
    const emulator = new Lucid.Emulator(accounts);
    const traces: string[] = [];
    const actionCounts = new Map<string, number>();
    const iterations = 20;
    for (let i = 0; i < iterations; i++) {
      console.log(
        `\ntrials left: ${trials} - iteration: ${i} - block: ${emulator.blockHeight}`// - errors: ${errors.length}`,
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
      // try {
        // for (const user of users) {
        const hashes = await user
          .generateActions()
          .then(async (actions) => {
            const signed: Lucid.TxSigned[] = [];
            let failed: Action[] = [];
            for (const action of actions) {
              const type = action.type;
              actionCounts.set(type, (actionCounts.get(type) ?? 0) + 1);
              const { succ, fail } = await user.getTxSigned(action);
              signed.push(...succ);
              failed.push(...fail);
            }
            const hashes_ = await Promise.all(
              signed.map(async (s) => await s.submit()),
            );
            while (failed.length) {
              console.warn(`failed: ${failed.length}`);
              user.resetMempool(); // TODO do this automatically in user.update() - requires checking blocks, however
              emulator.awaitBlock(1);
              const failed_ = [];
              for (const action of failed) {
                const { succ, fail } = await user.getTxSigned(action);
                hashes_.push(
                  ...(await Promise.all(
                    succ.map(async (s) => await s.submit()), // TODO check somewhere that after all of this, the full action was successfully completed
                  )),
                );
                failed_.push(...fail);
              }
              failed = failed_;
            }
            return hashes_;
          });
        // console.log(hashes);
        traces.push(...hashes.flat());
        // }
      // } catch (e) {
      //   if (e.toString().includes("TypeError: Cannot read properties of undefined (reading '__wbindgen_add_to_stack_pointer')")) {
      //     console.error("caught:", e);
      //   } else {
      //     throw e;
      //   }
      // }
      user.resetMempool();
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
  console.log("--- DONE ---");
  for (const [type, count] of actionCounts_) {
    console.log(`${type}: ${count}`);
  }
  // console.log(`errors: ${errors.length}`);
  // for (const e of errors) {
  //   console.warn("---");
  //   console.warn(e);
  // }
});

// // Deno.test("constr", async () => {
// //   for (let i = 0; i < 100; i++) {
// //     const privateKey = Lucid.generatePrivateKey();

// //     const address = await (await Lucid.Lucid.new(undefined, "Custom"))
// //       .selectWalletFromPrivateKey(privateKey).wallet.address();

// //     const emulator = new Lucid.Emulator([{
// //       address,
// //       assets: { lovelace: 3000000000n },
// //     }]);

// //     const lucid = await Lucid.Lucid.new(emulator);

// //     lucid.selectWalletFromPrivateKey(privateKey);

// //     const contract = new Contract(lucid);
// //     const param = PParam.ptype.genData();
// //     const param_ = new Param(
// //       KeyHash.fromCredential(
// //         lucid.utils.getAddressDetails(address).paymentCredential!,
// //       ),
// //       param.virtual,
// //       param.weights,
// //       param.jumpSizes,
// //     );
// //     const paramDatum = new ParamDatum(param_);
// //     const peuclidDatum = PPreEuclidDatum.genPType(); //only need this for ParamDatum, so this is fine

// //     const datum = peuclidDatum.pconstant(paramDatum);

// //     console.log(datum);
// //     (datum.fields[0] as Lucid.Constr<Data>).fields.forEach((f) => {
// //       console.log(f);
// //       console.log("---");
// //     });
// //     try {
// //       const tx = lucid.newTx()
// //         .payToContract(
// //           contract.address,
// //           {
// //             inline: Data.to(datum),
// //             scriptRef: contract.validator,
// //           },
// //           { lovelace: 42n },
// //         );
// //       const txComplete = await tx.complete();
// //       const signedTx = await txComplete.sign().complete();
// //       await signedTx.submit();

// //       emulator.awaitBlock(4);

// //       const utxos = await lucid.utxosAt(contract.address);
// //       console.log(utxos);

// //       const tx2 = lucid.newTx()
// //         // .attachMintingPolicy(contract.mintingPolicy)
// //         // .mintAssets(burningNFTs, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
// //         .addSigner(address)
// //         .collectFrom(
// //           utxos,
// //           Lucid.Data.void(),
// //         );
// //       const tx2complete = await tx2.complete();
// //       const signedTx2 = await tx2complete.sign().complete();
// //       await signedTx2.submit();
// //       emulator.awaitBlock(4);
// //     } catch (e) {
// //       throw new Error(e);
// //     }
// //   }
// // });

// // Deno.test("lucid-example", async () => {
// //   const l = 32n; // empirical maximum = 32n
// //   console.log(l);
// //   const privateKey = Lucid.generatePrivateKey();

// //   const address = await (await Lucid.Lucid.new(undefined, "Custom"))
// //     .selectWalletFromPrivateKey(privateKey).wallet.address();

// //   const { paymentCredential } = Lucid.getAddressDetails(address);

// //   const emulator = new Lucid.Emulator([{
// //     address,
// //     assets: { lovelace: 3000000000n },
// //   }]);

// //   const lucid = await Lucid.Lucid.new(emulator);

// //   lucid.selectWalletFromPrivateKey(privateKey);

// //   const mintingPolicy = lucid.utils.nativeScriptFromJson({
// //     type: "all",
// //     scripts: [
// //       {
// //         type: "before",
// //         slot: lucid.utils.unixTimeToSlot(emulator.now() + 60000),
// //       },
// //       { type: "sig", keyHash: paymentCredential?.hash! },
// //     ],
// //   });

// //   const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);

// //   const token = genName(1n, l);
// //   const assets = {
// //     [Lucid.toUnit(policyId, Lucid.fromText(token))]: 123n,
// //   };

// //   console.log(mintingPolicy.type);
// //   console.log(mintingPolicy.script);
// //   console.log(policyId);
// //   console.log(token);
// //   console.log(assets);

// //   async function mint(): Promise<Lucid.TxHash> {
// //     const tx = await lucid.newTx()
// //       .mintAssets(assets)
// //       .validTo(emulator.now() + 30000)
// //       .attachMintingPolicy(mintingPolicy)
// //       .complete();
// //     const signedTx = await tx.sign().complete();

// //     return signedTx.submit();
// //   }
// //   await mint();

// //   emulator.awaitBlock(4);

// //   console.log(await lucid.wallet.getUtxos());
// // });
