// import { TransactionUnspentOutput } from "../../lucid.mod.ts";
import { Address, AssetName, BigNum, MultiAsset, ScriptHash, TransactionHash, TransactionInput, TransactionOutput, TransactionUnspentOutput, Value } from "https://deno.land/x/lucid@0.10.6/src/core/libs/cardano_multiplatform_lib/cardano_multiplatform_lib.generated.js";
import { Lucid } from "../../lucid.mod.ts";
import { Asset } from "../mod.ts";

// TODO proptests

// converts Lucid-Utxo into CML-TransactionUnspentOutput
export const utxoToCML = (utxo: Lucid.UTxO): TransactionUnspentOutput => {
  const txin = TransactionInput.new(
    TransactionHash.from_hex(utxo.txHash), // TODO from_hex correct?
    BigNum.from_str(utxo.outputIndex.toString()),
  );
  const assets = MultiAsset.new();
  Object.entries(utxo.assets).forEach(([id, amount]) => {
    const asset = Asset.fromLucid(id);
    const scriptHash = ScriptHash.from_hex(asset.currency.toLucid()); // TODO check those conversions are correct
    const assetName = AssetName.new(Lucid.fromHex(asset.token.toLucid()));
    const amount_ = BigNum.from_str(amount.toString());
    assets.set_asset(
      scriptHash,
      assetName,
      amount_,
    );
  });
  const txout = TransactionOutput.new(
    Address.from_bytes(Lucid.fromHex(utxo.address)), // TODO correct?
    Value.new_from_assets(assets)
  );
  return TransactionUnspentOutput.new(txin, txout);
};