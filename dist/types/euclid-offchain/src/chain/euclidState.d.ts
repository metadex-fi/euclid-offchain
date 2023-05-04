import { Lucid } from "../../lucid.mod.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { Currency } from "../types/general/derived/asset/currency.js";
import { KeyHash } from "../types/general/derived/hash/keyHash.js";
import { AssocMap } from "../types/general/fundamental/container/map.js";
import { Swapping } from "./actions/swapping.js";
import { Pool, PrePool } from "./pool.js";
import { User } from "./user.js";
export declare class EuclidState {
  private invalidUtxos;
  pools: AssocMap<KeyHash, AssocMap<IdNFT, Pool>>;
  invalidPools: AssocMap<KeyHash, AssocMap<IdNFT, PrePool>>;
  constructor(utxos: Lucid.UTxO[], policy: Currency);
  swappingsFor(user: User): Swapping[];
}
