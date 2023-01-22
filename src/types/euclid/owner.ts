import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  fromHex,
  fromText,
  PaymentKeyHash,
  toHex,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { genName } from "../../mod.ts";
import { PByteString } from "../general/fundamental/primitive/bytestring.ts";
import { PConstraint, PLiteral } from "../mod.ts";

export class PPaymentKeyHash extends PConstraint<PByteString> {
  private constructor() {
    super(
      new PByteString(),
      [PPaymentKeyHash.assert],
      PPaymentKeyHash.generate,
    );
  }

  static assert(data: Uint8Array): void {
    assert(data.length > 0, "paymentKeyHash must be non-empty");
  }

  static generate(): Uint8Array {
    return fromHex(fromText(genName(1n)));
  }

  static ptype = new PPaymentKeyHash();
  static genPType(): PConstraint<PByteString> {
    return PPaymentKeyHash.ptype;
  }
}

export class Owner {
  constructor(
    public paymentKeyHash: PaymentKeyHash,
  ) {
    assert(paymentKeyHash.length > 0, "paymentKeyHash must be non-empty");
  }
}

export class POwner extends PLiteral<PPaymentKeyHash> {
  private constructor(
    public paymentKeyHash: PaymentKeyHash,
  ) {
    super(PPaymentKeyHash.ptype, fromHex(paymentKeyHash));
  }

  static genPType(): PLiteral<PByteString> {
    const paymentKeyHash = toHex(PPaymentKeyHash.ptype.genData());
    return new POwner(paymentKeyHash);
  }

  static pliteral(paymentKeyHash: PaymentKeyHash): POwner {
    return new POwner(paymentKeyHash);
  }
}
