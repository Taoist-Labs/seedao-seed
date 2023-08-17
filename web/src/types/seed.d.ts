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
