import styled from "@emotion/styled";
import IconAvatar from "assets/images/home/avatar.svg";
import IconGovernance from "assets/images/home/governance.svg";
import IconIncubation from "assets/images/home/incubation.svg";
import IconRewards from "assets/images/home/rewards.svg";
import IconStar from "assets/images/home/star.svg";
import { CenterBox } from "style";

const UTILITIES = [
  {
    img: IconAvatar,
    title: "Avatar",
    text: "The Seed NFT serves as your avatar within the SeeDAO Network Polis, symbolising your membership. It provides a visual profile picture (PFP) and a reputation score, encapsulating your standing within the community.",
  },
  {
    img: IconGovernance,
    title: "Governance",
    text: "The Seed NFT is a prerequisite for participating in our Node Consensus Conference and obtaining internal governance rights within the community. It, along with reputation, points, and ranking, collectively determines a citizen's governance privileges within SeeDAO.",
    link: "https://seedao.notion.site/SeeDAO-SIP-2-a4720f18c068455785a7a9ee5fd626ee",
  },
  {
    img: IconIncubation,
    title: "Incubation",
    text: "Seed NFT holders is able to initiate new DAO proposals to receive financial support from the SeeDAO Community Fund.",
    link: "https://seedao.notion.site/SeeDAO-9d43e99fd34940f39f66187d11309e45",
  },
  {
    img: IconRewards,
    title: "Rewards",
    text: "In an event of third party partnership benefits or tokens issued by SeeDAO will be based on the holdings of Seed NFT as the basis for airdrops. ",
  },
];

export default function Utility() {
  return (
    <UtilitytStyle className="center">
      <UtilityTitle>Seed NFT Utility</UtilityTitle>
      <Box>
        {UTILITIES.map((item, i) => (
          <li key={i}>
            <div className="icon">
              <img src={item.img} alt="" />
            </div>
            <span className="title">{item.title}</span>
            <div className="text">{item.text}</div>
            {item.link && (
              <a
                className="more"
                href={item.link}
                target="_blank"
                rel="noreferrer"
              >
                Learn More
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
        <span>Join SeeDAO</span>
      </JoinButton>
    </UtilitytStyle>
  );
}

const UtilitytStyle = styled(CenterBox)`
  padding: 80px 120px;
  @media (max-width: 960px) {
    padding: 60px 40px;
  }
`;

const UtilityTitle = styled.div`
  text-align: center;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 50px;
  margin-bottom: 80px;
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
      }
    }

    span.title {
      text-align: center;
      font-family: DM Sans;
      font-size: 32px;
      font-style: normal;
      font-weight: 700;
      line-height: 34px;
      margin-block: 34px;
    }
    .more {
      color: #9e9e9e;
      font-family: DM Sans;
      font-size: 18px;
      font-style: normal;
      font-weight: 700;
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
  font-family: DM Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
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
  }
`;
