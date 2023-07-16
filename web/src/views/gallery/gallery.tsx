import { useState } from "react";
import styled from "@emotion/styled";
import FilterAttrItem from "./filterAttrItem";

interface IAttrGroup {
  name: string;
  values: string[];
}

export type SelectAttr = {
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
      <GalleryRight></GalleryRight>
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
const GalleryRight = styled.div`
  flex: 1;
`;
