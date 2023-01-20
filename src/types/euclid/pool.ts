import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Tx,Data } from "https://deno.land/x/lucid@0.8.6/mod.ts";
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

  public openingTx = (user: User): Tx => {
    const paramDatum = PParamDatum.ptype.pconstant(new ParamDatum(this.param));
    const lucidNFTs = this.threadNFTs.add(this.paramNFT).toLucidWith(1n);

    let tx = user.lucid.newTx()
      .mintAssets(lucidNFTs)
      .attachMintingPolicy(user.contract.mintingPolicy)
      .payToContract(
        user.contract.address,
        {
          inline: Data.to(paramDatum),
          scriptRef: user.contract.validator, // for now, for simplicities' sake
        },
        this.paramNFT.toLucidWith(1n),
      );

    const threadNFTs = this.threadNFTs.toList()
    this.diracs.forEach((dirac, index) => {
      tx = tx.payToContract(
        user.contract.address,
        {
          inline: Data.to(new DiracDatum(dirac)),
        },
        threadNFTs[index].toLucidWith(1n),
        // TODO funds
      );
    })

    return tx;
  }

  static assert(pool: Pool): void {
    const owner = pool.param.owner;
    const threadNFTs = pool.threadNFTs.clone();
    const assertThreadNFT = PThreadNFT.assertAsset(
      pool.paramNFT.currencySymbol,
      pool.paramNFT.tokenName,
      BigInt(pool.diracs.length),
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
    const pool_ = user.pools.get(pool.paramNFT.show());
    assert(
      pool_,
      `Pool ${pool.paramNFT.show()} not found for user: ${user.showPools()}`,
    );
    assert(
      pool.show() === pool_.show(),
      `Pools don't match: ${pool.show()} vs ${pool_.show()}`,
    );
    // TODO consider more here
  };

  static generateForUser = (user: User) => (): Pool => {
    const nfts = new Assets();
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
    let tickBudget = deposit.lowest() / param.minDiracs();
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
    nfts.insert(paramNFT.asset);
    function generateDirac(prices: Prices): Dirac {
      nfts.insert(threadNFT.asset);
      return new Dirac(
        param.owner,
        threadNFT.asset,
        paramNFT.asset,
        prices,
        Amounts.fresh(), // TODO this is wrong
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
      diracs.length + 1 === nfts.size(),
      `Wrong number of diracs: ${diracs.length} vs ${nfts.size()} - 1`,
    );
    const pool = new Pool(paramNFT.asset, nfts, param, diracs);
    user.nextParamNFT = threadNFT.next();
    user.addPool(pool);
    return pool;
  };
}

export class PPool extends PConstraint<PObject<Pool>> {
  private constructor(
    public readonly user: User,
  ) {
    const pparamNFT = new PParamNFT(
      user.contract.policyId,
      user.address,
      maxInteger,
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
                "owner": POwner.pliteral(user.address),
                "threadNFT": new PThreadNFT(
                  user.contract.policyId,
                  user.address,
                  maxInteger,
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
      Pool.generateForUser(user),
    );
  }

  static genPType(): PConstraint<PObject<Pool>> {
    return new PPool(User.generateDummy());
  }
}
