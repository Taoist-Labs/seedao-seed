import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FilterAttrItem from "./filterAttrItem";

export type SelectAttr = {
  name: string;
  values: string[];
};

interface IProps {
  attrGroups: IAttrGroup[];
  selectAttrs: SelectAttr[];
  serialKeyword: string;
  onChangeSerialKeyword: (value: string) => void;
  onSelectValue: (name: string, value: string, selected: boolean) => void;
  sm: boolean;
  handleClose?: () => void;
}

export default function GalleryFilterMenu({
  attrGroups,
  selectAttrs,
  serialKeyword,
  onChangeSerialKeyword,
  onSelectValue,
  sm,
  handleClose,
}: IProps) {
  const { t } = useTranslation();
  return (
    <GalleryLeft sm={sm}>
      <LeftTitle>
        {t("gallery.filter")}
        {sm && (
          <CloseButton
            onClick={handleClose}
            fontSize="small"
            className="close"
          />
        )}
      </LeftTitle>
      <div className="container">
        <InputWrapper>
          <SearchIcon className="search-icon" />
          <input
            value={serialKeyword}
            type="text"
            placeholder={t("gallery.serialPlaceHolder")}
            onChange={(e) => onChangeSerialKeyword(e.target.value)}
          />
        </InputWrapper>
        <FilterColumn hide={!!serialKeyword}>
          {attrGroups.map((group, index) => (
            <FilterAttrItem
              key={index}
              id={index}
              name={group.name}
              icon={group.icon}
              values={group.values}
              valueNumbers={group.valueNumbers}
              selected={
                selectAttrs.find((item) => item.name === group.name)?.values ||
                []
              }
              onSelectValue={(value, selected) =>
                onSelectValue(group.name, value, selected)
              }
            />
          ))}
        </FilterColumn>
      </div>
    </GalleryLeft>
  );
}

const SmLeftStyle = css`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 340px;
  max-width: 100%;
  animation-name: slide;
  animation-duration: 0.4s;

  @keyframes slide {
    from {
      right: -680px;
    }
    to {
      right: 0;
    }
  }
`;

const GalleryLeft = styled.div<{ sm: boolean }>`
  width: 340px;
  height: calc(100vh - 102px);
  overflow-y: auto;
  padding-inline: 30px;
  padding-top: 49px;
  box-shadow: 2px 0px 8px 2px rgba(0, 0, 0, 0.1);
  background-color: #fbf5ef;
  box-sizing: border-box;
  ${(props) => props.sm && SmLeftStyle}
  display: flex;
  flex-direction: column;
  .container {
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  @media (max-width: 414px) {
    padding: 20px 15px;
  } ;
`;

const LeftTitle = styled.div`
  font-size: 40px;
  font-style: normal;
  font-family: "Inter-Bold";
  line-height: 64px;
  .close {
    top: 20px;
  }
  @media (max-width: 414px) {
    font-size: 15px;
  }
`;

const InputWrapper = styled.div`
  border: 1px solid #bbb;
  border-radius: 8px;
  height: 36px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-inline: 10px;
  margin-block: 20px;
  box-sizing: border-box;
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

const FilterColumn = styled.div<{ hide: boolean }>`
  opacity: ${(props) => (props.hide ? 0.2 : 1)};
  cursor: ${(props) => (props.hide ? "not-allowed" : "pointer")};
`;

const CloseButton = styled(CloseIcon)`
  float: right;
  position: relative;
  top: 15px;
  cursor: pointer;
`;
