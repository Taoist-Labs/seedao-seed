import { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import NFTCard from "./nft";
import Grid from "@mui/system/Unstable_Grid/Grid";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import SeedModal from "components/modals/seedModal";
import { useTranslation } from "react-i18next";
import useMediaQuery from "@mui/material/useMediaQuery";

import GalleryFilterMenu, { SelectAttr } from "./filterMenu";
import FilterSvg from "assets/images/filter.svg";
import RefreshSvg from "assets/images/refresh.svg";
import Header from "components/layout/header";
import { handleNfts } from "utils/handler";
import { AppActionType, useAppContext } from "providers/appProvider";

const PageSize = 48;

export default function GalleryPage() {
  const matches = useMediaQuery("(max-width:960px)");
  const { t } = useTranslation();
  const {
    state: { nft_res },
    dispatch,
  } = useAppContext();
  const [showLeft, setshowLeft] = useState<boolean>(!matches);

  const [selectAttrs, setSelectAttrs] = useState<SelectAttr[]>([]);
  const [list, setList] = useState<INFT[]>([]);
  const [displayList, setDisplayList] = useState<INFT[]>([]);
  const [page, setPage] = useState<number>(0);
  const [showSeed, setShowSeed] = useState<INFT>();
  const [keyword, setKeyword] = useState<string>("");

  const [attrGroups, setAttrGroups] = useState<IAttrGroup[]>([]);
  const [AllNFTs, setAllNFTs] = useState<INFT[]>([]);

  useEffect(() => {
    if (nft_res.length) {
      const { attrGroups: grps, nfts } = handleNfts(nft_res);
      setAllNFTs(nfts);
      setAttrGroups(grps);
      setList(nfts);
    } else {
      const getNfts = () => {
        dispatch({ type: AppActionType.SET_LOADING, payload: true });
        fetch(`${process.env.REACT_APP_STATIC_HOST}/nfts.json`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("res", res);
            dispatch({ type: AppActionType.SET_NFT_RES, payload: res });
          })
          .finally(() => {
            dispatch({ type: AppActionType.SET_LOADING, payload: false });
          });
      };
      getNfts();
    }
  }, [nft_res]);

  const randomList = (arr: INFT[]) => {
    const _list = [...arr.sort(() => Math.random() - 0.5)];
    setList(_list);
    setPage(0);
    handleDisplayList(0, _list);
  };

  const handleFilter = () => {
    randomList(
      AllNFTs.filter((item) => {
        return selectAttrs.every((attr) => {
          if (!attr.values.length) {
            return true;
          } else {
            return item.attrs.some((v) => attr.values.indexOf(v.value) > -1);
          }
        });
      }),
    );
  };

  const onSelectValue = (name: string, values: string[], selected: boolean) => {
    if (selected) {
      const f = selectAttrs.find((item) => item.name === name);
      if (!f) {
        setSelectAttrs([
          ...selectAttrs,
          {
            name,
            values: [...values],
          },
        ]);
        return;
      } else {
        const _select_lst: SelectAttr[] = [];
        selectAttrs.forEach((item) => {
          _select_lst.push({
            ...item,
            values:
              item.name === name
                ? Array.from(new Set([...item.values, ...values]))
                : item.values,
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
            values: item.values.filter((v) => !values.includes(v)),
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
        setPage(0);
        handleDisplayList(0, [{ ...f }]);
      } else {
        setList([]);
        setPage(0);
        handleDisplayList(0, []);
      }
    } else {
      handleFilter();
    }
  }, [keyword, AllNFTs]);

  const filterNums = useMemo(() => {
    if (keyword) {
      return 1;
    }
    let count = 0;
    selectAttrs.forEach((item) => {
      count += item.values.length;
    });
    return count;
  }, [selectAttrs, keyword]);
  const removeFilters = () => {
    setSelectAttrs([]);
    setKeyword("");
  };

  const handleDisplayList = (_page: number, _list: INFT[]) => {
    const start = _page * PageSize;
    const end = start + PageSize;
    if (start === 0) {
      setDisplayList([..._list.slice(start, end)]);
    } else {
      const more_list = _list.slice(start, end);
      if (more_list.length) {
        setDisplayList([...displayList, ..._list.slice(start, end)]);
      } else {
        setPage(_page - 1);
      }
    }
  };

  const handleScroll = () => {
    const dom = document.getElementById("scroll");
    const scrollHeight = dom?.scrollHeight || 0;
    const scrollTop = dom?.scrollTop || 0;
    const clientHeight = dom?.clientHeight || 0;
    if (clientHeight + scrollTop + 10 >= scrollHeight) {
      setPage(page + 1);
      handleDisplayList(page + 1, list);
    }
  };

  return (
    <>
      <Header />
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
          <GalleryContent onScroll={handleScroll} id="scroll">
            <FilterHead>
              <span className="title">{t("gallery.filters")}</span>
              <span className="num">{filterNums}</span>
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
                <img
                  src={RefreshSvg}
                  className="refresh"
                  onClick={() => randomList(list)}
                />
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
              // <ScrollBox>
              <NFTList
                container
                spacing={matches ? "10px" : 3}
                style={{ width: "100%" }}
                className="nft-container"
              >
                {displayList.map((item, idx) => (
                  <NFTCard
                    // key={`${idx}_${Math.random()}`}
                    key={idx}
                    data={item}
                    onClick={() => setShowSeed(item)}
                  />
                ))}
              </NFTList>
            ) : (
              // </ScrollBox>
              <EmptyBox>
                <p>{t("gallery.emptyResult")}</p>
                <ClearButton onClick={removeFilters}>
                  {t("gallery.clearFilters")}
                </ClearButton>
              </EmptyBox>
            )}
          </GalleryContent>
        </GalleryRight>
        {showSeed && (
          <SeedModal
            seed={showSeed}
            handleClose={() => setShowSeed(undefined)}
          />
        )}
      </GalleryPageStyle>
    </>
  );
}

const GalleryPageStyle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
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
  @media (max-width: 414px) {
    padding: 20px 15px;
  }
`;

const NFTList = styled(Grid)`
  @media (max-width: 414px) {
    &.nft-container {
      margin: 0;
    }
  }
`;

const FilterTags = styled.div`
  flex: 1;
  overflow-x: auto;
  .tag-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  &::-webkit-scrollbar {
    display: none;
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
  @media (max-width: 414px) {
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
    font-family: "Inter-Bold";
    font-size: 14px;
  }
  @media (max-width: 414px) {
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
    font-family: "Inter-Bold";
  }
  .refresh {
    margin-left: 34px;
    margin-right: 28px;
    cursor: pointer;
  }
  @media (max-width: 414px) {
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
  text-align: center;
  font-size: 20px;
  @media (max-width: 414px) {
    font-size: 14px;
  }
`;

const ClearButton = styled.span`
  border-radius: 8px;
  background: #c3f237;
  margin-top: 36px;
  cursor: pointer;
  padding: 10px;
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
