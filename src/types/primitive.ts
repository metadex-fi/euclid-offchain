import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  gMaxLength,
  maxInteger,
  maybeNdef,
  PaymentKeyHash,
  PByteString,
  PConstraint,
  PInteger,
  PLifted,
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

// @ts-ignore TODO consider fixing this, or leaving as is
export type PNum = PInteger | PConstraint<PNum>;

export class PBounded extends PConstraint<PInteger> {
  static pinner = new PInteger();
  constructor(
    public lowerBound = -maxInteger,
    public upperBound = maxInteger,
  ) {
    assert(lowerBound < upperBound, "PBounded: lowerBound >= upperBound");
    super(
      PBounded.pinner,
      [newAssertInRange(lowerBound, upperBound)],
      newGenInRange(lowerBound, upperBound),
    );
  }

  static genPType(): PConstraint<PInteger> {
    return genPBounded();
  }
}

export class PPositive extends PBounded {
  constructor(
    public lowerBound = 1n,
    public upperBound = maxInteger,
  ) {
    assert(lowerBound > 0n, "PPositive: lowerBound <= 0");
    super(lowerBound, upperBound);
  }

  static genPType(): PPositive {
    return genPBounded(1n);
  }
}

const genPBounded = (
  minLowerBound?: bigint,
  maxLowerBound?: bigint,
  minRange?: bigint,
  maxRange?: bigint,
): PBounded => {
  assert(!minRange || minRange > 0n, "minRange <= 0");
  assert(!maxRange || maxRange > gMaxLength, "maxRange <= gMaxLength");
  assert(!maxRange || !minRange || minRange <= maxRange, "minRange > maxRange");
  assert(
    !maxLowerBound || !minLowerBound || minLowerBound <= maxLowerBound,
    "minLowerBound > maxLowerBound",
  );
  const genLowerBound = newGenInRange(minLowerBound, maxLowerBound);
  const genRange = newGenInRange(minRange ?? gMaxLength, maxRange);
  const lowerBound = genLowerBound();
  const upperBound = lowerBound + genRange();
  const maybeLowerBound = minLowerBound || maxLowerBound
    ? lowerBound
    : maybeNdef(lowerBound);
  const maybeUpperBound = minRange || maxRange
    ? upperBound
    : maybeNdef(upperBound);
  return new PBounded(maybeLowerBound, maybeUpperBound);
};

const newGenInRange = (
  lowerBound = -maxInteger,
  upperBound = maxInteger,
) =>
(): PLifted<PInteger> => {
  assert(lowerBound < upperBound, "newGenInRange: lowerBound >= upperBound");
  return lowerBound + genNonNegative(upperBound - lowerBound);
};

const newAssertInRange =
  (lowerBound?: bigint, upperBound?: bigint) => (i: bigint) => {
    assert(!lowerBound || lowerBound <= i, `too small: ${i} < ${lowerBound}`);
    assert(!upperBound || i <= upperBound, `too big: ${i} > ${upperBound}`);
  };

export type Amount = bigint;
export type PAmount = PPositive;
