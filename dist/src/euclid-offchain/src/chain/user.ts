import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../lucid.mod.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { Asset } from "../types/general/derived/asset/asset.js";
import { Assets } from "../types/general/derived/asset/assets.js";
import { KeyHash, PKeyHash } from "../types/general/derived/hash/keyHash.js";
import { feesEtcLovelace } from "../utils/generators.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
import { Action, UserAction } from "./actions/action.js";

import { Contract } from "./contract.js";

const forFeesEtc = PositiveValue.singleton(
  Asset.ADA,
  10n * feesEtcLovelace,
); // costs in lovelace for fees etc. TODO excessive
// const feesEtc = PositiveValue.singleton(Asset.ADA, feesEtcLovelace);

export class User {
  public readonly contract: Contract;
  public readonly paymentKeyHash: KeyHash;
  public balance?: PositiveValue;

  private lastIdNFT?: IdNFT;

  private constructor(
    public readonly lucid: Lucid.Lucid,
    public readonly privateKey?: string, // for emulation
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

  public get availableBalance(): PositiveValue | undefined {
    assert(this.balance, "No balance");
    if (this.balance.amountOf(Asset.ADA, 0n) < feesEtcLovelace) {
      return undefined;
    }
    const available = this.balance.clone;
    available.drop(Asset.ADA); // TODO don't drop ADA completely
    return available;
    // return this.balance.normedMinus(feesEtc);
  }

  public get hasPools(): boolean {
    return this.lastIdNFT !== undefined;
  }

  public get nextParamNFT(): IdNFT {
    if (this.lastIdNFT) return this.lastIdNFT.next();
    else return new IdNFT(this.contract.policy, this.paymentKeyHash.hash());
  }

  // only needed for multiple actions within same iteration
  public setLastIdNFT = (idNFT: IdNFT): void => {
    this.lastIdNFT = idNFT;
  };

  // TODO consider generating several
  public generateActions = async (): Promise<Action[]> => {
    await this.update();
    if (this.balance!.amountOf(Asset.ADA) < feesEtcLovelace) {
      console.log(`not enough ada to pay fees etc.`);
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

  public update = async (): Promise<void> => {
    const utxos = (await Promise.all([
      this.lucid.utxosAt(this.address!),
      this.contract.update(),
    ]))[0];
    this.balance = utxos.map((utxo) => PositiveValue.fromLucid(utxo.assets))
      .reduce((a, b) => a.normedPlus(b), new PositiveValue());
    // console.log(`balance: ${this.balance.concise()}`);
    this.lastIdNFT = this.contract.state!.pools.get(this.paymentKeyHash)?.last
      ?.lastIdNFT;
  };

  static async fromWalletApi(
    lucid: Lucid.Lucid,
    api: Lucid.WalletApi,
  ): Promise<User> {
    const address = await lucid.selectWallet(api).wallet
      .address();
    return new User(lucid, undefined, address);
  }

  static async fromPrivateKey(
    lucid: Lucid.Lucid,
    privateKey: string,
  ): Promise<User> {
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    return new User(lucid, privateKey, address);
  }

  static async generateWith(
    lucid: Lucid.Lucid,
    allAssets: Assets,
  ): Promise<User> {
    const privateKey = Lucid.generatePrivateKey();
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
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
    // console.log(allAssets.show());
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