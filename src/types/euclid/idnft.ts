import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  fromHex,
  fromText,
  sha256,
  toHex,
  toText,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  genNonNegative,
  genPositive,
  Param,
  PKeyHash,
  Token,
} from "../../mod.ts";
import { Asset, Currency, f, KeyHash, PAsset, PConstraint } from "../mod.ts";

// export const maxTicks = 5n; // per dimension
// TODO prod: derive this from observed number of diracs in pool
// export const gMaxHashes = 1n + maxTicks ** gMaxLength;

export const gMaxGenerationHashes = 128n;
export const gMaxAssertionHashes = 2n * gMaxGenerationHashes;
export const placeholderCcy = Currency.fromHex("cc");

export class IdNFT {
  public readonly asset: Asset;
  protected constructor(
    public readonly contractCurrency: Currency,
    public readonly tokenName: Uint8Array,
  ) {
    this.asset = new Asset(this.contractCurrency, Token.toHex(tokenName));
  }

  public next = (skip = 0): IdNFT => {
    return new IdNFT(
      this.contractCurrency,
      hashNTimes(this.tokenName, 1n + BigInt(skip)),
    );
  };

  public show = (): string => {
    return `IdNFT(${this.asset.show()})`;
  };
}

export const nextHash = sha256;

export function hashNTimes(
  paymentKeyHash: KeyHash,
  n: bigint,
): Uint8Array {
  let hash = paymentKeyHash;
  for (let i = 0n; i < n; i++) {
    hash = sha256(hash);
  }
  return hash;
}

export class ParamNFT extends IdNFT {
  constructor(
    contractCurrency: Currency,
    tokenName: KeyHash,
  ) {
    super(contractCurrency, tokenName);
  }

  static generateWith = (
    contractCurrency: Currency,
    owner?: KeyHash,
  ): ParamNFT => {
    const tokenName = owner
      ? hashNTimes(owner, genNonNegative(gMaxGenerationHashes))
      : PKeyHash.ptype.genData();
    return new ParamNFT(contractCurrency, tokenName);
  };
}

export class ThreadNFT extends IdNFT {
  static generateWith = (paramNFT: ParamNFT): IdNFT => {
    const tokenName = hashNTimes(
      paramNFT.tokenName,
      genPositive(gMaxGenerationHashes),
    );
    return new ThreadNFT(paramNFT.contractCurrency, tokenName);
  };
}

export class PIdNFT extends PConstraint<PAsset> {
  protected constructor(
    public readonly contractCurrency: Currency,
    public readonly firstHash?: Uint8Array,
  ) {
    super(
      PAsset.ptype,
      [PIdNFT.assertAsset(contractCurrency, firstHash)],
      PIdNFT.generateAsset(contractCurrency, firstHash),
    );
    this.population = PAsset.ptype.population;
  }

  public showData = (data: Asset): string => {
    return `IdNFT ${data.show()}`;
  };

  public showPType = (): string => {
    return `PObject: PIdNFT(${this.contractCurrency}, ${this.firstHash})`;
  };

  static unparsed(contractCurrency: Currency): PIdNFT {
    return new PIdNFT(contractCurrency);
  }

  static assertAsset = (
    contractCurrency: Currency,
    firstHash?: Uint8Array,
  ) =>
  (asset: Asset): void => {
    assert(
      toHex(asset.currency.symbol) === toHex(contractCurrency.symbol),
      `currencySymbol: ${asset.currency} of ${asset.show()} is not contractCurrency: ${contractCurrency}`,
    );

    if (firstHash) {
      let hash = firstHash;
      const log = [hash];
      try {
        fromHex(asset.token.name);
      } catch (_e) {
        throw new Error(`ID-Asset tokenName is not hex: ${asset.show()}`);
      }

      for (let i = 0n; i <= gMaxAssertionHashes!; i++) {
        if (asset.token.name === toHex(hash)) {
          return;
        }
        hash = nextHash(hash);
        log.push(hash);
      }
      throw new Error(
        `ID-Asset verification failure for\n${asset.show()}\nwithin ${gMaxAssertionHashes} hashes, :\n${f}${
          log.join(`\n${f}`)
        };\nfirstHash: ${firstHash}`,
      );
    }
  };

  static generateAsset = (
    contractCurrency: Currency,
    firstHash?: Uint8Array,
  ) =>
  (): Asset => {
    return ParamNFT.generateWith( // bit of an abuse here
      contractCurrency,
      firstHash,
    ).asset;
  };
}

export class PParamNFT extends PIdNFT {
  constructor(
    public contractCurrency: Currency,
    public owner: KeyHash,
  ) {
    super(contractCurrency, owner);
  }

  static genPType(): PConstraint<PAsset> {
    return new PParamNFT(
      placeholderCcy,
      PKeyHash.ptype.genData(),
    );
  }
}

export class PThreadNFT extends PIdNFT {
  constructor(
    public contractCurrency: Currency,
    public paramNFTtkn: Uint8Array,
  ) {
    super(contractCurrency, nextHash(paramNFTtkn));
  }

  static genPType(): PConstraint<PAsset> {
    const param = Param.generate();
    const paramNFTtkn = hashNTimes(
      param.owner,
      genPositive(gMaxGenerationHashes),
    );
    return new PThreadNFT(
      placeholderCcy,
      paramNFTtkn,
    );
  }
}
