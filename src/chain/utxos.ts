import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Tx, UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Amounts,
  Asset,
  Assets,
  Currency,
  Data,
  Dirac,
  DiracDatum,
  leq,
  Param,
  ParamDatum,
  PDiracDatum,
  PParamDatum,
  User,
} from "../mod.ts";

export class ParamUtxo {
  constructor(
    public readonly param: Param,
    public readonly paramNFT: Asset,
  ) {}

  static parse(
    utxo: UTxO,
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
    assert(
      balance.firstAmount() === 1n,
      `expected exactly 1 id-NFT in ${balance.concise()}`,
    );
    const paramNFT = balance.firstAsset();

    return new ParamUtxo(param, paramNFT);
  }

  public openingTx = (user: User): Tx => {
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(this.param));
    const paramNFT = new Assets().add(this.paramNFT).toLucidWith(1n);

    return user.lucid.newTx()
      .mintAssets(paramNFT)
      .attachMintingPolicy(user.contract.mintingPolicy)
      .payToContract(
        user.contract.address,
        {
          inline: Data.to(paramDatum),
          scriptRef: user.contract.validator, // for now, for simplicities' sake
        },
        paramNFT,
      );
  };
}

export class PreDiracUtxo {
  public readonly dirac: Dirac;
  constructor(
    public readonly utxo: UTxO,
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
  // public readonly balance: Amounts; // might want this later again
  public flippable?: Assets;
  public jumpable?: Assets;

  constructor(
    public readonly dirac: Dirac,
    public readonly pdiracDatum: PDiracDatum,
  ) {}

  static parse(
    from: PreDiracUtxo,
    pdiracDatum: PDiracDatum,
  ): DiracUtxo {
    const dirac = pdiracDatum.plift(from.fields)._0;
    const balance = Amounts.fromLucid(
      from.utxo.assets,
    );
    balance.popNFT(dirac.threadNFT);
    assert(
      leq(dirac.activeAmnts.unsigned(), balance.unsigned()),
      `dirac activeAmnts ${dirac.activeAmnts.concise()} > balance ${balance.concise()}`,
    );
    // TODO consider checking amounts for all locations

    return new DiracUtxo(dirac, pdiracDatum);
  }

  public openingTx = (user: User, tx: Tx): Tx => {
    const funds = this.dirac.activeAmnts.clone(); // not strictly required, as the utxo will be obsolete anyways
    funds.initAmountOf(this.dirac.threadNFT, 1n);
    const datum = this.pdiracDatum.pconstant(new DiracDatum(this.dirac));
    tx = tx.payToContract(
      user.contract.address,
      {
        inline: Data.to(datum),
      },
      funds.toLucid(),
    );
    return tx;
  };

  // public openForFlipping = (assets: Assets): boolean => {
  //   const sharedAssets = this.dirac.assets().intersect(assets);
  //   if (sharedAssets.empty()) return false;
  //   this.flippable = sharedAssets;
  //   return true;
  // };

  // public openForJumping = (assets: Assets): boolean => {
  //   throw new Error("not implemented");
  //   // return this.dirac.isJumpable(assets);
  // };
}
