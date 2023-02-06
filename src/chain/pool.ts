import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import { AssocMap, Currency, IdNFT, PDiracDatum, PIdNFT } from "../mod.ts";
import { User } from "./user.ts";
import { DiracUtxo, ParamUtxo, PreDiracUtxo } from "./utxo.ts";

export class PrePool {
  public paramUtxo?: ParamUtxo;
  public preDiracUtxos = new AssocMap<PIdNFT, PreDiracUtxo>(PIdNFT.pdummy); // TODO not sure about pdummy here

  public setParamUtxo = (paramUtxo: ParamUtxo): PrePool => {
    assert(!this.paramUtxo, `duplicate param ${paramUtxo}`);
    this.paramUtxo = paramUtxo;
    return this;
  };

  public addPreDiracUtxo = (preDiracUtxo: PreDiracUtxo): PrePool => {
    const paramNFT = preDiracUtxo.dirac.paramNFT;
    assert(!this.preDiracUtxos.has(paramNFT), `CRITICAL: duplicate dirac ${paramNFT}`);
    this.preDiracUtxos.set(paramNFT, preDiracUtxo);
    return this;
  };

  public parse = (policy: Currency, firstIdNFT: IdNFT): [Pool, IdNFT] | undefined => {
    if (!this.paramUtxo || this.preDiracUtxos.size) return undefined; // TODO logging

    const param = this.paramUtxo.param;
    const paramNFT = this.paramUtxo.paramNFT;
    if (paramNFT.currency.show() !== policy.show()) return undefined; // TODO logging

    // TODO ENTRYPOINT iterate firstIdNFT until it matches paramNFT
    // TODO ENTRYPOINT do the same thing as in euclidState, where we iterate the nft and process the matches in the map, if they exist

    const numDiracs = BigInt(this.preDiracUtxos.size);
    const pdiracDatum = PDiracDatum.parse(param, paramNFT, numDiracs);
    const diracUtxos = this.preDiracUtxos.map((pdu) => pdu.parse(pdiracDatum))
      .filter((du) => du) as DiracUtxo[];

    if (!diracUtxos.length) return undefined;
    return [new Pool(this.paramUtxo, diracUtxos), ];
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
