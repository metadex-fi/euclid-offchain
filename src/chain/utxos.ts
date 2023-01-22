import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Amounts,
  Assets,
  Currency,
  Data,
  Dirac,
  leq,
  Param,
  PDiracDatum,
  Pool,
  PParamDatum,
  Token,
} from "../mod.ts";

// function getNFT(utxo: UTxO, contractCurrency: CurrencySymbol): TokenName {
//   let id: TokenName | undefined;
//   Object.entries(utxo.assets).forEach(([asset, amount]) => {
//     if (asset.startsWith(contractCurrency) && amount === 1n) {
//       assert(id === undefined, "multiple NFTs found");
//       id = asset.slice(contractCurrency.length);
//     }
//   });
//   assert(id !== undefined, "no NFT found");
//   return id;
// }

export class ParamUtxo {
  public readonly param: Param;
  public readonly id: Token;
  constructor(
    public readonly utxo: UTxO,
    fields: Data[],
    contractCurrency: Currency,
  ) {
    this.param = PParamDatum.ptype.plift(fields)._0;
    const balance = Amounts.fromLucid(
      utxo.assets,
      contractCurrency.symbol.length,
    );
    assert(
      balance.size() === 1n,
      `expected exactly id-NFT in ${balance.concise()}`,
    );
    assert(
      balance.firstAmount() === 1n,
      `expected exactly 1 id-NFT in ${balance.concise()}`,
    );
    const idNFT = balance.firstAsset();
    assert(
      idNFT.currency === contractCurrency,
      `id-NFT ${idNFT.show()} has wrong currency, expected ${contractCurrency}`,
    );
    this.id = balance.firstAsset().token;
  }
}

export class DiracUtxo {
  public dirac: Dirac;
  public readonly id: Token;
  public readonly balance: Amounts;
  public flippable?: Assets;
  public jumpable?: Assets;
  constructor(
    public readonly utxo: UTxO,
    public readonly fields: Data[],
    public readonly contractCurrency: Currency,
  ) {
    const pdiracDatum = PDiracDatum.unparsed(contractCurrency);
    this.dirac = pdiracDatum.plift(fields)._0;
    this.id = this.dirac.threadNFT.token;
    this.balance = Amounts.fromLucid(
      utxo.assets,
      contractCurrency.symbol.length,
    );
    const nftAmnt = this.balance.pop(this.dirac.threadNFT);
    assert(nftAmnt === 1n, `wrong threadNFT amount: ${nftAmnt}`);
    assert(
      leq(this.dirac.activeAmnts.unsigned(), this.balance.unsigned()),
      `dirac activeAmnts ${this.dirac.activeAmnts.concise()} > balance ${this.balance.concise()}`,
    );
    // TODO consider checking amounts for all locations
  }

  public parseWith = (param: Param): void => {
    const pdiracDatum = PDiracDatum.fromParam(param, this.contractCurrency);
    this.dirac = pdiracDatum.plift(this.fields)._0;
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
}

export class UtxoPool {
  private sharedAssets?: Assets;
  public flippable?: DiracUtxo[];
  public jumpable?: DiracUtxo[];
  constructor(
    public readonly pool: Pool,
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxos: DiracUtxo[],
  ) {}

  public openForBusiness = (assets: Assets): boolean => {
    const sharedAssets = this.pool.sharedAssets(assets);
    if (sharedAssets.empty()) {
      return false;
    } else {
      this.sharedAssets = sharedAssets;
      this.flippable = this.diracUtxos.filter((diracUtxo) => {
        diracUtxo.openForFlipping(this.sharedAssets!);
      });
      this.jumpable = this.diracUtxos.filter((diracUtxo) => {
        diracUtxo.openForJumping(this.sharedAssets!);
      });
      return true;
    }
  };
}
