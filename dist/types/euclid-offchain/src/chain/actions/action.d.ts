import { User } from "../user.js";
import { Cleaning } from "./cleaning.js";
import { Closing } from "./closing.js";
import { Disabling } from "./disabling.js";
import { Opening } from "./opening.js";
import { Swapping } from "./swapping.js";
export declare type Action = Cleaning | Closing | Disabling | Opening | Swapping;
export declare const allActions: (typeof Swapping | typeof Cleaning | typeof Closing | typeof Disabling | typeof Opening)[];
export declare class UserAction {
    private readonly user;
    constructor(user: User);
    generate: () => Action | undefined;
}
