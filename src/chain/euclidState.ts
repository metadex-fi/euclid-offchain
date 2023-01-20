import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Address,
  Constr,
  Data,
  Lucid,
  UTxO,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { DiracUtxo, EuclidUtxos, ParamUtxo } from "./euclidUtxo.ts";

export class EuclidState {
  public utxos?: EuclidUtxos
  constructor(
    public lucid: Lucid,
    public address: Address,
  ) {
  }

  public get = (address: Address): Map<ParamUtxo, DiracUtxo[]> => {
    const valid = new Map<ParamUtxo, DiracUtxo[]>();
    for (const [param, diracs] of this.valid) {
      if (param.param.owner === address) {
        valid.set(param, diracs);
      }
    }
    return valid;
  };

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    [this.valid, this.invalid] = EuclidState.parse(utxos);
  };
}
