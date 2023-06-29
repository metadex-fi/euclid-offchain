import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { genNonNegative, maxInteger } from "../../../../utils/generators.js";
import { PConstraint } from "../../fundamental/container/constraint.js";
import { PInteger } from "../../fundamental/primitive/integer.js";

export const bothExtreme = (a: bigint, b: bigint) =>
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

export const genPBounded = (
  minLowerBound = -maxInteger,
): PBounded => {
  assert(minLowerBound >= -maxInteger, `${minLowerBound} < -maxInteger`);
  assert(minLowerBound < maxInteger, `${minLowerBound} >= maxInteger`);
  const lowerBound = newGenInRange(minLowerBound, maxInteger)();
  const upperBound = newGenInRange(lowerBound, maxInteger)();
  return new PBounded(lowerBound, upperBound);
};

export const newGenInRange = (lowerBound: bigint, upperBound: bigint) => {
  if (lowerBound === upperBound) return () => lowerBound;
  assert(
    lowerBound <= upperBound,
    `newGenInRange: ${lowerBound} > ${upperBound}`,
  );
  return () => lowerBound + genNonNegative(upperBound - lowerBound);
};

const newAssertInRange =
  (lowerBound?: bigint, upperBound?: bigint) => (i: bigint) => {
    assert(
      !lowerBound || lowerBound <= i,
      `too small: ${i} < ${lowerBound} by ${lowerBound! - i}`,
    );
    assert(
      !upperBound || i <= upperBound,
      `too big: ${i} > ${upperBound} by ${i - upperBound!}`,
    );
  };
