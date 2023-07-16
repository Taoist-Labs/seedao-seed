import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import LogoIcon from "assets/images/logo.png";
import { useWeb3React } from "@web3-react/core";
import { Button } from "@mui/material";
import { addressToShow } from "utils/index";

const LoginBox = ({ account }: { account?: string }) => {
  if (!account) {
    return <Button>Connect Wallet</Button>;
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
