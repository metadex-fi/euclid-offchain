import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../lucid.mod.ts";
import { Action, allActions } from "../src/chain/actions/action.ts";
import { Swapping } from "../src/chain/actions/swapping.ts";
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
import { parameters } from "../src/utils/protocol.ts";
import { Asset } from "../src/types/general/derived/asset/asset.ts";

Deno.test("emulator", async () => {
  // const blockfrostUrl = "https://cardano-preview.blockfrost.io/api/v0";
  // const projectId = ""; // TODO un-hardcode

  // const blockfrost = await Lucid.Lucid.new(
  //   new Lucid.Blockfrost(blockfrostUrl, projectId),
  //   "Preview"
  // );
  // const parameters = await blockfrost.provider.getProtocolParameters();

  // console.log(parameters);

  // return;
  const nativeUplc = true; // TODO check the impact of this

  let trials = 1; //5;
  const actionCounts_ = new Map<string, number>();
  // const errors = [];
  while (trials > 0) {
    console.log(`trials left: ${trials}`);
    let allUsers;
    let generationTries = 100; // TODO consider fixing this
    while (!allUsers) {
      try {
        allUsers = await User.genSeveral(
          nativeUplc,
          genPositive(10n),
          genPositive(10n),
        ); // TODO more
      } catch (e) {
        if (generationTries-- <= 0) throw e;
      }
    }
    const accounts = allUsers.map((u) => u.account);
    console.log(`accounts: ${accounts.length}`);
    const emulator = new Lucid.Emulator(accounts, parameters); // TODO get actual exBudget from Chain - the one in the emulator seems too low
    const traces: string[] = [];
    const actionCounts = new Map<string, number>();
    const iterations = 20; //100; TODO increase again
    for (let i = 0; i < iterations; i++) {
      console.log(
        `\ntrials left: ${trials} - iteration: ${i} - block: ${emulator.blockHeight}`, // - errors: ${errors.length}`,
      );
      const lucid = await Lucid.Lucid.new(emulator);
      const contract = new Contract(lucid);
      const user = await User.fromPrivateKey(
        lucid,
        nativeUplc,
        randomChoice(allUsers).privateKey!,
        contract,
      );
      // TODO multiple parallel users and actions (requires logging of spent contract utxos or error handling)
      // const users = await Promise.all(
      //   randomSubset(allUsers).map(async (user) => {
      //     const lucid = await Lucid.Lucid.new(emulator);
      //     return User.from(lucid, user.privateKey);
      //   }),
      // );
      // console.log(`users: ${users.length}`);
      let prevActionType = "";
      try {
        // for (const user of users) {
        const hashes = await user
          .generateActions()
          .then(async (actions) => {
            const hashes_: string[] = [];
            for (const action of actions) {
              const type = action.type;
              prevActionType = type;
              // corruption-tests
              if (type === "Swapping") {
                const swapping = action as Swapping;
                const corrupted = swapping.corruptAll();
                console.log(`attempting ${corrupted.length} corruptions...`);
                for (const [t, c] of corrupted.entries()) {
                  console.log(`attempting corruption ${t}...`);
                  try {
                    const hash = await user.execute(c);
                    console.log(
                      `successfully executed type ${t} corruption: ${hash}`,
                    );
                  } catch (e) {
                    console.log(
                      `type ${t} corruption failed successfully: ${e}`,
                    );
                    continue;
                  }

                  // TODO FIXME
                  // if (c.soldAsset.equals(Asset.ADA)) {
                  //   console.error(
                  //     `type ${t} corruption succeeded, but skipping due to ADA sold: ${swapping.show()}\n~~~>\n${c.show()}`,
                  //   );
                  //   break;
                  // }

                  // console.log(`type ${t} corruption succeeded: ${swapping.show()}\n~~~>\n${c.show()}`)
                  throw new Error(
                    `type ${t} corruption succeeded: ${swapping.show()}\n~~~>\n${c.show()}`,
                  );
                }
              }
              console.log(`attempting ${type}...`);
              actionCounts.set(type, (actionCounts.get(type) ?? 0) + 1);
              const results = await user.execute(action);
              hashes_.push(...results.txHashes);
            }
            while (user.wantsToRetry) {
              console.warn(`wantsToRetry`);
              emulator.awaitBlock(1); // TODO this does not take into account the possibility that others do or attempt stuff in the meantime
              await user.update(); // NOTE late night edit, not sure. Just for logging I think
              const results = await user.newBlock();
              results.forEach((r) => hashes_.push(...r.txHashes)); // TODO do this automatically in user.update() - requires checking blocks, however
            }
            return hashes_;
          });
        // console.log(hashes);
        traces.push(...hashes.flat());
        // }
      } catch (e) {
        assert(
          prevActionType !== "",
          `prevActionType not set, caught: ${e.toString()}`,
        );
        if (
          prevActionType === "Opening" && (
            // false
            e.toString().includes("Not enough ADA leftover to cover minADA") || // TODO hard to fix bullshit
            // NOTE I think below might be due to collateral-utxos having to be different ones; setting fees super high does not solve it.
            // see tx_builder.rs in lucid/CML
            e.toString().includes("Insufficient collateral balance") || // TODO hard to fix bullshit
            // e.toString().includes("Over budget") // TODO FIXME
            e.toString().includes("Max collateral inputs reached") // TODO FIXME
          )
        ) {
          console.error("caught:", e);
          // } else if (
          //   prevActionType === "Closing" && (
          //     e.toString().includes("Over budget") // TODO FIXME
          //   )
          // ) {
          //   console.error("caught:", e);
          // } else if (
          //   prevActionType === "Swapping" && (
          //     e.toString().includes("Over budget") // TODO FIXME
          //   )
          // ) {
          //   console.error("caught:", e);
        } else {
          // console.error(e);
          throw e;
        }
      }
      emulator.awaitBlock(Number(genPositive(1000n))); // NOTE/TODO this arbitrary limit is a hotfix for block height overflow issue
      assert(!user.wantsToRetry, `user wants to retry still`);
      const actionResults = await user.newBlock();
      assert(
        actionResults.length === 0,
        `unexpected unhandled actions: ${actionResults}`,
      );
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
