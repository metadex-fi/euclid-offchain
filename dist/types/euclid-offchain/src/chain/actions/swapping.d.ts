import { Lucid } from "../../../lucid.mod.js";
import { Asset } from "../../types/general/derived/asset/asset.js";
import { User } from "../user.js";
import { DiracUtxo, ParamUtxo } from "../utxo.js";
export declare class Swapping {
    private readonly user;
    private readonly paramUtxo;
    private readonly diracUtxo;
    private readonly boughtAsset;
    private readonly soldAsset;
    private readonly boughtAmount;
    private readonly soldAmount;
    private readonly boughtSpot;
    private readonly soldSpot;
    private constructor();
    get type(): string;
    show: () => string;
    tx: (tx: Lucid.Tx) => Lucid.Tx;
    private randomSubSwap;
    static boundary(user: User, paramUtxo: ParamUtxo, diracUtxo: DiracUtxo, boughtAsset: Asset, soldAsset: Asset, boughtAmount: bigint, soldAmount: bigint, boughtSpot: bigint, soldSpot: bigint): Swapping;
    static genOfUser(user: User): Swapping | undefined;
    private static pricesFitDirac;
    private static boughtAssetForSale;
    private static valueEquation;
    static validates(spotBuying: bigint, spotSelling: bigint, buyingLowest: bigint, sellingLowest: bigint, buyingJumpSize: bigint, sellingJumpSize: bigint, buyingWeight: bigint, sellingWeight: bigint, buyingLiquidity: bigint, sellingLiquidity: bigint, buyingAmount: bigint, sellingAmount: bigint): boolean;
}
