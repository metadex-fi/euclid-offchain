import { Asset, PAsset } from "../mod.ts";
import { PWrapped } from "../general/fundamental/container/wrapped.ts";

export class IdNFT {
  constructor(
    public readonly asset: Asset,
  ) {}
}

export class PIdNFT extends PWrapped<IdNFT> {
  private constructor() {
    super(
      PAsset.ptype,
      IdNFT,
    );
  }

  static ptype = new PIdNFT();
  static genPType(): PIdNFT {
    return PIdNFT.ptype;
  }
}
