import {
  fromHex,
  genNonNegative,
  genNumber,
  PaymentKeyHash,
  PType,
  randomChoice,
  sha256,
  toHex,
} from "../../../refactor_parse/lucid/src/mod.ts";
import { Asset, IdNFT, PAsset, PIdNFT } from "../../src/types/asset.ts";
import {
  ActiveAssets,
  Dirac,
  DiracDatum,
  PActiveAssets,
  PDirac,
} from "../../src/types/dirac.ts";
import {
  EuclidData,
  EuclidDatum,
  PEuclidDatum,
} from "../../src/types/euclid.ts";
import {
  Param,
  ParamDatum,
  PParam,
  PParamDatum,
} from "../../src/types/param.ts";
import {
  Amount,
  CurrencySymbol,
  PAmount,
  PCurrencySymbol,
  PPaymentKeyHash,
  PTokenName,
  TokenName,
} from "../../src/types/primitive.ts";
import {
  PAmounts,
  PJumpSizes,
  PPrices,
  Prices,
  PValue,
  Value,
} from "../../src/types/value.ts";
import { contains } from "../../src/utils.ts";
import {
  addAssetAmount,
  addValues,
  amountOf,
  amountOfAsset,
  assetSingleton,
  assetsOf,
  mapAmounts,
  newValue,
  setAssetAmount,
} from "../../src/value.ts";

const maxNumAssets = 5;
const dropChance = 0.5;
const maxJumps = 2n; // per direction, so 1 + 2 * maxJumps per dimension
const minTicks = 1; // per dimension
const maxTicks = 5; // per dimension
export const contractCurrency = "cc"; // TODO replace with actual
const maxJumpStores = 10;
const maxThreadNFTs = 10;

export function randomSubset<T>(set: T[]): T[] {
  const subset = new Array<T>();
  set.forEach((elem) => {
    if (Math.random() > dropChance) {
      subset.push(elem);
    }
  });
  return subset;
}

export function genWithinRange(
  lowerBound: number = 0,
  upperBound?: number,
): number {
  return lowerBound + genNonNegative(upperBound);
}

export function genEuclidData(ptype: PType): EuclidData {
  if (ptype === PAmount) {
    return genAmount();
  } else if (ptype === PCurrencySymbol) {
    return genCurrencySymbol();
  } else if (ptype === PTokenName) {
    return genTokenName();
  } else if (ptype === PPaymentKeyHash) {
    return genPaymentKeyHash();
  } else if (ptype === PAsset) {
    return genAsset();
  } else if (ptype === PIdNFT) {
    return genIdNFT();
  } else if (ptype === PValue) {
    const assets = genAssets();
    return genValue(assets);
  } else if (ptype === PPrices) {
    const assets = genAssets();
    return genPrices(assets);
  } else if (ptype === PAmounts) {
    const amountA0 = genInteger();
    const assets = genAssets();
    const prices = genPrices(assets);
    return genAmounts(amountA0, prices);
  } else if (ptype === PJumpSizes) {
    const assets = genAssets();
    return genJumpSizes(assets);
  } else if (ptype === PActiveAssets) {
    const assets = genAssets();
    const initialPrices = genPrices(assets);
    const jumpSizes = genPrices(assets);
    return genActiveAssets(initialPrices, jumpSizes);
  } else if (ptype === PDirac) {
    return genDirac();
  } else if (ptype === PParam) {
    return genParam();
  } else if (ptype === PDiracDatum) {
    return genDiracDatum();
  } else if (ptype === PParamDatum) {
    return genParamDatum();
  } else if (ptype === PEuclidDatum) {
    return genEuclidDatum();
  } else {
    throw new Error("unknown ptype");
  }
}

export function genPoolDatums(): EuclidDatum[] {
  const param = genParam();
  const diracs = genDiracs(param);
  return [
    genParamDatum(param),
    ...diracs.map(genDiracDatum),
  ];
}

export function genAssets(): Asset[] {
  const numAssets = genNumber(maxNumAssets);
  const assets: Asset[] = [];
  while (assets.length < numAssets) {
    const asset = genAsset();
    if (!contains(assets, asset)) assets.push(asset);
  }
  return assets;
}

export function nextThreadNFT(threadNFT: IdNFT): IdNFT {
  return genIdNFT(toHex(sha256(fromHex(threadNFT.tokenName))));
}

export function genValue(
  assets: Asset[],
  lowerBounds?: Value,
  upperBounds?: Value,
): Value {
  let value: Value = newValue();
  assets.forEach((asset) => {
    const lower = lowerBounds ? amountOfAsset(lowerBounds, asset) : undefined;
    const upper = upperBounds ? amountOfAsset(upperBounds, asset) : undefined;
    value = addValues(value, assetSingleton(asset, genAmount(lower, upper)));
  });
  return value;
}

export function genPrices(
  assets: Asset[],
  lowerBounds?: Prices,
  upperBounds?: Prices,
): Prices {
  let lowerBounds_ = newValue();
  assets.forEach((asset) => {
    const lower = lowerBounds ? (amountOfAsset(lowerBounds, asset) ?? 1n) : 1n;
    lowerBounds_ = setAssetAmount(lowerBounds_, asset, lower);
  });
  return genValue(assets, lowerBounds_, upperBounds);
}

export function genAmounts(baseAmountA0: bigint, prices: Prices): Value {
  const assets = assetsOf(prices);
  const denom = assets[0];
  const nonzero = randomSubset(assets);
  const p0 = amountOfAsset(prices, denom)!;
  let amounts = newValue();
  let amountA0 = baseAmountA0;
  nonzero.slice(1).forEach((asset) => {
    const tradedA0 = BigInt(genNumber(Number(amountA0)));
    amountA0 -= tradedA0;
    const p = amountOfAsset(prices, asset)!;
    amounts = setAssetAmount(amounts, asset, (tradedA0 * p) / p0);
  });
  const p = amountOfAsset(prices, nonzero[0])!;
  amounts = setAssetAmount(amounts, nonzero[0], (amountA0 * p) / p0);
  return amounts;
}

export const genJumpSizes = genPrices;

// TODO this might lead to some paradoxes, let's see, we might learn something
export function genActiveAssets(
  initialPrices: Value,
  jumpSizes: Value,
): ActiveAssets {
  const assets = assetsOf(initialPrices);
  const storeSize = genNumber(maxJumpStores);
  const maxJumps = maxJumpStores;
  const activeAssets = new Map<Prices, Asset>();
  const jumpLogs = new Map<string, bigint[]>();

  for (let i = 0; i < storeSize; i++) {
    let collides = true;
    const storedPrices = mapAmounts(initialPrices, (amnt, ccy, tkn) => {
      const assetName = ccy! + tkn!;
      const jump = randomChoice([-1n, 1n]) * BigInt(genNumber(maxJumps));
      let jumpLog = jumpLogs.get(assetName);
      if (jumpLog) {
        if (!jumpLog.includes(jump)) {
          jumpLog.push(jump);
          collides = false;
        }
      } else {
        jumpLog = [jump];
        jumpLogs.set(assetName, jumpLog);
        collides = false;
      }
      return amnt + jump * amountOf(jumpSizes, ccy!, tkn!)!;
    });
    if (!collides) {
      const storedAsset = randomChoice(assets);
      activeAssets.set(storedPrices, storedAsset);
    }
  }

  return activeAssets;
}

export function genDirac(): Dirac {
  const owner = genPaymentKeyHash();
  const paramNFT = genIdNFT(owner);
  const numThreadNFTs = genNumber(maxThreadNFTs);
  let threadNFT = nextThreadNFT(paramNFT);
  for (let i = 0; i < numThreadNFTs; i++) {
    threadNFT = nextThreadNFT(paramNFT);
  }
  const assets = genAssets();
  const prices = genPrices(assets);
  const jumpSizes = genJumpSizes(assets);
  const baseAmountA0 = genInteger();
  const activeAmnts = genAmounts(baseAmountA0, prices);
  const jumpStorage = genActiveAssets(prices, jumpSizes);

  return new Dirac(
    owner,
    threadNFT,
    paramNFT,
    prices,
    activeAmnts,
    jumpStorage,
  );
}

export function genDiracs(param: Param): Dirac[] {
  // const threadNFTs = new Array<IdNFT>();
  const assets = assetsOf(param.initialPrices);
  const owner = param.owner;
  const paramNFT = genIdNFT(owner);
  const numTicks = BigInt(minTicks + genNumber(maxTicks - minTicks + 1));
  let threadNFT = paramNFT;

  threadNFT = nextThreadNFT(threadNFT);
  // threadNFTs.push(threadNFT);
  const prices = param.initialPrices;
  let diracs = [
    new Dirac(
      owner,
      threadNFT,
      paramNFT,
      prices,
      genAmounts(param.baseAmountA0, prices),
      genActiveAssets(prices, param.jumpSizes),
    ),
  ];
  // for each asset and for each existing dirac, "spread" that dirac
  // in that asset's dimension. "spread" means: add all other tick
  // offsets for that asset's price.
  assets.forEach((asset) => {
    const jumpSize = amountOfAsset(param.jumpSizes, asset)!;
    const tickSize = jumpSize / numTicks;
    const diracs_ = new Array<Dirac>();
    diracs.forEach((dirac) => {
      for (let offset = tickSize; offset < jumpSize; offset += tickSize) {
        threadNFT = nextThreadNFT(threadNFT);
        // threadNFTs.push(threadNFT);
        const prices = addAssetAmount(dirac.prices, asset, offset);
        diracs_.push(
          new Dirac(
            owner,
            threadNFT,
            paramNFT,
            prices,
            genAmounts(param.baseAmountA0, prices),
            genActiveAssets(prices, param.jumpSizes),
          ),
        );
      }
    });
    diracs = diracs.concat(diracs_);
  });
  return diracs;
}

export function genParam(): Param {
  const owner = genPaymentKeyHash();
  const assets = genAssets();
  const lowerBoundedAssets = randomSubset(assets);
  const lowerPriceBounds = genPrices(lowerBoundedAssets);
  const upperBoundedAssets = randomSubset(assets);
  const upperPriceBounds = genPrices(upperBoundedAssets, lowerPriceBounds);
  const initialPrices = genPrices(assets, lowerPriceBounds, upperPriceBounds);
  const jumpSizes = genJumpSizes(assets);
  const baseAmountA0 = genAmount();

  return new Param(
    owner,
    jumpSizes,
    initialPrices,
    lowerPriceBounds,
    upperPriceBounds,
    baseAmountA0,
  );
}

export function genDiracDatum(dirac?: Dirac): DiracDatum {
  return new DiracDatum(dirac ?? genDirac());
}

export function genParamDatum(param?: Param): ParamDatum {
  return new ParamDatum(param ?? genParam());
}

export function genEuclidDatum(): EuclidDatum {
  return randomChoice([
    genDiracDatum,
    genParamDatum,
  ])();
}
