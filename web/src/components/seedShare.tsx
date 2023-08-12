import styled from "@emotion/styled";
import BannerImg from "assets/images/home/banner.png";
import LogoIcon from "assets/images/logo.png";
import { GALLERY_ATTRS } from "data/gallery";

export default function SeedShare() {
  return (
    <SeedShareBox id="SEED">
      <img src={BannerImg} alt="" className="nft" />
      <SeedContent>
        <div className="title">SEED NO. 2879</div>
        <div className="num">
          第 <span>524</span> 位 SEED NFT 铸造者
        </div>
        <AttrBox>
          {GALLERY_ATTRS.map((attr, idx) => (
            <li key={idx}>
              <img src={attr.icon} alt="" />
              <div>
                <p className="value">TextText</p>
              </div>
            </li>
          ))}
        </AttrBox>
      </SeedContent>
      <LogoBottom>
        <img src={LogoIcon} alt="" />
      </LogoBottom>
    </SeedShareBox>
  );
}

const SeedShareBox = styled.div`
  width: 750px;
  background-color: #fbf5ef;
  img.nft {
    width: 100%;
  }
`;

const SeedContent = styled.div`
  margin-top: 36px;
  .title {
    color: #040404;
    font-size: 40px;
    font-weight: 700;
    text-align: center;
  }
  .num {
    font-size: 32px;
    line-height: 38px;
    margin-top: 19px;
    text-align: center;
    margin-bottom: 46px;
    span {
      font-weight: 700;
    }
  }
`;

const AttrBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-inline: 50px;
  li {
    width: calc(50% - 22px);
    border-radius: 8px;
    border: 1px solid #d8d8d8;
    background: #fff;

    box-sizing: border-box;
    margin-inline: 11px;
    margin-bottom: 14px;
    padding: 8px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 64px;
    img {
      width: 34px;
    }
    .value {
      font-size: 22px;
      font-weight: 600;
    }
  }
`;

const LogoBottom = styled.div`
  border-top: 1px solid #c4c4c4;
  padding-top: 28px;
  padding-bottom: 26px;
  text-align: center;
  margin-top: 54px;
  img {
    width: 200px;
  }
`;
