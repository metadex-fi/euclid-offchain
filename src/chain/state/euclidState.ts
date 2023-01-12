import { Address, Lucid, UTxO } from "https://deno.land/x/lucid@0.8.6/mod.ts";

export class EuclidState {
    public state: Map<ParamUtxo, DiracUtxo[]> = new Map();
    public wrong: UTxO[] = [];
    constructor(
        public lucid: Lucid,
        public address: Address,
    ) {
    }

    public update = async (): Promise<void> => {
        const utxos = await this.lucid.utxosAt(this.address);
        utxos.forEach((utxo) => {
            const datum = utxo.datum;
            try {
                
            }
        })
    }

}