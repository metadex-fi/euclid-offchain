// TODO consider generating wrong cases as well

import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PByteString } from "../../types/general/bytestring.ts";
import { PInteger } from "../../types/general/integer.ts";
import { PRecord } from "../../types/general/record.ts";
import { PData } from "../../types/general/type.ts";

export const maxInteger = 9000n; //BigInt(Number.MAX_SAFE_INTEGER); // TODO better value, maybe look at chain/plutus max
const maxStringBytes = 2n; // TODO higher
export const gMaxLength = 4n;
export const gMaxDepth = 4n;
const dropChance = 0.5;
export const contractCurrency = "cc"; // TODO replace with actual

export class Generators {
  constructor(
    public primitives: Array<
      () => PData
    >,
    public containers: Array<
      (
        gen: Generators,
        maxDepth: bigint,
      ) => PData
    >,
  ) {}

  public generate(maxDepth: bigint): PData {
    const generator = maxDepth > 0
      ? randomChoice([
        ...this.primitives,
        ...this.containers,
      ])
      : randomChoice(this.primitives);
    return generator(this, max(maxDepth - 1n, 0n));
  }
}

export function max(a: bigint, b: bigint): bigint {
  return a > b ? a : b;
}
export function min(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}

export function abs(n: bigint): bigint {
  return n < 0n ? -n : n;
}

export function randomChoice<T>(alternatives: T[]): T {
  return randomIndexedChoice(alternatives)[0];
}

export function randomIndexedChoice<T>(alternatives: T[]): [T, number] {
  assert(
    alternatives.length > 0,
    `randomIndexedChoice: alternatives.length <= 0`,
  );
  const choice = Math.floor(Math.random() * alternatives.length);
  return [alternatives[choice], choice];
}

export function randomSubset<T>(set: T[]): T[] {
  const subset = new Array<T>();
  set.forEach((elem) => {
    if (Math.random() > dropChance) {
      subset.push(elem);
    }
  });
  return subset;
}

export function nonEmptySubSet<T>(set: T[]): T[] {
  const subset = randomSubset(set);
  if (subset.length === 0) {
    subset.push(randomChoice(set));
  }
  return subset;
}

export function maybeNdef<T>(value: T) {
  return randomChoice([value, undefined]);
}

export function genNonNegative(maxValue = maxInteger): bigint {
  assert(maxValue >= 0n, `genNonNegative: maxValue < 1`);
  return randomChoice([
    0n,
    BigInt(Math.floor(Math.random() * Number(maxValue))),
    maxValue,
  ]);
}

export function genPositive(maxValue = maxInteger): bigint {
  assert(maxValue >= 1n, `genPositive: maxValue < 1`);
  return 1n + genNonNegative(maxValue - 1n);
}

export function genNumber(maxValue?: bigint): bigint {
  const n = genNonNegative(maxValue);
  return randomChoice([n, -n]);
}

export function genString(alph: string): string {
  function genChar(): string {
    const choice = Math.floor(Math.random() * (alph.length + 10));
    if (choice < alph.length) {
      return alph.charAt(choice);
    } else {
      return Math.floor(Math.random() * 10).toString();
    }
  }
  const l: string[] = [];
  const maxi = 8n * genNonNegative(maxStringBytes);
  for (let i = 0; i < maxi; i++) {
    l.push(genChar());
  }
  const s = l.join("");
  return s;
}

export function genName(): string {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = lower.toUpperCase();
  const alph = lower + upper; // TODO special characters
  return genString(alph);
}

// sample named record

export class Example {
  constructor(
    public ccy: string,
    public tkn: string,
    public amnt: bigint,
  ) {}
}

export function genPExample() {
  return new PRecord<PByteString | PInteger>(
    {
      "ccy": new PByteString(),
      "tkn": new PByteString(),
      "amnt": new PInteger(),
    },
    //@ts-ignore TODO fixme
    Example,
  );
}
