import { randomIndexedChoice } from "../../utils/generators.ts";
import { User } from "../user.ts";
import { Closing } from "./closing.ts";
import { Opening } from "./opening.ts";
import { Swapping } from "./swapping.ts";
import { Switching } from "./switching.ts";

export type Action = Closing | Opening | Swapping | Switching; // TODO test Switching
export const allActions = [Closing, Opening, Swapping];

export class UserAction {
  constructor(
    private readonly user: User,
  ) {}

  public generate = (): Action | undefined => {
    const actions = new Permutation(allActions);
    return actions.try((a) => {
      return a.genOfUser(this.user);
    });
  };
}

class Permutation<T> {
  private base: Array<T>;
  constructor(
    base: Array<T>,
  ) {
    this.base = base.slice();
  }

  public get done(): boolean {
    return this.base.length === 0;
  }

  public get next(): T | undefined {
    if (this.done) return undefined;
    const [choice, i] = randomIndexedChoice(this.base);
    this.base = this.base.slice(0, i).concat(this.base.slice(i + 1));
    return choice;
  }

  public try = <T0>(f: (arg: T) => T0 | undefined): T0 | undefined => {
    if (this.done) return undefined;
    return f(this.next!) ?? this.try(f);
  };
}
