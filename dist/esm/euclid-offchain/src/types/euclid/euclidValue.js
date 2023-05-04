import { assert } from "../../../../deps/deno.land/std@0.167.0/testing/asserts.js";
import { PWrapped } from "../general/fundamental/container/wrapped.js";
import { maxInteger } from "../../utils/generators.js";
import { Assets } from "../general/derived/asset/assets.js";
import { PBounded } from "../general/derived/bounded/bounded.js";
import {
  PositiveValue,
  PPositiveValue,
} from "../general/derived/value/positiveValue.js";
import { Value } from "../general/derived/value/value.js";
export class EuclidValue {
  constructor(value) {
    Object.defineProperty(this, "value", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: value,
    });
    Object.defineProperty(this, "concise", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (tabs = "") => this.value.concise(tabs),
    });
    Object.defineProperty(this, "amountOf", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (asset, defaultAmnt) => this.value.amountOf(asset, defaultAmnt),
    });
    Object.defineProperty(this, "addAmountOf", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (asset, amount) => {
        this.value.addAmountOf(asset, amount);
      },
    });
    Object.defineProperty(this, "plus", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return EuclidValue.fromValue(Value.add(this.unsigned, other.unsigned));
      },
    });
    Object.defineProperty(this, "minus", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return EuclidValue.fromValue(
          Value.subtract(this.unsigned, other.unsigned),
        );
      },
    });
    Object.defineProperty(this, "normedMinus", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return new PositiveValue(
          Value.normedSubtract(this.unsigned, other.unsigned),
        );
      },
    });
    Object.defineProperty(this, "hadamard", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return EuclidValue.fromValue(
          Value.hadamard(this.unsigned, other.unsigned),
        );
      },
    });
    // reverse hadamard product
    Object.defineProperty(this, "divideBy", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return EuclidValue.fromValue(
          Value.divide(this.unsigned, other.unsigned),
        );
      },
    });
    // public normedDivideBy = (other: EuclidValue): PositiveValue => {
    //   return new PositiveValue(Value.normedDivide(this.unsigned, other.unsigned));
    // };
    Object.defineProperty(this, "divideByScalar", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (scalar) => {
        return EuclidValue.fromValue(this.unsigned.divideByScalar(scalar));
      },
    });
    Object.defineProperty(this, "lt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return Value.lt(this.unsigned, other.unsigned);
      },
    });
    Object.defineProperty(this, "leq", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (other) => {
        return Value.leq(this.unsigned, other.unsigned);
      },
    });
    Object.defineProperty(this, "bounded", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (lower = 1n, upper = maxInteger) => {
        return EuclidValue.fromValue(
          Value.newBoundedWith(new PBounded(lower, upper))(this.unsigned),
        );
      },
    });
    EuclidValue.asserts(this);
  }
  get assets() {
    return this.value.assets;
  }
  get unsigned() {
    return this.value.unsigned;
  }
  get unsized() {
    return this.value.clone;
  }
  get unit() {
    return this.value.unit;
  }
  get clone() {
    return new EuclidValue(this.value.clone);
  }
  get toLucid() {
    return this.value.toLucid;
  }
  get leqMaxInteger() {
    return this.unsigned.leqMaxInteger;
  }
  // public halfRandomAmount = (): void => this.value.halfRandomAmount();
  static asserts(euclidValue) {
    assert(euclidValue.assets.size >= 2n, "at least two assets are required");
  }
  static generate() {
    const assets = Assets.generate(2n);
    const value = PositiveValue.genOfAssets(assets);
    return new EuclidValue(value);
  }
  static genOfAssets(assets) {
    return new EuclidValue(PositiveValue.genOfAssets(assets));
  }
  static genBelow(upper) {
    return EuclidValue.fromValue(Value.genBetween(upper.unit, upper.unsigned));
  }
}
Object.defineProperty(EuclidValue, "fromValue", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: (value) => new EuclidValue(new PositiveValue(value)),
});
Object.defineProperty(EuclidValue, "filled", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: (value, assets, amount) => {
    return new EuclidValue(value.fill(assets, amount));
  },
});
export class PEuclidValue extends PWrapped {
  constructor() {
    super(PPositiveValue.ptype, EuclidValue);
    Object.defineProperty(this, "genData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: EuclidValue.generate,
    });
  }
  static genPType() {
    return PEuclidValue.ptype;
  }
}
Object.defineProperty(PEuclidValue, "ptype", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: new PEuclidValue(),
});
