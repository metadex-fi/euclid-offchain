// import { TransactionUnspentOutput } from "../../lucid.mod.ts";
import { TransactionUnspentOutputs } from "https://deno.land/x/lucid@0.10.7/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated.js";
import { Lucid } from "../../lucid.mod.ts";

export const utxosToCore = (utxos: Lucid.UTxO[]): TransactionUnspentOutputs => {
  const utxos_ = TransactionUnspentOutputs.new();
  utxos.forEach((utxo) => {
    utxos_.add(Lucid.utxoToCore(utxo));
  });
  return utxos_;
};

export const coreToUtxos = (utxos: TransactionUnspentOutputs): Lucid.UTxO[] => {
  const utxos_ = [];
  for (let i = 0; i < utxos.len(); i++) {
    utxos_.push(Lucid.coreToUtxo(utxos.get(i)));
  }
  return utxos_;
}