import {
  ActiveAssets,
  Amounts,
  Dirac,
  DiracDatum,
  IdNFT,
  PActiveAssets,
  PAmounts,
  Param,
  PConstraint,
  PDiracDatum,
  PIdNFT,
  PList,
  PObject,
  POwner,
  PParam,
  PPositive,
  PPrices,
  PRecord,
  Prices,
} from "../mod.ts";

export class PAllDiracs extends PConstraint<PList<PObject<Dirac>>> {
  private constructor(
    public param: Param,
  ) {
    const pinner = new PList(
      new PObject(
        new PRecord({
          "owner": POwner.pliteral(param.owner),
          "threadNFT": PIdNFT.newPThreadNFT(param.owner),
          "paramNFT": PIdNFT.newPParamNFT(param.owner),
          "initialPrices": PPrices.initial(param),
          "currentPrices": PPrices.initial(param),
          "activeAmnts": PAmounts.ptype,
          "jumpStorage": new PActiveAssets(param),
        }),
        Dirac,
      ),
    );
    super(
      pinner,
      [assertDiracsWith(param)], //, assertCountWith(param)],
      PAllDiracs.generateWith(param),
    );
  }

  static fromParam(param: Param): PAllDiracs {
    return new PAllDiracs(param);
  }

  static genPType(): PConstraint<PList<PObject<Dirac>>> {
    const param = PParam.genPType().genData();
    return new PAllDiracs(param);
  }

  static generateWith = (param: Param) => (): Dirac[] => {
    const initialPrices = Prices.generateInitial(param)();
    const assets = initialPrices.assets();
    const paramNFT = new IdNFT(param.owner);
    const numTicks = PTicks.genData();

    let threadNFT = paramNFT.next();
    function generate(initialPrices: Prices): Dirac {
      const currentPrices = Prices.generateCurrent(param, initialPrices)();
      return new Dirac(
        param.owner,
        threadNFT.asset(),
        paramNFT.asset(),
        initialPrices,
        currentPrices,
        Amounts.generateWith(param, currentPrices)(),
        ActiveAssets.generateWith(param, initialPrices)(),
      );
    }

    let diracs = [
      generate(initialPrices),
    ];
    // for each asset and for each existing dirac, "spread" that dirac
    // in that asset's dimension. "spread" means: add all other tick
    // offsets for that asset's price.
    for (const asset of assets.toList()) {
      const jumpSize = param.jumpSizes.amountOf(asset);
      const tickSize = jumpSize / numTicks;
      if (tickSize > 0n) {
        const minPrice = param.lowerPriceBounds.amountOf(asset);
        const maxPrice = param.upperPriceBounds.amountOf(asset);
        const basePrice = initialPrices.amountOf(asset);
        const diracs_ = new Array<Dirac>();
        let down = -1n;
        diracs.forEach((dirac) => {
          for (let i = 1n; i < numTicks; i++) {
            let tickPrice = basePrice + i * tickSize;
            if (tickPrice > maxPrice) {
              tickPrice = basePrice + down-- * tickSize;
              if (tickPrice < minPrice) break;
            }
            const initialPrices = dirac.initialPrices.clone();
            initialPrices.setAmountOf(
              asset,
              tickPrice,
            );
            threadNFT = threadNFT.next();
            diracs_.push(
              generate(initialPrices),
            );
          }
        });
        diracs = diracs.concat(diracs_);
      }
    }

    return diracs;
  };
}

const assertDiracsWith = (param: Param) => (diracs: Dirac[]) => {
  for (const dirac of diracs) {
    Dirac.assertWith(param)(dirac);
  }
};

// NOTE: This might fail if owner starts closing;
// which sounds correct for users and wrong for owner.
// NOTE: This could be a parameter for PList
const assertCountWith = (param: Param) => (diracs: Dirac[]) => {
  // assert(diracs.length === TODO);
};

export const minTicks = 1n; // per dimension
export const maxTicks = 5n; // per dimension
const PTicks = new PPositive(minTicks, maxTicks);

export class PAllDiracDatums extends PConstraint<PList<PDiracDatum>> {
  private constructor(
    public readonly param: Param,
  ) {
    super(
      new PList(PDiracDatum.fromParam(param)),
      [PAllDiracDatums.assertWith(param)],
      PAllDiracDatums.generateWith(param),
    );
  }

  static fromParam(param: Param): PAllDiracDatums {
    return new PAllDiracDatums(param);
  }

  static assertWith = (param: Param) => (diracDatums: DiracDatum[]) => {
    const diracs = diracDatums.map((diracDatum) => diracDatum._0);
    PAllDiracs.fromParam(param).asserts.forEach((assert) => {
      assert(diracs);
    });
  };

  static generateWith = (param: Param) => (): DiracDatum[] => {
    const allDiracs = PAllDiracs.generateWith(param)();
    return allDiracs.map((dirac) => new DiracDatum(dirac));
  };

  static genPType(): PConstraint<PList<PDiracDatum>> {
    const param = Param.generate();
    return new PAllDiracDatums(param);
  }
}
