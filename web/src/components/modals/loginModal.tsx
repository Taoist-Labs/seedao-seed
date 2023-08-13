import { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useAppContext, AppActionType } from "providers/appProvider";
import styled from "@emotion/styled";
import { Wallet, WalletType } from "wallet/wallet";

import { SELECT_WALLET } from "utils/constant";
import { MetaMask } from "@web3-react/metamask";
import { injected } from "wallet/connector";
import MetamaskIcon from "assets/images/metamask.png";
import { useTranslation } from "react-i18next";

enum LoginStatus {
  Default = 0,
  Pending,
}

type Connector = MetaMask;

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
];

export default function LoginModal() {
  const { t } = useTranslation();
  const {
    state: { show_login_modal },
    dispatch,
  } = useAppContext();

  const [loginStatus, setLoginStatus] = useState<LoginStatus>(
    LoginStatus.Default,
  );
  const [chooseWallet, setChooseWallet] = useState<LoginWallet>();

  const handleClose = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: false });
  };

  const handleFailed = () => {
    setLoginStatus(LoginStatus.Default);
    setChooseWallet(undefined);
    localStorage.removeItem(SELECT_WALLET);
  };

  const connect = async (w: LoginWallet) => {
    setChooseWallet(w);
    const connector = w.connector;
    setLoginStatus(LoginStatus.Pending);
    try {
      await connector.activate();
      localStorage.setItem(SELECT_WALLET, w.value);
    } catch (error) {
      handleFailed();
    }
  };
  useEffect(() => {
    // TODO
  }, [loginStatus, chooseWallet]);
  return (
    <Modal
      open={!!show_login_modal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContainer>
        <span className="icon-close" onClick={handleClose}>
          {/* <EvaIcon name="close-outline" /> */}
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
  height: 160px;
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: 18px;
  font-family: "Inter-Semibold";
  text-align: center;
  margin-bottom: 16px;
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
  background: rgb(191, 239, 45);
  color: #fff;
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
