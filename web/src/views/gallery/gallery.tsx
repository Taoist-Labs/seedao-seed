import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import FilterAttrItem from "./filterAttrItem";
import NFTCard from "./nft";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import CloseIcon from "@mui/icons-material/Close";
import SeedModal from "components/modals/seedModal";
import { height } from "@mui/system";

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
      attrs: [
        { name: "background", value: "#fff" },
        { name: "color", value: "#fff" },
        { name: "height", value: "90cm" },
      ],
    },
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
      attrs: [
        { name: "background", value: "#fff" },
        { name: "color", value: "#fff" },
        { name: "height", value: "90cm" },
      ],
    },
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
      attrs: [
        { name: "background", value: "#fff" },
        { name: "color", value: "#fff" },
        { name: "height", value: "90cm" },
      ],
    },
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
      attrs: [
        { name: "background", value: "#fff" },
        { name: "color", value: "#fff" },
        { name: "height", value: "90cm" },
      ],
    },
    {
      image:
        "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
      tokenId: "2000",
      name: "lala",
      attrs: [
        { name: "background", value: "#fff" },
        { name: "color", value: "#fff" },
        { name: "height", value: "90cm" },
      ],
    },
  ]);
  const [showSeed, setShowSeed] = useState<INFT>();

  const handleFilter = () => {
    // TODO
  };

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

  const removeAttr = ({ id, value }: SelectAttr) => {
    setSelectAttrs(
      selectAttrs.filter((item) => item.value !== value || item.id !== id),
    );
  };

  useEffect(() => {
    handleFilter();
  }, [selectAttrs]);

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
        <GalleryContent>
          <FilterTags>
            {selectAttrs.map((item, idx) => (
              <Tag key={idx} onClick={() => removeAttr(item)}>
                <span>{item.value}</span> <CloseIcon fontSize="small" />
              </Tag>
            ))}
          </FilterTags>
          <NFTList container spacing={2}>
            {list.map((item, idx) => (
              <NFTCard
                key={idx}
                data={item}
                onClick={() => setShowSeed(item)}
              />
            ))}
          </NFTList>
          <PaginationStyle count={list.length} color="primary" />
        </GalleryContent>
      </GalleryRight>
      {showSeed && (
        <SeedModal seed={showSeed} handleClose={() => setShowSeed(undefined)} />
      )}
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
`;

const GalleryContent = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 20px;
  padding-top: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
    display: none;
  }
`;

const NFTList = styled(Grid)``;

const PaginationStyle = styled(Pagination)`
  margin-block: 10px;
`;

const FilterTags = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;
const Tag = styled.li`
  padding: 5px 10px;
  border: 1px solid #ddd;
  margin-block: 10px;
  border-radius: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
