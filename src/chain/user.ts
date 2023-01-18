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
import {
  IdNFT,
  PAllDiracDatums,
  Param,
  ParamDatum,
  PParamDatum,
  randomChoice,
} from "../mod.ts";
import { Contract } from "./contract.ts";

export class User {
  public readonly state: EuclidState;
  public readonly contract: Contract;

  public assets: Assets = {};
  public own = new Map<ParamUtxo, DiracUtxo[]>();
  public latestNFT: IdNFT;

  constructor(
    public readonly lucid: Lucid,
    public readonly address: Address,
  ) {
    this.contract = new Contract(lucid);
    this.state = new EuclidState(this.lucid, this.contract.address);
    this.latestNFT = IdNFT.paramNFT(this.contract.policyId, this.address);
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
    const param = Param.generate();
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(param));
    const pdiracDatums = PAllDiracDatums.fromParam(
      param,
      this.latestNFT.next(),
    );
    const diracDatums = pdiracDatums.pconstant(pdiracDatums.genData());

    // TODO mint & add NFTs
    // TODO funds

    let tx = this.lucid.newTx()
      .payToContract(
        this.contract.address,
        { inline: Data.to(paramDatum), scriptRef: this.contract.validator }, // for now, for simplicities' sake
        {},
      );

    diracDatums.forEach((diracDatum) => {
      tx = tx.payToContract(this.contract.address, {
        inline: Data.to(diracDatum),
      }, {});
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
    const diracs = this.own.get(param) ?? [];
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
    await Promise.all([this.update(), this.state.update()]);
    this.own = this.state.get(this.address);

    const genTx = randomChoice([
      ...this.canOpen() ? [this.genOpenTx] : [],
      ...this.isOwner() ? [this.genOwnerTx] : [],
      this.genUserTx,
    ]);

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
