import { Lucid } from "../../lucid.mod.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { AssocMap } from "../types/general/fundamental/container/map.js";
import { Swapping } from "./actions/swapping.js";
import { Contract } from "./contract.js";
import { User } from "./user.js";
import { DiracUtxo, ParamUtxo, PreDiracUtxo } from "./utxo.js";
import { Value } from "../types/general/derived/value/value.js";
import { Asset } from "../types/general/derived/asset/asset.js";
import { Assets } from "../types/general/derived/asset/assets.js";
export declare class PrePool {
    paramUtxo?: ParamUtxo;
    preDiracUtxos?: AssocMap<IdNFT, PreDiracUtxo>;
    get utxos(): Lucid.UTxO[];
    setParamUtxo: (paramUtxo: ParamUtxo) => PrePool;
    addPreDiracUtxo: (preDiracUtxo: PreDiracUtxo) => PrePool;
    parse: () => [Pool, IdNFT] | undefined;
    show: (tabs?: string) => string;
    cleaningTx: (tx: Lucid.Tx, contract: Contract) => Lucid.Tx;
}
export declare type DiracPriceValueA1 = {
    pricesA1: AssocMap<Asset, number>;
    valueA1: number;
};
export declare class Pool {
    readonly paramUtxo: ParamUtxo;
    readonly diracUtxos: DiracUtxo[];
    private constructor();
    get utxos(): Lucid.UTxO[];
    get idNFT(): IdNFT;
    get lastIdNFT(): IdNFT;
    get balance(): Value;
    get assets(): Assets;
    get weightedPrices(): DiracPriceValueA1[];
    openingTx: (tx: Lucid.Tx, contract: Contract) => Lucid.Tx;
    closingTx: (tx: Lucid.Tx, contract: Contract) => Lucid.Tx;
    switchingTx: (tx: Lucid.Tx, contract: Contract) => Lucid.Tx;
    swappingsFor(user: User): Swapping[];
    static parse(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool;
    static open(paramUtxo: ParamUtxo, diracUtxos: DiracUtxo[]): Pool;
}
