import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../lucid.mod.ts";
import {
  Assets,
  Data,
  Dirac,
  DiracDatum,
  DiracUtxo,
  genPositive,
  min,
  randomChoice,
  randomIndexedChoice,
  User,
} from "../mod.ts";
import { Pool } from "./pool.ts";

interface Actionable {
  readonly tx: Lucid.Tx;
}

const showErrors = true;

class FlipPool implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(user: User, pool: Pool): FlipPool | undefined {
    try {
      assert(user.balance, `user.balance is undefined`);
      const sharedAssets = pool.sharedAssets(user.balance.assets());
      assert(!sharedAssets.empty(), `FlipPool: no shared assets`);
      const [diracUtxo, i] = randomIndexedChoice(pool.diracUtxos);
      const dirac = diracUtxo.dirac;

      const boughtAsset = dirac.activeAmnts.assets().randomChoice();
      const boughtPrice = dirac.prices.amountOf(boughtAsset);
      const maxBoughtA0 = dirac.activeAmnts.amountOf(boughtAsset) * boughtPrice;

      const otherAssets = diracUtxo.flippable;
      otherAssets.drop(boughtAsset);
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
      const tx = user.lucid.newTx()
        .readFrom([pool.paramUtxo.utxo]) // for the script
        .payToContract(
          user.contract.address,
          { inline: Data.to(datum) },
          newBalance.toLucid(),
        );

      assert(diracUtxo.utxo, `diracUtxo.utxo is undefined`);
      tx.txBuilder.add_input( // TODO see if this works
        Lucid.utxoToCore(diracUtxo.utxo),
        undefined, // TODO see if that's required
      );

      return new Flip(tx);
    } catch (e) {
      if (showErrors) console.log(`FlipPool: ${e}`);
      return undefined;
    }
  }
}

class Jump implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(user: User, pool: Pool): Jump | undefined {
    return undefined;
  }
}

class Open implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(user: User): Open {
    return new Open(Pool.generateForUser(user).openingTx(user));
  }
}
class Close implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(user: User, pool: Pool): Close | undefined {
    return undefined;
  }
}

class Admin implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(user: User, pool: Pool): Admin | undefined {
    return undefined;
  }
}

class FlipDirac implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(
    user: User,
    diracUtxo: DiracUtxo,
    sharedAssets: Assets,
    onSale: Assets,
  ): FlipDirac | undefined {
    try {
      const soldAsset = sharedAssets.randomChoice();
      const available = diracUtxo.availableAssets(); // TODO make sure availableAssets() clones

      const dirac = diracUtxo.dirac;
      const soldPrice = dirac.prices.amountOf(soldAsset);
      const maxSoldA0 = dirac.activeAmnts.amountOf(soldAsset) * soldPrice;

      const boughtAsset = dirac.activeAmnts.assets().randomChoice();
      const boughtPrice = dirac.prices.amountOf(boughtAsset);
      const maxBoughtA0 = dirac.activeAmnts.amountOf(boughtAsset) * boughtPrice;

      const otherAssets = diracUtxo.nonZeroAssets;
      otherAssets.remove(boughtAsset);

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
      const tx = user.lucid.newTx()
        .readFrom([pool.paramUtxo.utxo]) // for the script
        .payToContract(
          user.contract.address,
          { inline: Data.to(datum) },
          newBalance.toLucid(),
        );

      assert(diracUtxo.utxo, `diracUtxo.utxo is undefined`);
      tx.txBuilder.add_input( // TODO see if this works
        Lucid.utxoToCore(diracUtxo.utxo),
        undefined, // TODO see if that's required
      );

      return new Flip(tx);
    } catch (e) {
      if (showErrors) console.log(`FlipPool: ${e}`);
      return undefined;
    }
  }
}

class SwapDirac implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(
    user: User,
    pool: Pool,
    options = [FlipDirac, JumpDirac],
  ): SwapDirac | undefined {
    assert(user.balance, `user.balance is undefined`);
    const sharedAssets_ = diracUtxo.sharedAssets(sharedAssets);
    assert(!sharedAssets.empty(), `FlipDirac: no shared assets`);

    if (options.length === 0) return undefined;
    if (!pool.openForBusiness) return undefined;
    const [choice, i] = randomIndexedChoice(options);
    const a = choice.generateMaybe(user, pool);
    if (a) return new SwapDirac(a.tx);
    return SwapDirac.generateMaybe(
      user,
      pool,
      options.slice(0, i).concat(options.slice(i + 1)),
    );
  }
}

class SwapPool implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(
    user: User,
    pool: Pool,
    options = [Flip, Jump, Close, Admin],
  ): SwapPool | undefined {
    if (options.length === 0) return undefined;
    if (!pool.openForBusiness) return undefined;
    const [choice, i] = randomIndexedChoice(options);
    const a = choice.generateMaybe(user, pool);
    if (a) return new SwapPool(a.tx);
    return SwapPool.generateMaybe(
      user,
      pool,
      options.slice(0, i).concat(options.slice(i + 1)),
    );
  }
}

class SwapAny implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(
    user: User,
    pools: Pool[],
  ): SwapPool | undefined {
    if (pools.length === 0) return undefined;
    const [pool, i] = randomIndexedChoice(pools);
    const a = SwapPool.generateMaybe(user, pool);
    if (a) return new SwapAny(a.tx);
    return SwapAny.generateMaybe(
      user,
      pools.slice(0, i).concat(pools.slice(i + 1)),
    );
  }
}

export class Action implements Actionable {
  private constructor(
    public readonly tx: Lucid.Tx,
  ) {}

  static generateMaybe(
    user: User,
    pools: Pool[],
    options = [SwapAny, Open],
  ): Action | undefined {
    if (options.length === 0) return undefined;
    const [choice, i] = randomIndexedChoice(options);
    const a = choice.generateMaybe(user, pools);
    if (a) return new Action(a.tx);
    return Action.generateMaybe(
      user,
      pools,
      options.slice(0, i).concat(options.slice(i + 1)),
    );
  }
}
