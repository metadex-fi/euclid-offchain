import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import { Assets, IdNFT, KeyHash, PKeyHash, PositiveValue } from "../mod.ts";
import { Swapping } from "./actions/swapping.ts";

import { Contract } from "./contract.ts";
import { Action, UserAction } from "./mod.ts";
import { Pool } from "./pool.ts";

type consequences = (u: User) => void;

export class User {
  public readonly contract: Contract;
  public readonly paymentKeyHash: KeyHash;

  public balance?: PositiveValue;
  public pools?: Pool[]; // own creation recall
  // public utxoPools?: UtxoPool[]; // from onchain
  private lastIdNFT?: IdNFT;

  public pendingConsequences?: consequences; // TODO not filled rn

  private constructor(
    public readonly lucid: Lucid.Lucid,
    public readonly privateKey: string,
    public readonly address?: Lucid.Address,
    paymentKeyHash?: KeyHash,
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
    } else {
      assert(paymentKeyHash, `neither address nor paymentKeyHash provided`);
      this.paymentKeyHash = paymentKeyHash;
    }
  }

  public get nextParamNFT(): IdNFT {
    if (this.lastIdNFT) return this.lastIdNFT.next();
    else return new IdNFT(this.contract.policy, this.paymentKeyHash.hash());
  }

  // TODO use this
  public setLastIdNFT = (idNFT: IdNFT): void => {
    this.lastIdNFT = idNFT;
  };

  public get swappings(): Swapping[] {
    if (
      this.contract.state === undefined ||
      this.balance === undefined ||
      this.balance.size < 1
    ) return [];
    else return this.contract.state.swappingsFor(this);
  }

  // TODO consider generating several
  public generateActions = async (): Promise<Action[]> => {
    await this.update();
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

  // TODO use this
  public dealWithConsequences = (): void => {
    if (this.pendingConsequences) {
      this.pendingConsequences(this);
      this.pendingConsequences = undefined;
    }
  };

  // public addPool = (pool: Pool): void => {
  //   if (!this.pools) this.pools = [];
  //   this.pools.push(pool);
  // };

  public update = async (): Promise<void> => {
    const utxos = (await Promise.all([
      this.lucid.utxosAt(this.address!),
      this.contract.update(),
    ]))[0];
    this.balance = utxos.map((utxo) => PositiveValue.fromLucid(utxo.assets))
      .reduce((a, b) => a.normedPlus(b));
    console.log(`balance: ${this.balance.concise()}`);
  };

  static async from(
    lucid: Lucid.Lucid,
    privateKey: string,
  ): Promise<User> {
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    return new User(lucid, privateKey, address);
  }

  static async generateWith(
    lucid: Lucid.Lucid,
  ): Promise<User> {
    const privateKey = Lucid.generatePrivateKey();
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    const user = new User(lucid, privateKey, address);
    return user;
  }

  // for propertytesting
  static generateDummy(): User {
    const lucid = new Lucid.Lucid();
    lucid.utils = new Lucid.Utils(lucid);
    const privateKey = Lucid.generatePrivateKey();
    const paymentKeyHash = PKeyHash.ptype.genData();
    const user = new User(lucid, privateKey, undefined, paymentKeyHash);
    const assets = Assets.generate(2n);
    user.balance = PositiveValue.genOfAssets(assets);
    return user;
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
