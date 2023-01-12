import {
  Address,
  Assets,
  fromText,
  Lucid,
  toUnit,
  Tx,
  TxComplete,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { randomChoice } from "../mod.ts";

export class User {
  public assets: Assets = {};

  constructor(
    public lucid: Lucid,
    public address: Address,
  ) {}

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    const assets = {};
    utxos.forEach((utxo) => {
      addAssetsTo(assets, utxo.assets);
    });
    this.assets = assets;
  };

  public isEuclidEligible = (): boolean => {
    return Object.keys(this.assets).length >= 2;
  };

  public genOpenTx = (): Tx => {
    return this.lucid.newTx()
      .mintAssets({
        [toUnit(policyId, fromText("Wow"))]: 123n,
      })
      .validTo(emulator.now() + 30000)
      .attachMintingPolicy(mintingPolicy);
  };

  public genCloseTx = (): Tx => {
  };

  public genAdminTx = (): Tx => {
  };

  public genFlipTx = (): Tx => {
  };

  public genJumpTx = (): Tx => {
  };

  public genOwnerTx = (): Tx => {
    return randomChoice([
      this.genOpenTx,
      this.genCloseTx,
      this.genAdminTx,
    ])();
  };

  public genUserTx = (): Tx => {
    return randomChoice([
      this.genFlipTx,
      this.genJumpTx,
    ])();
  };

  public genEuclidTx = async (): Promise<TxComplete> => {
    await this.update();
    const genTx = this.isEuclidEligible()
      ? randomChoice([
        this.genOwnerTx,
        this.genUserTx,
      ])
      : this.genUserTx;

    return await genTx().complete();
  };
}

function addAssetsTo(a: Assets, b: Assets): void {
  for (const asset in b) {
    if (a[asset]) {
      a[asset] += b[asset];
    } else {
      a[asset] = b[asset];
    }
  }
}
