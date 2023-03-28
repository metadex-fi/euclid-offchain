import { Currency } from "../general/derived/asset/currency.js";
import { KeyHash } from "../general/derived/hash/keyHash.js";
import { PositiveValue } from "../general/derived/value/positiveValue.js";
import { PConstraint } from "../general/fundamental/container/constraint.js";
import { PObject } from "../general/fundamental/container/object.js";
import { IdNFT } from "./idnft.js";
import { Param } from "./param.js";
export declare class Dirac {
    readonly owner: KeyHash;
    readonly threadNFT: IdNFT;
    readonly paramNFT: IdNFT;
    readonly lowestPrices: PositiveValue;
    constructor(owner: KeyHash, threadNFT: IdNFT, paramNFT: IdNFT, lowestPrices: PositiveValue);
    concise: (tabs?: string) => string;
    static assertWith: (param: Param) => (dirac: Dirac) => void;
    static generateWith: (param: Param, paramNFT: IdNFT, threadNFT: IdNFT) => () => Dirac;
}
export declare class PPreDirac extends PObject<Dirac> {
    constructor(policy: Currency);
    static genPType(): PPreDirac;
}
export declare class PDirac extends PConstraint<PObject<Dirac>> {
    readonly param: Param;
    readonly paramNFT: IdNFT;
    readonly threadNFT: IdNFT;
    constructor(param: Param, paramNFT: IdNFT, threadNFT: IdNFT);
    static genPType(): PConstraint<PObject<Dirac>>;
}
