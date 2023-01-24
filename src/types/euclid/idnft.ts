import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  genNonNegative,
  genPositive,
  PKeyHash,
  randomChoice,
} from "../../mod.ts";
import { f, Hash, PConstraint, PHash, PObject, PRecord } from "../mod.ts";
import { Asset, Currency, PCurrency, Token } from "../general/derived/asset.ts";
import { Assets as LucidAssets } from "https://deno.land/x/lucid@0.8.6/mod.ts";

// NOTE biggest difference to regular Asset is that tokenName is not decoded/encoded
// when parsing to/from lucid, as this is not symmetric unless starting with text-strings
// (here we start with hashes, aka hex-strings).
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

  public toLucid = (): string => {
    if (this.currency.symbol.length === 0) return "lovelace";
    else return `${this.currency.toLucid()}${this.token.toLucid()}`;
  };

  public toLucidNFT = (): LucidAssets => {
    return { [this.toLucid()]: 1n };
  };

  static fromLucid(hexAsset: string): IdNFT {
    try {
      if (hexAsset === "lovelace") throw new Error("lovelace is not an id-NFT");
      else {return new IdNFT(
          Currency.fromLucid(hexAsset.slice(0, Number(Currency.numBytes * 2n))),
          Hash.fromLucid(hexAsset.slice(Number(Currency.numBytes * 2n))),
        );}
    } catch (e) {
      throw new Error(`IdNFT.fromLucid ${hexAsset}:\n${e}`);
    }
  }

  static fromAsset(asset: Asset): IdNFT {
    try {
      return new IdNFT(asset.currency, Hash.fromString(asset.token.name));
    } catch (e) {
      throw new Error(`IdNFT.fromAsset ${asset.show()}:\n${e}`);
    }
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
