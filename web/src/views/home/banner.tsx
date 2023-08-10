import styled from "@emotion/styled";
import BannerBg from "assets/images/home/banner.png";
import BannerBg01 from "assets/images/home/banner1.jpeg";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "react-i18next";

export default function Banner({ color }: { color: string }) {
  const matches = useMediaQuery("(max-width:960px)");
  const { t } = useTranslation();
  return (
    <BannerStyle color={color}>
      <BannerContent>
        {matches && (
          <img src={color === "#F9D9FB" ? BannerBg : BannerBg01} alt="" />
        )}
        <BannerTitle>{t("home.bannerTitle")}</BannerTitle>
        <BannerText>
          <p>{t("home.bannerContent01")}</p>
          <p>{t("home.bannerContent02")}</p>
        </BannerText>
        <BannerButtonGroup>
          <ViewButton
            onClick={() => window.open(`${window.origin}/#/gallery`, "_blank")}
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
      </BannerContent>
    </BannerStyle>
  );
}

const BannerStyle = styled.section`
  height: calc(100vh - 102px);
  min-height: 664px;
  padding: 113px 0 0 80px;
  box-sizing: border-box;
  background: ${(props) => props.color};
  background-image: ${(props) =>
    props.color === "#F9D9FB" ? `url(${BannerBg})` : `url(${BannerBg01})`};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right bottom;
  @media (max-width: 960px) {
    padding: 0;
    background-image: unset;
    height: unset;
    padding-bottom: 40px;
  }
`;

const BannerContent = styled.div`
  padding-inline: 24px;
  display: flex;
  flex-direction: column;
  gap: 36px;

  img {
    width: 61%;
  }
  @media (max-width: 960px) {
    align-items: center;
  }
`;

const BannerTitle = styled.div`
  font-size: 56px;
  font-weight: 700;
  line-height: 80px;
  @media (max-width: 960px) {
    font-size: 48px;
    line-height: 66px;
  }
`;

const BannerText = styled.div`
  width: 50%;
  p {
    font-family: Inter;
    font-size: 20px;
  }
  @media (max-width: 960px) {
    width: unset;
  }
`;

const BannerButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.div`
  width: 160px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  font-feature-settings: "clig" off, "liga" off;
  font-family: DM Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
`;

const ViewButton = styled(Button)`
  background: #ffffff;
`;

const BuyButton = styled(Button)`
  background: #c3f237;
`;
