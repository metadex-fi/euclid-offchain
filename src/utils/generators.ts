// TODO consider generating wrong cases as well

import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Address,
  fromHex,
  Lucid,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Amounts, Assets, PData, User } from "../mod.ts";

export const maxInteger = 9000n; //BigInt(Number.MAX_SAFE_INTEGER); // TODO better value, maybe look at chain/plutus max
export const gMaxStringBytes = 64n; // TODO higher
export const gMaxLength = 3n;
export const gMaxDepth = 4n;
const dropChance = 0.5;

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

export function minSizedSubset<T>(set: T[], minSize: bigint): T[] {
  assert(minSize <= set.length, `minSizedSubset: ${minSize} > ${set.length}`);
  const subset = [];
  const pickedIndices: number[] = [];
  while (subset.length < minSize) {
    const [elem, index] = randomIndexedChoice(set);
    if (!pickedIndices.includes(index)) {
      subset.push(elem);
      pickedIndices.push(index);
    }
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

export function genNumber(maxValue = maxInteger): bigint {
  const n = genNonNegative(maxValue);
  return randomChoice([n, -n]);
}

function genString(
  alph: string,
  minBytes = 0n,
  maxBytes = gMaxStringBytes,
): string {
  assert(minBytes >= 0n, `genString: minBytes < 0`);
  assert(gMaxStringBytes >= maxBytes, `genString: maxStringBytes < minBytes`);
  assert(maxBytes >= minBytes, `genString: maxBytes < minBytes`);
  function genChar(): string {
    const choice = Math.floor(Math.random() * (alph.length + 10));
    if (choice < alph.length) {
      return alph.charAt(choice);
    } else {
      return Math.floor(Math.random() * 10).toString();
    }
  }
  const l: string[] = [];
  const maxi = 8n * (minBytes + genNonNegative(maxBytes - minBytes));
  for (let i = 0n; i < maxi; i++) {
    l.push(genChar());
  }
  const s = l.join("");
  return s;
}

export function genByteString(
  minBytes = 0n,
  maxBytes = gMaxStringBytes,
): Uint8Array {
  return fromHex(genString("abcdef", minBytes, maxBytes));
}

export function genName(minBytes = 0n): string {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = lower.toUpperCase();
  const alph = lower + upper; // TODO special characters
  return genString(alph, minBytes);
}

export async function genUsers(): Promise<User[]> {
  const users = new Array<User>();
  const allAssets = Assets.generate(2n);
  const lucid = await Lucid.new(undefined, "Custom");

  const numUsers = 10n; //genPositive(gMaxLength);
  let canOpenPool = 10n; //genPositive(numUsers);
  const addresses = new Array<Address>();
  while (users.length < numUsers) {
    const user = await User.generateWith(lucid);
    assert(user.address, `user.address is undefined`);
    if (!addresses.includes(user.address)) {
      addresses.push(user.address);
      user.balance = Amounts.genOfAssets(
        allAssets.minSizedSubset(canOpenPool-- > 0 ? 2n : 0n),
      );
      users.push(user);
    }
  }
  return users;
}
