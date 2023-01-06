import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { PByteString, PLiteral } from "../mod.ts";

type PByteStringLiteral = PLiteral<PByteString>;
const newPByteStringLiteral = (
  h: PaymentKeyHash,
): PByteStringLiteral => {
  return new PLiteral(PPaymentKeyHash, h);
};

export type CurrencySymbol = string;
export type PCurrencySymbol = PByteString;
export const PCurrencySymbol = new PByteString();
export type PCurrencySymbolLiteral = PByteStringLiteral;
export const newPCurrencySymbolLiteral = newPByteStringLiteral;

export type TokenName = string;
export type PTokenName = PByteString;
export const PTokenName = new PByteString();
export type PTokenNameLiteral = PByteStringLiteral;
export const newPTokenNameLiteral = newPByteStringLiteral;

export type PPaymentKeyHash = PByteString;
export const PPaymentKeyHash = new PByteString();
export type PPaymentKeyHashLiteral = PByteStringLiteral;
export const newPPaymentKeyHashLiteral = newPByteStringLiteral;
