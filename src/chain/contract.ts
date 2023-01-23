import euclidValidator from "../../contract/euclidValidator.json" assert {
  type: "json",
};
import euclidMinting from "../../contract/euclidMinting.json" assert {
  type: "json",
};
import {
  Address,
  Emulator,
  fromHex,
  Lucid,
  MintingPolicy,
  PolicyId,
  Validator,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Euclid } from "./euclid.ts";
import { Currency } from "../mod.ts";

export class Contract {
  public readonly validator: Validator;
  public readonly mintingPolicy: MintingPolicy;
  public readonly address: Address;
  public readonly policyId: PolicyId;
  public readonly currency: Currency;
  public state?: Euclid;

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
    this.policyId = lucid.utils.mintingPolicyToId(this.mintingPolicy);
    this.currency = Currency.fromHex(this.policyId);
  }

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    this.state = new Euclid(utxos, this.currency);
  };
}
