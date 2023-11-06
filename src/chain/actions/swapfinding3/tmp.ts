export type OtherAssetType<AssetType extends "buying" | "selling"> =
  AssetType extends "buying" ? "selling"
    : "buying";

const flipOnce = <T extends "buying" | "selling">(
  assetType: T,
): OtherAssetType<T> => {
  return (assetType === "buying" ? "selling" : "buying") as OtherAssetType<T>;
};

const flipTwice = <T extends "buying" | "selling">(assetType: T): T => {
  return flipOnce(flipOnce(assetType)) as T;
};
