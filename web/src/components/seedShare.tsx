import styled from "@emotion/styled";
import LogoIcon from "assets/images/logo.png";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ATTR_ICON_MAP } from "utils/constant";

export default function SeedShare({
  seed,
  handleLoaded,
}: {
  seed: INFT;
  handleLoaded: () => void;
}) {
  const { t, i18n } = useTranslation();
  const token_suffix = useMemo(() => {
    if (i18n.language === "en") {
      const _id = Number(seed.tokenId);
      if (_id === 0) {
        return "st";
      } else if (_id === 1) {
        return "nd";
      } else if (_id === 2) {
        return "rd";
      } else {
        return "th";
      }
    } else {
      return "";
    }
  }, [i18n]);
  return (
    <SeedShareBox id="SEED">
      <img src={seed.image} alt="" className="nft" onLoad={handleLoaded} />
      <SeedContent>
        <div className="title">
          {seed.tokenId ? seed.tokenIdFormat : seed.name}
        </div>
        <div className="num">
          {t("user.minNum1")}
          <span>
            {" "}
            {Number(seed.tokenId) + 1} {token_suffix}{" "}
          </span>
          {t("user.minNum2")}
        </div>
        <AttrBox>
          {seed.attrs.map((attr, idx) => (
            <li key={idx}>
              <img src={ATTR_ICON_MAP[attr.name]} alt="" />
              <div>
                <p className="value">{attr.value}</p>
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
  height: 1438px;
  background-color: #fbf5ef;
  display: flex;
  flex-direction: column;
  img.nft {
    width: 100%;
  }
`;

const SeedContent = styled.div`
  margin-top: 36px;
  flex: 1;
  .title {
    color: #040404;
    font-size: 40px;
    font-family: "Inter-Bold";
    text-align: center;
  }
  .num {
    font-size: 32px;
    line-height: 38px;
    margin-top: 19px;
    text-align: center;
    margin-bottom: 46px;
    span {
      font-family: "Inter-Bold";
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
      font-family: "Inter-Semibold";
    }
  }
`;

const LogoBottom = styled.div`
  border-top: 1px solid #c4c4c4;
  padding-top: 28px;
  padding-bottom: 26px;
  text-align: center;
  margin-top: 54px;
  margin-inline: 50px;
  img {
    width: 200px;
  }
`;
