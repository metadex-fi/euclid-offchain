import { randomIndexedChoice } from "../../utils/generators.js";
import { Closing } from "./closing.js";
import { Opening } from "./opening.js";
import { Swapping } from "./swapping.js";
export const allActions = [Closing, Opening, Swapping];
export class UserAction {
  constructor(user) {
    Object.defineProperty(this, "user", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: user,
    });
    Object.defineProperty(this, "generate", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        const actions = new Permutation(allActions);
        return actions.try((a) => {
          return a.genOfUser(this.user);
        });
      },
    });
  }
}
class Permutation {
  constructor(base) {
    Object.defineProperty(this, "base", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
    Object.defineProperty(this, "try", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: (f) => {
        if (this.done) {
          return undefined;
        }
        return f(this.next) ?? this.try(f);
      },
    });
    this.base = base.slice();
  }
  get done() {
    return this.base.length === 0;
  }
  get next() {
    if (this.done) {
      return undefined;
    }
    const [choice, i] = randomIndexedChoice(this.base);
    this.base = this.base.slice(0, i).concat(this.base.slice(i + 1));
    return choice;
  }
}
