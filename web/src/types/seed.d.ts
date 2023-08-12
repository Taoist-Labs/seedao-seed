declare interface INFT {
  image: string;
  tokenId: string;
  name?: string;
  attrs: { name: string; value: string | number | boolean }[];
}
