import { Lucid } from "../../../../../lucid.mod.js";
import { Data, PType } from "../type.js";
import { PObject } from "./object.js";
export declare class PSum<Os extends Object>
  implements PType<Lucid.Constr<Data>, Os> {
  readonly pconstrs: Array<Os extends Object ? PObject<Os> : never>;
  readonly population: number;
  constructor(pconstrs: Array<Os extends Object ? PObject<Os> : never>);
  plift: (c: Lucid.Constr<Data>) => Os;
  private matchData;
  pconstant: (data: Os) => Lucid.Constr<Data>;
  genData: () => Os;
  showData: (data: Os, tabs?: string, maxDepth?: bigint) => string;
  showPType(tabs?: string, maxDepth?: bigint): string;
  static genPType(): PSum<any>;
}
