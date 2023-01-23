import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { fromText, toHex } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  genNonNegative,
  genPositive,
  gMaxLength,
  PKeyHash,
  randomChoice,
  Token,
} from "../../mod.ts";
import {
  Asset,
  Currency,
  f,
  Hash,
  KeyHash,
  PAsset,
  PConstraint,
} from "../mod.ts";

export const gMaxHashesPerPool = 128n;
export const placeholderCcy = Currency.fromHex("cc");

export class PIdNFT extends PConstraint<PAsset> {
  private constructor(
    public readonly paramNFT: Asset,
    public readonly numDiracs?: bigint,
  ) {
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
    this.population = Number(gMaxHashesPerPool + 1n);
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
      placeholderCcy,
      Token.fromHash(PKeyHash.ptype.genData().hash().hash(genNonNegative())),
    );
    return randomChoice([
      () => PIdNFT.pparamNFT(paramNFT),
      () => PIdNFT.pthreadNFT(paramNFT, genNonNegative()),
    ])();
  };
}
