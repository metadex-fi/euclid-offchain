import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import { AssocMap, IdNFT, PIdNFT } from "../mod.ts";
import { Contract } from "./mod.ts";
import { DiracUtxo, ParamUtxo, PreDiracUtxo } from "./utxo.ts";

export class PrePool {
  public paramUtxo?: ParamUtxo;
  public preDiracUtxos?: AssocMap<PIdNFT, PreDiracUtxo>;

  public setParamUtxo = (paramUtxo: ParamUtxo): PrePool => {
    assert(!this.paramUtxo, `duplicate param ${paramUtxo}`);
    this.paramUtxo = paramUtxo;
    return this;
  };

  public addPreDiracUtxo = (preDiracUtxo: PreDiracUtxo): PrePool => {
    const paramNFT = preDiracUtxo.dirac.paramNFT;
    if (!this.preDiracUtxos) {
      this.preDiracUtxos = new AssocMap<PIdNFT, PreDiracUtxo>(
        new PIdNFT(paramNFT.currency),
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

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    let tx_ = this.paramUtxo.openingTx(tx, contract);
    this.diracUtxos.forEach((diracUtxo) =>
      tx_ = diracUtxo.openingTx(tx_, contract)
    );
    return tx_;
  };

  static parse(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool {
    return new Pool(paramUtxo, diracUtxos);
  }

  static open(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool {
    return new Pool(paramUtxo, diracUtxos);
  }
}
