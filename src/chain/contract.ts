import euclidValidator from "../../contract/euclidValidator.json" assert {
  type: "json",
};
import euclidMinting from "../../contract/euclidMinting.json" assert {
  type: "json",
};
import { Euclid } from "./euclid.ts";
import { Currency } from "../mod.ts";
import { Lucid } from "../../lucid.mod.ts";

export class Contract {
  public readonly validator: Lucid.Validator;
  public readonly mintingPolicy: Lucid.MintingPolicy;
  public readonly address: Lucid.Address;
  public readonly policyId: Lucid.PolicyId;
  public readonly currency: Currency;
  public state?: Euclid;

  constructor(
    public readonly lucid: Lucid.Lucid,
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

  public concise = (): string => {
    // validator.script: ${this.validator.script};
    return `Contract (
      mintingPolicy.script: ${this.mintingPolicy.script};
      address: ${this.address};
      policyId: ${this.policyId};
      currency: ${this.currency};
      state?: ${this.state ? "yes" : "no"};
      )`;
  };
}
