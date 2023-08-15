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
import { useAppContext, AppActionType } from "providers/appProvider";
import { toast } from "react-toastify";

const whiteList = WhiteListData as {
  rootHash: string;
  proofs: [{ address: string; proof: string[] }];
}[];

const LEVELS = [
  {
    level: 0,
    minPoints: 0,
    maxPoints: 4999,
    color: "#FF0000",
  },
  {
    level: 1,
    minPoints: 5000,
    maxPoints: 19999,
    color: "#FF0000",
  },
  {
    level: 2,
    minPoints: 20000,
    maxPoints: 99999,
    color: "#01B492",
  },
  {
    level: 3,
    minPoints: 100000,
    maxPoints: 299999,
    color: "#01B492",
  },
  {
    level: 4,
    minPoints: 300000,
    maxPoints: 999999,
    color: "#FFFFFF",
  },
  {
    level: 5,
    minPoints: 1000000,
    maxPoints: 2999999,
    color: "#FFFFFF",
  },
  {
    level: 6,
    minPoints: 3000000,
    maxPoints: 9999999,
    color: "#FF0091",
  },
  {
    level: 7,
    minPoints: 10000000,
    maxPoints: 29999999,
    color: "#FF0091",
  },
  {
    level: 8,
    minPoints: 30000000,
    maxPoints: 99999999,
    color: "#00B1FF",
  },
  {
    level: 9,
    minPoints: 100000000,
    maxPoints: -1,
    color: "#00B1FF",
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
  const { dispatch } = useAppContext();

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

  const getSeedContract = async () => {
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
    try {
      const data = await seedContract.balanceOf(account);
      setHasSeed(data.gte(ethers.BigNumber.from(1)));
    } catch (error) {
      console.error("getSeedBalance error", error);
    }
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
    return whiteList.findIndex(
      (item) =>
        !!item.proofs.find(
          (p) => p.address.toLocaleLowerCase() === account?.toLocaleLowerCase(),
        ),
    );
  };

  const goMint = async () => {
    if (!connector) {
      return;
    }
    // check network
    if (chainId !== Chain.POLYGON.chainId) {
      await connector.activate(Chain.POLYGON);
      return;
    }
    if (!seedMgrContract || !seedContract) {
      return;
    }
    // dispatch({ type: AppActionType.SET_LOADING, payload: true });
    try {
      let res: any;
      const findIdx = checkIfinWhiteList();
      if (findIdx > -1) {
        const proof_item = whiteList[findIdx].proofs.find(
          (p) => p.address.toLocaleLowerCase() === account?.toLocaleLowerCase(),
        );
        if (proof_item) {
          res = await seedMgrContract.claimWithWhiteList(
            findIdx,
            proof_item.proof,
          );
        }
      } else {
        res = await seedMgrContract.claimWithPoints();
      }
      setLoading(true);
      setShowMintModal(false);
      const r = await res.wait();
      console.log("[DEBUG] r: ", r);

      console.log("mint done");

      const event = r.events.find(
        (e: any) =>
          e.topics[0] ==
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
      );

      setHasSeed(true);
      if (event) {
        console.log("[DEBUG] find event: ", event);

        const tokenId = ethers.BigNumber.from(event.topics[3]);
        console.log("[DEBUG] tokenId: ", tokenId);

        const uri = await seedContract.tokenURI(tokenId);
        console.log("[DEBUG] token uri:  ", uri);

        // const _new_nft: INFT = {
        //   tokenId: tokenId.toString(),
        //   tokenIdFormat: `SEED No.${tokenId.toString()}`, // display tokenId ?
        //   image: emptySeed.image,
        //   attrs: emptySeed.attrs,
        // };
        // setNewNft(_new_nft);
        // setNfts([...nfts, _new_nft]);
        // setSelectSeedIdx(nfts.length);

        // setShowSeedModal(true);
        // setLoading(false);
        fetch(uri, { method: "GET" })
          .then((res) => res.json())
          .then((res: any) => {
            const _new_nft: INFT = {
              tokenId: tokenId.toString(),
              tokenIdFormat: `SEED No.${tokenId.toString()}`,
              image: res.image, // TODO handle image url
              attrs: res.attributes.map((attr: any) => ({
                name: attr.trait_type,
                value: attr.value,
              })),
            };
            setNewNft(_new_nft);
            setNfts([...nfts, _new_nft]);
            setSelectSeedIdx(nfts.length);

            setShowSeedModal(true);
            setLoading(false);
          })
          .catch((err) => {
            console.error("fetch new token uri error", err, uri);
          })
          .finally(() => {
            setLoading(false);
          });
      }
      setLoading(false);
    } catch (error: any) {
      console.error("goMint error", error);
      setLoading(false);
      toast.error(error?.reason || error?.data?.message || "unknown");
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
      if (!account) return;
      dispatch({ type: AppActionType.SET_LOADING, payload: true });
      getNftByAccount(account)
        .then((res) => res.json())
        .then((res) => {
          console.log("getMySeeds res:", res);
          const lst: INFT[] = res.data.content.map((item: any) => ({
            tokenId: item.token_id,
            tokenIdFormat: `SEED No.${item.token_id}`,
            attrs: item.attributes?.length
              ? item.attributes.map((attr: any) => ({
                  name: attr.attribute_name,
                  value: attr.attribute_value,
                }))
              : GALLERY_ATTRS.map((attr) => ({ name: attr, value: "" })),
            image: item.image_uri,
          }));
          setNfts(lst);
          if (lst.length) {
            setSelectSeedIdx(0);
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          dispatch({ type: AppActionType.SET_LOADING, payload: false });
        });
    };
    process.env.NODE_ENV !== "development" && getMySeeds();
  }, [account]);

  // check network
  const checkNetwork = async () => {
    if (connector && chainId && chainId !== Chain.POLYGON.chainId) {
      try {
        await connector.activate(Chain.POLYGON);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return true;
  };

  const onClickUnlockButton = async () => {
    if (!connector) {
      return;
    }
    // check network
    const res = await checkNetwork();
    if (!res) {
      return;
    }
    setShowMintModal(true);
  };

  useEffect(() => {
    checkNetwork();
  }, [connector, chainId]);
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
                ) : checkIfinWhiteList() > -1 || Number(points) >= 5000 ? (
                  <div>
                    <span
                      className="btn mint-btn"
                      onClick={onClickUnlockButton}
                    >
                      <span>{t("user.unlockMint")}</span>
                    </span>
                    <p className="tip">{t("user.unlockTip")}</p>
                  </div>
                ) : (
                  <div>
                    <span className="btn lock-btn">
                      <span>{t("user.lockMint")}</span>
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
  padding: 60px 40px 30px;
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
