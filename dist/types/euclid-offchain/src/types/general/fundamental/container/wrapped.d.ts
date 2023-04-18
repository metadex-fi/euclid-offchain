import { Generators } from "../../../../utils/generators.js";
import { Data, PData, PType } from "../type.js";
export declare class PWrapped<O extends Object> implements PType<Data, O> {
  readonly pinner: PData;
  readonly O: new (arg: any) => O;
  population: number;
  constructor(pinner: PData, O: new (arg: any) => O);
  plift: (data: Data) => O;
  pconstant: (data: O) => Data;
  genData: () => O;
  showData: (data: O, tabs?: string, maxDepth?: bigint) => string;
  showPType: (tabs?: string, maxDepth?: bigint) => string;
  static genPType(gen: Generators, maxDepth: bigint): PWrapped<any>;
}
