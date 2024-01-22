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
import { PositiveValue } from "../types/general/derived/value/positiveValue.ts";
import { ParamDatum, PPreEuclidDatum } from "../types/euclid/euclidDatum.ts";
import { Value } from "../types/general/derived/value/value.ts";
import { Asset } from "../types/general/derived/asset/asset.ts";
import { Assets } from "../types/general/derived/asset/assets.ts";
import { handleInvalidPools } from "../utils/constants.ts";
import { SwapfindingVariant } from "./actions/swapfinding6/swapsForPair.ts";

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
      else if (handleInvalidPools) invalidDiracUtxos.push(preDiracUtxo);
      else throw new Error(`invalid dirac utxo: ${preDiracUtxo.show()}`);
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
    private readonly paramContainingSplit = true,
  ) {}

  // public get utxos(): Lucid.UTxO[] {
  //   assert(this.paramUtxo.utxo, "pool.utxos(): paramUtxo.utxo is undefined");
  //   return [
  //     ...(this.paramContainingSplit ? [this.paramUtxo.utxo] : []),
  //     ...this.diracUtxos.map((d) => d.utxo!)
  //   ];
  // }

  public get idNFT(): IdNFT {
    return this.paramUtxo.paramNFT;
  }

  public get lastIdNFT(): IdNFT {
    if (this.diracUtxos) {
      return this.diracUtxos[this.diracUtxos.length - 1].dirac.threadNFT;
    } else return this.paramUtxo.paramNFT;
  }

  private balance = (total: boolean): Value => {
    const assets = this.paramUtxo.param.assets;
    const sum = this.diracUtxos.reduce(
      (a, b) => a.normedPlus(total ? b.funds : b.available),
      new PositiveValue(),
    ).ofAssets(this.paramUtxo.param.assets);

    const sum_ = sum.unsigned;
    assets.forEach((asset) => {
      sum_.fillAmountOf(asset, 0n);
    });

    return sum_;
  };

  public get available() {
    return this.balance(false);
  }
  public get funds() {
    return this.balance(true);
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
      const pricesA0 = Value.hadamard(
        Value.normedAdd(d.funds.ofAssets(assets).unsigned, virtual),
        weights,
      );
      const pricesA1 = new AssocMap<Asset, number>((a) => a.concise());
      const priceA0_1 = Number(pricesA0.amountOf(a1));
      let valueA1 = 0;
      assets.forEach((asset) => {
        const priceA1_i = priceA0_1 / Number(pricesA0.amountOf(asset));
        pricesA1.set(asset, priceA1_i);
        valueA1 += Number(d.funds.amountOf(asset, 0n)) * priceA1_i;
      });
      return {
        pricesA1: pricesA1,
        valueA1: valueA1,
      };
    });
  }

  public show = (tabs = "") => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `Pool {
${ttf}diracUtxos: ${this.diracUtxos.length}
${ttf}paramUtxo: ${this.paramUtxo?.show(ttf)}
${ttf}first diracUtxo: ${this.diracUtxos[0]?.show(ttf)}
${tt}}`; // .map((d) => d.show(ttf)).join(",\n" + ttf)}
  };

  public split = (): Pool[] => {
    console.log(`splitting pool`);
    assert(this.diracUtxos.length > 1, "Pool is not splittable");
    const half = Math.floor(this.diracUtxos.length / 2);
    const diracUtxos1 = this.diracUtxos.slice(0, half);
    const diracUtxos2 = this.diracUtxos.slice(half);
    return [
      new Pool(this.paramUtxo, diracUtxos1, this.paramContainingSplit),
      new Pool(this.paramUtxo, diracUtxos2, false),
    ];
  };

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    console.log("Building opening-tx for pool:", this.show());
    // this.diracUtxos.forEach((diracUtxo) => console.log(diracUtxo.show()));
    let tx_ = this.paramUtxo.openingTx(tx, contract, this.paramContainingSplit);
    // let remaining = this.diracUtxos.slice(0, 100); TODO this is for splitting larger txes
    this.diracUtxos.forEach((diracUtxo) =>
      tx_ = diracUtxo.openingTx(tx_, contract)
    );
    return tx_;
  };

  public closingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    console.log("Building closing-tx for pool:", this.show());
    const adminRedeemer = PEuclidAction.ptype.pconstant(
      new AdminRedeemer(),
    );
    const redeemer = Data.to(adminRedeemer);

    // this.diracUtxos.forEach((diracUtxo) => console.log(diracUtxo.show()));
    let tx_ = this.paramUtxo.closingTx(
      tx,
      contract,
      redeemer,
      this.paramContainingSplit,
    );
    // let remaining = this.diracUtxos.slice(0, 100); TODO this is for splitting larger txes
    this.diracUtxos.forEach((diracUtxo) =>
      tx_ = diracUtxo.closingTx(tx_, redeemer)
    );
    return tx_;
  };

  // public closingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
  //   console.log("Building closing-tx for pool:", this.show());
  //   const adminRedeemer = PEuclidAction.ptype.pconstant(
  //     new AdminRedeemer(),
  //   );
  //   const redeemer = Data.to(adminRedeemer);

  //   const burningNFTs: Lucid.Assets = {};
  //   for (
  //     const nft of [
  //       ...(this.paramContainingSplit ? [this.paramUtxo.paramNFT] : []),
  //       ...this.diracUtxos.map((d) => d.dirac.threadNFT),
  //     ]
  //   ) {
  //     burningNFTs[nft.toLucid] = -1n;
  //   }

  //   return tx // TODO read script?
  //     .attachMintingPolicy(contract.mintingPolicy)
  //     .mintAssets(burningNFTs, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
  //     .collectFrom(
  //       this.utxos,
  //       redeemer,
  //     );
  // };

  public switchingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    console.log("Building switching-tx for pool:", this.show());
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

  public swappingsFor(
    user: User | null,
    variant: SwapfindingVariant,
    minBuying: bigint,
    minSelling: bigint,
    minExpMults: number,
    maxExpMults: number,
  ): Swapping[] {
    if (this.paramUtxo.param.active === 0n) return [];
    const balance = user?.availableBalance;
    console.log("pool.swappingsFor balance", balance?.concise());
    if (user && !balance) return [];
    const sellableBalance = balance?.ofAssets(this.paramUtxo.param.assets)
      .unsigned;
    console.log(
      "pool.swappingsFor sellableBalance",
      sellableBalance?.concise(),
    );
    if (user && !sellableBalance!.size) return [];
    return this.diracUtxos.flatMap((d) =>
      d.swappingsFor(
        user,
        this.paramUtxo,
        variant,
        minBuying,
        minSelling,
        minExpMults,
        maxExpMults,
        sellableBalance,
        undefined,
        undefined,
      )
    );
  }

  static parse(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool {
    return new Pool(paramUtxo, diracUtxos);
  }

  static open(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool {
    return new Pool(paramUtxo, diracUtxos);
  }
}
