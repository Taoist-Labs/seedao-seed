import { useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useAppContext, AppActionType } from "providers/appProvider";
import styled from "@emotion/styled";
import { Wallet, WalletType } from "wallet/wallet";

import { SELECT_WALLET } from "utils/constant";
import { MetaMask } from "@web3-react/metamask";
import { UniPass } from "@unipasswallet/web3-react";
import { injected, uniPassWallet } from "wallet/connector";

import MetamaskIcon from "assets/images/wallet/metamask.png";
import UnipassIcon from "assets/images/wallet/unipass.svg";
import { useTranslation } from "react-i18next";
import useSelectAccount from "hooks/useSelectAccout";
import Chain from "utils/chain";
import { isMobile } from "utils/userAgent";
import CallApp from "callapp-lib";
import { USE_NETWORK } from "utils/constant";

// enum LoginStatus {
//   Default = 0,
//   Pending,
// }

type Connector = MetaMask | UniPass;

type LoginWallet = {
  name: string;
  value: Wallet;
  connector: Connector;
  iconURL: string;
  type: WalletType;
};

const LOGIN_WALLETS: LoginWallet[] = [
  {
    name: "MetaMask",
    value: Wallet.METAMASK,
    connector: injected,
    iconURL: MetamaskIcon,
    type: WalletType.EOA,
  },
  {
    name: "Unipass",
    value: Wallet.UNIPASS,
    connector: uniPassWallet,
    iconURL: UnipassIcon,
    type: WalletType.AA,
  },
];

export default function LoginModal() {
  const { t } = useTranslation();

  const {
    state: { show_login_modal },
    dispatch,
  } = useAppContext();

  // const [loginStatus, setLoginStatus] = useState<LoginStatus>(
  //   LoginStatus.Default,
  // );
  // const [chooseWallet, setChooseWallet] = useState<LoginWallet>();

  const { chainId, connector } = useSelectAccount();

  const handleClose = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  const handleFailed = () => {
    // setLoginStatus(LoginStatus.Default);
    // setChooseWallet(undefined);
    localStorage.removeItem(SELECT_WALLET);
  };

  const connect = async (w: LoginWallet) => {
    if (w.value === Wallet.METAMASK) {
      if (!isMobile && !window.ethereum) {
        window.open("https://metamask.io/download.html", "_blank");
        return;
      } else if (isMobile && !window.ethereum) {
        const options = {
          scheme: {
            protocol: "https",
            host: "metamask.app.link",
          },
          appstore: "",
          fallback: "https://metamask.io/download.html",
        };
        const callLib = new CallApp(options);
        const openParams = {
          path: `dapp/${window.location.hostname}/`,
          callback() {
            console.log("Please install MetaMask");
          },
        };
        callLib.open(openParams);
        return;
      }
    }
    // setChooseWallet(w);
    const connector = w.connector;
    // setLoginStatus(LoginStatus.Pending);
    try {
      await connector.activate();
      localStorage.setItem(SELECT_WALLET, w.value);
      dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: w.type });
      handleClose();
    } catch (error) {
      handleFailed();
    }
  };
  useEffect(() => {
    if (connector && chainId && chainId !== Chain[USE_NETWORK].chainId) {
      connector.activate(Chain[USE_NETWORK]);
    }
  }, [chainId, connector]);
  return (
    <Modal
      open={!!show_login_modal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContainer>
        <span className="icon-close" onClick={handleClose}>
          <CloseOutlinedIcon />
        </span>

        <Title>{t("header.connectWallet")}</Title>
        <Content>
          {LOGIN_WALLETS.map((w) => (
            <WalletOption key={w.value} onClick={() => connect(w)}>
              <span>{w.name}</span>
              <span>
                <img src={w.iconURL} alt="" />
              </span>
            </WalletOption>
          ))}
        </Content>
      </ModalContainer>
    </Modal>
  );
}

const ModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 370px;
  /* height: 200px; */
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  &:focus-visible {
    outline: none;
  }
  .icon-close {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
  @media (max-width: 414px) {
    width: 320px;
    padding: 20px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-family: "Inter-Semibold";
  text-align: center;
  margin-bottom: 26px;
  margin-top: 15px;
`;

const WalletOption = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  padding: 10px 28px;
  border-radius: 8px;
  margin-block: 10px;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #f1f1f1;
  background: #c3f237;
  /* color: #fff; */
  font-family: "Inter-Semibold";
  font-size: 16px;
  &:hover {
    background-color: rgb(201, 251, 48);
  }
  img {
    width: 28px;
    height: 28px;
  }
`;

const Content = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
