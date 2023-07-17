import { useState } from "react";
import styled from "@emotion/styled";
import FilterAttrItem from "./filterAttrItem";
import NFTCard, { INFT } from "./nft";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Box from "@mui/material/Box";

interface IAttrGroup {
  name: string;
  values: string[];
}

type SelectAttr = {
  value: string;
  id: number;
};

export default function GalleryPage() {
  const [attrGroups, setAttrGroups] = useState<IAttrGroup[]>([
    {
      name: "background",
      values: ["1235", "456"],
    },
    {
      name: "color",
      values: ["#fff", "#aaa"],
    },
    {
      name: "height",
      values: ["90cm", "456"],
    },
  ]);
  const [selectAttrs, setSelectAttrs] = useState<SelectAttr[]>([]);
  const [list, setList] = useState<INFT[]>([
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
    },
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
    },
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
    },
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
    },
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
    },
  ]);

  const onSelectValue = (id: number, value: string, selected: boolean) => {
    if (selected) {
      setSelectAttrs([
        ...selectAttrs,
        {
          id,
          value,
        },
      ]);
    } else {
      setSelectAttrs(
        selectAttrs.filter((item) => item.value !== value || item.id !== id),
      );
    }
  };

  return (
    <GalleryPageStyle>
      <GalleryLeft>
        {attrGroups.map((group, index) => (
          <FilterAttrItem
            key={index}
            id={index}
            name={group.name}
            values={group.values}
            selected={selectAttrs
              .filter((item) => item.id === index)
              .map((item) => item.value)}
            onSelectValue={onSelectValue}
          />
        ))}
      </GalleryLeft>
      <GalleryRight>
        <NFTList container spacing={2}>
          {list.map((item, idx) => (
            <NFTCard key={idx} data={item} />
          ))}
        </NFTList>
      </GalleryRight>
    </GalleryPageStyle>
  );
}

const GalleryPageStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const GalleryLeft = styled.div`
  width: 270px;
  border-right: 1px solid #ddd;
`;
const GalleryRight = styled(Box)`
  flex: 1;
  padding-left: 20px;
`;

const NFTList = styled(Grid)`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;
