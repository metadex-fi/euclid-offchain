import { Lucid } from "../lucid.mod.ts";
import {
  Actionable,
  genName,
  genUsers,
  randomChoice,
  randomSubset,
  User,
} from "../src/mod.ts";

Deno.test("lucid-example", async () => {
  const l = 32n; // empirical maximum = 32n
  console.log(l);
  const privateKey = Lucid.generatePrivateKey();

  const address = await (await Lucid.Lucid.new(undefined, "Custom"))
    .selectWalletFromPrivateKey(privateKey).wallet.address();

  const { paymentCredential } = Lucid.getAddressDetails(address);

  const emulator = new Lucid.Emulator([{
    address,
    assets: { lovelace: 3000000000n },
  }]);

  const lucid = await Lucid.Lucid.new(emulator);

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

  const token = genName(1n, l);
  const assets = {
    [Lucid.toUnit(policyId, Lucid.fromText(token))]: 123n,
  };

  console.log(mintingPolicy.type);
  console.log(mintingPolicy.script);
  console.log(policyId);
  console.log(token);
  console.log(assets);

  async function mint(): Promise<Lucid.TxHash> {
    const tx = await lucid.newTx()
      .mintAssets(assets)
      .validTo(emulator.now() + 30000)
      .attachMintingPolicy(mintingPolicy)
      .complete();
    const signedTx = await tx.sign().complete();

    return signedTx.submit();
  }
  await mint();

  emulator.awaitBlock(4);

  console.log(await lucid.wallet.getUtxos());
});

Deno.test("emulator", async () => {
  const allUsers = await genUsers();
  const accounts = users.map((u) => u.account());
  console.log(`accounts: ${accounts}`);
  const emulator = new Lucid.Emulator(accounts);
  const iterations = 10;
  const timeout = 10;
  let timeout_ = timeout;
  const traces: string[][] = [];
  const lucid = await Lucid.Lucid.new(emulator);
  while (trace.length < iterations) {
    console.log(`\ni: ${traces.length}`);
    const trace = [];
    const users = await Promise.all(
      randomSubset(allUsers).map(async (user) => {
        const lucid = await Lucid.Lucid.new(emulator);
        return User.from(lucid, user.privateKey);
      }),
    );
    const actions = users.map((user) => new Action(user));
    for (const action of actions) {
      const options = await action.txOptions();
      if (options.length) {
        timeout_ = timeout;
        const txHash = await action.genEuclidTx(options);
        trace.push(txHash);
      } else if (timeout_-- < 0) throw new Error("timeout");
    }
  }
});
