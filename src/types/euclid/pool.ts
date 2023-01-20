import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { genPositive, maxInteger, min, User } from "../../mod.ts";
import {
  addValues,
  Amounts,
  Asset,
  Assets,
  Dirac,
  divValues,
  f,
  generateWithin,
  mulValues,
  PAmounts,
  Param,
  PAssets,
  PConstraint,
  PDirac,
  PList,
  PObject,
  POwner,
  PParam,
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
    public readonly param: Param,
    public readonly diracs: Dirac[],
    public readonly nfts: Assets,
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
${ttf}param: ${this.param.concise(ttf)},
${ttf}diracs: [${mn}${
      this.diracs.map((dirac) => `${ttff}${dirac.show(ttff)}\n`).join(",")
    }]
${ttf}nfts: ${this.nfts.show(ttf)},
${tt})`;
  };

  static assert(pool: Pool): void {
    const owner = pool.param.owner;
    const nfts = pool.nfts.clone();
    nfts.remove(pool.paramNFT);
    pool.diracs.forEach((dirac) => {
      assert(dirac.owner === owner, `Wrong owner: ${dirac.owner} vs ${owner}`);
      assert(
        dirac.paramNFT.show() === pool.paramNFT.show(),
        `Wrong paramNFT: ${dirac.paramNFT.show()} vs ${pool.paramNFT.show()}`,
      );
      nfts.remove(dirac.threadNFT);
    });
    assert(nfts.size() === 0, `leftover nfts: ${nfts.show()}`);
    // TODO more here
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
    let numJumps = generateWithin(zeroes, param.maxJumps().flatDecrement());
    let lowestPrices = addValues(
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
    const pool = new Pool(paramNFT.asset, param, diracs, nfts);
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
          "nfts": PAssets.ptype,
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
