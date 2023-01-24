import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genPositive,
  PKeyHash,
  randomChoice,
} from "../../mod.ts";
import { f, Hash, PConstraint, PHash, PObject, PRecord } from "../mod.ts";
import { Asset, Currency, PCurrency, Token } from "../general/derived/asset.ts";

export class IdNFT {
  constructor(
    public readonly currency: Currency,
    public readonly token: Hash,
  ) {}

  public show = (): string => {
    return `IdNFT (${this.currency.show()}, ${this.token.show()})`;
  };

  public next = (): IdNFT => {
    return new IdNFT(this.currency, this.token.hash());
  };

  public asset = (): Asset => {
    return new Asset(this.currency, Token.fromHash(this.token));
  };

  static from(asset: Asset): IdNFT {
    return new IdNFT(asset.currency, Hash.from(asset.token.name));
  }
}

// this is supposed to hace the same onchain-representation as PAsset
export class PIdNFT extends PConstraint<PObject<IdNFT>> {
  private constructor(
    public readonly paramNFT: IdNFT,
    public readonly numDiracs?: bigint,
  ) {
    assert(
      numDiracs === undefined || numDiracs > 0n,
      "PIdNFT.numDiracs must be undefined (paramNFT) or positive (diracNFT)",
    );
    super(
      new PObject(
        new PRecord({
          currency: PCurrency.ptype,
          token: PHash.ptype,
        }),
        IdNFT,
      ),
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

  public showData = (data: IdNFT): string => {
    return `IdNFT ${data.show()}`;
  };

  public showPType = (): string => {
    return `PObject: PIdNFT(${this.paramNFT.show()}, ${this.numDiracs})`;
  };

  static pparamNFT(
    paramNFT: IdNFT,
  ): PIdNFT {
    return new PIdNFT(
      paramNFT,
    );
  }

  static pthreadNFT(
    paramNFT: IdNFT,
    numDiracs: bigint,
  ): PIdNFT {
    assert(numDiracs > 0n, "pthreadNFT.numDiracs must be positive");
    return new PIdNFT(
      paramNFT,
      numDiracs,
    );
  }

  private static assertIdNFT = (
    paramNFT: IdNFT,
    maxHashes: bigint,
  ) =>
  (nft: IdNFT): void => {
    assert(
      nft.currency.show() === paramNFT.currency.show(),
      `currency of ${nft.show()} does not fit ${paramNFT.currency.show()}`,
    );

    let hash = paramNFT.token;
    let hashString = hash.toString();
    const log = [hashString];
    for (let i = 0n; i <= maxHashes; i++) {
      if (nft.token.toString() === hashString) {
        return;
      }
      hash = hash.hash();
      hashString = hash.toString();
      log.push(hashString);
    }
    throw new Error(
      `ID-Asset verification failure for
      ${nft.show()}
      within ${maxHashes} hashes:\n${f}${log.join(`\n${f}`)}`,
    );
  };

  static assertParamNFT = (
    paramNFT: IdNFT,
  ) => this.assertIdNFT(paramNFT, 0n);

  static assertThreadNFT = (
    paramNFT: IdNFT,
    numDiracs: bigint,
  ) => this.assertIdNFT(paramNFT, numDiracs);

  private static generateThreadNFT = (
    paramNFT: IdNFT,
    maxHashes: bigint,
  ) =>
  (): IdNFT => {
    return new IdNFT(
      paramNFT.currency,
      paramNFT.token.hash(genPositive(maxHashes)),
    );
  };

  static genPType = (): PConstraint<PObject<IdNFT>> => {
    const paramNFT = new IdNFT(
      Currency.dummy,
      PKeyHash.ptype.genData().hash().hash(genNonNegative()),
    );
    return randomChoice([
      () => PIdNFT.pparamNFT(paramNFT),
      () => PIdNFT.pthreadNFT(paramNFT, genPositive()),
    ])();
  };

  static pdummy = PIdNFT.pparamNFT(new IdNFT(Currency.dummy, Hash.dummy));
}
