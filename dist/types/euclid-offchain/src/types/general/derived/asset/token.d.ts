import { PWrapped } from "../../fundamental/container/wrapped.js";
export declare class Token {
  readonly name: string;
  constructor(name: string);
  show: () => string;
  concise: () => string;
  valueOf: () => string;
  toLucid: () => string;
  static fromLucid(hexTokenName: string): Token;
  static maxLength: bigint;
  static lovelace: Token;
}
export declare class PToken extends PWrapped<Token> {
  constructor();
  static ptype: PToken;
  static genPType(): PWrapped<Token>;
}
