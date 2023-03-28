import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../lucid.mod.js";
import { DiracDatum, ParamDatum, PPreEuclidDatum, } from "../types/euclid/euclidDatum.js";
import { gMaxHashes, IdNFT } from "../types/euclid/idnft.js";
import { AssocMap } from "../types/general/fundamental/container/map.js";
import { Data } from "../types/general/fundamental/type.js";
import { PrePool } from "./pool.js";
import { ParamUtxo, PreDiracUtxo } from "./utxo.js";
export class EuclidState {
    constructor(utxos, policy) {
        // private invalidDiracs = new AssocMap<PErrorMessage, PreDiracUtxo[]>(PString.ptype);
        Object.defineProperty(this, "invalidUtxos", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new AssocMap((str) => str)
        });
        // public emptyPoolParams!: AssocMap<PKeyHash, AssocMap<PToken, ParamUtxo>>;
        Object.defineProperty(this, "pools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new AssocMap((kh) => kh.show())
        });
        Object.defineProperty(this, "invalidPools", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new AssocMap((kh) => kh.show())
        });
        // 1. sort utxos into prePools
        const prePools = new AssocMap((kh) => kh.show());
        const ppreEuclidDatum = new PPreEuclidDatum(policy);
        utxos.forEach((utxo) => {
            try {
                // TODO assert scriptref, and all the other fields if it makes sense
                assert(utxo.datum, `datum must be present`);
                const datum = Data.from(utxo.datum);
                assert(datum instanceof Lucid.Constr, `datum must be a Constr, got ${datum}`);
                const preEuclidDatum = ppreEuclidDatum.plift(datum);
                if (preEuclidDatum instanceof ParamDatum) {
                    const paramUtxo = ParamUtxo.parse(utxo, preEuclidDatum.param);
                    const owner = paramUtxo.param.owner;
                    const paramNFT = paramUtxo.paramNFT;
                    const ownerPrePools = prePools.get(owner) ??
                        new AssocMap((nft) => nft.show());
                    const prePool = (ownerPrePools.get(paramNFT) ?? new PrePool())
                        .setParamUtxo(paramUtxo);
                    ownerPrePools.set(paramNFT, prePool);
                    prePools.set(owner, ownerPrePools);
                }
                else if (preEuclidDatum instanceof DiracDatum) {
                    const preDiracUtxo = new PreDiracUtxo(utxo, datum, preEuclidDatum.dirac);
                    const owner = preDiracUtxo.preDirac.owner;
                    const paramNFT = preDiracUtxo.preDirac.paramNFT;
                    const ownerPrePools = prePools.get(owner) ??
                        new AssocMap((kh) => kh.show());
                    const prePool = (ownerPrePools.get(paramNFT) ?? new PrePool())
                        .addPreDiracUtxo(preDiracUtxo);
                    ownerPrePools.set(paramNFT, prePool);
                    prePools.set(owner, ownerPrePools);
                }
                else {
                    throw new Error(`unknown preEuclidDatum`);
                }
            }
            catch (e) {
                throw e; // TODO revert in prod
                // const is = this.invalidUtxos.get(e.message) ?? [];
                // is.push(utxo);
                // this.invalidUtxos.set(e.message, is);
            }
        });
        // 2. parse prePools into pools
        this.pools = new AssocMap((kh) => kh.show());
        prePools.forEach((ownerPrePools, owner) => {
            const parsedOwnerPools = new AssocMap((kh) => kh.show());
            const invalidOwnerPools = new AssocMap((kh) => kh.show());
            let hits = ownerPrePools.size;
            let misses = gMaxHashes;
            let paramNFT = new IdNFT(policy, // NOTE this is the only place where we actually constrain the policy, preserve that
            owner.hash());
            while (hits && misses) {
                const prePool = ownerPrePools.get(paramNFT);
                if (prePool) {
                    misses = gMaxHashes;
                    const parsed = prePool.parse();
                    if (parsed) {
                        const [parsedPool, lastIdNFT] = parsed;
                        parsedOwnerPools.set(paramNFT, parsedPool);
                        paramNFT = lastIdNFT;
                        hits--;
                    }
                    else {
                        throw new Error(`invalid prePool: ${prePool.show()}`); // TODO revert in prod
                        // invalidOwnerPools.set(paramNFT, prePool);
                    }
                }
                else {
                    misses--;
                }
                paramNFT = paramNFT.next();
            }
            this.pools.set(owner, parsedOwnerPools);
            this.invalidPools.set(owner, invalidOwnerPools);
        });
    }
    swappingsFor(user) {
        // TODO consider removing the user's own pools beforehand
        const pools = [...this.pools.values()].flatMap((p) => [...p.values()]);
        // if (pools.length) {
        //   console.log(`\t\tpools: ${pools.length}`);
        // }
        return pools.flatMap((pool) => pool.swappingsFor(user));
    }
}
