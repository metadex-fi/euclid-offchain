import { assert } from "../../../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { Lucid } from "../../../../../lucid.mod.js";
import { randomChoice } from "../../../../utils/generators.js";
import { PObject } from "../../fundamental/container/object.js";
import { PRecord } from "../../fundamental/container/record.js";
import { Currency, PCurrency } from "./currency.js";
import { PToken, Token } from "./token.js";
export class Asset {
    constructor(currency, token) {
        Object.defineProperty(this, "currency", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: currency
        });
        Object.defineProperty(this, "token", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: token
        });
        Object.defineProperty(this, "equals", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (other) => {
                return this.currency.symbol === other.currency.symbol &&
                    this.token.name === other.token.name;
            }
        });
        Object.defineProperty(this, "show", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `Asset(${this.currency.toString()}, ${this.token.name})`;
            }
        });
        Object.defineProperty(this, "concise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `${this.currency.concise()}.${this.token.concise()}`;
            }
        });
        Object.defineProperty(this, "toLucid", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                if (this.currency.symbol.length === 0)
                    return "lovelace";
                else
                    return Lucid.toUnit(this.currency.toLucid(), this.token.toLucid());
            }
        });
        Object.defineProperty(this, "toLucidWith", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (amount) => {
                return { [this.toLucid()]: amount };
            }
        });
        Asset.assertADAlovelace(this);
        // Asset.assertLength(this);
    }
    static fromLucid(hexAsset) {
        try {
            if (hexAsset === "lovelace")
                return Asset.ADA;
            else {
                const unit = Lucid.fromUnit(hexAsset);
                return new Asset(Currency.fromLucid(unit.policyId), Token.fromLucid(unit.assetName ?? ""));
            }
        }
        catch (e) {
            throw new Error(`Asset.fromLucid ${hexAsset}:\n${e}`);
        }
    }
    static assertADAlovelace(asset) {
        if (Lucid.toHex(asset.currency.symbol) === "") {
            assert(asset.token.name === "", `ADA must have lovelace, got ${asset.show()}`);
        }
    }
    static generate() {
        return randomChoice([
            () => Asset.ADA,
            Asset.generateNonADA,
        ])();
    }
}
// static maxLength = 64n;
// static assertLength(asset: Asset): void {
//   const ccy = asset.currency.symbol.length * 2;
//   const tkn = asset.token.name.length;
//   const ass = ccy + tkn;
//   assert(
//     ass <= Asset.maxLength,
//     `Asset too long: ${asset.show()}, ${ass} = ${ccy} + ${tkn}`,
//   );
// }
Object.defineProperty(Asset, "ADA", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new Asset(Currency.ADA, Token.lovelace)
});
Object.defineProperty(Asset, "generateNonADA", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: () => {
        const ccy = PCurrency.ptype.genData();
        const tkn = PToken.ptype.genData();
        return new Asset(ccy, tkn);
    }
});
export class PAsset extends PObject {
    constructor() {
        super(new PRecord({
            "currency": PCurrency.ptype,
            "token": PToken.ptype,
        }), Asset);
        Object.defineProperty(this, "genData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Asset.generate
        });
        Object.defineProperty(this, "showData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (data) => {
                assert(data instanceof Asset, `PAsset.showData: expected Asset, got ${data}`);
                return data.show();
            }
        });
        Object.defineProperty(this, "showPType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                return `PObject: PAsset`;
            }
        });
    }
    static genPType() {
        return PAsset.ptype;
    }
}
Object.defineProperty(PAsset, "ptype", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new PAsset()
});
