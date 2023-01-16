import euclidValidator from "../../plutarch/euclidValidator.json" assert {
  type: "json",
};
import euclidMinting from "../../plutarch/euclidMinting.json" assert {
  type: "json",
};
import {
  Address,
  Lucid,
  MintingPolicy,
  Validator,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";

export class Contract {
  public readonly validator: Validator;
  public readonly mintingPolicy: MintingPolicy;
  public readonly address: Address;

  constructor(
    public readonly lucid: Lucid,
  ) {
    this.validator = {
      type: "PlutusV2",
      script: euclidValidator.cborHex,
    };

    this.mintingPolicy = {
      type: "PlutusV2",
      script: euclidMinting.cborHex,
    };

    this.address = lucid.utils.validatorToAddress(this.validator);
  }
}
