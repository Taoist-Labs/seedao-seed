declare interface INFT {
  image: string;
  tokenId: string;
  name?: string;
  tokenIdFormat?: string;
  attrs: { name: string; value: string }[];
  thumb?: string;
  ownerRank?: number;
}

declare interface IAttrGroup {
  name: string;
  values: { name: string; values: string[] }[];
  icon: string;
  valueNumbers: { [key: string]: number };
}

declare type NFTRes = {
  name: string;
  metadata: {
    attributes: { trait_type: string; value: string }[];
  };
  image: string;
  thumb: string;
};
