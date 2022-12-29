import {
  genPositive,
  PByteString,
  PConstraint,
  PInteger,
  PType,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { genWithinRange } from "../../tests/generators/types.ts";
import { assertPositive, mkAssertWithinRange } from "../asserts.ts";

export type CurrencySymbol = string;
export type PCurrencySymbol = PByteString;
export const PCurrencySymbol = new PByteString();

export type TokenName = string;
export type PTokenName = PByteString;
export const PTokenName = new PByteString();

export type PPaymentKeyHash = PByteString;
export const PPaymentKeyHash = new PByteString();

export type PPositive = PConstraint<PInteger>;
export const PPositive: PPositive = new PConstraint<PInteger>(
  new PInteger(),
  [assertPositive],
  () => {
    return BigInt(genPositive());
  },
  () => {
    return BigInt(genPositive());
  },
);

export type Amount = bigint;
export type PAmount = PConstraint<PPositive>;
export const mkPAmount = (
  lowerBound?: number,
  upperBound?: number,
): PAmount => {
  return new PConstraint<PPositive>(
    PPositive,
    [mkAssertWithinRange(lowerBound, upperBound)],
    () => {
      return BigInt(genWithinRange(lowerBound, upperBound));
    },
    () => {
      return BigInt(genWithinRange(lowerBound, upperBound));
    },
  );
};
