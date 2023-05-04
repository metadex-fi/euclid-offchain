import { Lucid } from "../../../../../lucid.mod.js";
import { PWrapped } from "../../fundamental/container/wrapped.js";
import { Hash } from "./hash.js";
export declare class KeyHash {
  readonly keyHash: Uint8Array;
  constructor(keyHash: Uint8Array);
  hash: () => Hash;
  toString: () => string;
  show: () => string;
  static fromCredential(credential: Lucid.Credential): KeyHash;
  static numBytes: bigint;
}
export declare class PKeyHash extends PWrapped<KeyHash> {
  private constructor();
  static ptype: PKeyHash;
  static genPType(): PWrapped<KeyHash>;
}
