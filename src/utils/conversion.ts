import { Lucid } from "../../lucid.mod.ts";

export const utxosToCore = (utxos: Lucid.UTxO[]): Lucid.C.TransactionUnspentOutputs => {
  const utxos_ = Lucid.C.TransactionUnspentOutputs.new();
  utxos.forEach((utxo) => {
    utxos_.add(Lucid.utxoToCore(utxo));
  });
  return utxos_;
};

export const coreToUtxos = (utxos: Lucid.C.TransactionUnspentOutputs): Lucid.UTxO[] => {
  const utxos_ = [];
  for (let i = 0; i < utxos.len(); i++) {
    utxos_.push(Lucid.coreToUtxo(utxos.get(i)));
  }
  return utxos_;
};
