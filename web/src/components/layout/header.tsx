import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import LogoIcon from "assets/images/logo.png";
import { useWeb3React } from "@web3-react/core";
import { Button } from "@mui/material";
import { addressToShow } from "utils/index";
import LoginModal from "components/modals/loginModal";
import React from "react";
import { useAppContext, AppActionType } from "providers/appProvider";

const LoginBox = ({ account }: { account?: string }) => {
  const { dispatch } = useAppContext();

  const showLoginModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
  };

  if (!account) {
    return (
      <React.Fragment>
        <LoginModal />
        <Button onClick={showLoginModal}>Connect Wallet</Button>
      </React.Fragment>
    );
  }
  return <LoginStyle>{addressToShow(account)}</LoginStyle>;
};

export default function Header() {
  const { account } = useWeb3React();
  return (
    <HeaderStyle>
      <LogoLink to="/">
        <img src={LogoIcon} alt="" />
      </LogoLink>
      <LoginBox account={account} />
    </HeaderStyle>
  );
}

const HeaderStyle = styled.header`
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #ddd;
  padding: 10px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoLink = styled(Link)`
  img {
    height: 55px;
    position: relative;
    top: 10px;
  }
`;

const LoginStyle = styled.div``;
