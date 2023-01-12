import {
  Address,
  Assets,
  Emulator,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { PAssets } from "../mod.ts";
import {
  genKeyHash,
  genNonNegative,
  genPositive,
  gMaxLength,
} from "./generators.ts";

export function genEmulator(): Emulator {
  const accounts: { address: Address; assets: Assets }[] = [];
  const allAssets = PAssets.genAssets(2n);

  const numEuclidEligible = genPositive(gMaxLength);
  const euclidEligible: Address[] = [];

  while (euclidEligible.length < numEuclidEligible) {
    const keyHash = genKeyHash();
    if (!euclidEligible.includes(keyHash)) {
      euclidEligible.push(keyHash);
      const assets: Assets = {};
      allAssets.minSizedSubset(2n).forEach((asset) =>
        assets[asset.toLucid()] = genPositive()
      );

      accounts.push({
        address: keyHash,
        assets: assets,
      });
    }
  }

  const numAny = genNonNegative(gMaxLength - numEuclidEligible);
  const anyKeyHashes: Address[] = [];

  while (anyKeyHashes.length < numAny) {
    const keyHash = genKeyHash();
    if (!anyKeyHashes.includes(keyHash)) {
      anyKeyHashes.push(keyHash);
      const assets: Assets = {};
      allAssets.minSizedSubset(0n).forEach((asset) =>
        assets[asset.toLucid()] = genNonNegative()
      );

      accounts.push({
        address: keyHash,
        assets: assets,
      });
    }
  }

  return new Emulator(accounts);
}
