import styled from "@emotion/styled";

import { ethers, Contract } from "ethers";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useAppContext, AppActionType } from "providers/appProvider";
import Chain from "utils/chain";

import LevelItem from "./levelItem";
import NFT_02 from "assets/images/home/nfts/2.png";
import QuestIcon from "assets/images/user/quest.svg";

const SCR_CONTRACT = "0x77dea9602D6768889819B24D6f5deB7e3362B496";
const SEED_CONTRACT_BSC_TESTNET = "0x22B3a87635B7fF5E8e1178522596a6e23b568DDE";

const LEVELS = [
  {
    level: 0,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 1,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 2,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 3,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 4,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 5,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 6,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 7,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 8,
    minPoints: 0,
    maxPointes: 50000,
  },
  {
    level: 9,
    minPoints: 0,
    maxPointes: 50000,
  },
];

export default function SeedCard() {
  const { account, provider, chainId, connector } = useWeb3React();
  const { dispatch } = useAppContext();

  const [points, setPoints] = useState("0");
  const [hasSeed, setHasSeed] = useState(false);
  const [seedContract, setSeedContract] = useState<Contract>();

  const getSeedContract = () => {
    if (!provider) {
      return;
    }
    const signer = provider.getSigner(account);
    const contract = new ethers.Contract(
      SEED_CONTRACT_BSC_TESTNET,
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "account",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "claimWithPoints",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      signer,
    );
    setSeedContract(contract);
  };

  const getSeedBalance = async () => {
    if (!seedContract) {
      return;
    }
    const data = await seedContract.balanceOf(account);
    setHasSeed(data.eq(ethers.BigNumber.from(1)));
  };

  const getSCR = async () => {
    const provider = new ethers.providers.StaticJsonRpcProvider(
      "https://endpoints.omniatech.io/v1/bsc/testnet/public",
    );
    try {
      const contract = new ethers.Contract(
        SCR_CONTRACT,
        [
          {
            inputs: [
              {
                internalType: "address",
                name: "account",
                type: "address",
              },
            ],
            name: "balanceOf",
            outputs: [
              {
                internalType: "uint256",
                name: "",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        provider,
      );
      const data = await contract.balanceOf(account);
      setPoints(ethers.utils.formatUnits(data, 6));
    } catch (error) {
      console.error("getSCR error", error);
    }
  };

  useEffect(() => {
    getSeedBalance();
  }, [seedContract]);

  useEffect(() => {
    account && getSCR();
    chainId === 97 && account && getSeedContract();
  }, [chainId, account]);

  const goMint = async () => {
    if (!seedContract) {
      return;
    }
    // check network
    if (chainId !== 97) {
      await connector.activate({ ...Chain.BSC_TESTNET });
    }
    dispatch({ type: AppActionType.SET_LOADING, payload: true });

    try {
      const res = await seedContract.claimWithPoints();
      await res.wait();
      console.log("mint done");
      setHasSeed(true);
    } catch (error) {
      console.error("goMint error", error);
    } finally {
      dispatch({ type: AppActionType.SET_LOADING, payload: false });
    }
  };
  return (
    <Card>
      <CardTop>
        {LEVELS.map((item, i) => (
          <LevelItem key={i} isCurrent={i === 5} level={item.level} />
        ))}
      </CardTop>
      <CardBottom>
        <CardBottomInner>
          <SeedDetail>
            <SeedImg>
              <img src={NFT_02} alt="" />
            </SeedImg>
            <SeedAttr>
              <div className="name">Seed # 2584</div>
              <ul>
                <li>
                  <div>
                    <p className="name">Hair</p>
                    <p className="value">BlackBlack</p>
                  </div>
                </li>
                <li>
                  <div>
                    <p className="name">Hair</p>
                    <p className="value">BlackBlack</p>
                  </div>
                </li>
                <li>
                  <div>
                    <p className="name">Hair</p>
                    <p className="value">BlackBlack</p>
                  </div>
                </li>
              </ul>
            </SeedAttr>
          </SeedDetail>
          <CardBottomInnerRight disabled={hasSeed}>
            {!hasSeed && Number(points) < 5000 ? (
              <span className="btn lock-btn">
                <label>Mint 未解锁</label>
                <img src={QuestIcon} alt="" />
              </span>
            ) : (
              <span className="btn mint-btn" onClick={goMint}>
                <label>Mint Now</label>
                <img src={QuestIcon} alt="" />
              </span>
            )}
          </CardBottomInnerRight>
        </CardBottomInner>
      </CardBottom>
    </Card>
  );
}

const Card = styled.div`
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.18);
`;

const CardTop = styled.div`
  display: flex;
  gap: 19px;
  padding: 40px 40px 45px;
  border-bottom: 1px solid #d9d9d9;
`;

const CardBottom = styled.div`
  padding: 35px 40px;
`;

const CardBottomInner = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SeedImg = styled.div`
  width: 240px;
  height: 240px;
  img {
    width: 100%;
    height: 100%;
  }
`;

const SeedDetail = styled.div`
  display: flex;
  gap: 14px;
`;
const SeedAttr = styled.div`
  width: 390px;
  .name {
    font-size: 18px;
    font-weight: 700;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  li {
    width: 190px;
    height: 42px;
    border-radius: 8px;
    border: 1px solid #000;
    background: #fff;
    padding: 4px 9px;
    box-sizing: border-box;
    .name {
      font-size: 12px;
      font-weight: 400;
    }
    .value {
      font-size: 16px;
      font-weight: 600;
    }
  }
`;

interface CardBottomInnerRightProps {
  disabled?: boolean;
}

const CardBottomInnerRight = styled.div<CardBottomInnerRightProps>`
  .btn {
    width: 196px;
    height: 48px;
    line-height: 48px;
    border-radius: 8px;
    box-sizing: border-box;
    padding-inline: 14px;
    font-family: DM Sans;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }
  .lock-btn {
    background: #d9d9d9;
    cursor: not-allowed;
  }
  .mint-btn {
    background: ${(props) => (props.disabled ? "#d9d9d9" : "a8e100")};
    cursor: pointer;
  }
`;
