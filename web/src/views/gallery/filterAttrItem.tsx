import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Divider from "@mui/material/Divider";
import Checkbox from "components/common/checkbox";

interface IProps {
  id: number;
  name: string;
  values: string[];
  valueNumbers: { [key: string]: number };
  selected: string[];
  icon: string;
  onSelectValue: (value: string, selected: boolean) => void;
}

type AttrItem = {
  value: string;
  isSelected: boolean;
};

export default function FilterAttrItem({
  name,
  icon,
  values,
  valueNumbers,
  selected,
  onSelectValue,
}: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [attrList, setAttrList] = useState<AttrItem[]>([]);
  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    const lst: AttrItem[] = [];
    values.forEach((value) => {
      const _key = keyword.toLowerCase();
      const _val = value.toLowerCase();
      if (!_key || _val.includes(_key)) {
        lst.push({
          value,
          isSelected: !!selected.find((v) => v === value),
        });
      }
    });
    setAttrList(lst);
  }, [values, selected, keyword]);
  return (
    <FilterAttrItemStyle>
      <FilterAttrName onClick={() => setIsOpen(!isOpen)}>
        <div className="left">
          <img src={icon} alt="" />
          {name}
        </div>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </FilterAttrName>
      {isOpen && (
        <>
          <InputWrapper>
            <input
              type="text"
              placeholder="search"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </InputWrapper>
          <FilterAttrValues>
            {attrList.map((item, index) => (
              <li key={index}>
                <Checkbox
                  checked={item.isSelected}
                  onChange={(checked) => onSelectValue(item.value, checked)}
                >
                  <span className="text">{item.value}</span>
                  <span className="num">({valueNumbers[item.value]})</span>
                </Checkbox>
              </li>
            ))}
          </FilterAttrValues>
          <Divider />
        </>
      )}
    </FilterAttrItemStyle>
  );
}

const FilterAttrItemStyle = styled.div`
  /* padding-inline: 10px; */
`;

const FilterAttrName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding-block: 10px;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  .left {
    display: flex;
    align-items: center;
    gap: 4px;
    img {
      width: 30px;
    }
    @media (max-width: 412px) {
      img {
        width: 25px;
      }
      font-size: 20px;
    }
  }
`;

const FilterAttrValues = styled.ul`
  max-height: 200px;
  overflow-y: auto;
  margin-block: 18px;

  li {
    margin-top: 20px;
    &:first-of-type {
      margin-top: 0;
    }
    .text {
      font-size: 20px;
    }
    .num {
      color: #b5b5b5;
      font-size: 16px;
      font-weight: 400;
    }
    @media (max-width: 412px) {
      .text {
        font-size: 18px;
      }
      .num {
        font-size: 12px;
      }
    }
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
