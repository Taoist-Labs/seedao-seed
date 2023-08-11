import styled from "@emotion/styled";
import { useState } from "react";

export default function SeedList() {
  const [selectId, setSelectId] = useState(0);
  return (
    <RightBottomBox>
      <ul>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <li
            onClick={() => setSelectId(item)}
            key={item}
            className={item === selectId ? "select" : ""}
          ></li>
        ))}
      </ul>
    </RightBottomBox>
  );
}

const RightBottomBox = styled.div`
  margin-top: 20px;
  width: 200px;
  height: 200px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      list-style: none;
      width: 60px;
      height: 60px;
      background: #cecdf6;
      box-sizing: border-box;
      margin-right: 10px;
      margin-top: 10px;
      &:nth-of-type(3n) {
        margin-right: 0;
      }
      &.select {
        border: 2px solid #000;
      }
    }
  }
`;
