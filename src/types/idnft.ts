import { PConstraint } from "../../../refactor_parse/lucid/src/mod.ts";
import { contractCurrency } from "../../tests/generators/types.ts";
import { assertContractCurrency } from "../asserts.ts";
import { Asset, PAsset } from "./asset.ts";
import { PTokenName } from "./primitive.ts";

export type IdNFT = Asset;
export type PIdNFT = PConstraint<PAsset>;
export const PIdNFT = new PConstraint<PAsset>(
  PAsset,
  [assertContractCurrency],
  () => {
    return new Asset(contractCurrency, PTokenName.genData());
  },
  () => {
    return [contractCurrency, PTokenName.genPlutusData()];
  },
);
