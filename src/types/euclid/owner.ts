import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { PaymentKeyHash } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { genString } from "../../mod.ts";
import { PByteString, PConstraint, PLiteral } from "../mod.ts";

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
    assert(paymentKeyHash.length > 0, "paymentKeyHash must be non-empty");
    super(new PByteString(), paymentKeyHash);
  }

  static genPType(): PLiteral<PByteString> {
    const paymentKeyHash = genString("abcdef", 1n);
    return new POwner(paymentKeyHash);
  }

  static pliteral(paymentKeyHash: PaymentKeyHash): POwner {
    return new POwner(paymentKeyHash);
  }
}
