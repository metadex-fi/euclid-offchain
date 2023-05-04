// TODO consider generating wrong cases as well
import { assert } from "../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../lucid.mod.js";
export const maxInteger = 9000n; //BigInt(Number.MAX_SAFE_INTEGER); // TODO better value, maybe look at chain/plutus max
export const gMaxStringLength = maxInteger;
export const gMaxStringBytes = gMaxStringLength / 2n;
export const gMaxLength = 3n;
export const gMaxDepth = 4n;
export const feesEtcLovelace = 100000000n; // costs in lovelace for fees etc. TODO excessive
const letters = `abcdefghijklmnopqrstuvwxyz`;
const symbols = "!@#$%^&*()_-+={[}]|\\;:'\",<.>/?`~";
const dropChance = 0.5;
export class Generators {
  constructor(primitives, containers) {
    Object.defineProperty(this, "primitives", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: primitives,
    });
    Object.defineProperty(this, "containers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: containers,
    });
  }
  generate(maxDepth) {
    const generator = maxDepth > 0
      ? randomChoice([
        ...this.primitives,
        ...this.containers,
      ])
      : randomChoice(this.primitives);
    return generator(this, max(maxDepth - 1n, 0n));
  }
}
export function max(a, b) {
  return a > b ? a : b;
}
export function min(a, b) {
  return a < b ? a : b;
}
export function abs(n) {
  return n < 0n ? -n : n;
}
export function randomChoice(alternatives) {
  return randomIndexedChoice(alternatives)[0];
}
export function randomIndexedChoice(alternatives) {
  assert(
    alternatives.length > 0,
    `randomIndexedChoice: alternatives.length <= 0`,
  );
  const choice = Math.floor(Math.random() * alternatives.length);
  return [alternatives[choice], choice];
}
export function randomSubset(set) {
  const subset = new Array();
  set.forEach((elem) => {
    if (Math.random() > dropChance) {
      subset.push(elem);
    }
  });
  return subset;
}
export function nonEmptySubSet(set) {
  const subset = randomSubset(set);
  if (subset.length === 0) {
    subset.push(randomChoice(set));
  }
  return subset;
}
export function boundedSubset(set, minSize = 0n, maxSize) {
  assert(minSize <= set.length, `minSizedSubset: ${minSize} > ${set.length}`);
  const subset = [];
  const pickedIndices = [];
  const maxSize_ = maxSize
    ? min(maxSize, BigInt(set.length))
    : BigInt(set.length);
  const size = minSize + genNonNegative(maxSize_ - minSize);
  while (subset.length < size) {
    const [elem, index] = randomIndexedChoice(set);
    if (!pickedIndices.includes(index)) {
      subset.push(elem);
      pickedIndices.push(index);
    }
  }
  return subset;
}
export function maybeNdef(value) {
  return randomChoice([value, undefined]);
}
export function genNonNegative(maxValue = maxInteger) {
  assert(maxValue >= 0n, `genNonNegative: maxValue < 0: ${maxValue}`);
  const n = Math.floor(Math.random() * Number(maxValue));
  let n_;
  try {
    n_ = BigInt(n);
  } catch (_e) { // TODO isFinite does not work, but this is excessive
    n_ = maxValue;
  }
  return randomChoice([
    0n,
    n_,
    maxValue,
  ]);
}
export function genPositive(maxValue = maxInteger) {
  assert(maxValue >= 1n, `genPositive: maxValue < 1: ${maxValue}`);
  return 1n + genNonNegative(maxValue - 1n);
}
export function genNumber(maxValue = maxInteger) {
  const n = genNonNegative(maxValue);
  return randomChoice([n, -n]);
}
function genString(alph, minLength, maxLength, stepSize) {
  assert(minLength >= 0n, `genString: minBytes < 0`);
  assert(gMaxStringLength >= maxLength, `genString: maxStringBytes < minBytes`);
  assert(maxLength >= minLength, `genString: maxBytes < minBytes`);
  function genChar() {
    const choice = Math.floor(Math.random() * (alph.length + 10));
    if (choice < alph.length) {
      return alph.charAt(choice);
    } else {
      return Math.floor(Math.random() * 10).toString();
    }
  }
  const l = [];
  const maxi = stepSize * (minLength + genNonNegative(maxLength - minLength));
  for (let i = 0n; i < maxi; i++) {
    l.push(genChar());
  }
  const s = l.join("");
  return s;
}
export function genByteString(minBytes = 0n, maxBytes = gMaxStringBytes) {
  return Lucid.fromHex(genString("abcdef", minBytes, maxBytes, 2n));
}
export function genName(minLength = 0n, maxLength = gMaxStringLength) {
  const lower = letters;
  const upper = lower.toUpperCase();
  const alph = lower + upper; //+ symbols; TODO reactivate symbols (apparently sometimes breaks something onchain in tokenNames)
  return genString(alph, minLength, maxLength, 1n);
}
