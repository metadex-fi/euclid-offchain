import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import { AssocMap, Currency, Data, IdNFT, maxInteger, PIdNFT, PKeyHash, PString } from "../mod.ts";
import { Pool, PrePool } from "./pool.ts";
import { ParamUtxo, PreDiracUtxo } from "./utxo.ts";

type PErrorMessage = PString;

export class EuclidState {
  // private invalidDiracs = new AssocMap<PErrorMessage, PreDiracUtxo[]>(PString.ptype);
  private invalidUtxos = new AssocMap<PErrorMessage, Lucid.UTxO[]>(
    PString.ptype,
  );
  // public emptyPoolParams!: AssocMap<PKeyHash, AssocMap<PToken, ParamUtxo>>;
  public pools: AssocMap<PKeyHash, AssocMap<PIdNFT, Pool>>;

  constructor(
    utxos: Lucid.UTxO[],
    policy: Currency,
  ) {
    // 1. sort utxos into prePools
    const prePools = new AssocMap<PKeyHash, AssocMap<PIdNFT, PrePool>>(
      PKeyHash.ptype,
    );
    utxos.forEach((utxo) => {
      try {
        // TODO assert scriptref, and all the other fields if it makes sense
        assert(utxo.datum, `datum must be present`);
        const datum = Data.from(utxo.datum);
        assert(datum instanceof Lucid.Constr, `datum must be a Constr`);
        switch (datum.index) {
          case 0: {
            const paramUtxo = ParamUtxo.parse(
              utxo,
              datum.fields,
            );
            const owner = paramUtxo.param.owner;
            const paramNFT = paramUtxo.paramNFT;
            const ownerPrePools = prePools.get(owner) ??
              new AssocMap<PIdNFT, PrePool>(PIdNFT.pdummy); // TODO not sure about pdummy here
            const prePool = (ownerPrePools.get(paramNFT) ?? new PrePool())
              .setParamUtxo(paramUtxo);
            ownerPrePools.set(paramNFT, prePool);
            prePools.set(owner, ownerPrePools);
            break;
          }
          case 1: {
            const preDiracUtxo = new PreDiracUtxo(
              utxo,
              datum.fields,
            );
            const owner = preDiracUtxo.dirac.owner;
            const paramNFT = preDiracUtxo.dirac.paramNFT;
            const ownerPrePools = prePools.get(owner) ??
              new AssocMap<PIdNFT, PrePool>(PIdNFT.pdummy); // TODO not sure about pdummy here
            const prePool = (ownerPrePools.get(paramNFT) ?? new PrePool())
              .addPreDiracUtxo(preDiracUtxo);
            ownerPrePools.set(paramNFT, prePool);
            prePools.set(owner, ownerPrePools);
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

    // 2. parse prePools into pools
    this.pools = new AssocMap<PKeyHash, AssocMap<PIdNFT, Pool>>(PKeyHash.ptype);
    prePools.forEach((ownerPrePools, owner) => { // TODO this could be parallelized
        const parsedOwnerPools = new AssocMap<PIdNFT, Pool>(PIdNFT.pdummy); // TODO not sure about pdummy here
        const numPools = ownerPrePools.size;
        let misses = maxInteger // TODO don't hardcode this here
        let idNFT = new IdNFT(
            policy,
            owner.hash()
        )
        while(parsedOwnerPools.size < numPools) {
            const prePool = ownerPrePools.get(idNFT);
            if (prePool) {
                const parsed = prePool.parse(policy, idNFT)
                if (parsed) {
                    const [parsedPool, lastIdNFT] = parsed;
                    parsedOwnerPools.set(idNFT, parsedPool);
                    idNFT = lastIdNFT;
                } // TODO else?
            }
            else {
                if (misses-- < 0) { // TODO do something about the unparsed
                    this.pools.set(owner, parsedOwnerPools);
                    return
                }
            }
            idNFT = idNFT.next();
        }
        this.pools.set(owner, parsedOwnerPools);
    })
  }

  // public openForBusiness = (assets: Assets): Pool[] => {
  //   return [...this.pools.values()].map((pools) => [...pools.values()]).flat()
  //     .filter((pool) => pool.openForBusiness(assets));
  // };
}
