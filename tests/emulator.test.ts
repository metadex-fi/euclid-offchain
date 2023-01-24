import {
  Emulator,
  fromHex,
  fromText,
  generatePrivateKey,
  getAddressDetails,
  Lucid,
  toHex,
  toUnit,
  TxHash,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Action,
  genName,
  genUsers,
  maxInteger,
  randomChoice,
  User,
} from "../src/mod.ts";

Deno.test("lucid-example", async () => {
  let l = 0n; // empirical maximum = 32n
  //   while (true) {
  console.log(l);
  const privateKey = generatePrivateKey();

  const address = await (await Lucid.new(undefined, "Custom"))
    .selectWalletFromPrivateKey(privateKey).wallet.address();

  const { paymentCredential } = getAddressDetails(address);

  const emulator = new Emulator([{
    address,
    assets: { lovelace: 3000000000n },
  }]);

  const lucid = await Lucid.new(emulator);

  lucid.selectWalletFromPrivateKey(privateKey);

  const mintingPolicy = lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [
      {
        type: "before",
        slot: lucid.utils.unixTimeToSlot(emulator.now() + 60000),
      },
      { type: "sig", keyHash: paymentCredential?.hash! },
    ],
  });

  const policyId = lucid.utils.mintingPolicyToId(mintingPolicy);

  async function mint(l: bigint): Promise<TxHash> {
    const token = genName(l, l);
    const tx = await lucid.newTx()
      .mintAssets({
        [toUnit(policyId, fromText(token))]: 123n,
      })
      .validTo(emulator.now() + 30000)
      .attachMintingPolicy(mintingPolicy)
      .complete();
    const signedTx = await tx.sign().complete();

    return signedTx.submit();
  }
  await mint(l++);
  //   }

  emulator.awaitBlock(4);

  console.log(await lucid.wallet.getUtxos());
});

Deno.test("emulator", async () => {
  const users = await genUsers();
  const emulator = new Emulator(users.map((u) => u.account()));
  const iterations = 10;
  const timeout = 10;
  let timeout_ = timeout;
  const trace = [];
  while (trace.length < iterations) {
    const lucid = await Lucid.new(emulator);
    const user = await User.from(lucid, randomChoice(users).privateKey);
    const action = new Action(user);
    const options = await action.txOptions();
    if (options.length) {
      timeout_ = timeout;
      const txHash = await action.genEuclidTx(options);
      trace.push(txHash);
    } else if (timeout_-- < 0) throw new Error("timeout");
  }
});
