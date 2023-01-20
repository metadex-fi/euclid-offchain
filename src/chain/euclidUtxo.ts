import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Constr, Data, PaymentKeyHash, UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Asset, Assets, CurrencySymbol, Dirac, Param, PDiracDatum, Pool, PParamDatum, TokenName, User } from "../mod.ts";


function getNFT(utxo: UTxO, contractCurrency: CurrencySymbol): TokenName {
  let id: TokenName | undefined
  Object.entries(utxo.assets).forEach(([asset, amount]) => {
    if(asset.startsWith(contractCurrency) && amount === 1n) {
      assert(id === undefined, "multiple NFTs found")
      id = asset.slice(contractCurrency.length)
    }
  })
  assert(id !== undefined, "no NFT found")
  return id
}

export class ParamUtxo {
  public readonly p: Param;
  public readonly id: TokenName;
  constructor(
    utxo: UTxO,
    fields: Data[],
    contractCurrency: CurrencySymbol
  ) {
    this.p = PParamDatum.ptype.plift(fields)._0;
    this.id = getNFT(utxo, contractCurrency)
  }
}

export class DiracUtxo {
  public d: Dirac;
  public readonly id: TokenName;
  constructor(
    utxo: UTxO,
    public readonly fields: Data[],
    contractCurrency: CurrencySymbol
  ) {
    const pdiracDatum = PDiracDatum.unparsed()
    this.d = pdiracDatum.plift(fields)._0;
    assert(this.d.paramNFT.currencySymbol === contractCurrency, "NFT mismatch (paramNFT.currencySymbol)")
    assert(this.d.threadNFT.currencySymbol === contractCurrency, "NFT mismatch (threadNFT.currencySymbol)")
    this.id = getNFT(utxo, contractCurrency)
    assert(this.d.threadNFT.tokenName === this.id, "NFT mismatch (threadNFT.tokenName)")
  }

  public parseWith = (param: Param): void => {
    const pdiracDatum = PDiracDatum.fromParam(param);
    this.d = pdiracDatum.plift(this.fields)._0;
    // number of reachable prices * baseAmountA0 <= total value of amounts.
    // TODO Do we check this? where?
  };
}

export class EuclidUtxos {
  // owner -> id -> utxo
  public params = new Map<PaymentKeyHash, Map<TokenName, ParamUtxo>>();
  public diracs = new Map<PaymentKeyHash, Map<TokenName, DiracUtxo>>();
  // public invalidParams = new Map<string, Map<PaymentKeyHash, ParamUtxo[]>>();
  public invalidDiracs = new Map<string, DiracUtxo[]>();
  public invalidUtxos = new Map<string, UTxO[]>();

  constructor(
    public readonly contractCurrency: CurrencySymbol
  ) {}

  static ingest(utxos: UTxO[], contractCurrency: CurrencySymbol): EuclidUtxos {
    const e = new EuclidUtxos(contractCurrency);
    utxos.forEach((utxo) => {
      try {
        // TODO assert scriptref, and all the other fields if it makes sense
        assert(utxo.datum, `datum must be present`);
        const datum = Data.from(utxo.datum);
        assert(datum instanceof Constr, `datum must be a Constr`);
        switch (datum.index) {
          case 0: {
            const paramUtxo = new ParamUtxo(utxo, datum.fields, contractCurrency);
            const ps = e.params.get(paramUtxo.p.owner) ?? new Map<TokenName, ParamUtxo>();
            assert(!ps.has(paramUtxo.id), `duplicate param id ${paramUtxo.id}`);
            ps.set(paramUtxo.id, paramUtxo);
            e.params.set(paramUtxo.p.owner, ps);
            break;
          }
          case 1: {
            const diracUtxo = new DiracUtxo(utxo, datum.fields, contractCurrency);
            const ds = e.diracs.get(diracUtxo.d.owner) ?? new Map<TokenName, DiracUtxo>();
            assert(!ds.has(diracUtxo.id), `duplicate dirac id ${diracUtxo.id}`);
            ds.set(diracUtxo.id, diracUtxo);
            e.diracs.set(diracUtxo.d.owner, ds);
            break;
          }
          default:
            throw new Error(`invalid datum index: ${datum.index}`);
        }
      } catch (e) {
        const is = e.invalidUtxos.get(e.message) ?? [];
        is.push(utxo);
        e.invalidUtxos.set(e.message, is);
      }
    });
    return e;
  }

  public digest = (): Map<PaymentKeyHash, Pool[]> => {
    // owner -> param-id -> pool
    const pools = new Map<PaymentKeyHash, Map<TokenName, {
      paramNFT: Asset,
      threadNFTs: Assets,
      param: Param,
      diracs: Dirac[]
    }>>();
    // pairing up params and diracs by owner and param-id
    for (const [owner, diracs] of this.diracs) {
      const params = this.params.get(owner);
      if (params) {
        const pools_ = pools.get(owner) ?? new Map<TokenName, {
          paramNFT: Asset,
          threadNFTs: Assets,
          param: Param,
          diracs: Dirac[]
        }>();
        for (const [id, dirac] of diracs) {
          const param = params.get(id);
          if (param) {
            dirac.parseWith(param.p);
            const pool = pools_.get(id) ?? {
              paramNFT: dirac.d.paramNFT,
              threadNFTs: Assets.singleton(dirac.d.threadNFT),
              param: param.p,
              diracs: new Array<Dirac>()
            };
            pool.diracs.push(dirac.d);
            pools_.set(id, pool);
          } else {
            const message = `no params for dirac ${id}`;
            const is = this.invalidDiracs.get(message) ?? [];
            is.push(...[...diracs.values()].flat());
            this.invalidDiracs.set(message, is);
          }
        }
        pools.set(owner, pools_);
      } else {
        const message = `no params for owner ${owner}`;
        const is = this.invalidDiracs.get(message) ?? [];
        is.push(...[...diracs.values()].flat());
        this.invalidDiracs.set(message, is);
      }
    }
    const result = new Map<PaymentKeyHash, Pool[]>();
    for (const [owner, pools_] of pools) {
      result.set(owner, [...pools_.values()].map((pool) => (
        new Pool(
          pool.paramNFT,
          pool.threadNFTs,
          pool.param,
          pool.diracs
        )
      )));
    }
    return result;
  }
} 