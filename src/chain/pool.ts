import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { AssocMap, IdNFT, PIdNFT } from "../mod.ts";
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
        this.paramUtxo.paramNFT,
        threadNFT,
      );
      if (parsedDiracUtxo) parsedDiracUtxos.push(parsedDiracUtxo);
      else invalidDiracUtxos.push(preDiracUtxo);
    }
    if (!parsedDiracUtxos.length) return undefined;
    return [
      new Pool(this.paramUtxo, parsedDiracUtxos),
      threadNFTs[threadNFTs.length - 1],
    ];
  };
}

export class Pool {
  constructor(
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxos: DiracUtxo[],
  ) {}

  //   public openingTx = (tx: Lucid.Tx, user: User): Lucid.Tx => {
  //     console.log(`opening pool`);
  //     let tx_ = this.paramUtxo.openingTx(tx, user);
  //     this.diracUtxos.forEach((diracUtxo) =>
  //       tx_ = diracUtxo.openingTx(user, tx_)
  //     );
  //     return tx_;
  //   };
}
