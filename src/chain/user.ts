import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Address,
  Assets as LucidAssets,
  Data,
  generatePrivateKey,
  Lucid,
  Tx,
  TxHash,
  Utils,
  utxoToCore,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Amounts,
  Asset,
  Assets,
  Dirac,
  DiracDatum,
  f,
  genPositive,
  IdNFT,
  KeyHash,
  min,
  PKeyHash,
  randomChoice,
  Token,
} from "../mod.ts";
import { Contract } from "./contract.ts";
import { Pool } from "./pool.ts";

type consequences = (u: User) => void;

export class User {
  public readonly contract: Contract;
  public readonly paymentKeyHash: KeyHash;

  public balance?: Amounts;
  public pools?: Pool[]; // own creation recall
  // public utxoPools?: UtxoPool[]; // from onchain
  private lastIdNFT?: IdNFT;

  public pendingConsequences?: consequences;

  private constructor(
    public readonly lucid: Lucid,
    public readonly privateKey: string,
    public readonly address?: Address,
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

  public nextParamNFT = (): IdNFT => {
    if (this.lastIdNFT) return this.lastIdNFT.next();
    else return new IdNFT(this.contract.currency, this.paymentKeyHash.hash());
  };

  public setLastIdNFT = (idNFT: IdNFT): void => {
    this.lastIdNFT = idNFT;
  };

  public numPools = (): bigint => {
    assert(this.pools, "no pools");
    return BigInt(this.pools.length);
  };

  static async from(
    lucid: Lucid,
    privateKey: string,
  ): Promise<User> {
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    return new User(lucid, privateKey, address);
  }

  static async generateWith(
    lucid: Lucid,
  ): Promise<User> {
    const privateKey = generatePrivateKey();
    const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet
      .address();
    const user = new User(lucid, privateKey, address);
    return user;
  }

  // for propertytesting
  static generateDummy(): User {
    const lucid = new Lucid();
    lucid.utils = new Utils(lucid);
    const privateKey = generatePrivateKey();
    const paymentKeyHash = PKeyHash.ptype.genData();
    const user = new User(lucid, privateKey, undefined, paymentKeyHash);
    const assets = Assets.generate(2n);
    user.balance = Amounts.genOfAssets(assets);
    return user;
  }

  public account = (): { address: Address; assets: LucidAssets } => {
    assert(this.address, "No address");
    assert(this.balance, "No balance");
    return {
      address: this.address,
      assets: this.balance.toLucid(),
    };
  };

  public dealWithConsequences = (): void => {
    if (this.pendingConsequences) {
      this.pendingConsequences(this);
      this.pendingConsequences = undefined;
    }
  };

  public addPool = (pool: Pool): void => {
    if (!this.pools) this.pools = [];
    this.pools.push(pool);
  };

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address!);
    const assets: LucidAssets = {};
    utxos.forEach((utxo) => {
      Object.entries(utxo.assets).forEach(([asset, amount]) => {
        assets[asset] = amount + BigInt(assets[asset] ?? 0);
      });
    });
    this.balance = Amounts.fromLucid(assets);
  };

  public ownsPools = (): boolean => {
    return this.pools ? this.pools.length > 0 : false;
  };

  public genOpenTx = (): Tx => {
    return Pool.generate(this).openingTx(this);
  };

  // public genCloseTx = (pool: Pool): Tx => {
  // };

  // public genAdminTx = (pool: Pool): Tx => {
  // };

  // public genOwnerTx = (): Tx => {
  //   const utxoPools = this.contract.state!.utxoPools!.get(this.address);
  //   const pool = randomChoice(this.pools!);
  //   return randomChoice([
  //     this.genCloseTx,
  //     this.genAdminTx,
  //   ])(pool);
  // };

  public genFlipTx = (pool: Pool): Tx => {
    const diracUtxo = randomChoice(pool.flippable!);
    const dirac = diracUtxo.dirac;

    const boughtAsset = dirac.activeAmnts.assets().randomChoice();
    const boughtPrice = dirac.prices.amountOf(boughtAsset);
    const maxBoughtA0 = dirac.activeAmnts.amountOf(boughtAsset) * boughtPrice;

    const otherAssets = diracUtxo.flippable!;
    otherAssets.remove(boughtAsset);
    const soldAsset = otherAssets.randomChoice();
    const soldPrice = dirac.prices.amountOf(soldAsset);
    const maxSoldA0 = dirac.activeAmnts.amountOf(soldAsset) * soldPrice;

    const flippedA0 = genPositive(min(maxBoughtA0, maxSoldA0));
    const soldAmount = flippedA0 / soldPrice;
    const boughtAmount = (soldAmount * soldPrice) / boughtPrice;

    const newAmounts = dirac.activeAmnts.clone();
    newAmounts.addAmountOf(boughtAsset, boughtAmount);
    newAmounts.addAmountOf(soldAsset, -soldAmount);

    assert(diracUtxo.balance, `diracUtxo.balance is undefined`);
    const newBalance = diracUtxo.balance.clone();
    newBalance.addAmountOf(boughtAsset, boughtAmount);
    newBalance.addAmountOf(soldAsset, -soldAmount);

    const diracDatum = new DiracDatum(
      new Dirac(
        dirac.owner,
        dirac.threadNFT,
        dirac.paramNFT,
        dirac.prices,
        newAmounts,
        dirac.jumpStorage,
      ),
    );

    assert(pool.paramUtxo.utxo, `pool.paramUtxo.utxo is undefined`);
    const tx = this.lucid.newTx()
      .readFrom([pool.paramUtxo.utxo]) // for the script
      .payToContract(
        this.contract.address,
        { inline: Data.to(diracDatum) },
        newBalance.toLucid(),
      );

    assert(diracUtxo.utxo, `diracUtxo.utxo is undefined`);
    tx.txBuilder.add_input( // TODO see if this works
      utxoToCore(diracUtxo.utxo),
      undefined, // TODO see if that's required
    );

    return tx;
  };

  public genJumpTx = (pool: Pool): Tx => {
    throw new Error("Not implemented");
  };

  public genUserTx = (openUtxoPools: Pool[]) => (): Tx => {
    const utxoPool = randomChoice(openUtxoPools);
    return randomChoice([
      ...utxoPool.flippable!.length ? [this.genFlipTx] : [],
      // ...utxoPool.jumpable!.length ? [this.genJumpTx] : [],
    ])(utxoPool);
  };

  public txOptions = async (): Promise<(() => Tx)[]> => {
    await Promise.all([this.update(), this.contract.update()]);

    const openUtxoPools = this.contract.state!.openForBusiness(
      this.balance!.assets(),
    );
    return [
      // ...this.isOwner() ? [this.genOwnerTx] : [], // TODO get pools from contract.state
      // ...openUtxoPools.length ? [this.genUserTx(openUtxoPools)] : [],
      ...this.balance!.size() >= 2n ? [this.genOpenTx] : [],
    ];
  };

  public genEuclidTx = async (options: (() => Tx)[]): Promise<TxHash> => {
    const genTx = randomChoice(options);
    const tx = genTx();
    try {
      const complete = await tx.complete();
      const signed = await complete.sign().complete();
      return await signed.submit();
    } catch (e) {
      console.log(e);
      return "";
    }
  };
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
