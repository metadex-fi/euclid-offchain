import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { fromHex, fromText } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { genName } from "../../mod.ts";
import { PByteString } from "../general/fundamental/primitive/bytestring.ts";
import { PConstraint, PLiteral } from "../mod.ts";

export type KeyHash = Uint8Array;
export class PKeyHash extends PConstraint<PByteString> {
  private constructor() {
    super(
      new PByteString(),
      [PKeyHash.assert],
      PKeyHash.generate,
    );
  }

  static assert(data: Uint8Array): void {
    assert(data.length > 0, "paymentKeyHash must be non-empty");
  }

  static generate(): Uint8Array {
    return fromHex(fromText(genName(1n)));
  }

  static ptype = new PKeyHash();
  static genPType(): PConstraint<PByteString> {
    return PKeyHash.ptype;
  }
}

export class Owner {
  constructor(
    public paymentKeyHash: KeyHash,
  ) {
    assert(paymentKeyHash.length > 0, "paymentKeyHash must be non-empty");
  }
}

export class POwner extends PLiteral<PKeyHash> {
  private constructor(
    public paymentKeyHash: KeyHash,
  ) {
    super(PKeyHash.ptype, paymentKeyHash);
  }

  static genPType(): PLiteral<PByteString> {
    const paymentKeyHash = PKeyHash.ptype.genData();
    return new POwner(paymentKeyHash);
  }

  static pliteral(paymentKeyHash: KeyHash): POwner {
    return new POwner(paymentKeyHash);
  }
}
