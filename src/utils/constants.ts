export const maxInteger = BigInt( // TODO better value, maybe look at chain/plutus max
  Number.MAX_SAFE_INTEGER, // = 2 ** 53 - 1
); // NOTE/TODO using this for now to avoid Number rounding errors for convenience
// export const maxInteger = 2n ** 61n;
// TODO revert
// export const maxInteger = 10000n; // NOTE This will cause weirdness after we added the minAda of 1000000n (utxo.ts)
export const defaultMaxWeight = 10000n; //BigInt(Math.floor(Number(maxInteger) ** 0.5)); // TODO evaluate this
export const gMaxStringLength = 9000n; //maxInteger;
export const gMaxStringBytes = gMaxStringLength / 2n;
export const gMaxLength = 10n;
export const gMaxDiracs = 100n;
export const gMaxDepth = 4n;
export const compareVariants = false;
export const globalExpLimit = 300; // TODO better value (500 failed, 100 appears to work)
export const handleInvalidPools = true; // in prod we might get invalid pools because of spammers/attackers, but in dev we want to get an error. TODO adjust accordingly
// TODO the above can happen even if emulator in case of closing-split, consider catching that accordingly deactivating the above

// fees and minAda
export const lovelacePerAda = 1000000n;
export const feesLovelace = 10n * lovelacePerAda; // costs in lovelace for fees TODO excessive and probably different for different actions
export const closingFees = feesLovelace / 2n; // in case all ADA was put into a pool, we want avoid losing the minimum needed to close it again

// TODO still estimates (see math/lockedAda)
export const lockedAdaDiracBase = lovelacePerAda * 3n / 2n;
export const lockedAdaParamBase = 29n * lovelacePerAda;
export const lockedAdaPerAssetDirac = lovelacePerAda * 3n / 4n;
export const lockedAdaPerAssetParam = lovelacePerAda; //* 3n / 4n;

// this one is actually required per the contract
export const lockedAdaDirac = (numAssets: bigint): bigint =>
  lockedAdaDiracBase + numAssets * lockedAdaPerAssetDirac;

// this one is just for setting aside enough ADA
export const lockedAdaParam = (numAssets: bigint): bigint =>
  lockedAdaParamBase + numAssets * lockedAdaPerAssetParam;
