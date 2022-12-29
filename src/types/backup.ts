// import {
//   PaymentKeyHash,
//   PByteString,
//   PInteger,
//   PMap,
//   PObject,
//   PRecord,
//   PSum,
// } from "../../refactor_parse/lucid/mod.ts";
// import { PlutusData } from "../../refactor_parse/lucid/src/core/wasm_modules/cardano_multiplatform_lib_nodejs/cardano_multiplatform_lib.js";

// import {
//   assertContractCurrency,
//   assertNonEmpty,
//   assertNotADA,
//   assertPositive,
//   mkDiracAsserts,
// } from "./asserts.ts";

// export type EuclidData =
//   | Amount
//   | CurrencySymbol
//   | TokenName
//   | Asset
//   | IdNFT
//   | Value
//   | Prices
//   | Amounts
//   | JumpSizes
//   | ActiveAssets
//   | Dirac
//   | Param
//   | DiracDatum
//   | ParamDatum
//   | EuclidDatum;

// export type Amount = bigint;
// export type CurrencySymbol = string;
// export type TokenName = string;

// export const PAmount = new PInteger([assertPositive]);
// export const PCurrencySymbol = new PByteString();
// export const PTokenName = new PByteString();
// export const PPaymentKeyHash = new PByteString();

// export class Asset {
//   constructor(
//     public currencySymbol: CurrencySymbol,
//     public tokenName: TokenName,
//   ) {}
// }
// export type IdNFT = Asset;

// export const PAsset = new PObject(
//   new PRecord(
//     {
//       "currencySymbol": PCurrencySymbol,
//       "tokenName": PTokenName,
//     },
//   ),
//   Asset,
// );
// export const PIdNFT = new PObject(
//   new PRecord({
//     "currencySymbol": new PByteString([assertContractCurrency]),
//     "tokenName": new PByteString([assertNotADA]),
//   }),
//   Asset,
// );

// export type Value = Map<string, Map<string, bigint>>;
// export const emptyValue: Value = new Map<string, Map<string, bigint>>();

// export type Prices = Value;
// export type Amounts = Value;
// export type JumpSizes = Value;

// export const PValue = new PMap(
//   PCurrencySymbol,
//   new PMap(PTokenName, new PInteger([assertPositive]), undefined, [
//     assertNonEmpty,
//   ]),
//   undefined,
//   [assertNonEmpty],
// );
// export const PPrices = PValue;
// export const PAmounts = PValue;
// export const PJumpSizes = PValue;

// export type ActiveAssets = Map<Prices, Asset>;
// export const PActiveAssets = new PMap(PPrices, PAsset);

// export class Dirac {
//   constructor(
//     public owner: PaymentKeyHash,
//     public threadNFT: IdNFT,
//     public paramNFT: IdNFT,
//     public prices: Prices,
//     public activeAmnts: Amounts,
//     public jumpStorage: ActiveAssets,
//   ) {}
// }

// export class Param {
//   constructor(
//     public owner: PaymentKeyHash,
//     public jumpSizes: JumpSizes,
//     public initialPrices: Prices,
//     public lowerPriceBounds: Prices,
//     public upperPriceBounds: Prices,
//     public baseAmountA0: Amount,
//   ) {}
// }

// export const mkPDirac = (param: Param) =>
//   new PRecord<Array<PlutusData>, Dirac>(
//     {
//       "owner": PPaymentKeyHash,
//       "threadNFT": PIdNFT,
//       "paramNFT": PIdNFT,
//       "prices": PPrices,
//       "activeAmnts": PAmounts,
//       "jumpStorage": PActiveAssets,
//     },
//     Dirac,
//     mkDiracAsserts(param),
//   );

// export const PParam = new PObject(
//   new PRecord({
//     "owner": PPaymentKeyHash,
//     "jumpSizes": PJumpSizes,
//     "initialPrices": PPrices,
//     "lowerPriceBounds": PPrices,
//     "upperPriceBounds": PPrices,
//     "baseAmountA0": PAmount,
//   }),
//   Param,
// );

// export class DiracDatum {
//   constructor(
//     public _0: Dirac,
//   ) {}
// }

// export class ParamDatum {
//   constructor(
//     public _0: Param,
//   ) {}
// }

// export const PDiracDatum = new PObject(
//   new PRecord({
//     "_0": PDirac,
//   }),
//   DiracDatum,
// );

// export const PParamDatum = new PObject(
//   new PRecord({
//     "_0": PParam,
//   }),
//   ParamDatum,
// );

// export type EuclidDatum = DiracDatum | ParamDatum;

// export const PEuclidDatum = new PSum([
//   PDiracDatum,
//   PParamDatum,
// ]);
