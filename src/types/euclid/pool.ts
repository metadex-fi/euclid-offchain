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
  ) {}

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

  static assertForUser = (user: User) => (pool: Pool): void => {
    // TODO
  };

  static generateForUser = (user: User) => (): Pool => {
    const nfts = new Assets();
    const [param, deposit] = Param.generateForUser(user);
    const assets = deposit.assets();
    // generate number of ticks per asset, such that
    // (numTicks * jumpSizes).mul <= deposit.lowest
    // and numTicks <= jumpSizes
    let tickBudget = deposit.lowest() / param.minDiracs();
    const numTicks = new Value();
    assets.forEach((asset) => {
      const ticks = genPositive(
        min(tickBudget, param.jumpSizes.amountOf(asset)),
      );
      tickBudget /= ticks;
      numTicks.initAmountOf(asset, ticks);
    });

    // jump the lowerBounds a random number of jumpSizes,
    // but within upper bounds, to prepare getting the lowest dirac prices
    const zeroes = param.initialPrices.zeroed();
    let numJumps = generateWithin(zeroes, param.maxJumps());
    let lowestPrices = addValues(
      param.filledLowerBounds().unsigned(),
      mulValues(param.jumpSizes.unsigned(), numJumps),
    );

    // jump the result a random number of ticks to get the lowest dirac prices
    const tickSizes = divValues(param.jumpSizes.unsigned(), numTicks);
    numJumps = generateWithin(zeroes, numTicks);
    lowestPrices = addValues(
      lowestPrices,
      mulValues(tickSizes, numJumps),
    );

    // generator function for a single dirac based on its' prices
    const paramNFT = user.nextParamNFT;
    function generateDirac(prices: Prices): Dirac {
      nfts.add(threadNFT.asset);
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

    user.nextParamNFT = threadNFT.next();
    return new Pool(paramNFT.asset, param, diracs, nfts);
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
