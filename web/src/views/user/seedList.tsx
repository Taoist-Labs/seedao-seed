import styled from "@emotion/styled";

interface IProps {
  list: INFT[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

export default function SeedList({ list, onSelect, selectedIdx }: IProps) {
  return (
    <RightBottomBox>
      <ul>
        {list.map((item, idx) => (
          <li
            onClick={() => onSelect(idx)}
            key={idx}
            className={idx === selectedIdx ? "select" : ""}
          >
            <img src={item.image} alt="" />
          </li>
        ))}
        {list.length < 6 &&
          new Array(6 - list.length)
            .fill(1, 0, 9 - list.length)
            .map((_, idx) => <li key={idx}></li>)}
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
      img {
        width: 100%;
      }
    }
  }
`;
