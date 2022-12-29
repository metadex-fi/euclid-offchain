import { Assets } from "./asset.ts";
import { PKeyedMap,mkPKeyedMap } from "./keyedMap.ts";
import { PNonEmptyMap } from "./nonEmptyMap.ts";
import { PCurrencySymbol,PTokenName,PAmount,TokenName,mkPAmount } from "./primitive.ts";

export type Value = Map<string, Map<string, bigint>>;
export const emptyValue: Value = new Map<string, Map<string, bigint>>();

export type PValue = PNonEmptyMap<
  PCurrencySymbol,
  PNonEmptyMap<PTokenName, PAmount>
>;
// export const PValue: PValue = mkPNonEmptyMap(
//   PCurrencySymbol,
//   mkPNonEmptyMap(
//     PTokenName,
//     PAmount,
//   ),
// );

const mkPTokenAmounts = (
  tokens: TokenName[],
  lowerBounds?: Map<TokenName, number>,
  upperBounds?: Map<TokenName, number>,
): PKeyedMap<PTokenName, PAmount> => {
  return mkPKeyedMap(
    tokens,
    PTokenName,
    mkPAmount(lowerBounds?.get(), upperBounds?),
  );
};

export const mkPValue = (
  assets: Assets,
  lowerBounds?: Value,
  upperBounds?: Value,
): PValue => {
  for (const [currencySymbol, tokens] of assets) {
    const lowerBound = lowerBounds?.get(currencySymbol);
    const upperBound = upperBounds?.get(currencySymbol);
    const tokenAmounts = mkPTokenAmounts(
      tokens,
      lowerBound,
      upperBound,
    );
    return new PNonEmptyMap(
      PCurrencySymbol,
      tokenAmounts,
    );
  }
};

export type Prices = Value;
export type PPrices = PValue;
export const PPrices = PValue;

export type Amounts = Value;
export type PAmounts = PValue;
export const PAmounts = PValue;

export type JumpSizes = Value;
export type PJumpSizes = PValue;
export const PJumpSizes = PValue;
