import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  max,
  maxInteger,
  maybeNdef,
  min,
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

export const bothExtreme = (a: Amount, b: Amount) =>
  a === b && a === maxInteger || a === -maxInteger;

export class PBounded extends PConstraint<PInteger> {
  static pinner = new PInteger();
  constructor(
    public lowerBound = -maxInteger,
    public upperBound = maxInteger,
  ) {
    assert(
      lowerBound <= upperBound,
      `PBounded: ${lowerBound} > ${upperBound}`,
    );

    super(
      PBounded.pinner,
      [newAssertInRange(lowerBound, upperBound)],
      newGenInRange(lowerBound, upperBound),
      `PBounded(${lowerBound}, ${upperBound})`,
    );
    this.population = Number(upperBound - lowerBound) + 1;
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
    assert(!lowerBound || lowerBound > 0n, `PPositive: ${lowerBound} <= 0`);
    super(lowerBound, upperBound);
  }

  static genPType(): PPositive {
    return genPBounded(1n);
  }
}

const genPBounded = (
  minLowerBound = -maxInteger,
): PBounded => {
  assert(minLowerBound >= -maxInteger, `${minLowerBound} < -maxInteger`);
  assert(minLowerBound < maxInteger, `${minLowerBound} >= maxInteger`);
  const lowerBound = newGenInRange(minLowerBound, maxInteger)();
  const upperBound = newGenInRange(lowerBound, maxInteger)();
  return new PBounded(lowerBound, upperBound);
};

const newGenInRange = (lowerBound: bigint, upperBound: bigint) => {
  if (lowerBound === upperBound) return () => lowerBound;
  assert(
    lowerBound < upperBound,
    `newGenInRange: ${lowerBound} >= ${lowerBound}`,
  );
  return () => lowerBound + genNonNegative(upperBound - lowerBound);
};

const newAssertInRange =
  (lowerBound?: bigint, upperBound?: bigint) => (i: bigint) => {
    assert(
      !lowerBound || lowerBound <= i,
      `too small: ${i} < ${lowerBound}`,
    );
    assert(
      !upperBound || i <= upperBound,
      `too big: ${i} > ${upperBound}`,
    );
  };

export type Amount = bigint;
export type PAmount = PPositive;
