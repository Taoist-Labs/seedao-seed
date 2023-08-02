import styled from "@emotion/styled";
import BannerBg from "assets/images/home/banner.png";

export default function Banner() {
  return (
    <BannerStyle>
      <BannerContent>
        <BannerTitle>Seed Now, See the DAO</BannerTitle>
        <BannerText>
          <p>
            The Seed NFT acts as your digital ID in SeeDAO, establishing your
            eligibility to attain governance rights within the Network Polis.
          </p>
          <p>
            The Seed NFT is your personal imprint on our shared SeeDAO journey,
            capturing your transformation from Web3 novice to builder.
          </p>
        </BannerText>
        <BannerButtonGroup>
          <ViewButton
            onClick={() => window.open(`${window.origin}/gallery`, "_blank")}
          >
            View Gallery
          </ViewButton>
          <BuyButton
            onClick={() =>
              window.open(
                "https://opensea.io/collection/seedaogenesis",
                "_blank",
              )
            }
          >
            Buy A Seed
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
  background: #f9d9fb;
  background-image: url(${BannerBg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: right bottom;
`;

const BannerContent = styled.div`
  padding-inline: 24px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const BannerTitle = styled.div`
  font-size: 56px;
  font-weight: 700;
  line-height: 80px;
`;

const BannerText = styled.div`
  width: 50%;
  p {
    font-family: Inter;
    font-size: 20px;
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
