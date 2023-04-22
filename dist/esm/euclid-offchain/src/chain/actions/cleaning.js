import { randomChoice } from "../../utils/generators.js";
export class Cleaning {
    constructor(user, prePool) {
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: user
        });
        Object.defineProperty(this, "prePool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: prePool
        });
        Object.defineProperty(this, "tx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tx) => {
                return this.prePool.cleaningTx(tx, this.user.contract).addSigner(this.user.address);
            }
        });
    }
    get type() {
        return "Cleaning";
    }
}
Object.defineProperty(Cleaning, "genOfUser", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (user) => {
        // console.log(`attempting to close`);
        const enoughForFees = user.availableBalance;
        if (!enoughForFees)
            return undefined;
        const prePools = user.contract.state?.invalidPools.get(user.paymentKeyHash);
        if (!prePools)
            return undefined;
        if (!prePools.size)
            return undefined;
        const prePool = randomChoice([...prePools.values()]);
        // console.log(`Cleaning`);
        return new Cleaning(user, prePool);
    }
});
