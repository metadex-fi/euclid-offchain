import { Lucid } from "../../lucid.mod.js";
import { IdNFT } from "../types/euclid/idnft.js";
import { Asset } from "../types/general/derived/asset/asset.js";
import { Assets } from "../types/general/derived/asset/assets.js";
import { KeyHash } from "../types/general/derived/hash/keyHash.js";
import { PositiveValue } from "../types/general/derived/value/positiveValue.js";
import { Action } from "./actions/action.js";
import { Contract } from "./contract.js";
import { Swapping } from "./actions/swapping.js";
import { AssocMap } from "../types/general/fundamental/container/map.js";
export declare class User {
    readonly lucid: Lucid.Lucid;
    readonly privateKey?: string | undefined;
    readonly address?: string | undefined;
    readonly contract: Contract;
    readonly paymentKeyHash: KeyHash;
    balance?: PositiveValue;
    swapMap: AssocMap<Asset, AssocMap<Asset, AssocMap<number, Swapping[]>>>;
    private lastIdNFT?;
    private constructor();
    get availableBalance(): PositiveValue | undefined;
    get hasPools(): boolean;
    get nextParamNFT(): IdNFT;
    setLastIdNFT: (idNFT: IdNFT) => void;
    generateActions: () => Promise<Action[]>;
    get account(): {
        address: Lucid.Address;
        assets: Lucid.Assets;
    };
    update: () => Promise<void>;
    composeSwappings: (boughtAsset: Asset, soldAsset: Asset, amount: bigint, amountIsSold: boolean) => [Swapping[], bigint];
    static fromWalletApi(lucid: Lucid.Lucid, api: Lucid.WalletApi): Promise<User>;
    static fromPrivateKey(lucid: Lucid.Lucid, privateKey: string): Promise<User>;
    static generateWith(lucid: Lucid.Lucid, allAssets: Assets): Promise<User>;
    static generateDummy(): User;
    static genSeveral(numUsers: bigint, numAssets: bigint): Promise<User[]>;
}
