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
import FilterSvg from "assets/images/filter.svg";
import RefreshSvg from "assets/images/refresh.svg";
import { CenterBox } from "style";
import AttrValuesData from "data/att_values.json";
import NFTsData from "data/nfts.json";
import BannerImg from "assets/images/home/banner.png";
import { ATTR_ICON_MAP } from "utils/constant";

type AttrValuesType = {
  [k: string]: {
    [k: string]: number;
  };
};

type AttrT = keyof typeof AttrValuesData;

const formatAttrValues = (): IAttrGroup[] => {
  const result: IAttrGroup[] = [];
  for (const key in AttrValuesData as AttrValuesType) {
    const element = AttrValuesData[key as AttrT];
    result.push({
      name: key,
      values: Object.keys(element),
      icon: ATTR_ICON_MAP[key] || "",
      valueNumbers: element,
    });
  }
  return result;
};

const attrGroups = formatAttrValues();
const AllNFTs = NFTsData.map((item) => ({ ...item, image: BannerImg } as INFT));

export default function GalleryPage() {
  const matches = useMediaQuery("(max-width:960px)");
  const { t } = useTranslation();
  const [showLeft, setshowLeft] = useState<boolean>(!matches);

  const [selectAttrs, setSelectAttrs] = useState<SelectAttr[]>([]);
  const [list, setList] = useState<INFT[]>(AllNFTs);
  const [showSeed, setShowSeed] = useState<INFT>();
  const [keyword, setKeyword] = useState<string>("");

  const handleFilter = () => {
    setList([
      ...AllNFTs.filter((item) => {
        return selectAttrs.every((attr) => {
          if (!attr.values.length) {
            return true;
          } else {
            return item.attrs.some((v) => attr.values.indexOf(v.value) > -1);
          }
        });
      }),
    ]);
  };

  const onSelectValue = (name: string, value: string, selected: boolean) => {
    console.log(name, value, selected);
    if (selected) {
      const f = selectAttrs.find((item) => item.name === name);
      if (!f) {
        setSelectAttrs([
          ...selectAttrs,
          {
            name,
            values: [value],
          },
        ]);
        return;
      } else {
        const _select_lst: SelectAttr[] = [];
        selectAttrs.forEach((item) => {
          _select_lst.push({
            ...item,
            values: item.name === name ? [...item.values, value] : item.values,
          });
        });
        setSelectAttrs(_select_lst);
      }
    } else {
      const _select_lst: SelectAttr[] = [];
      selectAttrs.forEach((item) => {
        if (item.name === name) {
          _select_lst.push({
            ...item,
            values: item.values.filter((v) => v !== value),
          });
        } else {
          _select_lst.push({ ...item });
        }
      });
      setSelectAttrs(_select_lst);
    }
  };

  const removeAttr = (name: string, value: string) => {
    const _select_lst: SelectAttr[] = [];
    selectAttrs.forEach((item) => {
      if (item.name === name) {
        _select_lst.push({
          ...item,
          values: item.values.filter((v) => v !== value),
        });
      } else {
        _select_lst.push({ ...item });
      }
    });
    setSelectAttrs(_select_lst);
  };

  useEffect(() => {
    handleFilter();
  }, [selectAttrs]);

  useEffect(() => {
    if (keyword) {
      const f = AllNFTs.find((item) => item.tokenId === keyword);
      if (f) {
        setList([{ ...f }]);
      } else {
        setList([]);
      }
    } else {
      handleFilter();
    }
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
                    <CloseIcon fontSize="small" className="remove-tag" />
                  </Tag>
                ) : (
                  selectAttrs.map((item, idx) => {
                    return item.values.map((v, jdx) => (
                      <Tag
                        key={`${idx}_${jdx}`}
                        onClick={() => removeAttr(item.name, v)}
                      >
                        <span>
                          {item.name}:{v}
                        </span>
                        <CloseIcon fontSize="small" />
                      </Tag>
                    ));
                  })
                )}
              </ul>
            </FilterTags>
            <FilterHeadRight>
              <span className="result">{list.length}</span>
              <img src={RefreshSvg} className="refresh" />
              {matches && (
                <img
                  src={FilterSvg}
                  onClick={() => setshowLeft(true)}
                  className="filter-icon"
                />
              )}
            </FilterHeadRight>
          </FilterHead>
          {list.length > 0 ? (
            <NFTList
              container
              spacing={matches ? "10px" : 3}
              style={{ width: "100%" }}
              className="nft-container"
            >
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
  @media (max-width: 412px) {
    padding: 20px 15px;
  }
`;

const NFTList = styled(Grid)`
  @media (max-width: 412px) {
    &.nft-container {
      margin: 0;
    }
  }
`;

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
  flex-shrink: 0;
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
  @media (max-width: 412px) {
    line-height: 18px;
    height: 18px;
    font-size: 12px;
    .remove-tag {
      font-size: 12px !important;
    }
  }
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
  @media (max-width: 412px) {
    margin-bottom: 15px;

    .title {
      font-size: 12px;
      line-height: 15px;
    }
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
    cursor: pointer;
  }
  @media (max-width: 412px) {
    .result {
      font-size: 13px;
    }
    .refresh {
      width: 15px;
      margin-left: 17px;
      margin-right: 14px;
    }
    .filter-icon {
      width: 14px;
    }
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
