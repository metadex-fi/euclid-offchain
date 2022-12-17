// import { Data, genString, genUnsizedValue } from "lucid-cardano";
import {
  ActiveAssets,
  Asset,
  AssetShape,
  Dirac,
  DiracShape,
  Prices,
} from "../src/Types.tsx";
import {
  Data,
  genInteger,
  genString,
  genUnsizedValue,
} from "../../lucid-data-parse/lucid/mod.ts";

/*
Test by
    A)
    - compiling some Plutarch script which passes if some exact redeemer is sent
    - pasting it here resp. in Context
    - construct said redeemer with lucid
    - try to send it

    B)
    - define some datums in frontend
    - serialize & deserialize them in frontend
    - see what comes out

*/

const maxLength = 2;

export function genAsset(): Asset {
  return new Asset(
    genString(maxLength)[1],
    genString(maxLength)[1],
  );
}

export function genActiveAssets(): ActiveAssets {
  const m = new Map<Prices, Asset>();
  const keyStrings: string[] = [];
  const maxi = maxLength * Math.random();
  for (let i = 0; i < maxi; i++) {
    const key = genUnsizedValue(maxLength)[1];
    const keyString = Data.to(key);
    if (!keyStrings.includes(keyString)) {
      keyStrings.push(keyString);
      const value = genAsset();
      m.set(key, value);
    }
  }
  return m;
}

export function genDirac(): Dirac {
  return new Dirac(
    genString(maxLength)[1],
    genAsset(),
    genAsset(),
    genUnsizedValue(maxLength)[1],
    genUnsizedValue(maxLength)[1],
    genActiveAssets(),
  );
}
