import { User } from "../user.js";
import { Closing } from "./closing.js";
import { Opening } from "./opening.js";
import { Swapping } from "./swapping.js";
export declare type Action = Closing | Opening | Swapping;
export declare const allActions: (typeof Swapping | typeof Closing | typeof Opening)[];
export declare class UserAction {
    private readonly user;
    constructor(user: User);
    generate: () => Action | undefined;
}
