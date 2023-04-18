import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { PString } from "../../fundamental/primitive/string.js";
export class Token {
  constructor(name) {
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: name,
    });
    Object.defineProperty(this, "show", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return `Token(${this.name})`;
      },
    });
    Object.defineProperty(this, "concise", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return this.name;
      },
    });
    Object.defineProperty(this, "valueOf", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.show,
    });
    Object.defineProperty(this, "toLucid", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        return Lucid.fromText(this.name);
      },
    });
    assert(
      name.length <= Token.maxLength,
      `Token too long: ${name}, ${name.length}`,
    );
  }
  static fromLucid(hexTokenName) {
    try {
      return new Token(Lucid.toText(hexTokenName));
    } catch (e) {
      throw new Error(`Token.fromLucid ${hexTokenName}:\n${e}`);
    }
  }
}
// static fromOwner = (owner: KeyHash) => {
//   return new Token(toText_(Lucid.toHex(owner.keyHash)));
// };
Object.defineProperty(Token, "maxLength", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 32n,
}); // empirical maximum (at least with lucid)
Object.defineProperty(Token, "lovelace", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new Token(""),
});
export class PToken extends PWrapped {
  constructor() {
    super(new PString(0n, Token.maxLength), Token);
  }
  static genPType() {
    return PToken.ptype;
  }
}
Object.defineProperty(PToken, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PToken(),
});
