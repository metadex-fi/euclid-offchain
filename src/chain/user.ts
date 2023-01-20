import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Address,
  Assets as LucidAssets,
  Data,
  Lucid,
  Tx,
  TxComplete,
  Utils,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { EuclidState } from "../chain/euclidState.ts";
import { DiracUtxo, ParamUtxo } from "../chain/euclidUtxo.ts";
import {
  Amounts,
  Asset,
  Assets,
  DiracDatum,
  f,
  IdNFT,
  Param,
  ParamDatum,
  ParamNFT,
  PositiveValue,
  PParamDatum,
  PPaymentKeyHash,
  randomChoice,
  Value,
} from "../mod.ts";
import { Pool } from "../types/euclid/pool.ts";
import { Contract } from "./contract.ts";

export class User {
  public readonly state: EuclidState;
  public readonly contract: Contract;

  public balance: Amounts | undefined;
  public pools = new Map<string, Pool>();
  public nextParamNFT: IdNFT;

  constructor(
    public readonly lucid: Lucid,
    public readonly address: Address,
  ) {
    this.contract = new Contract(lucid);
    this.state = new EuclidState(this.lucid, this.contract.address);
    this.nextParamNFT = new ParamNFT(this.contract.policyId, this.address);
  }

  // for propertytesting
  static generateDummy(): User {
    const lucid = new Lucid();
    lucid.utils = new Utils(lucid);
    const address = PPaymentKeyHash.genData();
    const user = new User(lucid, address);
    const assets = Assets.generate(2n);
    user.balance = Amounts.genOfAssets(assets);
    return user;
  }

  public addPool = (pool: Pool): void => {
    const nft = pool.paramNFT.show();
    assert(
      !this.pools.has(nft),
      `addPool: pool already exists for ${nft}`,
    );
    this.pools.set(nft, pool);
  };

  public showPools = (): string => {
    return `Pools:\n${
      [...this.pools.entries()].map(([nft, pool]) =>
        `${f}${nft} => ${pool.show(f)}`
      ).join(",\n")
    }`;
  };

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    const assets: LucidAssets = {};
    utxos.forEach((utxo) => {
      Object.entries(utxo.assets).forEach(([asset, amount]) => {
        assets[asset] = amount + assets[asset] ?? 0n;
      });
    });
    this.balance = Amounts.fromLucid(assets);
  };

  public isOwner = (): boolean => {
    return this.pools.size > 0;
  };

  public genOpenTx = (): Tx => {
    return Pool.generateForUser(this)().openingTx(this)
  };

  // public genCloseTx = (param: ParamUtxo, diracs: DiracUtxo[]): Tx => {
  // };

  // public genAdminTx = (param: ParamUtxo, diracs: DiracUtxo[]): Tx => {
  // };

  // public genFlipTx = (): Tx => {
  // };

  // public genJumpTx = (): Tx => {
  // };

  // public genOwnerTx = (): Tx => {
  //   const param = randomChoice(Array.from(this.pools.keys()));
  //   const diracs = this.pools.get(param) ?? [];
  //   return randomChoice([
  //     this.genCloseTx,
  //     this.genAdminTx,
  //   ])(param, diracs);
  // };

  // public genUserTx = (): Tx => {
  //   return randomChoice([
  //     this.genFlipTx,
  //     this.genJumpTx,
  //   ])();
  // };

  // public genEuclidTx = async (): Promise<TxComplete> => {
  //   await Promise.all([this.update(), this.state.update()]);
  //   this.pools = this.state.get(this.address);

  //   const genTx = randomChoice([
  //     ...this.isOwner() ? [this.genOwnerTx] : [],
  //     this.genOpenTx,
  //     this.genUserTx,
  //   ]);

  //   return await genTx().complete();
  // };
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
