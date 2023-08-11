import styled from "@emotion/styled";
import PurchaseIcon from "assets/images/home/purchase.svg";
import MintIcon from "assets/images/home/mint.svg";
import NFT_01 from "assets/images/home/nfts/1.png";
import NFT_02 from "assets/images/home/nfts/2.png";
import NFT_03 from "assets/images/home/nfts/3.png";
import NFT_04 from "assets/images/home/nfts/4.png";
import NFT_05 from "assets/images/home/nfts/5.png";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CenterBox } from "style";

const CardPart = () => {
  return (
    <CardPartStyle>
      <Title>How to Obtain an Seed NFT</Title>
      <CardsBox>
        <CardItem>
          <img src={PurchaseIcon} alt="" />
          <div className="title">Purchase</div>
          <div className="desc">Buy Seed tokens on OpenSea</div>
          <div>
            <span className="btn">Buy a Seed</span>
          </div>
        </CardItem>
        <CardItem>
          <img src={MintIcon} alt="" />
          <div className="title">PoW Mining</div>
          <div className="desc">
            Earn 50,000 points to unlock minting in SeeDAO.
          </div>
          <div>
            <span className="btn">View My Points</span>
          </div>
        </CardItem>
      </CardsBox>
    </CardPartStyle>
  );
};

const AvatarsBox = () => {
  return (
    <AvatarsBoxStyle>
      {[NFT_01, NFT_02, NFT_03, NFT_04, NFT_05, NFT_01].map((src, idx) => (
        <img src={src} alt="" key={idx} />
      ))}
    </AvatarsBoxStyle>
  );
};

const InfoBox = () => {
  return (
    <InfoBoxStyle>
      {[
        { name: "ITEMS", value: "5K" },
        { name: "VOLUME", value: "82K ETH" },
        { name: "ITEMS", value: "5K" },
        { name: "VOLUME", value: "82K ETH" },
        { name: "ITEMS", value: "5K" },
      ].map((item, idx) => (
        <li key={idx}>
          <div className="value">{item.value}</div>
          <div className="name">{item.name}</div>
        </li>
      ))}
    </InfoBoxStyle>
  );
};

export default function How2() {
  const matches = useMediaQuery("(max-width:960px)");

  return matches ? (
    <How2Style>
      <AvatarsBox />
      <InfoBox />
      <CardPart />
    </How2Style>
  ) : (
    <How2Style>
      <CardPart />
      <AvatarsBox />
      <InfoBox />
    </How2Style>
  );
}
const How2Style = styled(CenterBox)`
  padding: 80px 120px;
  @media (max-width: 960px) {
    padding: 60px 30px;
  }
`;

const CardPartStyle = styled.div``;

const Title = styled.div`
  text-align: center;
  font-family: DM Sans;
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 80px;
  @media (max-width: 750px) {
    font-size: 40px;
    margin-bottom: 64px;
  }
`;

const CardsBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 80px;
  @media (max-width: 960px) {
    flex-direction: column;
    gap: 48px;
    padding-inline: 40px;
  }
`;

const CardItem = styled.div`
  border-radius: 20px;
  background: #cbcaff;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6248cd;
  padding-top: 24px;
  padding-bottom: 40px;

  img {
    margin-bottom: 8px;
  }
  .btn {
    display: inline-block;
    border-radius: 8px;
    background: #fff;
    text-align: center;
    padding-inline: 16px;
    height: 44px;
    font-family: DM Sans;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: 44px;
    cursor: pointer;
  }
  .title {
    font-family: DM Sans;
    font-size: 32px;
    font-weight: 700;
    line-height: 28px;
  }
  .desc {
    text-align: center;
    font-family: Heiti SC;
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: 30px;
    margin-top: 24px;
    margin-bottom: 40px;
    width: 50%;
    @media (max-width: 960px) {
      width: 80%;
    }
  }
`;

const AvatarsBoxStyle = styled.div`
  font-size: 0;
  margin-top: 100px;
  margin-bottom: 80px;
  img {
    width: calc(100% / 6);
  }
  @media (max-width: 960px) {
    margin-top: 20px;
    margin-bottom: 56px;
    img {
      width: calc(100% / 3);
    }
  }
`;

const InfoBoxStyle = styled.ul`
  height: 104px;
  border-radius: 10px;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  gap: 20px;
  li {
    padding-inline: 20px;
    font-family: Inter;
    text-align: center;
    flex: 1;
    border-right: 1px solid #000;
    &:last-child {
      border-right: none;
    }
    .value {
      font-size: 22px;
      font-weight: 700;
    }
    .name {
      font-size: 14px;
      font-weight: 400;
      margin-top: 8px;
    }
    &.line {
      flex: unset;
      width: 1px;
      height: 50px;
      background-color: #000;
      padding: 0;
    }
  }
  @media (max-width: 960px) {
    margin-bottom: 56px;
    gap: 10px;
  }
  @media (max-width: 750px) {
    gap: 8px;
  }
  @media (max-width: 580px) {
    flex-wrap: wrap;
    height: unset;
    padding-block: 20px;
  }
`;
