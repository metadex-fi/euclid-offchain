import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../lucid.mod.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { Asset } from "../types/general/derived/asset/asset.js";
import { Assets } from "../types/general/derived/asset/assets.js";
import { KeyHash, PKeyHash } from "../types/general/derived/hash/keyHash.js";
import { feesEtcLovelace } from "../utils/generators.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
import { UserAction } from "./actions/action.js";
import { Contract } from "./contract.js";
const forFeesEtc = PositiveValue.singleton(Asset.ADA, 10n * feesEtcLovelace); // costs in lovelace for fees etc. TODO excessive
// const feesEtc = PositiveValue.singleton(Asset.ADA, feesEtcLovelace);
export class User {
  constructor(
    lucid,
    privateKey, // for emulation
    address,
    paymentKeyHash,
  ) {
    Object.defineProperty(this, "lucid", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: lucid,
    });
    Object.defineProperty(this, "privateKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: privateKey,
    });
    Object.defineProperty(this, "address", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: address,
    });
    Object.defineProperty(this, "contract", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "paymentKeyHash", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "balance", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "lastIdNFT", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    // only needed for multiple actions within same iteration
    Object.defineProperty(this, "setLastIdNFT", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (idNFT) => {
        this.lastIdNFT = idNFT;
      },
    });
    // TODO consider generating several
    Object.defineProperty(this, "generateActions", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: async () => {
        await this.update();
        if (this.balance.amountOf(Asset.ADA) < feesEtcLovelace) {
          console.log(`not enough ada to pay fees etc.`);
          return [];
        }
        const action = new UserAction(this).generate();
        if (action) {
          return [action];
        } else {
          return [];
        }
      },
    });
    Object.defineProperty(this, "update", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: async () => {
        const utxos = (await Promise.all([
          this.lucid.utxosAt(this.address),
          this.contract.update(),
        ]))[0];
        this.balance = utxos.map((utxo) => PositiveValue.fromLucid(utxo.assets))
          .reduce((a, b) => a.normedPlus(b), new PositiveValue());
        // console.log(`balance: ${this.balance.concise()}`);
        this.lastIdNFT = this.contract.state.pools.get(this.paymentKeyHash)
          ?.last
          ?.lastIdNFT;
        return this.lucid.currentSlot();
      },
    });
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
  get availableBalance() {
    assert(this.balance, "No balance");
    if (this.balance.amountOf(Asset.ADA, 0n) < feesEtcLovelace) {
      return undefined;
    }
    const available = this.balance.clone;
    available.drop(Asset.ADA); // TODO don't drop ADA completely
    return available;
    // return this.balance.normedMinus(feesEtc);
  }
  get hasPools() {
    return this.lastIdNFT !== undefined;
  }
  get nextParamNFT() {
    if (this.lastIdNFT) {
      return this.lastIdNFT.next();
    } else {
      return new IdNFT(this.contract.policy, this.paymentKeyHash.hash());
    }
  }
  get account() {
    assert(this.address, "No address");
    assert(this.balance, "No balance");
    return {
      address: this.address,
      assets: this.balance.toLucid,
    };
  }
  static async fromWalletApi(lucid, api) {
    const address = await lucid.selectWallet(api).wallet
      .address();
    return new User(lucid, undefined, address);
  }
  static async fromPrivateKey(lucid, privateKey) {
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    return new User(lucid, privateKey, address);
  }
  static async generateWith(lucid, allAssets) {
    const privateKey = Lucid.generatePrivateKey();
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    const user = new User(lucid, privateKey, address);
    user.balance = PositiveValue.genOfAssets(allAssets.boundedSubset(1n))
      .normedPlus(forFeesEtc);
    return user;
  }
  // for propertytesting
  static generateDummy() {
    const lucid = new Lucid.Lucid();
    lucid.utils = new Lucid.Utils(lucid);
    const privateKey = Lucid.generatePrivateKey();
    const paymentKeyHash = PKeyHash.ptype.genData();
    const user = new User(lucid, privateKey, undefined, paymentKeyHash);
    const assets = Assets.generate(2n);
    user.balance = PositiveValue.genOfAssets(assets);
    return user;
  }
  static async genSeveral(numUsers, numAssets) {
    const users = new Array();
    const allAssets = Assets.generate(numAssets, numAssets);
    // console.log(allAssets.show());
    const lucid = await Lucid.Lucid.new(undefined, "Custom");
    const addresses = new Array();
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
