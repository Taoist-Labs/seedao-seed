import styled from "@emotion/styled";
import { ATTR_ICON_MAP } from "utils/constant";

import SeedImg from "components/seedImg";
export default function SeedDisplay({ seed }: { seed: INFT }) {
  return (
    <SeedDetail>
      <SeedImgBox>
        <SeedImg src={seed.image} name={seed.name} isStatic key={seed.image} />
      </SeedImgBox>
      <SeedAttr>
        <div className="name">
          {seed.tokenId ? seed.tokenIdFormat : seed.name}
        </div>
        <ul>
          {seed.attrs.map((attr, idx) => (
            <li key={idx}>
              <img src={ATTR_ICON_MAP[attr.name]} alt="" />
              <div>
                <p className="name">{attr.name}</p>
                <p className="value">{attr.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </SeedAttr>
    </SeedDetail>
  );
}

const SeedDetail = styled.div`
  display: flex;
  gap: 14px;
`;

const SeedImgBox = styled.div`
  width: 240px;
  height: 240px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const SeedAttr = styled.div`
  width: 390px;
  .name {
    font-size: 18px;
    font-family: "Inter-Bold";
  }
  .not-name {
    color: #929191;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  li {
    width: 190px;
    min-height: 42px;
    border-radius: 8px;
    border: 1px solid #000;
    background: #fff;
    padding: 4px 9px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 7px;
    img {
      width: 24px;
    }
    .name {
      font-size: 12px;
      font-weight: 400;
      opacity: 0.5;
    }
    .value {
      font-size: 16px;
      font-family: "Inter-Semibold";
    }
  }
`;
