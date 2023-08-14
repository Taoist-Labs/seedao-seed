import styled from "@emotion/styled";

import { ethers, Contract } from "ethers";
import { useEffect, useMemo, useState } from "react";
import Chain from "utils/chain";

import LevelItem from "./levelItem";
import SeedModal from "components/modals/seedModal";
import { useTranslation } from "react-i18next";
import SeedList from "./seedList";
import MintModal from "./mintModal";
import ShareModal from "./shareModal";
import EmptyIcon from "assets/images/user/empty.svg";
import WhiteListData from "data/whitelist.json";
import SeedDisplay from "./seedDisplay";
import { getNftByAccount } from "utils/request";
import { GALLERY_ATTRS } from "data/gallery";
import OpeningModal from "./opening";
import useSelectAccount from "hooks/useSelectAccout";
import {
  SCR_CONTRACTS,
  SEED_CONTRACTS,
  SEED_MANAGER_CONTRACTS,
} from "utils/contract";
import SeedABI from "data/abi/Seed.json";
import SeedMgrABI from "data/abi/SeedManager.json";
import ScrABI from "data/abi/SCR.json";

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

// const handleTokenUri = (uri: string) => {
//   // uri: ipfs://xxxx/tokenId_level.json
//   const name = uri.split(".")[0].split("/").reverse()[0];
//   const arr = name.split("_");
//   return { tokenId: Number(arr[0]), level: Number(arr[1]) };
// };

export default function SeedCard() {
  const { t } = useTranslation();
  const { account, provider, chainId, connector } = useSelectAccount();

  const [points, setPoints] = useState("0");
  const [hasSeed, setHasSeed] = useState(false);
  const [seedContract, setSeedContract] = useState<Contract>();
  const [seedMgrContract, setSeedMgrContract] = useState<Contract>();
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newNft, setNewNft] = useState<INFT>();
  const [selectSeedIdx, setSelectSeedIdx] = useState(-1);
  const [nfts, setNfts] = useState<INFT[]>([]);

  const [isOpenMint, setIsOpenMint] = useState(false);

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
  const getSeedManagerContract = () => {
    if (!provider) {
      return;
    }
    const signer = provider.getSigner(account);
    const contract = new ethers.Contract(
      SEED_MANAGER_CONTRACTS.POLYGON,
      SeedMgrABI,
      signer,
    );

    setSeedMgrContract(contract);
  };

  const getSeedContract = () => {
    if (!provider) {
      return;
    }

    const contract = new ethers.Contract(
      SEED_CONTRACTS.POLYGON,
      SeedABI,
      provider,
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
      Chain.POLYGON.rpcUrls[0],
    );
    try {
      const contract = new ethers.Contract(
        SCR_CONTRACTS.POLYGON,
        ScrABI,
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
  }, [account]);

  useEffect(() => {
    chainId === Chain.POLYGON.chainId && getSeedContract();
  }, [chainId, provider]);

  useEffect(() => {
    chainId === Chain.POLYGON.chainId && account && getSeedManagerContract();
  }, [chainId, account, provider]);

  useEffect(() => {
    const getSwitch = async () => {
      if (!seedMgrContract) {
        return;
      }
      try {
        const _isOpenMint = await seedMgrContract.onClaimWithPoints();
        setIsOpenMint(_isOpenMint);
      } catch (error) {
        console.error("getSwitch error", error);
      }
    };
    getSwitch();
  }, [seedMgrContract]);

  const checkIfinWhiteList = () => {
    return WhiteListData.find((d) => d.address === account);
  };

  const goMint = async () => {
    if (!connector) {
      return;
    }
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

    // check network
    if (chainId !== Chain.POLYGON.chainId) {
      await connector.activate(Chain.POLYGON);
      return;
    }
    if (!seedContract) {
      return;
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
      const r = await res.wait();
      console.log("r:", r);
      console.log("mint done");
      const event = r.events.find((e: any) => e.name === "Transfer");
      setHasSeed(true);
      if (event) {
        const tokenIdHex = event.topics[3];
        // TODO handle 16 => 10;
        const tokenId = tokenIdHex;
        const uri = await seedContract.tokenURI(tokenId);
        // if (uri.endsWith(".json")) {
        //   const _new_nft: INFT = {
        //     tokenId,
        //     tokenIdFormat: `SEED No.${tokenId}`, // display tokenId ?
        //     image: emptySeed.image,
        //     attrs: emptySeed.attrs,
        //   };
        //   setNfts([...nfts, _new_nft]);
        //   setLoading(false);
        //   return;
        // }
        fetch(uri, { method: "GET" })
          .then((res) => res.json())
          .then((res: any) => {
            const _new_nft: INFT = {
              tokenId,
              tokenIdFormat: `SEED No.${tokenId}`,
              image: res.image, // TODO handle image url
              attrs: res.attributes.map((attr: any) => ({
                name: attr.trait_type,
                value: attr.value,
              })),
            };
            setNewNft(_new_nft);
            setNfts([...nfts, _new_nft]);

            setShowSeedModal(true);
            setLoading(false);
          })
          .catch((err) => {
            console.error("fetch new token uri error", err, uri);
          })
          .finally(() => {
            setLoading(false);
          });

        // setNewNft({
        //   image:
        //     "https://i.seadn.io/gcs/files/2cc49c2fefc90c12d21aaffd97de48df.png?auto=format&dpr=1&w=750",
        //   tokenId: "2000",
        //   name: "lala",
        //   attrs: [
        //     { name: "background", value: "#fff" },
        //     { name: "color", value: "#fff" },
        //     { name: "height", value: "90cm" },
        //   ],
        // });
      }
      setLoading(false);
    } catch (error) {
      console.error("goMint error", error);
      setLoading(false);
    } finally {
      // dispatch({ type: AppActionType.SET_LOADING, payload: false });
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
          {nfts.length === 0 ? (
            <SeedDisplay seed={emptySeed} />
          ) : selectSeed ? (
            <SeedDisplay seed={selectSeed} />
          ) : (
            <SeedDisplay seed={{ ...emptySeed, name: "SEED" }} />
          )}
          <CardBottomInnerRight>
            {isOpenMint && (
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
            )}
            {(nfts.length > 1 || isOpenMint) && (
              <SeedList
                list={nfts}
                selectedIdx={selectSeedIdx}
                onSelect={(idx) => setSelectSeedIdx(idx)}
              />
            )}
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
