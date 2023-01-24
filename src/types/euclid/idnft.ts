import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genPositive,
  PKeyHash,
  randomChoice,
  Token,
} from "../../mod.ts";
import { Asset, f, Hash, PAsset, PConstraint } from "../mod.ts";
import { Currency } from "../general/derived/asset.ts";

export class PIdNFT extends PConstraint<PAsset> {
  private constructor(
    public readonly paramNFT: Asset,
    public readonly numDiracs?: bigint,
  ) {
    assert(
      numDiracs === undefined || numDiracs > 0n,
      "PIdNFT.numDiracs must be undefined (paramNFT) or positive (diracNFT)",
    );
    super(
      PAsset.ptype,
      [
        numDiracs
          ? PIdNFT.assertThreadNFT(paramNFT, numDiracs)
          : PIdNFT.assertParamNFT(paramNFT),
      ],
      numDiracs
        ? PIdNFT.generateThreadNFT(paramNFT, numDiracs)
        : () => paramNFT,
    );
    this.population = Number(numDiracs ?? 1n);
  }

  public showData = (data: Asset): string => {
    return `IdNFT ${data.show()}`;
  };

  public showPType = (): string => {
    return `PObject: PIdNFT(${this.paramNFT.show()}, ${this.numDiracs})`;
  };

  static pparamNFT(
    paramNFT: Asset,
  ): PIdNFT {
    return new PIdNFT(
      paramNFT,
    );
  }

  static pthreadNFT(
    paramNFT: Asset,
    numDiracs: bigint,
  ): PIdNFT {
    assert(numDiracs > 0n, "pthreadNFT.numDiracs must be positive");
    return new PIdNFT(
      paramNFT,
      numDiracs,
    );
  }

  static next(idNFT: Asset): Asset {
    return new Asset(idNFT.currency, idNFT.token.next());
  }

  private static assertAsset = (
    contractCurrency: Currency,
    firstHash: Hash,
    maxHashes: bigint,
  ) =>
  (asset: Asset): void => {
    assert(
      asset.currency.show() === contractCurrency.show(),
      `currency of ${asset.show()} does not fit ${contractCurrency.show()}`,
    );

    let hash = firstHash;
    let hashString = hash.toString();
    const log = [hashString];
    for (let i = 0n; i <= maxHashes; i++) {
      if (asset.token.name === hashString) {
        return;
      }
      hash = hash.hash();
      hashString = hash.toString();
      log.push(hashString);
    }
    throw new Error(
      `ID-Asset verification failure for
      ${asset.show()}
      within ${maxHashes} hashes:\n${f}${log.join(`\n${f}`)}`,
    );
  };

  static assertParamNFT = (
    paramNFT: Asset,
  ) => this.assertAsset(paramNFT.currency, paramNFT.token.toHash(), 0n);

  static assertThreadNFT = (
    paramNFT: Asset,
    numDiracs: bigint,
  ) => this.assertAsset(paramNFT.currency, paramNFT.token.hash(), numDiracs);

  private static generateThreadNFT = (
    paramNFT: Asset,
    maxHashes: bigint,
  ) =>
  (): Asset => {
    return new Asset(
      paramNFT.currency,
      Token.fromHash(paramNFT.token.hash(genPositive(maxHashes))),
    );
  };

  static genPType = (): PConstraint<PAsset> => {
    const paramNFT = new Asset(
      Currency.dummy,
      Token.fromHash(PKeyHash.ptype.genData().hash().hash(genNonNegative())),
    );
    return randomChoice([
      () => PIdNFT.pparamNFT(paramNFT),
      () => PIdNFT.pthreadNFT(paramNFT, genPositive()),
    ])();
  };
}
