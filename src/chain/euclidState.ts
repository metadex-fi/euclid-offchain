import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Address,
  Constr,
  Data,
  Lucid,
  UTxO,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { DiracUtxo, ParamUtxo } from "./euclidUtxo.ts";

export class EuclidState {
  public valid = new Map<ParamUtxo, DiracUtxo[]>();
  public invalid = new Map<string, UTxO[]>();
  constructor(
    public lucid: Lucid,
    public address: Address,
  ) {
  }

  public get = (address: Address): Map<ParamUtxo, DiracUtxo[]> => {
    const valid = new Map<ParamUtxo, DiracUtxo[]>()
    for (const [param, diracs] of this.valid) {
      if (param.param.owner === address) {
        valid.set(param, diracs)
      }
    }
    return valid;
  }

  public update = async (): Promise<void> => {
    const utxos = await this.lucid.utxosAt(this.address);
    [this.valid, this.invalid] = EuclidState.parse(utxos);
  }

  static parse (utxos: UTxO[]): [Map<ParamUtxo, DiracUtxo[]>, Map<string, UTxO[]>] {
    const valid = new Map<ParamUtxo, DiracUtxo[]>();
    const invalid = new Map<string, UTxO[]>();
    const params = new Map<string, ParamUtxo>();
    const diracUtxos = new Map<string, DiracUtxo[]>();
    utxos.forEach((utxo) => {
      try {
        // TODO assert scriptref, and all the other fields if it makes sense
        assert(utxo.datum, `datum must be present`);
        const datum = Data.from(utxo.datum);
        assert(datum instanceof Constr, `datum must be a Constr`);
        switch (datum.index) {
          case 0: {
            const paramUtxo = new ParamUtxo(utxo, datum.fields);
            assert(!params.has(paramUtxo.paramNFT), `duplicate idNFT: ${paramUtxo.paramNFT}`);
            params.set(paramUtxo.paramNFT, paramUtxo);
            break;
          }
          case 1: {
            const diracUtxo = new DiracUtxo(
              utxo,
              datum.fields,
            );
            const paramNFT = diracUtxo.paramNFT;
            const diracUtxos_ = diracUtxos.get(paramNFT) ?? [];
            diracUtxos_.push(diracUtxo);
            diracUtxos.set(paramNFT, diracUtxos_);
            break;
          }
          default:
            throw new Error(`invalid datum index: ${datum.index}`);
        }
      } catch (e) {
        const invalidUtxos = invalid.get(e.message) ?? [];
        invalidUtxos.push(utxo);
        invalid.set(e.message, invalidUtxos);
      }
    });
    for (const [paramNFT, diracUtxos_] of diracUtxos) {
      try {
        const paramUtxo = params.get(paramNFT);
        assert(paramUtxo, `missing paramUtxo for ${paramNFT}`);
        assert(!valid.has(paramUtxo), `duplicate param: ${paramUtxo}`);

        for (const diracUtxo of diracUtxos_) {
          try {
            const diracs = valid.get(paramUtxo) ?? [];
            diracs.push(diracUtxo.parseWith(paramUtxo.param));
            valid.set(paramUtxo, diracs);
          } catch (e) {
            const invalidUtxos = invalid.get(e.message) ?? [];
            invalidUtxos.push(diracUtxo.utxo);
            invalid.set(e.message, invalidUtxos);
          }
        }
      } catch (e) {
        const invalidUtxos = invalid.get(e.message) ?? [];
        invalidUtxos.push(...diracUtxos_.map((utxo) => utxo.utxo));
        invalid.set(e.message, invalidUtxos);
      }
    }
    return [valid, invalid];
  }
}
