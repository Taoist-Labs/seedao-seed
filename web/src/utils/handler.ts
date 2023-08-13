import { ATTR_ICON_MAP } from "utils/constant";

type OType = {
  name: string;
  metadata: {
    attributes: { trait_type: string; value: string }[];
  };
  image: string;
  thumb: string;
};

export const handleNfts = (data: OType[]) => {
  const nfts: INFT[] = [];
  const attr_group: { [key: string]: { [value: string]: number } } = {};
  data.forEach((item) => {
    item.metadata.attributes.forEach((attr) => {
      const key = attr.trait_type;
      const value = attr.value;
      if (!attr_group[key]) {
        attr_group[key] = {};
      }
      if (!attr_group[key][value]) {
        attr_group[key][value] = 0;
      }
      attr_group[key][value] += 1;
    });
    nfts.push({
      attrs: item.metadata.attributes.map((attr) => ({
        name: attr.trait_type,
        value: attr.value,
      })),
      image: item.image,
      thumb: item.thumb,
      tokenId: item.name,
      name: item.name,
    });
  });
  const r: IAttrGroup[] = [];
  for (const key in attr_group) {
    const element = attr_group[key];
    r.push({
      name: key,
      values: Object.keys(element),
      valueNumbers: element,
      icon: ATTR_ICON_MAP[key] || "",
    });
  }
  return { attrGroups: r, nfts };
};
