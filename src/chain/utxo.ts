import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import {
  Assets,
  Data,
  Dirac,
  DiracDatum,
  EuclidValue,
  f,
  IdNFT,
  Param,
  ParamDatum,
  PDiracDatum,
  PositiveValue,
  PParamDatum,
  PPreDiracDatum,
  t,
} from "../mod.ts";
import { Contract } from "./mod.ts";
import { User } from "./user.ts";

export class ParamUtxo {
  constructor(
    public readonly param: Param,
    public readonly paramNFT: IdNFT,
    public readonly utxo?: Lucid.UTxO, //exists only when reading, not when creating
  ) {}

  static parse(
    utxo: Lucid.UTxO,
    fields: Data[],
  ): ParamUtxo {
    const param = PParamDatum.ptype.plift(fields).param;
    const balance = PositiveValue.fromLucid(
      utxo.assets,
    );
    assert(
      balance.size() === 1n,
      `expected exactly id-NFT in ${balance.concise()}`,
    );
    const paramNFT = IdNFT.fromAsset(balance.firstAsset());

    return new ParamUtxo(param, paramNFT, utxo);
  }

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(this.param));
    const paramNFT = this.paramNFT.toLucidNFT();

    return tx
      .attachMintingPolicy(contract.mintingPolicy)
      .mintAssets(paramNFT, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
      .payToContract(
        contract.address,
        {
          inline: Data.to(paramDatum),
          scriptRef: contract.validator, // for now, for simplicities' sake
        },
        paramNFT,
      );
  };

  public sharedAssets = (assets: Assets): Assets =>
    this.param.sharedAssets(assets);

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `ParamUtxo (
  ${ttf}param: ${this.param.concise(ttf)}
  ${tt})`;
  };
}

export class PreDiracUtxo {
  public readonly dirac: Dirac;
  public readonly balance: EuclidValue;
  constructor(
    public readonly utxo: Lucid.UTxO,
    public readonly fields: Data[],
    ppreDiracDatum: PPreDiracDatum,
  ) {
    this.dirac = ppreDiracDatum.plift(fields).dirac;
    this.balance = EuclidValue.fromLucid(
      utxo.assets,
    );
    this.balance.popIdNFT(this.dirac.threadNFT);
  }

  public parse = (
    param: Param,
    paramNFT: IdNFT,
    threadNFT: IdNFT,
  ): DiracUtxo | undefined => {
    try {
      return DiracUtxo.parse(this, param, paramNFT, threadNFT);
    } catch (_e) { // TODO log this somewhere
      return undefined;
    }
  };
}

export class DiracUtxo {
  private constructor( // keep private, because how we handle optional utxo arg
    public readonly dirac: Dirac,
    public readonly pdiracDatum: PDiracDatum,
    public readonly balance: EuclidValue,
    public readonly utxo?: Lucid.UTxO, //exists when reading, not when creating
  ) {}

  static parse(
    from: PreDiracUtxo,
    param: Param,
    paramNFT: IdNFT,
    threadNFT: IdNFT,
  ): DiracUtxo {
    const pdiracDatum = new PDiracDatum(param, paramNFT, threadNFT);
    const dirac = pdiracDatum.plift(from.fields).dirac;
    return new DiracUtxo(dirac, pdiracDatum, from.balance, from.utxo);
  }

  public assets = (): Assets => this.dirac.assets;
  public sharedAssets = (assets: Assets): Assets =>
    this.dirac.sharedAssets(assets);

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `DiracUtxo (
  ${ttf}dirac: ${this.dirac.concise(ttf)},
  ${ttf}balance: ${this.balance?.concise(ttf) ?? "undefined"}
  ${tt})`;
  };

  public openingTx = (tx: Lucid.Tx, contract: Contract): Lucid.Tx => {
    const diracDatum = this.pdiracDatum.pconstant(new DiracDatum(this.dirac));
    const funds = this.balance.toLucid();
    const threadNFT = this.dirac.threadNFT.toLucidNFT();
    funds[Object.keys(threadNFT)[0]] = 1n

    return tx
    .mintAssets(threadNFT, Lucid.Data.void()) // NOTE the Lucid.Data.void() redeemer is crucial
    .payToContract(
      contract.address,
      {
        inline: Data.to(diracDatum),
      },
      funds
    );
  }
}
