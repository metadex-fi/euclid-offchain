import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import { IdNFT } from "../types/euclid/idnft.ts";
import { AssocMap } from "../types/general/fundamental/container/map.ts";
import { Swapping } from "./actions/swapping.ts";
import { Contract } from "./contract.ts";
import { User } from "./user.ts";
import { DiracUtxo, ParamUtxo, PreDiracUtxo } from "./utxo.ts";

export class PrePool {
  public paramUtxo?: ParamUtxo;
  public preDiracUtxos?: AssocMap<IdNFT, PreDiracUtxo>;

  public setParamUtxo = (paramUtxo: ParamUtxo): PrePool => {
    assert(!this.paramUtxo, `duplicate param ${paramUtxo}`);
    this.paramUtxo = paramUtxo;
    return this;
  };

  public addPreDiracUtxo = (preDiracUtxo: PreDiracUtxo): PrePool => {
    const paramNFT = preDiracUtxo.dirac.paramNFT;
    if (!this.preDiracUtxos) {
      this.preDiracUtxos = new AssocMap<IdNFT, PreDiracUtxo>(
        (kh) => kh.show(),
      );
    }
    assert(
      !this.preDiracUtxos.has(paramNFT),
      `CRITICAL: duplicate dirac ${paramNFT}`,
    );
    this.preDiracUtxos.set(paramNFT, preDiracUtxo);
    return this;
  };

  public parse = (): [Pool, IdNFT] | undefined => {
    if (!this.paramUtxo || !this.preDiracUtxos) return undefined; // TODO consider if critical, then handle and/or log resp.
    const subsequents = this.paramUtxo.paramNFT.sortSubsequents([
      ...this.preDiracUtxos.keys(),
    ]); // TODO  consider if invalids critical, then handle and/or log resp.
    const threadNFTs = subsequents.sorted;
    const parsedDiracUtxos = new Array<DiracUtxo>();
    const invalidDiracUtxos = new Array<PreDiracUtxo>();
    for (const threadNFT of threadNFTs) {
      const preDiracUtxo = this.preDiracUtxos.get(threadNFT)!;
      const parsedDiracUtxo = preDiracUtxo.parse(
        this.paramUtxo.param,
      );
      if (parsedDiracUtxo) parsedDiracUtxos.push(parsedDiracUtxo);
      else invalidDiracUtxos.push(preDiracUtxo);
    }
    if (!parsedDiracUtxos.length) return undefined;
    return [
      Pool.parse(this.paramUtxo, parsedDiracUtxos),
      threadNFTs[threadNFTs.length - 1],
    ];
  };
}

export class Pool {
  private constructor(
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxos: DiracUtxo[],
  ) {}

  public get utxos(): Lucid.UTxO[] {
    return [this.paramUtxo.utxo!, ...this.diracUtxos.map((d) => d.utxo!)];
  }

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    let tx_ = this.paramUtxo.openingTx(tx, contract);
    // let remaining = this.diracUtxos.slice(0, 100);
    this.diracUtxos.forEach((diracUtxo) =>
      tx_ = diracUtxo.openingTx(tx_, contract)
    );
    return tx_;
  };

  public closingTx = (tx: Lucid.Tx): Lucid.Tx => {
    let tx_ = this.paramUtxo.closingTx(tx);
    this.diracUtxos.forEach((diracUtxo) => tx_ = diracUtxo.closingTx(tx_));
    return tx_;
  };

  public swappingsFor(user: User): Swapping[] {
    const balance = user.availableBalance;
    const sellableBalance = balance.ofAssets(this.paramUtxo.param.assets);
    if (!sellableBalance.size) return [];
    return this.diracUtxos.flatMap((d) =>
      d.swappingsFor(user, this, sellableBalance.unsigned)
    );
  }

  static parse(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool {
    return new Pool(paramUtxo, diracUtxos);
  }

  static open(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool {
    return new Pool(paramUtxo, diracUtxos);
  }
}
