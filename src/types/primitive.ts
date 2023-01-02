import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genNumber,
  genPositive,
  maxInteger,
  maybeNdef,
  PaymentKeyHash,
  PByteString,
  PConstraint,
  PInteger,
  PLifted,
  randomChoice,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { PLiteral } from "../../../refactor_parse/lucid/src/plutus/types/literal.ts";

type PByteStringLiteral = PLiteral<PByteString>;
const newPByteStringLiteral = (
  h: PaymentKeyHash,
): PByteStringLiteral => {
  return new PLiteral(PPaymentKeyHash, h);
};

export type CurrencySymbol = string;
export type PCurrencySymbol = PByteString;
export const PCurrencySymbol = new PByteString();
export type PCurrencySymbolLiteral = PByteStringLiteral;
export const newPCurrencySymbolLiteral = newPByteStringLiteral;

export type TokenName = string;
export type PTokenName = PByteString;
export const PTokenName = new PByteString();
export type PTokenNameLiteral = PByteStringLiteral;
export const newPTokenNameLiteral = newPByteStringLiteral;

export type PPaymentKeyHash = PByteString;
export const PPaymentKeyHash = new PByteString();
export type PPaymentKeyHashLiteral = PByteStringLiteral;
export const newPPaymentKeyHashLiteral = newPByteStringLiteral;

function assertPositive(i: bigint) {
  assert(i > 0n, `encountered nonpositive: ${i}`);
}

// @ts-ignore TODO consider fixing this, or leaving as is
export type PNum = PInteger | PConstraint<PNum>;

export type PBounded<T extends PNum> = PConstraint<T>;
export const newPBounded = <T extends PNum>(
  pinner: T,
  lowerBound?: bigint,
  upperBound?: bigint,
): PBounded<T> => {
  return new PConstraint<T>(
    // @ts-ignore TODO consider fixing this, or leaving as is
    pinner,
    [newAssertInRange(lowerBound, upperBound)],
    newGenInRange(pinner, lowerBound, upperBound),
  );
};
export const genPBounded = () => {
  const inner = randomChoice([new PInteger(), PPositive]);
  const lowerBound = maybeNdef(inner.genData());
  const upperBound = maybeNdef(
    lowerBound ? lowerBound + PPositive.genData() : inner.genData(),
  );
  return newPBounded(inner, lowerBound, upperBound);
};

const newGenInRange = <T extends PNum>(
  pinner: T,
  lowerBound = -BigInt(maxInteger), // TODO better infinity, maybe from chain
  upperBound = BigInt(maxInteger),
) =>
(): PLifted<T> => {
  const inner = pinner.genData();
  
};

const newAssertInRange =
  (lowerBound?: bigint, upperBound?: bigint) => (i: bigint) => {
    assert(!lowerBound || lowerBound <= i, `too small: ${i} < ${lowerBound}`);
    assert(!upperBound || i < upperBound, `too big: ${i} >= ${upperBound}`);
  };

  export type PPositive = PBounded<PInteger>;
export const PPositive: PPositive = newPBounded(
  new PInteger,
  1n,
  undefined,
);

export type PBoundedInteger = PBounded<PInteger>;
const PInteger_ = new PInteger();
export const newPBoundedInteger = (
  lowerBound?: bigint,
  upperBound?: bigint,
): PBoundedInteger => {
  return newPBounded(PInteger_, lowerBound, upperBound);
};

export type Amount = bigint;
export type PAmount = PBounded<PPositive>;
export const newPAmount = (lowerBound = 1n, upperBound?: bigint): PAmount => {
  assertPositive(lowerBound);
  return newPBounded(PPositive, lowerBound, upperBound);
};
