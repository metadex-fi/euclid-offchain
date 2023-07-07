import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { Lucid } from "../../../../../lucid.mod.ts";
import { PWrapped } from "../../fundamental/container/wrapped.ts";
import { PString } from "../../fundamental/primitive/string.ts";

export class Token {
  constructor(public readonly name: string) {
    assert(
      name.length <= Token.maxLength,
      `Token too long: ${name}, ${name.length}`,
    );
  }

  public show = (): string => {
    return `Token(${this.name})`;
  };

  public concise = (): string => {
    return this.name;
  };

  public equals = (other: Token): boolean => {
    return this.concise() === other.concise();
  };

  public valueOf = this.show;

  public toLucid = (): string => {
    return Lucid.fromText(this.name);
  };

  static fromLucid(hexTokenName: string): Token {
    // try {
    return new Token(Lucid.toText(hexTokenName));
    // } catch (e) {
    //   throw new Error(`Token.fromLucid ${hexTokenName}:\n${e}`);
    // }
  }

  // static fromOwner = (owner: KeyHash) => {
  //   return new Token(toText_(Lucid.toHex(owner.keyHash)));
  // };

  static maxLength = 32n; // empirical maximum (at least with lucid)
  static lovelace = new Token("");
}

export class PToken extends PWrapped<Token> {
  constructor() {
    super(
      new PString(0n, Token.maxLength),
      Token,
    );
  }

  static ptype = new PToken();
  static genPType(): PWrapped<Token> {
    return PToken.ptype;
  }
}
