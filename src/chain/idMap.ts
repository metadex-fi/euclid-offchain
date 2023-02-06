import { AssocMap,IdNFT,maxInteger,PIdNFT } from "../mod.ts";

export class IdMap<Value> {
    public readonly map = new AssocMap<PIdNFT, Value>(PIdNFT.pdummy); // TODO not sure about pdummy here

    public processWith = () => {
        const processed = new AssocMap<PIdNFT, Value>(PIdNFT.pdummy); // TODO not sure about pdummy here
        const numPools = this.map.size;
        let misses = maxInteger // TODO don't hardcode this here
        let idNFT = new IdNFT(
            policy,
            owner.hash()
        )
        while(processed.size < numPools) {
            const prePool = this.map.get(idNFT);
            if (prePool) {
                const parsed = prePool.parse(policy, idNFT)
                if (parsed) {
                    const [parsedPool, lastIdNFT] = parsed;
                    processed.set(idNFT, parsedPool);
                    idNFT = lastIdNFT;
                } // TODO else?
            }
            else {
                if (misses-- < 0) { // TODO do something about the unparsed
                    this.pools.set(owner, processed);
                    return
                }
            }
            idNFT = idNFT.next();
        }
        this.pools.set(owner, processed);
    }
}