import {
  Address,
  Assets as LucidAssets,
  Data,
  Lucid,
  Tx,
  TxComplete,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { EuclidState } from "../chain/euclidState.ts";
import { DiracUtxo, ParamUtxo } from "../chain/euclidUtxo.ts";
import {
  addValues,
  Amounts,
  Assets,
  IdNFT,
  Param,
  ParamDatum,
  ParamNFT,
  PositiveValue,
  PParamDatum,
  PPoolDatums,
  randomChoice,
  Value,
} from "../mod.ts";
import { Contract } from "./contract.ts";

export class User {
  public readonly state: EuclidState;
  public readonly contract: Contract;

  public balance: Amounts | undefined;
  public pools = new Map<ParamUtxo, DiracUtxo[]>();
  public nextParamNFT: IdNFT;

  constructor(
    public readonly lucid: Lucid,
    public readonly address: Address,
  ) {
    this.contract = new Contract(lucid);
    this.state = new EuclidState(this.lucid, this.contract.address);
    this.nextParamNFT = new ParamNFT(this.contract.policyId, this.address);
  }

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    const assets: LucidAssets = {};
    utxos.forEach((utxo) => {
      Object.entries(utxo.assets).forEach(([asset, amount]) => {
        assets[asset] = amount + assets[asset] ?? 0n;
      });
    });
    this.balance = Amounts.fromLucid(assets);
  };

  public isOwner = (): boolean => {
    return this.pools.size > 0;
  };

  public genOpenTx = (): Tx => {
    const deposit = this.balance!.minSizedSubAmounts(2n);
    const param = Param.generateWith(this.address, deposit);
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(param));
    const pdiracDatums = PPoolDatums.fromParam(
      param,
      this.nextParamNFT,
    );
    const diracDatums = pdiracDatums.genData();

    let tx = this.lucid.newTx();

    const paramNFT = this.nextParamNFT.asset;
    const threadNFTs = diracDatums.map((diracDatum) => diracDatum._0.threadNFT);
    this.nextParamNFT = this.nextParamNFT.next(diracDatums.length);

    const lucidIdNFTs = Assets.fromList([paramNFT, ...threadNFTs]).toLucidWith(
      1n,
    );

    tx = tx
      .mintAssets(lucidIdNFTs)
      .attachMintingPolicy(this.contract.mintingPolicy);

    tx = tx.payToContract(
      this.contract.address,
      {
        inline: Data.to(paramDatum),
        scriptRef: this.contract.validator, // for now, for simplicities' sake
      },
      paramNFT.toLucidWith(1n),
    );

    pdiracDatums.pconstant(diracDatums).forEach((diracDatum, index) => {
      tx = tx.payToContract(
        this.contract.address,
        {
          inline: Data.to(diracDatum),
        },
        threadNFTs[index].toLucidWith(1n),
        // TODO funds
      );
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
    const param = randomChoice(Array.from(this.pools.keys()));
    const diracs = this.pools.get(param) ?? [];
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
    this.pools = this.state.get(this.address);

    const genTx = randomChoice([
      ...this.isOwner() ? [this.genOwnerTx] : [],
      this.genOpenTx,
      this.genUserTx,
    ]);

    return await genTx().complete();
  };
}

// function addLucidAssetsTo(a: LucidAssets, b: LucidAssets): void {
//   for (const asset in b) {
//     if (a[asset]) {
//       a[asset] += b[asset];
//     } else {
//       a[asset] = b[asset];
//     }
//   }
// }
