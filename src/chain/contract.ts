import euclidValidator from "../../contract/euclidValidator.json" assert {
  type: "json",
};
import euclidMinting from "../../contract/euclidMinting.json" assert { // TODO any reason to constrain minting? If not, we can - maybe have to, to prevent jamming-attacks due to how our pool detection works - clean up the whole ID-NFT mechanism
  type: "json",
};
import { EuclidState } from "./euclidState.ts";
import { Lucid } from "../../lucid.mod.ts";
import { Currency } from "../types/general/derived/asset/currency.ts";

export class Contract {
  public readonly validator: Lucid.Validator;
  public readonly mintingPolicy: Lucid.MintingPolicy;
  public readonly address: Lucid.Address;
  public readonly policy: Currency;
  public state?: EuclidState;

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
    this.policy = Currency.fromHex(
      lucid.utils.mintingPolicyToId(this.mintingPolicy),
    );
  }

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    this.state = new EuclidState(utxos, this.policy);
  };

  public concise = (): string => {
    // validator.script: ${this.validator.script};
    return `Contract (
      mintingPolicy.script: ${this.mintingPolicy.script};
      address: ${this.address};
      policy: ${this.policy};
      state?: ${this.state ? "yes" : "no"};
      )`;
  };
}
