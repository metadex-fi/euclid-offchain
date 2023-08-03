// import { TransactionUnspentOutput } from "../../lucid.mod.ts";
import { Address, AssetName, BigNum, MultiAsset, ScriptHash, TransactionHash, TransactionInput, TransactionOutput, TransactionUnspentOutput, TransactionUnspentOutputs, Value } from "https://deno.land/x/lucid@0.10.6/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated.js";
import { Lucid } from "../../lucid.mod.ts";
import { Asset, Currency } from "../mod.ts";

// TODO proptests

// converts Lucid-Utxo into CML-TransactionUnspentOutput
export const utxoToCML = (utxo: Lucid.UTxO): TransactionUnspentOutput => {
  const txin = TransactionInput.new(
    TransactionHash.from_hex(utxo.txHash), // TODO from_hex correct?
    BigNum.from_str(utxo.outputIndex.toString()),
  );
  const assets = MultiAsset.new();
  const value = Value.zero();
  Object.entries(utxo.assets).forEach(([id, amount]) => {
    const asset = Asset.fromLucid(id);
    if (asset.currency.equals(Currency.ADA)) {
      value.set_coin(BigNum.from_str(amount.toString()));
    } else {
      const scriptHash = ScriptHash.from_hex(asset.currency.toLucid()); // TODO check those conversions are correct
      const assetName = AssetName.new(Lucid.fromHex(asset.token.toLucid()));
      const amount_ = BigNum.from_str(amount.toString());
      assets.set_asset(
        scriptHash,
        assetName,
        amount_,
      );
    }
  });
  value.set_multiasset(assets);
  const txout = TransactionOutput.new(
    Address.from_bech32(utxo.address), // TODO correct?
    value,
  );
  return TransactionUnspentOutput.new(txin, txout);
};

export const utxosToCML = (
  utxos: Lucid.UTxO[], 
  mempoolUtxos: {
    txHash: string;
    outputIndex: number;
  }[] 
  ): TransactionUnspentOutputs => {
    const utxos_ = TransactionUnspentOutputs.new();
    utxos.forEach((utxo) => {
      const i = mempoolUtxos.findIndex((mUtxo) => 
      mUtxo.txHash === utxo.txHash && mUtxo.outputIndex === utxo.outputIndex
      );
      if (i === -1) {
        utxos_.add(utxoToCML(utxo));
      }
    });
    return utxos_;
}