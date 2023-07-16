import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface IProps {
  id: number;
  name: string;
  values: string[];
  selected: string[];
  onSelectValue: (id: number, value: string, selected: boolean) => void;
}

type AttrItem = {
  value: string;
  isSelected: boolean;
};

export default function FilterAttrItem({
  id,
  name,
  values,
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
        <Typography variant="h6" component="h6">
          {name}
        </Typography>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </FilterAttrName>
      {isOpen && (
        <>
          <InputWrapper>
            <SearchIcon />
            <input
              type="text"
              placeholder="search"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </InputWrapper>
          <FilterAttrValues>
            <FormGroup>
              {attrList.map((item, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  checked={item.isSelected}
                  onChange={(_, checked) =>
                    onSelectValue(id, item.value, checked)
                  }
                  label={item.value}
                />
              ))}
            </FormGroup>
          </FilterAttrValues>
          <Divider />
        </>
      )}
    </FilterAttrItemStyle>
  );
}

const FilterAttrItemStyle = styled.div`
  padding-inline: 10px;
`;

const FilterAttrName = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding-block: 10px;
`;

const FilterAttrValues = styled.ul`
  max-height: 200px;
  overflow-y: auto;
  margin-block: 10px;

  li {
    display: flex;
    align-items: center;
  }
`;

const InputWrapper = styled.div`
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-inline: 10px;
  input {
    border: none;
    outline: none;
    height: 100%;
    line-height: 40px;
    padding: 0;
    background-color: transparent;
  }
`;
