import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import {
  Amounts,
  Asset,
  Assets,
  Currency,
  Data,
  Dirac,
  DiracDatum,
  f,
  IdNFT,
  leq,
  Param,
  ParamDatum,
  PDiracDatum,
  PParamDatum,
  t,
  User,
} from "../mod.ts";

export class ParamUtxo {
  constructor(
    public readonly param: Param,
    public readonly paramNFT: IdNFT,
    public readonly utxo?: Lucid.UTxO,
  ) {}

  static parse(
    utxo: Lucid.UTxO,
    fields: Data[],
  ): ParamUtxo {
    const param = PParamDatum.ptype.plift(fields)._0;
    const balance = Amounts.fromLucid(
      utxo.assets,
    );
    assert(
      balance.size() === 1n,
      `expected exactly id-NFT in ${balance.concise()}`,
    );
    const paramNFT = IdNFT.fromAsset(balance.firstAsset());

    return new ParamUtxo(param, paramNFT, utxo);
  }

  public sharedAssets = (assets: Assets): Assets =>
    this.param.sharedAssets(assets);

  public openingTx = (user: User): Lucid.Tx => {
    console.log(`paramUTxo: ${this.show()}`);
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(this.param));
    const paramNFT = this.paramNFT.toLucidNFT();

    console.log(this.paramNFT.show());

    return user.lucid.newTx()
      .attachMintingPolicy(user.contract.mintingPolicy)
      .mintAssets(paramNFT, Lucid.Data.void());
    // .payToContract(
    //   user.contract.address,
    //   {
    //     inline: Data.to(paramDatum),
    //     scriptRef: user.contract.validator, // for now, for simplicities' sake
    //   },
    //   paramNFT,
    // );
  };

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
  constructor(
    public readonly utxo: Lucid.UTxO,
    public readonly fields: Data[],
  ) {
    this.dirac = PDiracDatum.pre.plift(this.fields)._0;
  }

  public parse = (pdiracDatum: PDiracDatum): DiracUtxo | undefined => {
    try {
      return DiracUtxo.parse(this, pdiracDatum);
    } catch (_e) { // TODO log this somewhere
      return undefined;
    }
  };
}

export class DiracUtxo {
  public flippable?: Assets;
  public jumpable?: Assets;

  constructor(
    public readonly dirac: Dirac,
    public readonly pdiracDatum: PDiracDatum,
    public readonly balance?: Amounts,
    public readonly utxo?: Lucid.UTxO,
  ) {}

  static parse(
    from: PreDiracUtxo,
    pdiracDatum: PDiracDatum,
  ): DiracUtxo {
    const dirac = pdiracDatum.plift(from.fields)._0;
    const balance = Amounts.fromLucid(
      from.utxo.assets,
    );
    balance.popIdNFT(dirac.threadNFT);
    assert(
      leq(dirac.activeAmnts.unsigned(), balance.unsigned()),
      `dirac activeAmnts ${dirac.activeAmnts.concise()} > balance ${balance.concise()}`,
    );
    // TODO consider checking amounts for all locations

    return new DiracUtxo(dirac, pdiracDatum, balance, from.utxo);
  }

  public openingTx = (user: User, tx: Lucid.Tx): Lucid.Tx => {
    // console.log(`diracUTxo: ${this.show()}`);
    const funds = this.dirac.activeAmnts.toLucid();
    // const nft = this.dirac.threadNFT.toLucid();
    // funds[nft] = 1n;
    const datum = this.pdiracDatum.pconstant(new DiracDatum(this.dirac));
    tx = tx.payToContract(
      user.contract.address,
      {
        inline: Data.to(datum),
      },
      funds,
    );
    return tx;
  };

  public openForFlipping = (assets: Assets): boolean => {
    const sharedAssets = this.dirac.assets().intersect(assets);
    if (sharedAssets.empty()) return false;
    this.flippable = sharedAssets;
    return true;
  };

  public openForJumping = (assets: Assets): boolean => {
    throw new Error("not implemented");
    // return this.dirac.isJumpable(assets);
  };

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    return `DiracUtxo (
${ttf}dirac: ${this.dirac.show(ttf)},
${ttf}balance: ${this.balance?.concise(ttf) ?? "undefined"}
${tt})`;
  };
}
