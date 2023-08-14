import styled from "@emotion/styled";

import { ethers, Contract } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Chain from "utils/chain";

import LevelItem from "./levelItem";
import SeedModal from "components/modals/seedModal";
import { useTranslation } from "react-i18next";
import SeedList from "./seedList";
import MintModal from "./mintModal";
import ShareModal from "./shareModal";
import EmptyIcon from "assets/images/user/empty.svg";
import WhiteListData from "data/whitelist.json";
import ABI from "data/SeeDAO.json";
import SeedDisplay from "./seedDisplay";
import { getNftByAccount } from "utils/request";
import { GALLERY_ATTRS } from "data/gallery";
import OpeningModal from "./opening";

const SCR_CONTRACT = "0x27D4539d19b292b68369Ed588d682Db3aF679005";
const SEED_CONTRACT = "0xdC46E9b8658CEFA4690751Aad513c5e7Cca131b4";

const LEVELS = [
  {
    level: 0,
    minPoints: 0,
    maxPointes: 4999,
    color: "#FC6162",
  },
  {
    level: 1,
    minPoints: 5000,
    maxPointes: 19999,
    color: "#FC6162",
  },
  {
    level: 2,
    minPoints: 20000,
    maxPointes: 99999,
    color: "#5939D9",
  },
  {
    level: 3,
    minPoints: 100000,
    maxPointes: 299999,
    color: "#5939D9",
  },
  {
    level: 4,
    minPoints: 300000,
    maxPointes: 999999,
    color: "#6BE393",
  },
  {
    level: 5,
    minPoints: 1000000,
    maxPointes: 2999999,
    color: "#6BE393",
  },
  {
    level: 6,
    minPoints: 3000000,
    maxPointes: 9999999,
    color: "#EF36A9",
  },
  {
    level: 7,
    minPoints: 10000000,
    maxPointes: 29999999,
    color: "#EF36A9",
  },
  {
    level: 8,
    minPoints: 30000000,
    maxPointes: 99999999,
    color: "#10D4FF",
  },
  {
    level: 9,
    minPoints: 100000000,
    maxPointes: -1,
    color: "#10D4FF",
  },
];

export default function SeedCard() {
  const { t } = useTranslation();
  const { account, provider, chainId, connector } = useWeb3React();

  const [points, setPoints] = useState("0");
  const [hasSeed, setHasSeed] = useState(false);
  const [seedContract, setSeedContract] = useState<Contract>();
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newNft, setNewNft] = useState<INFT>();
  const [selectSeedIdx, setSelectSeedIdx] = useState(-1);
  const [nfts] = useState<INFT[]>([]);

  const selectSeed = useMemo(() => {
    if (selectSeedIdx === -1) {
      return undefined;
    } else {
      return nfts[selectSeedIdx];
    }
  }, [nfts, selectSeedIdx]);

  const emptySeed: INFT = useMemo(() => {
    return {
      image: EmptyIcon,
      tokenId: "",
      name: t("user.notOwneSeed"),
      attrs: GALLERY_ATTRS.map((attr) => ({ name: attr, value: "" })),
    };
  }, [t]);

  console.log("points:", points);

  const getSeedContract = () => {
    if (!provider) {
      return;
    }
    const signer = provider.getSigner(account);
    const contract = new ethers.Contract(SEED_CONTRACT, ABI, signer);
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
      "https://ethereum-sepolia.blockpi.network/v1/rpc/public",
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
      setPoints(ethers.utils.formatUnits(data, 18));
    } catch (error) {
      console.error("getSCR error", error);
    }
  };

  useEffect(() => {
    getSeedBalance();
  }, [seedContract]);

  useEffect(() => {
    account && getSCR();
    chainId === Chain.SEPOLIA.chaiId && account && getSeedContract();
  }, [chainId, account]);

  const checkIfinWhiteList = () => {
    return WhiteListData.find((d) => d.address === account);
  };

  const goMint = async () => {
    // setLoading(true);
    // setShowMintModal(false);

    // setTimeout(() => {
    //   console.log("mint done");
    //   setHasSeed(true);
    //   setNewNft({
    //     image:
    //       "https://raw.githubusercontent.com/Taoist-Labs/test-res/main/nfts/seed-Beige%20Gray%23Stategrey%23Normal%23Red%20L0-L1%23Headband_1%23%23Waves%20and%20Peaks_4.png",
    //     tokenId: "2000",
    //     name: "lala",
    //     attrs: [
    //       { name: "Background", value: "#fff" },
    //       { name: "Eyes", value: "#fff" },
    //       { name: "Background", value: "90cm" },
    //     ],
    //   });
    //   setLoading(false);
    //   setShowSeedModal(true);
    // }, 3000);
    if (!seedContract) {
      return;
    }
    // check network
    if (chainId !== Chain.SEPOLIA.chaiId) {
      await connector.activate({ ...Chain.SEPOLIA });
    }
    // dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      setLoading(true);
      setShowMintModal(false);
      let res: any;
      const find = checkIfinWhiteList();
      if (find) {
        res = await seedContract.claimWithWhiteList(find.no, find.proof);
      } else {
        res = await seedContract.claimWithPoints();
      }
      await res.wait();
      console.log("mint done");
      setHasSeed(true);
      // TODO handle event and get seed
      setShowSeedModal(true);
      setNewNft({
        image:
          "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
        tokenId: "2000",
        name: "lala",
        attrs: [
          { name: "background", value: "#fff" },
          { name: "color", value: "#fff" },
          { name: "height", value: "90cm" },
        ],
      });
    } catch (error) {
      console.error("goMint error", error);
    } finally {
      // dispatch({ type: AppActionType.SET_LOADING, payload: false });
      setLoading(false);
    }
  };
  const handleClickShare = () => {
    setShowSeedModal(false);
    setShowShareModal(true);
  };

  useEffect(() => {
    const getMySeeds = () => {
      account &&
        getNftByAccount(account)
          .then((res) => {
            console.log(res);
            // TODO
          })
          .catch((err) => console.log(err));
    };
    process.env.NODE_ENV !== "development" && getMySeeds();
  }, [account]);
  return (
    <Card>
      <CardTop>
        {LEVELS.map((item, i) => (
          <LevelItem key={i} data={item} points={Number(points)} />
        ))}
      </CardTop>
      <CardBottom>
        <CardBottomInner>
          {Number(points) < 5000 ? (
            <SeedDisplay seed={emptySeed} />
          ) : selectSeed ? (
            <SeedDisplay seed={selectSeed} />
          ) : (
            <SeedDisplay seed={{ ...emptySeed, name: "SEED" }} />
          )}

          <CardBottomInnerRight>
            <RightTopBox>
              {hasSeed ? (
                <span className="minted">{t("user.hadMint")}</span>
              ) : checkIfinWhiteList() || Number(points) >= 5000 ? (
                <div>
                  <span
                    className="btn mint-btn"
                    onClick={() => setShowMintModal(true)}
                  >
                    <label>{t("user.unlockMint")}</label>
                  </span>
                  <p className="tip">{t("user.unlockTip")}</p>
                </div>
              ) : (
                <div>
                  <span className="btn lock-btn">
                    <label>{t("user.lockMint")}</label>
                  </span>
                  <p className="tip">{t("user.lockTip")}</p>
                </div>
              )}
            </RightTopBox>
            <SeedList
              list={nfts}
              selectedIdx={selectSeedIdx}
              onSelect={(idx) => setSelectSeedIdx(idx)}
            />
          </CardBottomInnerRight>
        </CardBottomInner>
      </CardBottom>
      {/* before mint -- congrats */}
      {showMintModal && (
        <MintModal
          handleMint={goMint}
          handleClose={() => setShowMintModal(false)}
          show={showMintModal}
        />
      )}
      {/* mint success */}
      {showSeedModal && newNft && (
        <SeedModal
          isShare
          handleClose={() => setShowSeedModal(false)}
          handleClickShare={handleClickShare}
          seed={newNft}
        />
      )}
      {/* share modal */}
      {showShareModal && newNft && (
        <ShareModal
          show={showShareModal}
          seed={newNft}
          handleClose={() => setShowShareModal(false)}
        />
      )}
      {loading && <OpeningModal />}
    </Card>
  );
}

const Card = styled.div`
  border-radius: 20px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.18);
  max-width: 1100px;
  margin: 0 auto;
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

const CardBottomInnerRight = styled.div``;

const RightTopBox = styled.div`
  .btn {
    width: 196px;
    height: 48px;
    line-height: 48px;
    border-radius: 8px;
    box-sizing: border-box;
    padding-inline: 14px;
    font-size: 24px;
    font-family: "Inter-Bold";
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
    background: #a8e100;
    cursor: pointer;
    cursor: pointer;
  }
  .minted {
    color: #b4afaf;
    font-size: 20px;
  }
  .tip {
    color: #b5b5b5;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
    margin-top: 4px;
  }
`;
