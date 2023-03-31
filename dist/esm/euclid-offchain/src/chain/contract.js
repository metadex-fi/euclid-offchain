import euclidValidator from "../../contract/alwaysSucceeds.js";
import euclidMinting from "../../contract/mintAlways.js";
import { EuclidState } from "./euclidState.js";
import { Currency } from "../types/general/derived/asset/currency.js";
export class Contract {
    constructor(lucid) {
        Object.defineProperty(this, "lucid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: lucid
        });
        Object.defineProperty(this, "validator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mintingPolicy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "address", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "policy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "update", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: async () => {
                const utxos = await this.lucid.utxosAt(this.address);
                this.state = new EuclidState(utxos, this.policy);
            }
        });
        Object.defineProperty(this, "concise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                // validator.script: ${this.validator.script};
                return `Contract (
      mintingPolicy.script: ${this.mintingPolicy.script};
      address: ${this.address};
      policy: ${this.policy};
      state?: ${this.state ? "yes" : "no"};
      )`;
            }
        });
        this.validator = {
            type: "PlutusV2",
            script: euclidValidator.cborHex,
        };
        this.mintingPolicy = {
            type: "PlutusV2",
            script: euclidMinting.cborHex,
        };
        this.address = lucid.utils.validatorToAddress(this.validator);
        this.policy = Currency.fromHex(lucid.utils.mintingPolicyToId(this.mintingPolicy));
    }
}
