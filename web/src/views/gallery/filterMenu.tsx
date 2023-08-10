import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import FilterAttrItem from "./filterAttrItem";

export interface IAttrGroup {
  name: string;
  values: string[];
  icon: string;
}

export type SelectAttr = {
  name: string;
  value: string;
  id: number;
};

interface IProps {
  attrGroups: IAttrGroup[];
  selectAttrs: SelectAttr[];
  serialKeyword: string;
  onChangeSerialKeyword: (value: string) => void;
  onSelectValue: (
    id: number,
    name: string,
    value: string,
    selected: boolean,
  ) => void;
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
        FILTER
        {sm && <CloseButton onClick={handleClose} fontSize="large" />}
      </LeftTitle>
      <div className="container">
        <InputWrapper>
          <SearchIcon />
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
              selected={selectAttrs
                .filter((item) => item.id === index)
                .map((item) => item.value)}
              onSelectValue={(id, value, selected) =>
                onSelectValue(id, group.name, value, selected)
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
  width: 680px;
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
