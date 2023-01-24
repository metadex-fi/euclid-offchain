import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Tx, TxHash, utxoToCore } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  Data,
  Dirac,
  DiracDatum,
  genPositive,
  min,
  randomChoice,
  User,
} from "../mod.ts";
import { Pool } from "./pool.ts";

export class Action {
  constructor(public readonly user: User) {}

  public genOpenTx = (): Tx => {
    return Pool.generate(this.user).openingTx(this.user);
  };

  // public genCloseTx = (pool: Pool): Tx => {
  // };

  // public genAdminTx = (pool: Pool): Tx => {
  // };

  // public genOwnerTx = (): Tx => {
  //   const utxoPools = this.contract.state!.utxoPools!.get(this.address);
  //   const pool = randomChoice(this.pools!);
  //   return randomChoice([
  //     this.genCloseTx,
  //     this.genAdminTx,
  //   ])(pool);
  // };

  public genFlipTx = (pool: Pool): Tx => {
    const diracUtxo = randomChoice(pool.flippable!);
    const dirac = diracUtxo.dirac;

    const boughtAsset = dirac.activeAmnts.assets().randomChoice();
    const boughtPrice = dirac.prices.amountOf(boughtAsset);
    const maxBoughtA0 = dirac.activeAmnts.amountOf(boughtAsset) * boughtPrice;

    const otherAssets = diracUtxo.flippable!;
    otherAssets.remove(boughtAsset);
    const soldAsset = otherAssets.randomChoice();
    const soldPrice = dirac.prices.amountOf(soldAsset);
    const maxSoldA0 = dirac.activeAmnts.amountOf(soldAsset) * soldPrice;

    const flippedA0 = genPositive(min(maxBoughtA0, maxSoldA0));
    const soldAmount = flippedA0 / soldPrice;
    const boughtAmount = (soldAmount * soldPrice) / boughtPrice;

    const newAmounts = dirac.activeAmnts.clone();
    newAmounts.increaseAmountOf(boughtAsset, boughtAmount);
    newAmounts.increaseAmountOf(soldAsset, -soldAmount);

    assert(diracUtxo.balance, `diracUtxo.balance is undefined`);
    const newBalance = diracUtxo.balance.clone();
    newBalance.increaseAmountOf(boughtAsset, boughtAmount);
    newBalance.increaseAmountOf(soldAsset, -soldAmount);

    const diracDatum = new DiracDatum(
      new Dirac(
        dirac.owner,
        dirac.threadNFT,
        dirac.paramNFT,
        dirac.prices,
        newAmounts,
        dirac.jumpStorage,
      ),
    );

    const datum = diracUtxo.pdiracDatum.pconstant(diracDatum);

    assert(pool.paramUtxo.utxo, `pool.paramUtxo.utxo is undefined`);
    const tx = this.user.lucid.newTx()
      .readFrom([pool.paramUtxo.utxo]) // for the script
      .payToContract(
        this.user.contract.address,
        { inline: Data.to(datum) },
        newBalance.toLucid(),
      );

    assert(diracUtxo.utxo, `diracUtxo.utxo is undefined`);
    tx.txBuilder.add_input( // TODO see if this works
      utxoToCore(diracUtxo.utxo),
      undefined, // TODO see if that's required
    );

    return tx;
  };

  public genJumpTx = (pool: Pool): Tx => {
    throw new Error("Not implemented");
  };

  public genUserTx = (openUtxoPools: Pool[]) => (): Tx => {
    const utxoPool = randomChoice(openUtxoPools);
    return randomChoice([
      ...utxoPool.flippable!.length ? [this.genFlipTx] : [],
      // ...utxoPool.jumpable!.length ? [this.genJumpTx] : [],
    ])(utxoPool);
  };

  public txOptions = async (): Promise<(() => Tx)[]> => {
    await this.user.update();

    const openUtxoPools = this.user.contract.state!.openForBusiness(
      this.user.balance!.assets(),
    );
    return [
      // ...this.isOwner() ? [this.genOwnerTx] : [], // TODO get pools from contract.state
      // ...openUtxoPools.length ? [this.genUserTx(openUtxoPools)] : [],
      ...this.user.balance!.size() >= 2n ? [this.genOpenTx] : [],
    ];
  };

  public genEuclidTx = async (options: (() => Tx)[]): Promise<TxHash> => {
    const genTx = randomChoice(options);
    const tx = genTx();
    try {
      const complete = await tx.complete();
      const signed = await complete.sign().complete();
      return await signed.submit();
    } catch (e) {
      console.log(e);
      return "";
    }
  };
}
