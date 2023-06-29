export class Switching {
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
                return this.pool.switchingTx(tx, this.user.contract).addSigner(this.user.address);
            }
        });
    }
    get type() {
        return "Switching";
    }
}
