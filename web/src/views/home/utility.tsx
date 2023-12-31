import styled from "@emotion/styled";
import IconAvatar from "assets/images/home/avatar.svg";
import IconGovernance from "assets/images/home/governance.svg";
import IconIncubation from "assets/images/home/incubation.svg";
import IconRewards from "assets/images/home/rewards.svg";
import IconStar from "assets/images/home/star.svg";
import { useTranslation } from "react-i18next";
import { CenterBox } from "style";

const UTILITIES = [
  {
    img: IconAvatar,
    title: "home.avatar",
    text: "home.avatarDesc",
  },
  {
    img: IconGovernance,
    title: "home.governance",
    text: "home.governanceDesc",
    link: "https://seedao.notion.site/SeeDAO-SIP-2-a4720f18c068455785a7a9ee5fd626ee",
  },
  {
    img: IconIncubation,
    title: "home.incubation",
    text: "home.incubationDesc",
    link: "https://seedao.notion.site/SeeDAO-9d43e99fd34940f39f66187d11309e45",
  },
  {
    img: IconRewards,
    title: "home.rewards",
    text: "home.rewardsDesc",
  },
];

export default function Utility() {
  const { t } = useTranslation();
  return (
    <UtilitytStyle className="center">
      <UtilityTitle>{t("home.seedUtility")}</UtilityTitle>
      <Box>
        {UTILITIES.map((item, i) => (
          <li key={i}>
            <div className="icon">
              <img src={item.img} alt="" />
            </div>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <span className="title">{t(item.title)}</span>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <div className="text">{t(item.text)}</div>
            {item.link && (
              <a
                className="more"
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
                {t("home.leanMore")}
              </a>
            )}
          </li>
        ))}
      </Box>
      <JoinButton
        href="https://deschool.app/origin/series/62f0adc68b90ee1aa913a965/learning?courseId=62f0adc68b90ee1aa913a966"
        target="_blank"
        rel="noreferrer"
      >
        <img src={IconStar} alt="" />
        <span>{t("home.joinSeeDAO")}</span>
      </JoinButton>
    </UtilitytStyle>
  );
}

const UtilitytStyle = styled(CenterBox)`
  padding: 80px 120px;
  @media (max-width: 960px) {
    padding: 60px 40px;
  }
  @media (max-width: 414px) {
    padding: 40px 15px;
  }
`;

const UtilityTitle = styled.div`
  text-align: center;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-family: "Inter-Bold";
  line-height: 50px;
  margin-bottom: 80px;
  @media (max-width: 414px) {
    font-size: 20px;
    margin-bottom: 32px;
  }
`;

const Box = styled.ul`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  li {
    width: calc((100% - 144px) / 4);
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon {
      text-align: center;
      img {
        width: 140px;
        height: 140px;
      }
    }

    .title {
      text-align: center;
      font-size: 32px;
      font-style: normal;
      font-family: "Inter-Bold";
      line-height: 34px;
      margin-block: 34px;
    }
    .more {
      color: #9e9e9e;
      font-size: 18px;
      font-style: normal;
      font-family: "Inter-Bold";
      line-height: 25px;
      text-decoration-line: underline;
      margin-top: 40px;
      width: 100%;
      text-align: left;
    }
    .text {
      font-size: 18px;
    }
    @media (max-width: 960px) {
      width: calc((100% - 40px) / 2);
      align-items: stretch;
      margin-bottom: 50px;
    }
    @media (max-width: 414px) {
      .icon img {
        width: 60px;
      }
      width: calc((100% - 40px) / 2);
      align-items: stretch;
      margin-bottom: 32px;
      .title {
        font-size: 16px;
        margin-block: 12px;
      }
      .more,
      .text {
        font-size: 12px;
        text-align: center;
      }
      .more {
        margin-top: 20px;
      }
    }
  }
`;

const JoinButton = styled.a`
  display: inline-block;
  width: 340px;
  height: 54px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  font-size: 20px;
  font-style: normal;
  font-family: "Inter-Bold";
  line-height: 54px;
  text-align: center;
  background-color: #c3f237;
  cursor: pointer;
  margin: 80px auto;
  margin-bottom: 0;
  color: #000;
  text-decoration: none;
  @media (max-width: 960px) {
    width: 80%;
    margin-top: 0;
    img {
      display: none;
    }
  }
  @media (max-width: 414px) {
    height: 28px;
    line-height: 28px;
    font-size: 12px;
  }
`;
