import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Constr, UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Assets,
  AssocMap,
  Currency,
  Data,
  PIdNFT,
  PKeyHash,
  PString,
} from "../mod.ts";
import { Pool, PrePool } from "./pool.ts";
import { ParamUtxo, PreDiracUtxo } from "./utxos.ts";

type PErrorMessage = PString;

export class Euclid {
  // private invalidDiracs = new AssocMap<PErrorMessage, PreDiracUtxo[]>(PString.ptype);
  private invalidUtxos = new AssocMap<PErrorMessage, UTxO[]>(PString.ptype);
  // public emptyPoolParams!: AssocMap<PKeyHash, AssocMap<PToken, ParamUtxo>>;
  public pools: AssocMap<PKeyHash, AssocMap<PIdNFT, Pool>>;

  constructor(
    utxos: UTxO[],
    contractCurrency: Currency,
  ) {
    const prePools = new AssocMap<PIdNFT, PrePool>(PIdNFT.pdummy);
    utxos.forEach((utxo) => {
      try {
        // TODO assert scriptref, and all the other fields if it makes sense
        assert(utxo.datum, `datum must be present`);
        const datum = Data.from(utxo.datum);
        assert(datum instanceof Constr, `datum must be a Constr`);
        switch (datum.index) {
          case 0: {
            const paramUtxo = ParamUtxo.parse(
              utxo,
              datum.fields,
            );
            const prePool = (prePools.get(paramUtxo.paramNFT) ?? new PrePool())
              .setParamUtxo(paramUtxo);
            prePools.set(paramUtxo.paramNFT, prePool);
            break;
          }
          case 1: {
            const preDiracUtxo = new PreDiracUtxo(
              utxo,
              datum.fields,
            );
            const prePool =
              (prePools.get(preDiracUtxo.dirac.paramNFT) ?? new PrePool())
                .addPreDiracUtxo(preDiracUtxo);
            prePools.set(preDiracUtxo.dirac.paramNFT, prePool);
            break;
          }
          default:
            throw new Error(`invalid datum index: ${datum.index}`);
        }
      } catch (e) {
        const is = e.invalidUtxos.get(e.message) ?? [];
        is.push(utxo);
        this.invalidUtxos.set(e.message, is);
      }
    });
    const pools = prePools.map((prePool: PrePool) =>
      prePool.parse(contractCurrency)
    );
    this.pools = new AssocMap<PKeyHash, AssocMap<PIdNFT, Pool>>(PKeyHash.ptype);
    for (const [paramNFT, pool] of pools) {
      const owner = pool.paramUtxo.param.owner;
      const inner = this.pools.get(owner) ??
        new AssocMap<PIdNFT, Pool>(PIdNFT.pdummy);
      inner.set(paramNFT, pool);
      this.pools.set(owner, inner);
    }
  }

  public openForBusiness = (assets: Assets): Pool[] => {
    return [...this.pools.values()].map((pools) => [...pools.values()]).flat()
      .filter((pool) => pool.openForBusiness(assets));
  };
}
