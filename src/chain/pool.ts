import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Tx } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  ActiveAssets,
  addValues,
  Amounts,
  Assets,
  Currency,
  Dirac,
  divValues,
  generateWithin,
  genPositive,
  min,
  mulValues,
  Param,
  PDiracDatum,
  PIdNFT,
  PParam,
  Prices,
  User,
  Value,
} from "../mod.ts";
import { DiracUtxo, ParamUtxo, PreDiracUtxo } from "./utxos.ts";

export class PrePool {
  public paramUtxo?: ParamUtxo;
  public preDiracUtxos: PreDiracUtxo[] = [];

  public setParamUtxo = (paramUtxo: ParamUtxo): PrePool => {
    assert(!this.paramUtxo, `duplicate param ${paramUtxo}`);
    this.paramUtxo = paramUtxo;
    return this;
  };

  public addPreDiracUtxo = (preDiracUtxo: PreDiracUtxo): PrePool => {
    this.preDiracUtxos.push(preDiracUtxo);
    return this;
  };

  public parse = (contractCurrency: Currency): Pool | undefined => {
    if (!this.paramUtxo || this.preDiracUtxos.length) return undefined;

    const param = this.paramUtxo.param;
    const paramNFT = this.paramUtxo.paramNFT;
    if (paramNFT.currency.show() !== contractCurrency.show()) return undefined;

    const numDiracs = BigInt(this.preDiracUtxos.length);
    const pdiracDatum = PDiracDatum.parse(param, paramNFT, numDiracs);
    const diracUtxos = this.preDiracUtxos.map((pdu) => pdu.parse(pdiracDatum))
      .filter((du) => du) as DiracUtxo[];

    if (!diracUtxos.length) return undefined;
    return new Pool(this.paramUtxo, diracUtxos);
  };
}

export class Pool {
  private sharedAssets?: Assets;
  public flippable?: DiracUtxo[];
  public jumpable?: DiracUtxo[];
  constructor(
    public readonly paramUtxo: ParamUtxo,
    public readonly diracUtxos: DiracUtxo[],
  ) {}

  public openingTx = (user: User): Tx => {
    let tx = this.paramUtxo.openingTx(user);
    this.diracUtxos.forEach((diracUtxo) => tx = diracUtxo.openingTx(user, tx));
    return tx;
  };

  static generate = (user: User): Pool => {
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
    const paramNFT = user.nextParamNFT();
    function generateDirac(prices: Prices): Dirac {
      return new Dirac(
        param.owner,
        threadNFT,
        paramNFT,
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
    const paramUtxo = new ParamUtxo(param, paramNFT);
    const pdiracDatum = PDiracDatum.parse(
      param,
      paramNFT,
      BigInt(diracs.length),
    );
    const diracUtxos = diracs.map((dirac) => new DiracUtxo(dirac, pdiracDatum));
    const pool = new Pool(paramUtxo, diracUtxos);
    user.pendingConsequences = (u: User) => {
      u.setLastIdNFT(threadNFT);
      u.addPool(pool);
    };
    return pool;
  };

  public openForBusiness = (assets: Assets): boolean => {
    const sharedAssets = this.paramUtxo.sharedAssets(assets);
    if (sharedAssets.empty()) {
      return false;
    } else {
      this.sharedAssets = sharedAssets;
      this.flippable = this.diracUtxos.filter((diracUtxo) => {
        diracUtxo.openForFlipping(this.sharedAssets!);
      });
      this.jumpable = this.diracUtxos.filter((diracUtxo) => {
        diracUtxo.openForJumping(this.sharedAssets!);
      });
      return this.flippable.length > 0 || this.jumpable.length > 0;
    }
  };
}
