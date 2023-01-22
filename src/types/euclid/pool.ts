import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Data, fromHex, Tx } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import { genPositive, maxInteger, min, User } from "../../mod.ts";
import {
  addValues,
  Amounts,
  Asset,
  Assets,
  Dirac,
  DiracDatum,
  divValues,
  f,
  generateWithin,
  mulValues,
  PAmounts,
  Param,
  ParamDatum,
  PAssets,
  PConstraint,
  PList,
  PObject,
  POwner,
  PParam,
  PParamDatum,
  PParamNFT,
  PPrices,
  PRecord,
  Prices,
  PThreadNFT,
  t,
  Value,
} from "../mod.ts";
import { ActiveAssets, PActiveAssets } from "./activeAssets.ts";
import { PDiracDatum } from "./dirac.ts";

export class Pool {
  constructor(
    public readonly paramNFT: Asset,
    public readonly threadNFTs: Assets,
    public readonly param: Param,
    public readonly diracs: Dirac[],
  ) {
    Pool.assert(this);
  }

  public show = (tabs = ""): string => {
    const tt = tabs + t;
    const ttf = tt + f;
    const ttff = ttf + f;
    const mn = this.diracs.length > 0 ? "\n" : "";
    return `Pool(
${ttf}paramNFT: ${this.paramNFT.show()},
${ttf}threadNFTs: ${this.threadNFTs.show(ttf)},
${ttf}param: ${this.param.concise(ttf)},
${ttf}diracs: [${mn}${
      this.diracs.map((dirac) => `${ttff}${dirac.show(ttff)}\n`).join(",")
    }]
${tt})`;
  };

  public sharedAssets = (assets: Assets): Assets => {
    return this.param.initialPrices.assets().intersect(assets);
  };

  public openingTx = (user: User): Tx => {
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(this.param));
    const lucidNFTs = this.threadNFTs.add(this.paramNFT).toLucidWith(1n);

    let tx = user.lucid.newTx();
    //   .mintAssets(lucidNFTs)
    //   .attachMintingPolicy(user.contract.mintingPolicy)
    //   .payToContract(
    //     user.contract.address,
    //     {
    //       inline: Data.to(paramDatum),
    //       scriptRef: user.contract.validator, // for now, for simplicities' sake
    //     },
    //     this.paramNFT.toLucidWith(1n),
    //   );

    // const threadNFTs = this.threadNFTs.toList();
    // const pdatum = PDiracDatum.fromParam(this.param, user.contract.policyId);
    // this.diracs.forEach((dirac, index) => {
    //   const funds = dirac.activeAmnts.clone();
    //   funds.initAmountOf(threadNFTs[index], 1n);
    //   const datum = pdatum.pconstant(new DiracDatum(dirac));
    //   tx = tx.payToContract(
    //     user.contract.address,
    //     {
    //       inline: Data.to(datum),
    //     },
    //     funds.toLucid(),
    //   );
    // });

    return tx;
  };

  static assert(pool: Pool): void {
    const owner = pool.param.owner;
    const threadNFTs = pool.threadNFTs.clone();
    PParamNFT.assertAsset(pool.paramNFT.currencySymbol, owner)(pool.paramNFT);
    const assertThreadNFT = PThreadNFT.assertAsset(
      pool.paramNFT.currencySymbol,
      owner,
    );
    pool.diracs.forEach((dirac) => {
      assert(dirac.owner === owner, `Wrong owner: ${dirac.owner} vs ${owner}`);
      assert(
        dirac.paramNFT.show() === pool.paramNFT.show(),
        `Wrong paramNFT: ${dirac.paramNFT.show()} vs ${pool.paramNFT.show()}`,
      );
      threadNFTs.remove(dirac.threadNFT);
      Prices.assertCurrent(pool.param)(dirac.prices);
      // Dirac.assertWith(pool.param)(dirac); // TODO
      assertThreadNFT(dirac.threadNFT);
    });
    assert(threadNFTs.size() === 0, `leftover nfts: ${threadNFTs.show()}`);
    // TODO consider more here
  }

  static assertForUser = (user: User) => (pool: Pool): void => {
    Pool.assert(pool);
    Param.assertForUser(user)(pool.param);
    const paramNFT = pool.paramNFT.show();
    const pool_ = user.pools?.find((p) => p.paramNFT.show() === paramNFT);
    assert(
      pool_,
      `Pool ${paramNFT} not found for user: ${user.showPools()}`,
    );
    assert(
      pool.show() === pool_.show(),
      `Pools don't match: ${pool.show()} vs ${pool_.show()}`,
    );
    // TODO consider more here
  };

  static generateForUser = (user: User) => (): Pool => {
    const threadNFTs = new Assets();
    const [param, deposit] = Param.generateForUser(user);
    try {
      PParam.ptype.pconstant(param);
    } catch (e) {
      throw new Error(`Param wrong: ${e}`);
    }

    const assets = deposit.assets();
    // generate number of ticks per asset, such that
    // (numTicks * jumpSizes).mul <= deposit.lowest
    // and numTicks <= jumpSizes
    let tickBudget = deposit.smallestAmount() / param.locationsPerDirac();
    const numTicks = new Value();
    const maxTicks = 4n;
    assets.forEach((asset) => {
      const ticks = genPositive(
        min(maxTicks, min(tickBudget, param.jumpSizes.amountOf(asset))),
      );
      tickBudget /= ticks;
      numTicks.initAmountOf(asset, ticks);
    });

    // jump the lowerBounds a random number of jumpSizes,
    // but within upper bounds, to prepare getting the lowest dirac prices
    const zeroes = param.initialPrices.zeroed();
    const maxJumps = param.maxJumps();
    const numJumps = generateWithin(zeroes, maxJumps.flatDecrement());
    const lowestPrices = addValues(
      param.filledLowerBounds().unsigned(),
      mulValues(param.jumpSizes.unsigned(), numJumps),
    );

    // jump the result a random number of ticks to get the lowest dirac prices
    const tickSizes = divValues(param.jumpSizes.unsigned(), numTicks);
    // numJumps = generateWithin(zeroes, numTicks.flatDecrement());
    // lowestPrices = addValues(
    //   lowestPrices,
    //   mulValues(tickSizes, numJumps),
    // );

    // generator function for a single dirac based on its' prices
    const paramNFT = user.nextParamNFT;
    function generateDirac(prices: Prices): Dirac {
      threadNFTs.insert(threadNFT.asset);
      return new Dirac(
        param.owner,
        threadNFT.asset,
        paramNFT.asset,
        prices,
        Amounts.fresh(param, prices),
        ActiveAssets.fresh(),
      );
    }

    // generate the lowest prices dirac
    let threadNFT = paramNFT.next();
    let diracs = [
      generateDirac(Prices.fromValue(lowestPrices)),
    ];

    // for each asset and for each existing dirac, "spread" that dirac
    // in that asset's dimension. "spread" means: add all other tick
    // offsets for that asset's price.
    assets.forEach((asset) => {
      if (numJumps.amountOf(asset) === 0n) return;
      const ticks = numTicks.amountOf(asset);
      const tickSize = tickSizes.amountOf(asset);
      const diracs_ = new Array<Dirac>();
      diracs.forEach((dirac) => {
        for (let i = 1n; i < ticks; i++) {
          const prices = dirac.prices.clone();
          prices.setAmountOf(
            asset,
            prices.amountOf(asset) + i * tickSize,
          );
          threadNFT = threadNFT.next();
          diracs_.push(
            generateDirac(prices),
          );
        }
      });
      diracs = diracs.concat(diracs_);
    });
    assert(
      diracs.length === threadNFTs.size(),
      `Wrong number of diracs: ${diracs.length} vs ${threadNFTs.size()}`,
    );
    const pool = new Pool(paramNFT.asset, threadNFTs, param, diracs);
    user.pendingConsequences = (u: User) => {
      u.nextParamNFT = threadNFT.next();
      u.addPool(pool);
    };
    return pool;
  };
}

export class PPool extends PConstraint<PObject<Pool>> {
  private constructor(
    public readonly user: User,
  ) {
    const pparamNFT = new PParamNFT(
      user.contract.currency,
      user.paymentKeyHash,
    );
    super(
      new PObject(
        new PRecord({
          "paramNFT": pparamNFT,
          "threadNFTs": PAssets.ptype,
          "param": PParam.ptype,
          "diracs": new PList(
            new PObject(
              new PRecord({
                "owner": POwner.pliteral(user.paymentKeyHash),
                "threadNFT": new PThreadNFT(
                  user.contract.currency,
                  user.paymentKeyHash,
                ),
                "paramNFT": pparamNFT,
                "prices": PPrices.initial(),
                "activeAmnts": PAmounts.ptype,
                "jumpStorage": new PActiveAssets(),
              }),
              Dirac,
            ),
          ),
        }),
        Pool,
      ),
      [Pool.assertForUser(user)],
      () => {
        const pool = Pool.generateForUser(user)();
        user.dealWithConsequences();
        return pool;
      },
    );
  }

  static genPType(): PConstraint<PObject<Pool>> {
    return new PPool(User.generateDummy());
  }
}
