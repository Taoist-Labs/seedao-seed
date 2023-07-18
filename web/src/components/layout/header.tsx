import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "assets/images/logo.png";
import { useWeb3React } from "@web3-react/core";
import { Button } from "@mui/material";
import { addressToShow } from "utils/index";
import LoginModal from "components/modals/loginModal";
import React from "react";
import { useAppContext, AppActionType } from "providers/appProvider";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
  return <LoginStyle to="/user">{addressToShow(account)}</LoginStyle>;
};

const SEED_OPTIONS = [
  { path: "about", label: "About" },
  { path: "gallery", label: "Gallery" },
  { path: "license", label: "License" },
  { path: "shop", label: "Shop" },
];

export default function Header() {
  const navigate = useNavigate();
  const { account } = useWeb3React();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openSelect = Boolean(anchorEl);

  const handleSelect = (path: string) => {
    navigate(path);
    setAnchorEl(null);
  };

  return (
    <HeaderStyle>
      <LogoLink to="/">
        <img src={LogoIcon} alt="" />
      </LogoLink>
      <NavStyle>
        <SelectBox
          id="seed-select"
          onClick={(event: React.MouseEvent<HTMLElement>) =>
            setAnchorEl(event.currentTarget)
          }
        >
          <span>Seed</span>
          <ExpandMoreIcon />
        </SelectBox>
        <Menu
          anchorEl={anchorEl}
          open={openSelect}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            "aria-labelledby": "seed-select",
          }}
        >
          {SEED_OPTIONS.map((option, idx) => (
            <MenuItem
              value={idx}
              key={idx}
              onClick={() => handleSelect(option.path)}
            >
              {option.label}
            </MenuItem>
          ))}
        </Menu>
        <LoginBox account={account} />
      </NavStyle>
    </HeaderStyle>
  );
}

const HeaderStyle = styled.header`
  height: 80px;
  line-height: 80px;
  border-bottom: 1px solid #ddd;
  padding: 10px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

const LogoLink = styled(Link)`
  img {
    height: 55px;
    position: relative;
    top: 15px;
  }
`;

const LoginStyle = styled(Link)`
  text-decoration: none;
  color: unset;
`;

const NavStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SelectBox = styled.div`
  display: flex;
  width: 80px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;
