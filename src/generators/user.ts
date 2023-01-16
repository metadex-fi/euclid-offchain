import {
  Address,
  Assets,
  Data,
  Lucid,
  Tx,
  TxComplete,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { EuclidState } from "../chain/euclidState.ts";
import { DiracUtxo, ParamUtxo } from "../chain/euclidUtxo.ts";
import { Dirac, PAllDiracDatums, Param, ParamDatum, PParamDatum, randomChoice } from "../mod.ts";



const euclidAddress = "TODO";

export class User {
  public assets: Assets = {};
  public state: EuclidState;
  public own = new Map<ParamUtxo, DiracUtxo[]>();

  constructor(
    public lucid: Lucid,
    public address: Address,
  ) {
    this.state = new EuclidState(this.lucid, euclidAddress);
  }

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    const assets = {};
    utxos.forEach((utxo) => {
      addAssetsTo(assets, utxo.assets);
    });
    this.assets = assets;
  };

  public isOwner = (): boolean => {
    return this.own.size > 0;
  };

  public canOpen = (): boolean => {
    return Object.keys(this.assets).length >= 2;
  };

  public genOpenTx = (): Tx => {
    const param = Param.generate()
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(param));
    const pdiracDatums = PAllDiracDatums.fromParam(param)
    const diracDatums = pdiracDatums.pconstant(pdiracDatums.genData());

    // TODO mint & add NFTs
    // TODO funds
    
    let tx = this.lucid.newTx()
      .payToContract(euclidAddress,
        { inline: Data.to(paramDatum),
          scriptRef: euclidScript }, // for now, for simplicities' sake
        {})

    diracDatums.forEach((diracDatum) => {
      tx = tx.payToContract(euclidAddress,
        { inline: Data.to(diracDatum) },
        {});
    });

    return tx;
  };

  public genCloseTx = (param: ParamUtxo, diracs: DiracUtxo[]): Tx => {
  };

  public genAdminTx = (param: ParamUtxo, diracs: DiracUtxo[]): Tx => {
  };

  public genFlipTx = (): Tx => {
  };

  public genJumpTx = (): Tx => {
  };

  public genOwnerTx = (): Tx => {
    const param = randomChoice(Array.from(this.own.keys()));
    const diracs = this.own.get(param) ?? []
    return randomChoice([
      this.genCloseTx,
      this.genAdminTx,
    ])(param, diracs);
  };

  public genUserTx = (): Tx => {
    return randomChoice([
      this.genFlipTx,
      this.genJumpTx,
    ])();
  };

  public genEuclidTx = async (): Promise<TxComplete> => {
    await Promise.all([this.update(), this.state.update()])
    this.own = this.state.get(this.address)

    const genTx = randomChoice([
        ...this.canOpen() ? [this.genOpenTx] : [],
        ...this.isOwner() ? [this.genOwnerTx] : [],
        this.genUserTx,
      ])

    return await genTx().complete();
  };
}

function addAssetsTo(a: Assets, b: Assets): void {
  for (const asset in b) {
    if (a[asset]) {
      a[asset] += b[asset];
    } else {
      a[asset] = b[asset];
    }
  }
}
