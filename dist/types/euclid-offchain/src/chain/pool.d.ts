import { Lucid } from "../../lucid.mod.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { AssocMap } from "../types/general/fundamental/container/map.js";
import { Swapping } from "./actions/swapping.js";
import { Contract } from "./contract.js";
import { User } from "./user.js";
import { DiracUtxo, ParamUtxo, PreDiracUtxo } from "./utxo.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
export declare class PrePool {
    paramUtxo?: ParamUtxo;
    preDiracUtxos?: AssocMap<IdNFT, PreDiracUtxo>;
    setParamUtxo: (paramUtxo: ParamUtxo) => PrePool;
    addPreDiracUtxo: (preDiracUtxo: PreDiracUtxo) => PrePool;
    parse: () => [Pool, IdNFT] | undefined;
    show: (tabs?: string) => string;
}
export declare class Pool {
    readonly paramUtxo: ParamUtxo;
    readonly diracUtxos: DiracUtxo[];
    private constructor();
    get utxos(): Lucid.UTxO[];
    get lastIdNFT(): IdNFT;
    get balance(): PositiveValue;
    openingTx: (tx: Lucid.Tx, contract: Contract) => Lucid.Tx;
    closingTx: (tx: Lucid.Tx, contract: Contract) => Lucid.Tx;
    swappingsFor(user: User): Swapping[];
    static parse(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool;
    static open(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool;
}