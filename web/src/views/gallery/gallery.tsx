import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import NFTCard from "./nft";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import SeedModal from "components/modals/seedModal";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@mui/material/useMediaQuery";

import GalleryFilterMenu, { IAttrGroup, SelectAttr } from "./filterMenu";
import FilterSvg from "components/svg/filter";
import RefreshSvg from "components/svg/refresh";

import BackgroundIcon from "assets/images/attrs/background.svg";
import BodyIcon from "assets/images/attrs/body.svg";
import ClothIcon from "assets/images/attrs/cloth.svg";
import EarIcon from "assets/images/attrs/ear.svg";
import PolarisIcon from "assets/images/attrs/polarist.svg";
import HairIcon from "assets/images/attrs/hair.svg";
import SpecialIcon from "assets/images/attrs/special.svg";
import { CenterBox } from "style";

export default function GalleryPage() {
  const matches = useMediaQuery("(max-width:960px)");
  const { t } = useTranslation();
  const [showLeft, setshowLeft] = useState<boolean>(!matches);

  const [attrGroups] = useState<IAttrGroup[]>([
    {
      display: "Cloth",
      name: "cloth",
      icon: ClothIcon,
      values: ["90cm", "456"],
    },
    {
      display: "Polaris",
      name: "polaris",
      icon: PolarisIcon,
      values: ["90cm", "456"],
    },
    {
      display: "Haire",
      name: "haire",
      icon: HairIcon,
      values: ["90cm", "456"],
    },
    {
      display: "Body",
      name: "body",
      values: ["#fff", "#aaa"],
      icon: BodyIcon,
    },
    {
      display: "Ear",
      name: "ear",
      icon: EarIcon,
      values: ["90cm", "456"],
    },
    {
      display: "Background",
      name: "background",
      icon: BackgroundIcon,
      values: ["1235", "456"],
    },
    {
      display: "Special",
      name: "special",
      icon: SpecialIcon,
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

  useEffect(() => {
    // TODO
  }, [keyword]);

  return (
    <GalleryPageStyle>
      {matches ? (
        <>
          {showLeft && (
            <GalleryMenuBox>
              <div className="mask" onClick={() => setshowLeft(false)} />
              <GalleryFilterMenu
                sm={matches}
                selectAttrs={selectAttrs}
                attrGroups={attrGroups}
                serialKeyword={keyword}
                onChangeSerialKeyword={(v) => setKeyword(v)}
                onSelectValue={onSelectValue}
                handleClose={() => setshowLeft(false)}
              />
            </GalleryMenuBox>
          )}
        </>
      ) : (
        <GalleryFilterMenu
          sm={matches}
          selectAttrs={selectAttrs}
          attrGroups={attrGroups}
          serialKeyword={keyword}
          onChangeSerialKeyword={(v) => setKeyword(v)}
          onSelectValue={onSelectValue}
        />
      )}

      <GalleryRight>
        <GalleryContent>
          <FilterHead>
            <span className="title">{t("gallery.filters")}</span>
            <span className="num">{keyword ? 1 : selectAttrs.length}</span>
            <FilterTags>
              <ul className="tag-container">
                {keyword ? (
                  <Tag onClick={() => setKeyword("")}>
                    <span>{t("gallery.serialTag", { keyword })}</span>
                    <CloseIcon fontSize="small" />
                  </Tag>
                ) : (
                  selectAttrs.map((item, idx) => (
                    <Tag key={idx} onClick={() => removeAttr(item)}>
                      <span>
                        {item.name}:{item.value}
                      </span>
                      <CloseIcon fontSize="small" />
                    </Tag>
                  ))
                )}
              </ul>
            </FilterTags>
            <FilterHeadRight>
              <span className="result">123</span>
              <RefreshSvg className="refresh" />
              {matches && <FilterSvg onClick={() => setshowLeft(true)} />}
            </FilterHeadRight>
          </FilterHead>
          {list.length > 0 ? (
            <NFTList container spacing={3} style={{ width: "100%" }}>
              {list.map((item, idx) => (
                <NFTCard
                  key={idx}
                  data={item}
                  onClick={() => setShowSeed(item)}
                />
              ))}
            </NFTList>
          ) : (
            <EmptyBox>
              <p>{t("gallery.emptyResult")}</p>
              <ClearButton>{t("gallery.clearFilters")}</ClearButton>
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

const GalleryPageStyle = styled(CenterBox)`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
`;

const GalleryRight = styled(Box)`
  flex: 1;
  overflow-x: auto;
`;

const GalleryContent = styled.div`
  width: 100%;
  height: calc(100vh - 102px);
  padding-left: 45px;
  padding-top: 45px;
  box-sizing: border-box;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
    display: none;
  }
  @media (max-width: 960px) {
    padding: 40px 30px 0;
  }
`;

const NFTList = styled(Grid)``;

const FilterTags = styled.div`
  flex: 1;
  overflow-x: auto;
  .tag-container {
    width: 100%;
    overflow-x: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    &::-webkit-scrollbar {
      display: none;
    }
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

const FilterHead = styled.div`
  width: 100%;
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
  }
  .refresh {
    margin-left: 34px;
    margin-right: 28px;
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
  cursor: pointer;
  padding-inline: 10px;
  line-height: 44px;
`;

const GalleryMenuBox = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  right: 0;
  top: 0;
  z-index: 99;
  height: 100vh;
  width: 100vw;
  .mask {
    width: 100%;
    height: 100%;
    background-color: 000;
  }
`;
