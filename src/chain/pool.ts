import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import { AdminRedeemer, PEuclidAction } from "../types/euclid/euclidAction.ts";
import { IdNFT } from "../types/euclid/idnft.ts";
import { AssocMap } from "../types/general/fundamental/container/map.ts";
import { Data, f, t } from "../types/general/fundamental/type.ts";
import { Swapping } from "./actions/swapping.ts";
import { Contract } from "./contract.ts";
import { User } from "./user.ts";
import { DiracUtxo, ParamUtxo, PreDiracUtxo } from "./utxo.ts";

export class PrePool {
  public paramUtxo?: ParamUtxo;
  public preDiracUtxos?: AssocMap<IdNFT, PreDiracUtxo>;

  public setParamUtxo = (paramUtxo: ParamUtxo): PrePool => {
    assert(
      !this.paramUtxo,
      `duplicate paramNFT for ${this.paramUtxo?.paramNFT.show()}`,
    );
    this.paramUtxo = paramUtxo;
    return this;
  };

  public addPreDiracUtxo = (preDiracUtxo: PreDiracUtxo): PrePool => {
    const threadNFT = preDiracUtxo.preDirac.threadNFT;
    if (!this.preDiracUtxos) {
      this.preDiracUtxos = new AssocMap<IdNFT, PreDiracUtxo>(
        (kh) => kh.show(),
      );
    }
    assert(
      !this.preDiracUtxos.has(threadNFT),
      `CRITICAL: duplicate dirac ${threadNFT}`,
    );
    this.preDiracUtxos.set(threadNFT, preDiracUtxo);
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

  public show = (tabs = "") => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `PrePool {
${ttf}paramUtxo: ${this.paramUtxo?.show(ttf)}
${ttf}preDiracUtxos: ${this.preDiracUtxos?.show((pdu, ts) => pdu.show(ts), ttf)}
${tt}}`
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

  public get lastIdNFT(): IdNFT {
    if (this.diracUtxos) {
      return this.diracUtxos[this.diracUtxos.length - 1].dirac.threadNFT;
    } else return this.paramUtxo.paramNFT;
  }

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    let tx_ = this.paramUtxo.openingTx(tx, contract);
    // let remaining = this.diracUtxos.slice(0, 100); TODO this is for splitting larger txes
    this.diracUtxos.forEach((diracUtxo) =>
      tx_ = diracUtxo.openingTx(tx_, contract)
    );
    return tx_;
  };

  public closingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const adminRedeemer = PEuclidAction.ptype.pconstant(
      new AdminRedeemer(),
    );

    const burningNFTs: Lucid.Assets = {};
    for (
      const nft of [
        this.paramUtxo.paramNFT,
        ...this.diracUtxos.map((d) => d.dirac.threadNFT),
      ]
    ) {
      burningNFTs[nft.toLucid] = -1n;
    }

    return tx // TODO read script?
      .attachMintingPolicy(contract.mintingPolicy)
      .mintAssets(burningNFTs, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
      .collectFrom(
        this.utxos,
        Data.to(adminRedeemer),
      );
  };

  public swappingsFor(user: User): Swapping[] {
    const balance = user.availableBalance;
    if (!balance) return [];
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
