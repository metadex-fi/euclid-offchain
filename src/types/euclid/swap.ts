import { assert } from "https://deno.land/std@0.167.0/testing/asserts.ts";
import { gMaxLength } from "../../utils/constants.ts";
import { genPositive } from "../../utils/generators.ts";
import { Asset, PAsset } from "../general/derived/asset/asset.ts";
import { PList } from "../general/fundamental/container/list.ts";
import { PObject } from "../general/fundamental/container/object.ts";
import { PRecord } from "../general/fundamental/container/record.ts";
import { PSubSwap, SubSwap } from "./subSwap.ts";

export class Swap {
  constructor(
    public readonly boughtAsset: Asset,
    public readonly soldAsset: Asset,
    public readonly subswaps: SubSwap[],
  ) {}
}

export class PSwap extends PObject<Swap> {
  constructor(
    public readonly numSubSwaps?: bigint,
  ) {
    if (numSubSwaps !== undefined) {
      assert(numSubSwaps > 0n, "PSwap: nonpositive number of subSwaps");
    }
    super(
      new PRecord({
        boughtAsset: PAsset.ptype,
        soldAsset: PAsset.ptype,
        subswaps: new PList(PSubSwap.ptype, numSubSwaps),
      }),
      Swap,
    );
  }

  static genPType(): PSwap {
    const numSubSwaps = genPositive(gMaxLength);
    return new PSwap(numSubSwaps);
  }
}
