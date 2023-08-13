declare interface INFT {
  image: string;
  tokenId: string;
  name?: string;
  tokenIdFormat?: string;
  attrs: { name: string; value: string }[];
  thumb?: string;
}

declare interface IAttrGroup {
  name: string;
  values: string[];
  icon: string;
  valueNumbers: { [key: string]: number };
}
