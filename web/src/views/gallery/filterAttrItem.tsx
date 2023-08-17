import { useEffect, useState } from "react";
import styled from "@emotion/styled";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Divider from "@mui/material/Divider";
import Checkbox from "components/common/checkbox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type ValueType = {
  name: string;
  values: string[];
};

interface IProps {
  id: number;
  name: string;
  values: ValueType[];
  valueNumbers: { [key: string]: number };
  selected: string[];
  icon: string;
  onSelectValue: (values: string[], selected: boolean) => void;
}

type AttrItem = {
  value: string;
  children: AttrItem[];
  isSelected: boolean;
  isExpand?: boolean;
};

const SubFilterAttrItem = ({
  list,
  valueNumbers,
  onSelectValue,
}: {
  list: AttrItem[];
  valueNumbers: { [key: string]: number };
  onSelectValue: (value: string, selected: boolean) => void;
}) => {
  return (
    <SubFilterStyle>
      {list.map((item, index) => (
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
    </SubFilterStyle>
  );
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
  const [expandMap, setExpandMap] = useState<{ [k: number]: boolean }>({});

  const checkOutSelected = (value: string, children: AttrItem[]) => {
    return (
      !!selected.find((v) => v === value) ||
      (!!children.length &&
        children.every((sitem) => selected.find((v) => v === sitem.value)))
    );
  };

  useEffect(() => {
    const lst: AttrItem[] = [];
    values.forEach((item) => {
      const _key = keyword.toLowerCase();
      const _val = item.name.toLowerCase();
      if (!_key || _val.includes(_key)) {
        const children = item.values.map((subItem) => ({
          value: subItem,
          isSelected: !!selected.find((v) => v === subItem),
          children: [],
        }));
        lst.push({
          value: item.name,
          isSelected: checkOutSelected(item.name, children),
          children,
        });
      }
    });
    setAttrList(lst);
  }, [values, selected, keyword]);

  const handleSelect = (item: AttrItem, checked: boolean) => {
    if (item.children.length) {
      onSelectValue([...item.children.map((c) => c.value)], checked);
    } else {
      onSelectValue([item.value], checked);
    }
  };

  const handleSubSelect = (subValue: string, checked: boolean) => {
    onSelectValue([subValue], checked);
  };
  return (
    <FilterAttrItemStyle>
      <FilterAttrName onClick={() => setIsOpen(!isOpen)}>
        <div className="left">
          <img src={icon} alt="" />
          {name}
        </div>
        {isOpen ? <RemoveIcon /> : <AddIcon />}
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
                  onChange={(checked) => handleSelect(item, checked)}
                >
                  <div>
                    <div
                      className="out-box"
                      onClick={() =>
                        setExpandMap({
                          ...expandMap,
                          [index]: !expandMap[index],
                        })
                      }
                    >
                      <span className="text">{item.value}</span>
                      <span className="num snum">
                        ({valueNumbers[item.value]})
                      </span>
                      {!!item.children.length && (
                        <>
                          {expandMap[index] ? (
                            <ExpandLessIcon className="icon" />
                          ) : (
                            <ExpandMoreIcon className="icon" />
                          )}
                        </>
                      )}
                    </div>

                    {!!item.children.length && (
                      <>
                        {expandMap[index] && (
                          <SubFilterAttrItem
                            list={item.children}
                            valueNumbers={valueNumbers}
                            onSelectValue={handleSubSelect}
                          />
                        )}
                      </>
                    )}
                  </div>
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
  font-family: "Inter-Semibold";
  .left {
    display: flex;
    align-items: center;
    gap: 4px;
    img {
      width: 30px;
    }
    @media (max-width: 414px) {
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
    .snum {
      margin-left: 10px;
    }
    @media (max-width: 414px) {
      .text {
        font-size: 18px;
      }
      .num {
        font-size: 12px;
      }
    }
  }
  .out-box {
    display: flex;
    .icon {
      margin-left: 10px;
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

const SubFilterStyle = styled.ul`
  margin-top: 15px;
`;
