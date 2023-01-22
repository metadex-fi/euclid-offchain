import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { fromText, toHex } from "https://deno.land/x/lucid@0.8.6/mod.ts";
import {
  genNonNegative,
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
    public readonly numPools: bigint,
    public readonly contractCurrency: Currency,
    public readonly firstHash?: Hash, // the hash of the owner's key, or of the previous id-nft's tokenName
  ) {
    super(
      PAsset.ptype,
      [PIdNFT.assertAsset(numPools, contractCurrency, firstHash)],
      PIdNFT.generateAsset(contractCurrency, firstHash),
    );
    this.population = Number(gMaxHashesPerPool + 1n);
  }

  public showData = (data: Asset): string => {
    return `IdNFT ${data.show()}`;
  };

  public showPType = (): string => {
    return `PObject: PIdNFT(${this.contractCurrency}, ${this.firstHash})`;
  };

  static fromOwner(
    numPreviousPools: bigint,
    contractCurrency: Currency,
    owner: KeyHash,
  ): PIdNFT {
    return new PIdNFT(
      numPreviousPools + 1n,
      contractCurrency,
      owner.hash(),
    );
  }

  static fromPrevious(
    contractCurrency: Currency,
    previous: Asset,
  ): PIdNFT {
    return new PIdNFT(
      1n,
      contractCurrency,
      previous.token.hash(),
    );
  }

  static unparsed(contractCurrency: Currency): PIdNFT {
    return new PIdNFT(gMaxHashesPerPool, contractCurrency);
  }

  static assertAsset = (
    numPools: bigint,
    contractCurrency: Currency,
    firstHash?: Hash,
  ) =>
  (asset: Asset): void => {
    assert(
      toHex(asset.currency.symbol) === toHex(contractCurrency.symbol),
      `currencySymbol: ${asset.currency} of ${asset.show()} is not contractCurrency: ${contractCurrency}`,
    );

    if (firstHash) {
      const maxHashes = gMaxHashesPerPool * numPools;
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
    }
  };

  private static generateAsset = (
    contractCurrency: Currency,
    firstHash: Hash = PKeyHash.ptype.genData().hash(),
  ) =>
  (): Asset => {
    return new Asset(
      contractCurrency,
      Token.fromHash(
        firstHash.hash(genNonNegative(gMaxHashesPerPool)),
      ),
    );
  };

  static genPType = (): PConstraint<PAsset> => {
    const owner = PKeyHash.ptype.genData();
    const maxPreviousPools = genNonNegative(gMaxLength);
    return PIdNFT.fromOwner(maxPreviousPools, placeholderCcy, owner);
  };
}
