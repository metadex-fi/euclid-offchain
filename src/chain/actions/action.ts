import { randomIndexedChoice } from "../../utils/generators.ts";
import { User } from "../user.ts";
import { Closing } from "./closing.ts";
import { Opening } from "./opening.ts";
import { Swapping } from "./swapping.ts";
import { Switching } from "./switching.ts";

export type Action = Closing | Opening | Swapping | Switching;
// export const allActions = [Closing, Opening, Swapping, Switching];
export const allActions = [Opening, Closing];

export class UserAction {
  constructor(
    private readonly user: User,
  ) {}

  public generate = (): Action | null => {
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

  public get next(): T | null {
    if (this.done) return null;
    const [choice, i] = randomIndexedChoice(this.base);
    this.base = this.base.slice(0, i).concat(this.base.slice(i + 1));
    return choice;
  }

  public try = <T0>(f: (arg: T) => T0 | null): T0 | null => {
    if (this.done) return null;
    return f(this.next!) ?? this.try(f);
  };
}
