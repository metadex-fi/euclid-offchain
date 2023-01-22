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
  Utils,
  Validator,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Euclid } from "./state.ts";

export class Contract {
  public readonly validator: Validator;
  public readonly mintingPolicy: MintingPolicy;
  public readonly address: Address;
  public readonly policyId: PolicyId;
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
  }

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    this.state = Euclid.ingest(utxos, fromHex(this.policyId));
    this.state.digest();
  };
}
