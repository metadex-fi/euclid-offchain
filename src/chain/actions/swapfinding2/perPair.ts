import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { AssetBounds } from "./perAsset.ts";

export class PairBounds {
  constructor(
    private readonly buyingBounds: AssetBounds,
    private readonly sellingBounds: AssetBounds,
  ) {
    assert(buyingBounds.constants.direction === "buying");
    assert(sellingBounds.constants.direction === "selling");
  }

  // we assume one is tighter than the other in both directions
  // -1 means this is the tighter one
  public compare = (other: PairBounds): -1 | 0 | 1 => {
    const compareBuyingBounds = this.buyingBounds.compare(other.buyingBounds);
    const compareSellingBounds = this.sellingBounds.compare(
      other.sellingBounds,
    );
    let result: -1 | 0 | 1 = 0;
    for (const comparison of [compareBuyingBounds, compareSellingBounds]) {
      if (comparison === 0) continue;
      else if (result === 0) result = comparison;
      else {assert(
          result === comparison,
          `compare(): ${result} != ${comparison}`,
        );}
    }
    return result;
  };
}
