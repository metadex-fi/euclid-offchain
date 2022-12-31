import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genPositive,
  PaymentKeyHash,
  PByteString,
  PConstraint,
  PInteger,
  PMaybeLiteral,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { PLiteral } from "../../../refactor_parse/lucid/src/plutus/types/literal.ts";

export type CurrencySymbol = string;
export type PCurrencySymbol = PByteString;
export const PCurrencySymbol = new PByteString();

export type TokenName = string;
export type PTokenName = PByteString;
export const PTokenName = new PByteString();

export type PPaymentKeyHash = PByteString;
export const PPaymentKeyHash = new PByteString();
export type PPaymentKeyHashLiteral = PLiteral<PPaymentKeyHash>;
export const newPPaymentKeyHashLiteral = (
  h: PaymentKeyHash,
): PPaymentKeyHashLiteral => {
  return new PLiteral(PPaymentKeyHash, h);
};

export type PPositive = PConstraint<PInteger>;
export const PPositive: PPositive = new PConstraint<PInteger>(
  new PInteger(),
  [assertPositive],
  () => {
    return BigInt(genPositive());
  },
);

function assertPositive(i: bigint) {
  assert(i > 0n, "encountered nonpositive");
}

export type Amount = bigint;
export type PAmount = PConstraint<PPositive>;
export const newPAmount = (
  lowerBound = 1n,
  upperBound?: bigint,
): PAmount => {
  assertPositive(lowerBound);
  return new PConstraint<PPositive>(
    PPositive,
    [newAssertIntInRange(lowerBound, upperBound)],
    newGenIntInRange(lowerBound, upperBound),
  );
};

const newGenIntInRange = (
  lowerBound = 0n,
  upperBound?: bigint,
) =>
(): bigint => {
  return lowerBound + BigInt(genNonNegative(Number(upperBound)));
};

const newAssertIntInRange =
  (lowerBound?: bigint, upperBound?: bigint) => (i: bigint) => {
    assert(!lowerBound || lowerBound <= i, "too small");
    assert(!upperBound || i < upperBound, "too big");
  };
