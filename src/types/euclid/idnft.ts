import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import {
  fromHex,
  PaymentKeyHash,
  sha256,
  toHex,
} from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  genNonNegative,
  genPositive,
  maxInteger,
  Param,
  PPaymentKeyHash,
  randomChoice,
  TokenName,
} from "../../mod.ts";
import { Asset, CurrencySymbol, f, PAsset, PConstraint } from "../mod.ts";

// export const maxTicks = 5n; // per dimension
// TODO prod: derive this from observed number of diracs in pool
// export const gMaxHashes = 1n + maxTicks ** gMaxLength;

export const gMaxHashes = 128n;
export const placeholderCcy = "cc";

export class IdNFT {
  public readonly asset: Asset;
  protected constructor(
    public readonly contractCurrency: CurrencySymbol,
    public readonly tokenName: TokenName,
  ) {
    this.asset = new Asset(this.contractCurrency, tokenName);
    try {
      fromHex(this.contractCurrency);
    } catch (e) {
      throw new Error(
        `Invalid contractCurrency: ${this.contractCurrency}\n${e}`,
      );
    }
    try {
      fromHex(this.tokenName);
    } catch (e) {
      throw new Error(`Invalid tokenName: ${this.tokenName}\n${e}`);
    }
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

export function nextHash(hash: string): string {
  return toHex(sha256(fromHex(hash)));
}

export function hashNTimes(hash: string, n: bigint): string {
  for (let i = 0n; i < n; i++) {
    hash = nextHash(hash);
  }
  return hash;
}

export class ParamNFT extends IdNFT {
  constructor(
    contractCurrency: CurrencySymbol,
    tokenName: PaymentKeyHash,
  ) {
    super(contractCurrency, tokenName);
  }

  static generateWith = (
    contractCurrency: CurrencySymbol,
    owner?: PaymentKeyHash,
    maxParamHashes?: bigint,
  ): ParamNFT => {
    const tokenName = owner
      ? hashNTimes(owner, genNonNegative(maxParamHashes))
      : "";
    return new ParamNFT(contractCurrency, tokenName);
  };
}

export class ThreadNFT extends IdNFT {
  static generateWith = (paramNFT: ParamNFT, maxDiracs: bigint): IdNFT => {
    const tokenName = hashNTimes(paramNFT.tokenName, genPositive(maxDiracs));
    return new ThreadNFT(paramNFT.contractCurrency, tokenName);
  };
}

export class PIdNFT extends PConstraint<PAsset> {
  protected constructor(
    public readonly contractCurrency: CurrencySymbol,
    public readonly firstHash?: string,
    public readonly maxHashes?: bigint,
  ) {
    super(
      PAsset.ptype,
      [PIdNFT.assertAsset(contractCurrency, firstHash, maxHashes)],
      PIdNFT.generateAsset(contractCurrency, firstHash, maxHashes),
    );
    this.population = maxHashes
      ? Number(maxHashes + 1n)
      : PAsset.ptype.population;
  }

  public showData = (data: Asset): string => {
    return `IdNFT ${data.show()}`;
  };

  public showPType = (): string => {
    return `PObject: PIdNFT(${this.contractCurrency}, ${this.firstHash}, ${this.maxHashes})`;
  };

  static unparsed(contractCurrency: CurrencySymbol): PIdNFT {
    return new PIdNFT(contractCurrency);
  }

  static assertAsset = (
    contractCurrency: CurrencySymbol,
    firstHash?: string,
    maxHashes?: bigint,
  ) =>
  (asset: Asset): void => {
    assert(
      asset.currencySymbol === contractCurrency,
      `currencySymbol: ${asset.currencySymbol} of ${asset.show()} is not contractCurrency: ${contractCurrency}`,
    );

    if (firstHash) {
      let hash = firstHash;
      // const log = [hash];
      for (let i = 0n; i <= maxHashes!; i++) {
        if (asset.tokenName === hash) {
          return;
        }
        hash = nextHash(hash);
        // log.push(hash);
      }
      throw new Error(
        `ID-Asset verification failure for\n${asset.show()}\nwithin ${maxHashes} hashes`, //:\n${f}${
        //   log.join(`\n${f}`)
        // }`,
      );
    }
  };

  static generateAsset = (
    contractCurrency: CurrencySymbol,
    firstHash?: string,
    maxHashes?: bigint,
  ) =>
  (): Asset => {
    return ParamNFT.generateWith( // bit of an abuse here
      contractCurrency,
      firstHash,
      maxHashes,
    ).asset;
  };
}

export class PParamNFT extends PIdNFT {
  constructor(
    public contractCurrency: CurrencySymbol,
    public owner: PaymentKeyHash,
    public maxHashes: bigint,
  ) {
    super(contractCurrency, owner, maxHashes);
  }

  static genPType(): PConstraint<PAsset> {
    return new PParamNFT(
      placeholderCcy,
      PPaymentKeyHash.genData(),
      gMaxHashes,
    );
  }
}

export class PThreadNFT extends PIdNFT {
  constructor(
    public contractCurrency: CurrencySymbol,
    public paramNFTtkn: TokenName,
    public maxHashes: bigint,
  ) {
    super(contractCurrency, nextHash(paramNFTtkn), maxHashes);
  }

  static genPType(): PConstraint<PAsset> {
    const param = Param.generate();
    const paramNFTtkn = hashNTimes(
      param.owner,
      1n + genNonNegative(gMaxHashes),
    );
    return new PThreadNFT(
      placeholderCcy,
      paramNFTtkn,
      param.boundedMinDiracs(),
    );
  }
}
