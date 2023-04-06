import { randomChoice } from "../../utils/generators.js";
export class Disabling {
    constructor(user, pool) {
        Object.defineProperty(this, "user", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: user
        });
        Object.defineProperty(this, "pool", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: pool
        });
        Object.defineProperty(this, "tx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (tx) => {
                return this.pool.disablingTx(tx, this.user.contract).addSigner(this.user.address);
            }
        });
    }
    get type() {
        return "Disabling";
    }
}
Object.defineProperty(Disabling, "genOfUser", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: (user) => {
        // console.log(`attempting to close`);
        const enoughForFees = user.availableBalance;
        if (!enoughForFees)
            return undefined;
        const pools = user.contract.state?.pools.get(user.paymentKeyHash);
        if (!pools)
            return undefined;
        if (!pools.size)
            return undefined;
        const pool = randomChoice([...pools.values()]);
        // console.log(`Disabling`);
        return new Disabling(user, pool);
    }
});
