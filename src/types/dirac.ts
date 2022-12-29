import {
  FieldsOf,
  PaymentKeyHash,
  PData,
  PlutusOf,
  PMap,
  PObject,
  PRecord,
  PType,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Asset, IdNFT, PAsset, PIdNFT } from "./asset.ts";
import { PPaymentKeyHash } from "./primitive.ts";
import { Amounts, PAmounts, PPrices, Prices, Value } from "./value.ts";

export type ActiveAssets = Map<Prices, Asset>;
export type PActiveAssets = PMap<PPrices, PAsset>;
export const PActiveAssets = new PMap(PPrices, PAsset);

export class Dirac {
  constructor(
    public owner: PaymentKeyHash,
    public threadNFT: IdNFT,
    public paramNFT: IdNFT,
    public prices: Prices,
    public activeAmnts: Amounts,
    public jumpStorage: ActiveAssets,
  ) {}
}

export class PDirac implements PType<PlutusOf<Dirac>, Dirac> {
  plift(data: string | Value | Map<Value, string>): Dirac {
    throw new Error("Method not implemented.");
  }
  pconstant(data: Dirac): string | Value | Map<Value, string> {
    throw new Error("Method not implemented.");
  }
  genData(): Dirac {
    throw new Error("Method not implemented.");
  }
  genPlutusData(): string | Value | Map<Value, string> {
    throw new Error("Method not implemented.");
  }
}

export function mkPDirac() {
  return new PObject(
    new PRecord({
      "owner": PPaymentKeyHash,
      "threadNFT": PIdNFT,
      "paramNFT": PIdNFT,
      "prices": PPrices,
      "activeAmnts": PAmounts,
      "jumpStorage": PActiveAssets,
    }),
    Dirac,
  );
}

export class DiracDatum {
  constructor(
    public _0: Dirac,
  ) {}
}

// export const PDiracDatum = new PObject(
//   new PRecord({
//     "_0": PDirac,
//   }),
//   DiracDatum,
// );
