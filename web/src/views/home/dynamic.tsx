import styled from "@emotion/styled";
import DynamicIcon01 from "assets/images/home/dynamic_1.svg";
import DynamicIcon02 from "assets/images/home/dynamic_2.svg";
import DynamicIcon03 from "assets/images/home/dynamic_3.svg";
import DynamicIcon04 from "assets/images/home/dynamic_4.svg";
import DynamicIcon05 from "assets/images/home/dynamic_5.svg";

const DynamicNFTs = [
  {
    img: DynamicIcon01,
    color: "#FC6162",
    levels: [
      {
        title: "L0",
        points: "0-5k points",
      },
      {
        title: "L1",
        points: "5k-20k points",
      },
    ],
  },
  {
    img: DynamicIcon02,
    color: "#5939D9",
    levels: [
      {
        title: "L0",
        points: "0-5k points",
      },
      {
        title: "L1",
        points: "5k-20k points",
      },
    ],
  },
  {
    img: DynamicIcon03,
    color: "#6BE393",
    levels: [
      {
        title: "L0",
        points: "0-5k points",
      },
      {
        title: "L1",
        points: "5k-20k points",
      },
    ],
  },
  {
    img: DynamicIcon04,
    color: "#EF36A9",
    levels: [
      {
        title: "L0",
        points: "0-5k points",
      },
      {
        title: "L1",
        points: "5k-20k points",
      },
    ],
  },
  {
    img: DynamicIcon05,
    color: "#10D4FF",
    levels: [
      {
        title: "L0",
        points: "0-5k points",
      },
      {
        title: "L1",
        points: "5k-20k points",
      },
    ],
  },
];

export default function DynamicNFT() {
  const openLevel = () => {
    // login
    // unlogin
  };
  return (
    <DynamicNFTStyle>
      <Title>Dynamic PFP of Seed NFT</Title>
      <Content>
        <p>
          {`The Polaris star on the character's forehead in the Seed NFT will
          dynamically change based on the points in the member's wallet,
          affecting all on-chain avatars. It reflects the current holder's level
          and updates when trading actions occur with a new owner.`}
        </p>
        <p className="second">
          <span>Polaris star colors</span> for different points/Level:
        </p>
      </Content>
      <NFTCard>
        {DynamicNFTs.map((item, i) => (
          <NFTCardItem key={i} color={item.color}>
            <div className="content">
              <p>
                <span>{item.levels[0].title}</span> ({item.levels[0].points})
              </p>
              <div className="line"></div>
              <p>
                <span>{item.levels[1].title}</span> ({item.levels[1].points})
              </p>
            </div>
            <div>
              <img src={item.img} alt="" />
            </div>
          </NFTCardItem>
        ))}
      </NFTCard>
      <ViewButton onClick={openLevel}>View My Level</ViewButton>
    </DynamicNFTStyle>
  );
}

const DynamicNFTStyle = styled.section`
  padding: 80px 120px;
  background: #f9d9fb;
  @media (max-width: 640px) {
    padding: 60px 40px;
  }
`;

const Title = styled.div`
  text-align: center;
  font-family: Inter;
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 50px;
  margin-bottom: 40px;
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
    font-weight: 700;
    span {
      color: #d9393b;
    }
  }
`;

const NFTCard = styled.ul`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: space-between;
  @media (max-width: 640px) {
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

  img {
    vertical-align: bottom;
    width: 100%;
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
  }
  @media (max-width: 640px) {
    flex-direction: row;
    height: 137px;
    img {
      height: 100%;
    }
  }
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
  font-family: DM Sans;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  @media (max-width: 640px) {
    width: 80%;
    height: 56px;
    line-height: 56px;
  }
`;
