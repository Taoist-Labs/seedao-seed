import styled from "@emotion/styled";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";
import { CenterBox } from "style";

export default function Banner({ color, bg }: { color: string; bg: string }) {
  const matches = useMediaQuery("(max-width:960px)");
  const { t } = useTranslation();
  return (
    <BannerStyle color={color} bg={bg}>
      <BannerContent>
        {matches && (
          <div className="img-box">
            <img src={bg} alt="" />
          </div>
        )}
        <div className="content">
          <BannerTitle>{t("home.bannerTitle")}</BannerTitle>
          <BannerText>
            <p>{t("home.bannerContent01")}</p>
            <p className="last">{t("home.bannerContent02")}</p>
          </BannerText>
          <BannerButtonGroup>
            <ViewButton
              onClick={() =>
                window.open(`${window.origin}/#/gallery`, "_blank")
              }
            >
              {t("home.galleryButton")}
            </ViewButton>
            <BuyButton
              onClick={() =>
                window.open(
                  "https://opensea.io/collection/seedaogenesis",
                  "_blank",
                )
              }
            >
              {t("home.buySeedButton")}
            </BuyButton>
          </BannerButtonGroup>
        </div>
      </BannerContent>
    </BannerStyle>
  );
}

const BannerStyle = styled.section<{ bg: string }>`
  height: calc(100vh - 90px);
  min-height: 664px;
  box-sizing: border-box;
  background: ${(props) => props.color};
  background-image: ${(props) => `url(${props.bg})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right bottom;
  @media (max-width: 960px) {
    padding: 0;
    background-image: unset;
    height: unset;
    padding-bottom: 40px;
  }
  @media (max-width: 414px) {
    min-height: unset;
  }
`;

const BannerContent = styled(CenterBox)`
  display: flex;
  flex-direction: column;
  gap: 36px;
  height: 100%;
  .img-box {
    width: 61%;
    img {
      width: 100%;
    }
  }
  padding-inline: 100px;
  justify-content: center;

  @media (max-width: 960px) {
    align-items: center;
    padding-inline: 80px;
  }
  @media (max-width: 750px) {
    padding-inline: 20px;
  }
  @media (max-width: 414px) {
    gap: 10px;
  }
`;

const BannerTitle = styled.div`
  font-size: 56px;
  font-family: "Inter-Black";
  line-height: 80px;
  @media (max-width: 960px) {
    font-size: 48px;
    line-height: 66px;
    text-align: center;
  }
  @media (max-width: 414px) {
    font-size: 24px;
  }
`;

const BannerText = styled.div`
  width: 45%;
  margin-top: 40px;
  margin-bottom: 50px;
  p {
    font-family: Inter;
    font-size: 20px;
    &.last {
      margin-top: 20px;
    }
  }

  @media (max-width: 960px) {
    width: unset;
    text-align: center;
  }
  @media (max-width: 750px) {
    display: none;
  }
`;

const BannerButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 960px) {
    justify-content: center;
  }
  @media (max-width: 750px) {
    margin-top: 28px;
  }

  @media (max-width: 414px) {
    gap: 10px;
    margin-top: 14px;
  }
`;

const Button = styled.div`
  width: 160px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  font-size: 20px;
  font-style: normal;
  font-family: "Inter-Bold";
  @media (max-width: 414px) {
    font-size: 12px;
    height: 28px;
    line-height: 28px;
  }
`;

const ViewButton = styled(Button)`
  background: #ffffff;
`;

const BuyButton = styled(Button)`
  background: #c3f237;
`;
