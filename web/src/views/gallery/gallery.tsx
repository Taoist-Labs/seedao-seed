import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import FilterAttrItem from "./filterAttrItem";
import NFTCard from "./nft";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import CloseIcon from "@mui/icons-material/Close";
import SeedModal from "components/modals/seedModal";
import SearchIcon from "@mui/icons-material/Search";
import ReplayIcon from "@mui/icons-material/Replay";

interface IAttrGroup {
  name: string;
  values: string[];
}

type SelectAttr = {
  name: string;
  value: string;
  id: number;
};

export default function GalleryPage() {
  const [attrGroups] = useState<IAttrGroup[]>([
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
  const [list] = useState<INFT[]>([
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
  const [keyword, setKeyword] = useState<string>("");

  const handleFilter = () => {
    // TODO
  };

  const onSelectValue = (
    id: number,
    name: string,
    value: string,
    selected: boolean,
  ) => {
    if (selected) {
      setSelectAttrs([
        ...selectAttrs,
        {
          id,
          name,
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
        <LeftTitle>FILTER</LeftTitle>
        <InputWrapper>
          <SearchIcon />
          <input
            type="text"
            placeholder="Sort by serial..."
            onChange={(e) => setKeyword(e.target.value)}
          />
        </InputWrapper>
        {attrGroups.map((group, index) => (
          <FilterAttrItem
            key={index}
            id={index}
            name={group.name}
            values={group.values}
            selected={selectAttrs
              .filter((item) => item.id === index)
              .map((item) => item.value)}
            onSelectValue={(id, value, selected) =>
              onSelectValue(id, group.name, value, selected)
            }
          />
        ))}
      </GalleryLeft>
      <GalleryRight>
        <GalleryContent>
          <FilterHead>
            <span className="title">FILTERS</span>
            <span className="num">{selectAttrs.length}</span>
            <FilterTags>
              <ul className="tag-container">
                {selectAttrs.map((item, idx) => (
                  <Tag key={idx} onClick={() => removeAttr(item)}>
                    <span>
                      {item.name}:{item.value}
                    </span>
                    <CloseIcon fontSize="small" />
                  </Tag>
                ))}
              </ul>
            </FilterTags>
            <FilterHeadRight>
              <span className="result">123</span>
              <ReplayIcon />
            </FilterHeadRight>
          </FilterHead>
          {list.length > 0 ? (
            <>
              <NFTList container spacing={3}>
                {list.map((item, idx) => (
                  <NFTCard
                    key={idx}
                    data={item}
                    onClick={() => setShowSeed(item)}
                  />
                ))}
              </NFTList>
              <PaginationStyle count={list.length} color="primary" />
            </>
          ) : (
            <EmptyBox>
              <p>很抱歉，找不到符合您搜索条件的Seed NFT</p>
              <ClearButton>清空筛选标签</ClearButton>
            </EmptyBox>
          )}
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
  padding-inline: 30px;
  padding-top: 49px;
  box-shadow: 2px 0px 8px 2px rgba(0, 0, 0, 0.1);
`;
const GalleryRight = styled(Box)`
  flex: 1;
`;

const GalleryContent = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 45px;
  padding-top: 45px;
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

const FilterTags = styled.div`
  flex: 1;
  .tag-container {
    width: 100%;
    overflow-x: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
const Tag = styled.li`
  padding-inline: 10px;
  height: 24px;
  line-height: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

const LeftTitle = styled.div`
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: 64px;
`;

const InputWrapper = styled.div`
  border: 1px solid #bbb;
  border-radius: 5px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-inline: 10px;
  margin-block: 20px;
  input {
    border: none;
    outline: none;
    height: 100%;
    line-height: 36px;
    padding: 0;
    background-color: transparent;
    font-size: 20px;
    &::placeholder {
      color: #b5b5b5;
    }
  }
`;

const FilterHead = styled.div`
  display: flex;
  gap: 7px;
  align-items: center;
  margin-bottom: 40px;
  .title {
    font-size: 20px;
    line-height: 30px;
    opacity: 0.3;
  }
  .num {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background: #d2ceca;
    color: #fff;
    text-align: center;
    line-height: 24px;
    font-weight: 700;
    font-size: 14px;
  }
`;

const FilterHeadRight = styled.div`
  display: flex;
  align-items: center;
  .result {
    text-align: right;
    font-size: 36px;
    font-weight: 700;
    margin-right: 20px;
  }
`;

const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(80vh - 100px);
`;

const ClearButton = styled.span`
  border-radius: 8px;
  background: #c3f237;
  padding: 10px;
  font-size: 20px;
  margin-top: 36px;
`;
