import { Lucid } from "../../../lucid.mod.js";
import { Asset } from "../../types/general/derived/asset/asset.js";
import { User } from "../user.js";
import { DiracUtxo, ParamUtxo } from "../utxo.js";
export declare class Swapping {
  readonly user: User;
  readonly paramUtxo: ParamUtxo;
  readonly diracUtxo: DiracUtxo;
  readonly boughtAsset: Asset;
  readonly soldAsset: Asset;
  readonly boughtAmount: bigint;
  readonly soldAmount: bigint;
  readonly boughtSpot: bigint;
  readonly soldSpot: bigint;
  readonly boughtExp: bigint;
  readonly soldExp: bigint;
  readonly spotPrice: number;
  private constructor();
  get type(): string;
  show: () => string;
  tx: (tx: Lucid.Tx) => Lucid.Tx;
  subsequents: () => Swapping[];
  subSwap: (amount: bigint, amountIsSold: boolean) => Swapping;
  private randomSubSwap;
  static boundary(
    user: User,
    paramUtxo: ParamUtxo,
    diracUtxo: DiracUtxo,
    boughtAsset: Asset,
    soldAsset: Asset,
    boughtAmount: bigint,
    soldAmount: bigint,
    boughtSpot: bigint,
    soldSpot: bigint,
    boughtExp: bigint,
    soldExp: bigint,
  ): Swapping;
  static genOfUser(user: User): Swapping | undefined;
  private static boughtAssetForSale;
  private static valueEquation;
  static validates(
    spotBuying: bigint,
    spotSelling: bigint,
    buyingLowest: bigint,
    sellingLowest: bigint,
    buyingJumpSize: bigint,
    sellingJumpSize: bigint,
    buyingWeight: bigint,
    sellingWeight: bigint,
    buyingLiquidity: bigint,
    sellingLiquidity: bigint,
    buyingAmount: bigint,
    sellingAmount: bigint,
  ): boolean;
}
