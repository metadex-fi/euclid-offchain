import { EuclidState } from "./euclidState.js";
import { Lucid } from "../../lucid.mod.js";
import { Currency } from "../types/general/derived/asset/currency.js";
export declare class Contract {
  readonly lucid: Lucid.Lucid;
  readonly validator: Lucid.Validator;
  readonly mintingPolicy: Lucid.MintingPolicy;
  readonly address: Lucid.Address;
  readonly policy: Currency;
  state?: EuclidState;
  constructor(lucid: Lucid.Lucid);
  update: () => Promise<void>;
  concise: () => string;
}
