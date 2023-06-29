import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../lucid.mod.js";
import { AdminRedeemer, PEuclidAction } from "../types/euclid/euclidAction.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { AssocMap } from "../types/general/fundamental/container/map.js";
import { Data, f, t } from "../types/general/fundamental/type.js";
import { Swapping } from "./actions/swapping.js";
import { Contract } from "./contract.js";
import { User } from "./user.js";
import { DiracUtxo, ParamUtxo, PreDiracUtxo } from "./utxo.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
import { ParamDatum, PPreEuclidDatum } from "../types/euclid/euclidDatum.js";
import { Value } from "../types/general/derived/value/value.js";
import { Asset } from "../types/general/derived/asset/asset.js";
import { Assets } from "../types/general/derived/asset/assets.js";
import { EuclidValue } from "../mod.js";

export class PrePool {
  public paramUtxo?: ParamUtxo;
  public preDiracUtxos?: AssocMap<IdNFT, PreDiracUtxo>;

  public get utxos(): Lucid.UTxO[] {
    return [
      ...(this.paramUtxo ? [this.paramUtxo.utxo!] : []),
      ...(this.preDiracUtxos
        ? [...this.preDiracUtxos.values()].map((d) => d.utxo!)
        : []),
    ];
  }

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
${tt}}`;
  };

  public cleaningTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const adminRedeemer = PEuclidAction.ptype.pconstant(
      new AdminRedeemer(),
    );

    const burningNFTs: Lucid.Assets = {};
    for (
      const nft of [
        ...(this.paramUtxo ? [this.paramUtxo.paramNFT] : []),
        ...(this.preDiracUtxos ? [...this.preDiracUtxos.keys()] : []),
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
}

export type DiracPriceValueA1 = {
  pricesA1: AssocMap<Asset, number>; // uninverted
  valueA1: number;
};

export class Pool {
  private constructor(
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxos: DiracUtxo[],
  ) {}

  public get utxos(): Lucid.UTxO[] {
    return [this.paramUtxo.utxo!, ...this.diracUtxos.map((d) => d.utxo!)];
  }

  public get idNFT(): IdNFT {
    return this.paramUtxo.paramNFT;
  }

  public get lastIdNFT(): IdNFT {
    if (this.diracUtxos) {
      return this.diracUtxos[this.diracUtxos.length - 1].dirac.threadNFT;
    } else return this.paramUtxo.paramNFT;
  }

  public get balance(): Value {
    const assets = this.paramUtxo.param.assets;
    const total = this.diracUtxos.reduce(
      (a, b) => a.normedPlus(b.balance),
      new PositiveValue(),
    ).ofAssets(this.paramUtxo.param.assets);

    const total_ = total.unsigned;
    assets.forEach((asset) => {
      total_.fillAmountOf(asset, 0n);
    });

    return total_;
  }

  public get assets(): Assets {
    return this.paramUtxo.param.assets;
  }

  public get weightedPrices(): DiracPriceValueA1[] {
    const assets = this.assets;
    const a1 = assets.head;
    const weights = this.paramUtxo.param.weights.unsigned;
    const virtual = this.paramUtxo.param.virtual.unsigned;
    return this.diracUtxos.map((d) => {
      const pricesA0 = Value.hadamard(Value.normedAdd(d.balance.ofAssets(assets).unsigned, virtual), weights);
      const pricesA1 = new AssocMap<Asset, number>((a) => a.concise());
      const priceA0_1 = Number(pricesA0.amountOf(a1));
      let valueA1 = 0;
      assets.forEach((asset) => {
        const priceA1_i = priceA0_1 / Number(pricesA0.amountOf(asset));
        pricesA1.set(asset, priceA1_i);
        valueA1 += Number(d.balance.amountOf(asset, 0n)) * priceA1_i;
      });
      return {
        pricesA1: pricesA1,
        valueA1: valueA1,
      }
    });
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

  public switchingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const adminRedeemer = PEuclidAction.ptype.pconstant(
      new AdminRedeemer(),
    );

    const peuclidDatum = PPreEuclidDatum.genPType(); //only need this for ParamDatum, so this is fine
    const paramDatum = peuclidDatum.pconstant(
      new ParamDatum(this.paramUtxo.param.switched),
    );

    return tx
      .collectFrom(
        [this.paramUtxo.utxo!],
        Data.to(adminRedeemer),
      )
      .payToContract(
        contract.address,
        {
          inline: Data.to(paramDatum),
          scriptRef: contract.validator, // for now, for simplicities' sake
        },
        this.paramUtxo.utxo!.assets,
      );
  };

  public swappingsFor(user: User): Swapping[] {
    if (this.paramUtxo.param.active === 0n) return [];
    const balance = user.availableBalance;
    // console.log("pool.swappingsFor balance", balance)
    if (!balance) return [];
    const sellableBalance = balance.ofAssets(this.paramUtxo.param.assets);
    // console.log("pool.swappingsFor sellableBalance", sellableBalance)
    if (!sellableBalance.size) return [];
    return this.diracUtxos.flatMap((d) =>
      d.swappingsFor(user, this.paramUtxo, sellableBalance.unsigned)
    );
  }

  static parse(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool {
    return new Pool(paramUtxo, diracUtxos);
  }

  static open(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool {
    return new Pool(paramUtxo, diracUtxos);
  }
}
