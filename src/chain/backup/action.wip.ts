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
  Pool,
  randomIndexedChoice,
} from "../mod.ts";
import { Euclid } from "./euclid.ts";
import { User } from "./user.ts";

const showErrors = true;

// TODO later: consequences for Euclid as well, in case of multiple txes chained
export function tryToAct(
  tx: Lucid.Tx,
  user: User,
  state: Euclid,
): Lucid.Tx | undefined {
  return new Permutation([tryOpenAny, tryAdminAny, trySwapAny])
    .try((f) => f(tx, user, state));
}

// Any

function tryOpenAny(tx: Lucid.Tx, user: User): Lucid.Tx | undefined {
  try {
    return Pool.generateForUser(user).openingTx(tx, user);
  } catch (e) {
    if (showErrors) console.log(`Open: ${e}`);
    return undefined;
  }
}

function tryAdminAny(
  tx: Lucid.Tx,
  user: User,
  state: Euclid,
): Lucid.Tx | undefined {
  const p = state.pools.get(user.paymentKeyHash);
  const pools = p ? [...p.values()] : [];
  return new Permutation(pools).try((pool) => tryAdminPool(tx, user, pool));
}

function trySwapAny(
  tx: Lucid.Tx,
  user: User,
  state: Euclid,
): Lucid.Tx | undefined {
  const pools = ([...state.pools.values()].map((p) => [...p.values()])).flat();
  return new Permutation(pools).try((pool) => trySwapPool(tx, user, pool));
}

// Pool

function tryAdminPool(
  tx: Lucid.Tx,
  user: User,
  pool: Pool,
): Lucid.Tx | undefined {
  return undefined;
}

function trySwapPool(
  tx: Lucid.Tx,
  user: User,
  pool: Pool,
): Lucid.Tx | undefined {
  assert(pool.paramUtxo.utxo, `pool.paramUtxo.utxo is undefined`);
  assert(user.balance, `user.balance is undefined`);
  const sharedAssets = pool.sharedAssets(user.balance.assets());
  if (sharedAssets.empty) return undefined;
  const tx_ = new Permutation(pool.diracUtxos).try((utxo) =>
    trySwapDirac(tx, user, utxo, sharedAssets)
  );
  return tx_
    ? tx_.readFrom([pool.paramUtxo.utxo]) // for the script TODO add this to consequences, in case we interact with the pool multiple times
    : undefined;
}

// Dirac

function trySwapDirac(
  tx: Lucid.Tx,
  user: User,
  diracUtxo: DiracUtxo,
  sharedAssets: Assets,
): Lucid.Tx | undefined {
  assert(diracUtxo.balance, `diracUtxo.balance is undefined`);
  assert(diracUtxo.utxo, `diracUtxo.utxo is undefined`);
  const sharedAssets_ = diracUtxo.sharedAssets(sharedAssets);
  if (sharedAssets_.empty) return undefined;
  return new Permutation([tryFlipDirac, tryJumpDirac]).try((f) =>
    f(tx, user, diracUtxo, sharedAssets_)
  );
}

// Swaps

function tryFlipDirac(
  tx: Lucid.Tx,
  user: User,
  diracUtxo: DiracUtxo,
  sharedAssets: Assets,
): Lucid.Tx | undefined {
  const soldAsset = sharedAssets.randomChoice();
  const forSale = diracUtxo.assets().drop(soldAsset);
  if (forSale.empty) return undefined;
  const dirac = diracUtxo.dirac;
  const boughtAsset = forSale.randomChoice();

  const soldPrice = dirac.prices.amountOf(soldAsset);
  const boughtPrice = dirac.prices.amountOf(boughtAsset);

  const maxSoldA0 = dirac.activeAmnts.amountOf(soldAsset) * soldPrice;
  const maxBoughtA0 = dirac.activeAmnts.amountOf(boughtAsset) * boughtPrice;

  const flippedA0 = genPositive(min(maxBoughtA0, maxSoldA0));
  const soldAmount = flippedA0 / soldPrice;
  const boughtAmount = (soldAmount * soldPrice) / boughtPrice;

  const newAmounts = dirac.activeAmnts.clone;
  newAmounts.increaseAmountOf(boughtAsset, boughtAmount);
  newAmounts.increaseAmountOf(soldAsset, -soldAmount);

  const newBalance = diracUtxo.balance!.clone;
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

  const tx_ = tx
    .payToContract(
      user.contract.address,
      { inline: Data.to(datum) },
      newBalance.toLucid(),
    );
  tx_.txBuilder.add_input( // TODO see if this works
    Lucid.utxoToCore(diracUtxo.utxo!),
    undefined, // TODO see if that's required
  );
  return tx_;
}

function tryJumpDirac(
  tx: Lucid.Tx,
  user: User,
  diracUtxo: DiracUtxo,
  sharedAssets: Assets,
): Lucid.Tx | undefined {
  return undefined;
}

// Utils

class Permutation<T> {
  constructor(
    private base: Array<T>,
  ) {}

  public get done(): boolean {
    return this.base.length === 0;
  }

  public get next(): T | undefined {
    if (!this.done) return undefined;
    const [choice, i] = randomIndexedChoice(this.base);
    this.base = this.base.slice(0, i).concat(this.base.slice(i + 1));
    return choice;
  }

  public try = <T0>(f: (arg: T) => T0 | undefined): T0 | undefined => {
    if (this.done) return undefined;
    return f(this.next!) ?? this.try(f);
  };
}
