import { Alternative, Constr, Data, Datum, PaymentKeyHash, PlutusData, RecordType, Redeemer, Shape, SumType, UnsizedMap } from "../../lucid-data-parse/lucid/mod.ts" //"lucid-cardano"

export type Amount = bigint

export type CurrencySymbol = string 
export type TokenName = string

export class Asset {
    currencySymbol: CurrencySymbol 
    tokenName: TokenName
    
    constructor(currencySymbol: CurrencySymbol, tokenName: TokenName) {
        this.currencySymbol = currencySymbol
        this.tokenName = tokenName
    }
}
export type AssetShape = RecordType<Shape>
export const AssetShape: AssetShape = new Asset("", "")

export type IdNFT = Asset
export type IdNFTShape = AssetShape
export const IdNFTShape = AssetShape

export type Value = Map<CurrencySymbol, Map<TokenName, bigint>>
export type UnsizedValue = UnsizedMap<CurrencySymbol, UnsizedMap<TokenName, bigint>>
export const UnsizedValue: UnsizedValue = new UnsizedMap("", new UnsizedMap("", BigInt(0)))

export type Prices = Value
export type UnsizedPrices = UnsizedValue
export const UnsizedPrices: UnsizedPrices = UnsizedValue

export type Amounts = Value
export type UnsizedAmounts = UnsizedValue
export const UnsizedAmounts: UnsizedAmounts = UnsizedValue

export type JumpSizes = Value
export type UnsizedJumpSizes = UnsizedValue
export const UnsizedJumpSizes: UnsizedJumpSizes = UnsizedValue

export type ActiveAssets = Map<Prices, Asset>
export type UnsizedActiveAssets = UnsizedMap<UnsizedPrices, AssetShape>
export const UnsizedActiveAssets: UnsizedActiveAssets = new UnsizedMap(UnsizedPrices, AssetShape)

export class Dirac {
    owner: PaymentKeyHash
    threadNFT: IdNFT
    paramNFT: IdNFT
    prices: Prices
    activeAmnts: Amounts
    jumpStorage: ActiveAssets

    constructor (   owner: PaymentKeyHash
                ,   threadNFT: IdNFT
                ,   paramNFT: IdNFT
                ,   prices: Prices
                ,   activeAmnts: Amounts
                ,   jumpStorage: ActiveAssets
    ) {
        this.owner = owner
        this.threadNFT = threadNFT
        this.paramNFT = paramNFT
        this.prices = prices
        this.activeAmnts = activeAmnts
        this.jumpStorage = jumpStorage
    }
}
export type DiracShape = RecordType<Shape>
export const DiracShape: DiracShape = {
    owner: "",
    threadNFT: IdNFTShape,
    paramNFT: IdNFTShape,
    prices: UnsizedPrices,
    activeAmnts: UnsizedAmounts,
    jumpStorage: UnsizedActiveAssets
}

export class Param {
    owner: PaymentKeyHash
    jumpSizes: JumpSizes
    initialPrices: Prices
    lowerPriceBounds: Prices
    upperPriceBounds: Prices
    baseAmountA0: Amount

    constructor (   owner: PaymentKeyHash
                ,   jumpSizes: JumpSizes
                ,   initialPrices: Prices
                ,   lowerPriceBounds: Prices
                ,   upperPriceBounds: Prices
                ,   baseAmountA0: Amount
    ) {
        this.owner = owner
        this.jumpSizes = jumpSizes
        this.initialPrices = initialPrices
        this.lowerPriceBounds = lowerPriceBounds
        this.upperPriceBounds = upperPriceBounds
        this.baseAmountA0 = baseAmountA0
    }
}
export type ParamShape = RecordType<Shape>
export const ParamShape: ParamShape = {
    owner: "",
    jumpSizes: UnsizedJumpSizes,
    initialPrices: UnsizedPrices,
    lowerPriceBounds: UnsizedPrices,
    upperPriceBounds: UnsizedPrices,
    baseAmountA0: BigInt(0)
}

export type DiracDatumShape = RecordType<Shape>
export const DiracDatumShape: DiracDatumShape = {
    "_0": DiracShape
}

export type ParamDatumShape = RecordType<Shape>
export const ParamDatumShape: ParamDatumShape = {
    "_0": ParamShape
}

export type EuclidDatumShape = SumType<Shape>
export const EuclidDatumShape: EuclidDatumShape = [
    new Alternative(0, DiracDatumShape),
    new Alternative(1, ParamDatumShape)
]