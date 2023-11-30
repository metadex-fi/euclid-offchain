// export const maxInteger = BigInt( // TODO better value, maybe look at chain/plutus max
//   Number.MAX_SAFE_INTEGER, // = 2 ** 53 - 1
// ); // NOTE/TODO using this for now to avoid Number rounding errors for convenience
// export const maxInteger = 2n ** 61n;
// TODO revert
export const maxInteger = 10000n; // NOTE This will cause weirdness after we added the minAda of 1000000n (utxo.ts)
export const maxIntRoot = BigInt(Math.floor(Number(maxInteger) ** 0.5));
export const gMaxStringLength = 9000n; //maxInteger;
export const gMaxStringBytes = gMaxStringLength / 2n;
export const gMaxLength = 3n;
export const gMaxDepth = 4n;
export const feesEtcLovelace = 100000n; // costs in lovelace for fees etc. TODO excessive
export const compareVariants = false;
export const webappExpLimit = 11; // our empirically determined expLimit in the webapp TODO outdated, measure again
export const handleInvalidPools = false; // in prod we might get invalid pools because of spammers/attackers, but in dev we want to get an error. TODO adjust accordingly
