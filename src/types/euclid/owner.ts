import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { PByteString } from "../general/fundamental/primitive/bytestring.ts";
import { PLiteral } from "../mod.ts";

export const PPaymentKeyHash = new PByteString();

export class Owner {
  constructor(
    public paymentKeyHash: PaymentKeyHash,
  ) {
    assert(paymentKeyHash.length > 0, "paymentKeyHash must be non-empty");
  }
}

export class POwner extends PLiteral<PByteString> {
  private constructor(
    public paymentKeyHash: PaymentKeyHash,
  ) {
    super(PPaymentKeyHash, paymentKeyHash);
  }

  static genPType(): PLiteral<PByteString> {
    const paymentKeyHash = PPaymentKeyHash.genData();
    return new POwner(paymentKeyHash);
  }

  static pliteral(paymentKeyHash: PaymentKeyHash): POwner {
    return new POwner(paymentKeyHash);
  }
}
