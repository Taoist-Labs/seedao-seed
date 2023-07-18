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
  const closeModal = () => {
    //  TODO
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
        <span className="icon-close" onClick={closeModal}>
          {/* <EvaIcon name="close-outline" /> */}
        </span>

        <Title>ConnectWallet</Title>
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
  width: 400px;
  height: 300px;
  background-color: #fff;
  padding: 30px 20px;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
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
  font-weight: 600;
  font-size: 16px;
  &:hover {
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
