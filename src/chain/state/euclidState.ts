import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  Address,
  Constr,
  Data,
  Lucid,
  UTxO,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { Dirac, IdNFT, PAllDiracs, Param, PParamDatum } from "../../mod.ts";
import { DiracUtxo } from "./diracUtxo.ts";

export class EuclidState {
  public valid = new Map<Param, Dirac[]>();
  public invalid = new Map<string, UTxO[]>();
  constructor(
    public lucid: Lucid,
    public address: Address,
  ) {
  }

  public update = async (): Promise<void> => {
    this.invalid.clear();
    const utxos = await this.lucid.utxosAt(this.address);
    const params = new Map<string, Param>();
    const diracUtxos = new Map<string, DiracUtxo[]>();
    utxos.forEach((utxo) => {
      try {
        // TODO assert scriptref, and all the other fields if it makes sense
        assert(utxo.datum, `datum must be present`);
        const datum = Data.from(utxo.datum);
        assert(datum instanceof Constr, `datum must be a Constr`);
        switch (datum.index) {
          case 0: {
            const param = PParamDatum.ptype.plift(datum.fields)._0;
            const paramNFT = IdNFT.newParamNFT(param.owner).show();
            assert(!params.has(paramNFT), `duplicate idNFT: ${paramNFT}`);
            params.set(paramNFT, param);
            break;
          }
          case 1: {
            const [paramNFT, diracUtxo] = DiracUtxo.preparse(
              utxo,
              datum.fields,
            );
            const diracUtxos_ = diracUtxos.get(paramNFT) ?? [];
            diracUtxos_.push(diracUtxo);
            diracUtxos.set(paramNFT, diracUtxos_);
            break;
          }
          default:
            throw new Error(`invalid datum index: ${datum.index}`);
        }
      } catch (e) {
        const invalidUtxos = this.invalid.get(e.message) ?? [];
        invalidUtxos.push(utxo);
        this.invalid.set(e.message, invalidUtxos);
      }
    });
    for (const [paramNFT, diracUtxos_] of diracUtxos) {
      try {
        const param = params.get(paramNFT);
        assert(param, `missing paramUtxo for ${paramNFT}`);
        assert(!this.valid.has(param), `duplicate param: ${param}`);

        const pallDiracs = PAllDiracs.fromParam(param);

        for (const diracUtxo of diracUtxos_) {
          try {
            const diracs = this.valid.get(param) ?? [];
            diracs.push(diracUtxo.parseWith(param));
            this.valid.set(param, diracs);
          } catch (e) {
            const invalidUtxos = this.invalid.get(e.message) ?? [];
            invalidUtxos.push(diracUtxo.utxo);
            this.invalid.set(e.message, invalidUtxos);
          }
        }
      } catch (e) {
        const invalidUtxos = this.invalid.get(e.message) ?? [];
        invalidUtxos.push(...diracUtxos_.map((utxo) => utxo.utxo));
        this.invalid.set(e.message, invalidUtxos);
      }
    }
  };
}
