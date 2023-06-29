import { Lucid } from "../../lucid.mod.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { Currency } from "../types/general/derived/asset/currency.js";
import { KeyHash } from "../types/general/derived/hash/keyHash.js";
import { AssocMap } from "../types/general/fundamental/container/map.js";
import { Swapping } from "./actions/swapping.js";
import { Pool, PrePool } from "./pool.js";
import { User } from "./user.js";
import { Asset } from "../types/general/derived/asset/asset.js";
export declare class EuclidState {
    private invalidUtxos;
    pools: AssocMap<KeyHash, AssocMap<IdNFT, Pool>>;
    invalidPools: AssocMap<KeyHash, AssocMap<IdNFT, PrePool>>;
    get listPools(): Pool[];
    constructor(utxos: Lucid.UTxO[], policy: Currency);
    weightedPrice(denominator: Asset, numerator: Asset): number;
    swappingsFor(user: User): Swapping[];
}
