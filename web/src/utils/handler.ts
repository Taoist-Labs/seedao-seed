import { ATTR_ICON_MAP } from "utils/constant";

export const handleNfts = (data: NFTRes[]) => {
  const nfts: INFT[] = [];
  const attr_group: {
    [key: string]: {
      [value: string]: {
        count: number;
        subValues: { [subKey: string]: number };
      };
    };
  } = {};
  data.forEach((item) => {
    item.metadata.attributes.forEach((attr) => {
      const key = attr.trait_type;
      const value = attr.value;
      if (!attr_group[key]) {
        attr_group[key] = {};
      }
      const value_split = value.split("_");
      const _value = value_split[0];
      const _type = value_split[1];

      if (!attr_group[key][_value]) {
        attr_group[key][_value] = { count: 0, subValues: {} };
      }
      attr_group[key][_value].count += 1;
      if (_type) {
        const k = attr_group[key][_value].subValues[value];
        if (!k) {
          attr_group[key][_value].subValues[value] = 0;
        }
        attr_group[key][_value].subValues[value] += 1;
      }
    });
    const _name_split = item.name?.split("#") || [];
    let _token_id;
    if (_name_split.length === 2) {
      _token_id = _name_split[1];
    }

    nfts.push({
      attrs: item.metadata.attributes.map((attr) => ({
        name: attr.trait_type,
        value: attr.value,
      })),
      image: item.image.startsWith("https")
        ? item.image
        : `${process.env.REACT_APP_STATIC_HOST}/nfts/${item.image}`,
      thumb: item.thumb.startsWith("https")
        ? item.image
        : `${process.env.REACT_APP_STATIC_HOST}/nfts/${item.thumb}`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tokenId: _token_id,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      tokenIdFormat: `SEED No.${_token_id}`,
      name: item.name,
    });
  });
  const r: IAttrGroup[] = [];
  for (const key in attr_group) {
    const element = attr_group[key];
    const _vaulue_nambers: { [k: string]: number } = {};
    for (const k in element) {
      _vaulue_nambers[k] = element[k].count;
      for (const subKey in element[k].subValues) {
        const subValue = element[k].subValues[subKey];
        _vaulue_nambers[subKey] = subValue;
      }
    }

    r.push({
      name: key,
      values: Object.keys(element).map((k) => {
        return {
          name: k,
          values: Object.keys(element[k].subValues),
        };
      }),
      valueNumbers: _vaulue_nambers,
      icon: ATTR_ICON_MAP[key] || "",
    });
  }
  return { attrGroups: r, nfts };
};
