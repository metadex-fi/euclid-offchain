import {
  AssetBounds,
  AssetConstants,
} from "../src/chain/actions/swapfinding_new/perAsset.ts";

Deno.test("swapfinding", () => {
  let trials = 1000;
  while (trials--) {
    const buyingConstants = AssetConstants.generateFor("buying");
    const sellingConstants = AssetConstants.generateFor("selling");

    const buyingPairBounds = AssetBounds.fromAssetConstants(buyingConstants);
    // .toPairBounds(sellingConstants);
    const sellingPairBounds = AssetBounds.fromAssetConstants(sellingConstants);
    // .toPairBounds(buyingConstants);

    // const comparison = buyingPairBounds.compare(sellingPairBounds);
    // const finalBounds = comparison === -1
    //   ? buyingPairBounds
    //   : sellingPairBounds;
  }
});
