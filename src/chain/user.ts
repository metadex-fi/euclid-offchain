import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import { IdNFT } from "../types/euclid/idnft.ts";
import { Asset } from "../types/general/derived/asset/asset.ts";
import { Assets } from "../types/general/derived/asset/assets.ts";
import { KeyHash, PKeyHash } from "../types/general/derived/hash/keyHash.ts";
import { feesEtcLovelace } from "../utils/generators.ts";
import { PositiveValue } from "../types/general/derived/value/positiveValue.ts";
import { Action, UserAction } from "./actions/action.ts";

import { Contract } from "./contract.ts";
import { utxosToCore } from "../utils/conversion.ts";

const forFeesEtc = PositiveValue.singleton(
  Asset.ADA,
  10n * feesEtcLovelace,
); // costs in lovelace for fees etc. TODO excessive
// const feesEtc = PositiveValue.singleton(Asset.ADA, feesEtcLovelace);

type TxIn = {
  txHash: string;
  outputIndex: number;
};

type TxResult = {
  txHash: string;
  txCore: Lucid.C.Transaction;
} | Error;

export type ActionResults = {
  txHashes: string[];
  errors: Error[];
};

export class User {
  public readonly contract: Contract;
  public readonly paymentKeyHash: KeyHash;
  public balance?: PositiveValue;
  public usedSplitting = false;
  private lastIdNFT?: IdNFT;

  // for tx-chaining
  private spentUtxos: TxIn[] = [];
  private pendingUtxos: Lucid.UTxO[] = [];

  private retrying: Action[] = [];

  private constructor(
    public readonly lucid: Lucid.Lucid,
    // public readonly protocolParameters: Lucid.ProtocolParameters,
    public readonly privateKey?: string, // for emulation
    public readonly address?: Lucid.Address,
    paymentKeyHash?: KeyHash,
    private readonly userChaining = false, // whether the wallet supports chaining user-utxos
  ) {
    this.contract = new Contract(lucid);
    if (address) {
      const addressDetails = this.lucid.utils.getAddressDetails(address);
      assert(addressDetails.paymentCredential, "No payment credential");
      const paymentKeyHash_ = KeyHash.fromCredential(
        addressDetails.paymentCredential,
      );
      if (paymentKeyHash) {
        assert(paymentKeyHash.show() === paymentKeyHash_.show());
      }
      this.paymentKeyHash = paymentKeyHash_;

      lucid.wallet.getUtxos = async () => {
        // console.log("getUtxos()");
        const utxos = await lucid.utxosAt(address);
        // console.log("utxos (getUtxos):", utxos);
        // console.log("spentUtxos (getUtxos):", this.spentUtxos);
        // NOTE: using mempool-outputs does not quite work yet with nami/blockfrost for
        // utxos belonging to the user, see https://github.com/berry-pool/nami/issues/856
        if (this.userChaining) {
          // console.log("pendingUtxos (getUtxos):", this.pendingUtxos);
          this.pendingUtxos.forEach((pendingUtxo) => {
            if (pendingUtxo.address !== address) return;
            const index = utxos.findIndex((utxo) =>
              utxo.txHash === pendingUtxo.txHash &&
              utxo.outputIndex === pendingUtxo.outputIndex
            );
            if (index === -1) utxos.push(pendingUtxo);
          });
        }
        this.spentUtxos.forEach((spentUtxo) => {
          const index = utxos.findIndex((utxo) =>
            utxo.txHash === spentUtxo.txHash &&
            utxo.outputIndex === spentUtxo.outputIndex
          );
          if (index >= 0) utxos.splice(index, 1);
        });
        // console.log("utxos (getUtxos, 2):", utxos);
        return utxos;
      };
      lucid.wallet.getUtxosCore = async () => {
        // console.log("getUtxosCore()");
        const utxos = await lucid.wallet.getUtxos();
        return utxosToCore(utxos);
      };
    } else {
      assert(paymentKeyHash, `neither address nor paymentKeyHash provided`);
      this.paymentKeyHash = paymentKeyHash;
      // TODO what happens here to lucid.wallet.getUtxosCore?
    }
  }

  // TODO does this take mempool into account?
  public get availableBalance(): PositiveValue | undefined {
    assert(this.balance, "No balance");
    if (this.balance.amountOf(Asset.ADA, 0n) <= feesEtcLovelace) {
      console.warn(`not enough ada to pay fees etc.: ${this.balance.concise()}
      (current arbitrary & excessive minimum: ${feesEtcLovelace} lovelaces)`);
      return undefined;
    }
    const available = this.balance.clone;
    available.addAmountOf(Asset.ADA, -feesEtcLovelace);
    // available.drop(Asset.ADA); // TODO don't drop ADA completely
    return available;
  }

  public get hasPools(): boolean {
    return this.lastIdNFT !== undefined;
  }

  public get nextParamNFT(): IdNFT {
    if (this.lastIdNFT) return this.lastIdNFT.next();
    else return new IdNFT(this.contract.policy, this.paymentKeyHash.hash());
  }

  public get wantsToRetry(): boolean {
    return this.retrying.length > 0;
  }

  // only needed for multiple actions within same iteration
  public setLastIdNFT = (idNFT: IdNFT): void => {
    this.lastIdNFT = idNFT;
  };

  // TODO consider generating several
  public generateActions = async (): Promise<Action[]> => {
    await this.update();
    if (this.balance!.amountOf(Asset.ADA) < feesEtcLovelace) {
      // console.log(`not enough ada to pay fees etc.`);
      return [];
    }
    const action = new UserAction(this).generate();
    if (action) return [action];
    else return [];
  };

  public get account(): { address: Lucid.Address; assets: Lucid.Assets } {
    assert(this.address, "No address");
    assert(this.balance, "No balance");
    return {
      address: this.address,
      assets: this.balance.toLucid,
    };
  }

  public update = async (): Promise<number> => {
    const utxos = (await Promise.all([
      this.lucid.wallet.getUtxos(), // TODO update utxos-at-address-getting everywhere else to use wallet instead provider as well
      this.contract.update(),
    ]))[0];
    this.balance = utxos.map((utxo) => PositiveValue.fromLucid(utxo.assets))
      .reduce((a, b) => a.normedPlus(b), new PositiveValue());
    // // console.log(`balance: ${this.balance.concise()}`);
    this.lastIdNFT = this.contract.state!.pools.get(this.paymentKeyHash)?.last
      ?.lastIdNFT;

    return this.lucid.currentSlot();
  };

  // TODO use this and/or make this automatic in update() for example (only when a new block happens though)
  private resetMempool = (): void => {
    // console.log(
    //   `resetting:\n\nspent utxos: ${this.spentUtxos}\n\npending utxos:${this.pendingUtxos}`,
    // );
    this.spentUtxos.splice(0, this.spentUtxos.length);
    this.pendingUtxos.splice(0, this.pendingUtxos.length);
    this.usedSplitting = false;
  };

  private retry = async (): Promise<ActionResults[]> => {
    const results: ActionResults[] = [];
    const retrying_ = this.retrying.slice();
    this.retrying = [];
    for (const action of retrying_) {
      results.push(await this.execute(action));
    }
    return results;
  };

  public newBlock = async (): Promise<ActionResults[]> => {
    this.resetMempool();
    return await this.retry();
  };

  private updateMempool = (txCore: Lucid.C.Transaction) => {
    const txBody = txCore.body();
    const txHash_ = Lucid.C.hash_transaction(txBody);
    const txIns = txBody.inputs();
    const txOuts = txBody.outputs();
    const colls = txBody.collateral();

    for (let i = 0; i < txIns.len(); i++) {
      const txIn = txIns.get(i);
      this.spentUtxos.push({
        txHash: txIn.transaction_id().to_hex(),
        outputIndex: parseInt(txIn.index().to_str()),
      });
    }
    if (colls) {
      for (let i = 0; i < colls.len(); i++) {
        const txIn = colls.get(i);
        this.spentUtxos.push({
          txHash: txIn.transaction_id().to_hex(),
          outputIndex: parseInt(txIn.index().to_str()),
        });
      }
    }
    for (let i = 0; i < txOuts.len(); i++) {
      const txOut = txOuts.get(i);
      const address = txOut.address().to_bech32(undefined); // NOTE simplified version which does not work in byron (lol)
      if ((!this.userChaining) && (address !== this.contract.address)) {
        continue;
      }
      const txIn = Lucid.C.TransactionInput.new(
        txHash_,
        Lucid.C.BigNum.from_str(i.toString()),
      );
      const utxo = Lucid.C.TransactionUnspentOutput.new(txIn, txOut);
      this.pendingUtxos.push(Lucid.coreToUtxo(utxo));
    }
  };

  private signAndSubmit = async (
    tx: Lucid.Tx,
  ): Promise<TxResult> => {
    try {
      const txCompleted = await tx.complete();

      // // begin logging
      // const txBody = txCompleted.txComplete.body();
      // const txHash_ = Lucid.C.hash_transaction(txBody);
      // const txOuts = txBody.outputs();
      // for (let i = 0; i < txOuts.len(); i++) {
      //   const txOut = txOuts.get(i);
      //   const address = txOut.address().to_bech32(undefined); // NOTE simplified version which does not work in byron (lol)
      //   if (address !== this.contract.address) {
      //     continue;
      //   }
      //   const txIn = Lucid.C.TransactionInput.new(
      //     txHash_,
      //     Lucid.C.BigNum.from_str(i.toString()),
      //   );
      //   const utxo = Lucid.C.TransactionUnspentOutput.new(txIn, txOut);
      //   const bytes = BigInt(utxo.to_bytes().length);
      //   const coinsPerByte =
      //     (await this.lucid.provider.getProtocolParameters()).coinsPerUtxoByte;
      //   const lockedAda = bytes * coinsPerByte;
      //   console.log(
      //     "new - coinsPerByte:",
      //     coinsPerByte,
      //     "\tbytes:",
      //     bytes,
      //     "\tlockedAda:",
      //     lockedAda,
      //   );
      // }
      // // end logging

      const txSigned = await txCompleted.sign().complete();
      const txHash = await txSigned.submit();
      const txCore = txSigned.txSigned;
      this.updateMempool(txCore);
      return { txHash, txCore };
    } catch (e) {
      if (
        this.usedSplitting &&
        (e.toString().includes("Insufficient input in transaction") ||
          e.toString().includes("InputsExhaustedError"))
      ) {
        console.warn(
          `catching ${e} in user.signAndSubmit() after splitting`,
        );
        return new Error(e.toString());
      } else {
        throw e;
      }
    }
  };

  private execute_ = async (action: Action): Promise<TxResult[]> => {
    const tx = action.tx(this.lucid.newTx());
    try {
      const result = await this.signAndSubmit(tx);
      if (result instanceof Error) this.retrying.push(action); // means mempool-related issue right now
      else action.succeeded(result.txCore);
      return [result];
    } catch (e) {
      const e_ = e.toString();
      if (e_.includes("Maximum transaction size")) {
        console.log("splitting action...");
        const actions: Action[] = action.split();
        const results: TxResult[] = [];
        let first = true;
        // not using Promise.all here to ensure the mempool is handled correctly
        for (const action of actions) {
          console.log(`processing split action`);
          if (first) first = false;
          else this.usedSplitting = true;
          results.push(...await this.execute_(action));
        }
        return results;
      } else {
        throw e;
      }
    }
  };

  public execute = async (action: Action): Promise<ActionResults> => {
    const txHashes: string[] = [];
    const errors: Error[] = [];
    const results = await this.execute_(action);
    for (const result of results) {
      if (result instanceof Error) errors.push(result);
      else txHashes.push(result.txHash);
    }
    return { txHashes, errors };
  };

  static async fromWalletApi(
    lucid: Lucid.Lucid,
    api: Lucid.WalletApi,
  ): Promise<User> {
    const address = await lucid.selectWallet(api).wallet
      .address();
    // const protocolParameters = await lucid.provider.getProtocolParameters();
    return new User(lucid, undefined, address);
  }

  static async fromPrivateKey(
    lucid: Lucid.Lucid,
    privateKey: string,
  ): Promise<User> {
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    // const protocolParameters = await lucid.provider.getProtocolParameters();
    return new User(lucid, privateKey, address);
  }

  static async generateWith(
    lucid: Lucid.Lucid,
    allAssets: Assets,
  ): Promise<User> {
    const privateKey = Lucid.generatePrivateKey();
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    // const protocolParameters = await lucid.provider.getProtocolParameters();
    const user = new User(lucid, privateKey, address);
    user.balance = PositiveValue.genOfAssets(
      allAssets.boundedSubset(1n),
    ).normedPlus(forFeesEtc);
    return user;
  }

  // for propertytesting
  static generateDummy(): User {
    const lucid = new Lucid.Lucid();
    lucid.utils = new Lucid.Utils(lucid);
    const privateKey = Lucid.generatePrivateKey();
    const paymentKeyHash = PKeyHash.ptype.genData();
    // const protocolParameters = Lucid.PROTOCOL_PARAMETERS_DEFAULT;
    const user = new User(lucid, privateKey, undefined, paymentKeyHash);
    const assets = Assets.generate(2n);
    user.balance = PositiveValue.genOfAssets(assets);
    return user;
  }

  static async genSeveral(
    numUsers: bigint,
    numAssets: bigint,
  ): Promise<User[]> {
    const users = new Array<User>();
    const allAssets = Assets.generate(numAssets, numAssets);
    // // console.log(allAssets.show());
    const lucid = await Lucid.Lucid.new(undefined, "Custom");

    const addresses = new Array<Lucid.Address>();
    while (users.length < numUsers) {
      const user = await User.generateWith(lucid, allAssets);
      assert(user.address, `user.address is undefined`);
      if (!addresses.includes(user.address)) {
        addresses.push(user.address);
        users.push(user);
      }
    }
    return users;
  }
}

// function addLucidAssetsTo(a: LucidAssets, b: LucidAssets): void {
//   for (const asset in b) {
//     if (a[asset]) {
//       a[asset] += b[asset];
//     } else {
//       a[asset] = b[asset];
//     }
//   }
// }
