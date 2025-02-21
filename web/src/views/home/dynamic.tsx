import styled from "@emotion/styled";
import DynamicIcon01 from "assets/images/home/dynamic/dynamic_1.svg";
import DynamicIcon02 from "assets/images/home/dynamic/dynamic_2.svg";
import DynamicIcon03 from "assets/images/home/dynamic/dynamic_3.svg";
import DynamicIcon04 from "assets/images/home/dynamic/dynamic_4.svg";
import DynamicIcon05 from "assets/images/home/dynamic/dynamic_5.svg";

import RowDynamicIcon01 from "assets/images/home/dynamic/row_dynamic_1.svg";
import RowDynamicIcon02 from "assets/images/home/dynamic/row_dynamic_2.svg";
import RowDynamicIcon03 from "assets/images/home/dynamic/row_dynamic_3.svg";
import RowDynamicIcon04 from "assets/images/home/dynamic/row_dynamic_4.svg";
import RowDynamicIcon05 from "assets/images/home/dynamic/row_dynamic_5.svg";

import { useTranslation, Trans } from "react-i18next";
import { CenterBox } from "style";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAppContext, AppActionType } from "providers/appProvider";
import { useNavigate } from "react-router-dom";
import {useAccount} from "wagmi";

const DynamicNFTs = [
  {
    img: DynamicIcon01,
    rimg: RowDynamicIcon01,
    color: "#FF0000",
    levels: [
      {
        title: "L0",
        points: "0-5k",
      },
      {
        title: "L1",
        points: "5k-20k",
      },
    ],
  },
  {
    img: DynamicIcon02,
    rimg: RowDynamicIcon02,
    color: "#01B492",
    levels: [
      {
        title: "L2",
        points: "20k-100k",
      },
      {
        title: "L3",
        points: "100k-300k",
      },
    ],
  },
  {
    img: DynamicIcon03,
    rimg: RowDynamicIcon03,
    color: "#D4CBF3",
    levels: [
      {
        title: "L4",
        points: "300k-1m",
      },
      {
        title: "L5",
        points: "1m-3m",
      },
    ],
  },
  {
    img: DynamicIcon04,
    rimg: RowDynamicIcon04,
    color: "#FF0091",
    levels: [
      {
        title: "L6",
        points: "3m-10m",
      },
      {
        title: "L7",
        points: "10m-30m",
      },
    ],
  },
  {
    img: DynamicIcon05,
    rimg: RowDynamicIcon05,
    color: "#00B1FF",
    levels: [
      {
        title: "L8",
        points: "30m-100m",
      },
      {
        title: "L9",
        points: "100m",
      },
    ],
  },
];

export default function DynamicNFT({ color }: { color: string }) {
  const { t } = useTranslation();
  const matches = useMediaQuery("(max-width:680px)");
  const { address:account } = useAccount();
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  const openLevel = () => {
    if (account) {
      navigate("/my");
    } else {
      dispatch({
        type: AppActionType.SET_LOGIN_MODAL,
        payload: true,
      });
    }
  };
  return (
    <DynamicNFTStyle color={color}>
      <CenterBox>
        <Title>{t("home.dynamicTitle")}</Title>
        <Content>
          <p>{t("home.dynamicContent")}</p>
          <p className="second">
            <Trans
              i18nKey="home.dynamicPolaris"
              components={{ span: <span>Tai Chi Star colors</span> }}
            >
              {/* <span>Polaris star colors</span> for different points/Level: */}
            </Trans>
          </p>
        </Content>
        <NFTCard>
          {DynamicNFTs.map((item, i) => (
            <NFTCardItem key={i} color={item.color}>
              <div className="content">
                <p>
                  <span>{item.levels[0].title}</span> (
                  {t("home.points", { num: item.levels[0].points })})
                </p>
                <div className="line"></div>
                <p>
                  <span>{item.levels[1].title}</span>(
                  {t("home.points", { num: item.levels[1].points })})
                </p>
              </div>
              <div className={(matches ? "" : "clip-img ") + "img-box"}>
                <img src={matches ? item.rimg : item.img} alt="" />
              </div>
            </NFTCardItem>
          ))}
        </NFTCard>
        <ViewButton onClick={openLevel}>{t("home.viewLevel")}</ViewButton>
      </CenterBox>
    </DynamicNFTStyle>
  );
}

const DynamicNFTStyle = styled.section`
  padding: 80px 120px;
  background: ${(props) => props.color};
  @media (max-width: 960px) {
    padding: 60px 30px;
  }
  @media (max-width: 414px) {
    padding: 40px 15px;
  }
`;

const Title = styled.div`
  text-align: center;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-family: "Inter-Bold";
  line-height: 50px;
  margin-bottom: 40px;
  @media (max-width: 750px) {
    font-size: 40px;
  }
  @media (max-width: 414px) {
    font-size: 20px;
    margin-bottom: 32px;
  }
`;

const Content = styled.div`
  margin-bottom: 40px;
  p {
    font-family: Inter;
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: 30px;
  }
  p.second {
    margin-top: 20px;
    font-family: "Inter-Bold";
    span {
      color: #d9393b;
    }
  }
  @media (max-width: 414px) {
    p {
      font-size: 12px;
      line-height: 20px;
    }
    margin-bottom: 32px;
  }
`;

const NFTCard = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 18px;
  justify-content: space-between;
  @media (max-width: 680px) {
    flex-direction: column;
  }
`;

const NFTCardItem = styled.li`
  border-radius: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${(props) => props.color};
  position: relative;
  flex: 1;

  img {
    vertical-align: bottom;
    width: 100%;
  }
  .clip-img img {
    position: relative;
    bottom: -4px;
  }
  .content {
    padding: 15px;
  }
  .line {
    width: 100%;
    height: 1px;
    background: ${(props) => props.color};
    margin-block: 10px;
  }
  font-family: Inter;
  p span {
    font-size: 36px;
    font-family: "Inter-Bold";
  }

  @media (max-width: 680px) {
    .img-box {
      position: absolute;
      right: 0;
      height: 100%;
      img {
        position: absolute;
        right: 0;
        width: unset;
        height: 100%;
      }
    }
  }
  @media (max-width: 414px) {
    height: 68px;
    position: relative;
    .content {
      padding-block: 10px;
      flex: 1;
    }
    .line {
      margin-block: 4px;
    }
    p {
      font-size: 12px;
      span {
        font-size: 18px;
        margin-right: 4px;
      }
    }
  } ;
`;

const ViewButton = styled.div`
  width: 220px;
  height: 48px;
  line-height: 48px;
  border-radius: 8px;
  background: #fff;
  margin: 0 auto;
  margin-top: 64px;
  text-align: center;
  font-size: 20px;
  font-family: "Inter-Bold";
  cursor: pointer;
  @media (max-width: 960px) {
    width: 80%;
    height: 56px;
    line-height: 56px;
  }
  @media (max-width: 414px) {
    height: 28px;
    line-height: 28px;
    font-size: 12px;
    margin-top: 32px;
  }
`;
