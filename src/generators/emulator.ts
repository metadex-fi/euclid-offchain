import {
  Address,
  Assets as Value,
  Emulator,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Assets, PPaymentKeyHash } from "../mod.ts";
import {
  genNonNegative,
  genPositive,
  gMaxLength,
} from "./generators.ts";

export function genEmulator(): Emulator {
  const accounts: { address: Address; assets: Value }[] = [];
  const allAssets = Assets.generate(2n);

  const numEuclidEligible = genPositive(gMaxLength);
  const euclidEligible: Address[] = [];

  while (euclidEligible.length < numEuclidEligible) {
    const keyHash = PPaymentKeyHash.genData();
    if (!euclidEligible.includes(keyHash)) {
      euclidEligible.push(keyHash);
      const assets: Value = {};
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
    const keyHash = PPaymentKeyHash.genData()
    if (!anyKeyHashes.includes(keyHash)) {
      anyKeyHashes.push(keyHash);
      const assets: Value = {};
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
