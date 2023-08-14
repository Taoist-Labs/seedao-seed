import styled from "@emotion/styled";
import { Link, useNavigate } from "react-router-dom";
import LogoIcon from "assets/images/logo.png";
import { Button } from "@mui/material";
import { addressToShow } from "utils/index";
import LoginModal from "components/modals/loginModal";
import React, { useState } from "react";
import { useAppContext, AppActionType } from "providers/appProvider";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// import GreenStarIcon from "assets/images/home/green_star.svg";
import MenuIcon from "assets/images/home/menu.svg";
import LanguageIcon from "assets/images/home/language.svg";
import { useTranslation } from "react-i18next";
import useSelectAccount from "../../hooks/useSelectAccout";

const SEED_OPTIONS = [
  // { path: "about", label: "About" },
  { path: "gallery", label: "header.gallery" },
  // { path: "license", label: "License" },
  // { path: "shop", label: "Shop" },
];

const SmNav = ({ handleClose }: { handleClose: () => void }) => {
  const { t } = useTranslation();
  const [expand] = useState(false);
  return (
    <SmMenu>
      <div className="content">
        <div className="top">
          <div className="seed-menu">
            {/* <span>{t("header.seed")}</span> */}
            <Link to="/gallery">{t("header.gallery")}</Link>
            {/* {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />} */}
          </div>
          {expand && (
            <ul className="sub-menu">
              {SEED_OPTIONS.map((item, i) => (
                <li key={i}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore */}
                  <Link to={item.path}>{t(item.label)}</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bottom">
          <Languagebutton />
          {/* <EnterAppButton /> */}
        </div>
      </div>
      <div className="mask" onClick={handleClose}></div>
    </SmMenu>
  );
};

const LoginBox = ({ account }: { account?: string }) => {
  const { t } = useTranslation();
  const { dispatch } = useAppContext();

  const showLoginModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
  };

  if (!account) {
    return (
      <React.Fragment>
        <LoginModal />
        <ConnectButton onClick={showLoginModal}>
          {t("header.connectWallet")}
        </ConnectButton>
      </React.Fragment>
    );
  }
  return <LoginStyle to="/my">{addressToShow(account)}</LoginStyle>;
};

// const EnterAppButton = () => {
//   return (
//     <EnterButton
//       onClick={() => window.open("https://app.seedao.xyz/", "_blank")}
//     >
//       <img src={GreenStarIcon} alt="" />
//       <span>Enter App</span>
//     </EnterButton>
//   );
// };

const Languagebutton = () => {
  const { i18n } = useTranslation();
  const [lan, setLan] = useState<string>("en");

  const getOppositeLan = () => {
    if (i18n.language === "en") {
      return "zh";
    } else {
      return "en";
    }
  };

  const changeLan = () => {
    const _olan = getOppositeLan();
    i18n.changeLanguage(_olan);
    setLan(_olan);
  };

  return (
    <LanguageBox onClick={changeLan}>
      <img src={LanguageIcon} alt="" />
      <span>{lan === "zh" ? "ZH" : "EN"}</span>
    </LanguageBox>
  );
};

export default function Header({ color }: { color?: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openSelect = Boolean(anchorEl);
  const [showMenu, setShowMenu] = React.useState(false);
  const { account } = useSelectAccount();

  const handleSelect = (path: string) => {
    navigate(path);
    setAnchorEl(null);
  };

  console.log("header account:", account);

  return (
    <HeaderStyle color={color || "#fff"}>
      <HeaderContainer>
        <LogoLink to="/">
          <img src={LogoIcon} alt="" />
        </LogoLink>
        <SmNavStyle onClick={() => setShowMenu(true)}>
          <img src={MenuIcon} alt="" />
        </SmNavStyle>
        <NavStyle>
          <SelectBox
            id="seed-select"
            // onClick={(event: React.MouseEvent<HTMLElement>) =>
            //   setAnchorEl(event.currentTarget)
            // }
          >
            <Link to="/gallery">{t("header.gallery")}</Link>
            {/* <span>{t("header.seed")}</span> */}
            {/* <ExpandMoreIcon /> */}
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
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                {t(option.label)}
              </MenuItem>
            ))}
          </Menu>
          <Languagebutton />
          <LoginBox account={account} />
          {/* <EnterAppButton /> */}
        </NavStyle>
      </HeaderContainer>
      {showMenu && <SmNav handleClose={() => setShowMenu(false)} />}
    </HeaderStyle>
  );
}

const SmMenu = styled.div`
  position: fixed;
  z-index: 99;
  left: 0;
  top: 60px;
  width: 100vw;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;

  .content {
    background-color: #fff;
    .top {
      .seed-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .seed-menu,
      .sub-menu,
      .sub-menu li {
        padding-inline: 30px;
      }
      .seed-menu,
      .sub-menu li {
        line-height: 44px;
        padding-inline: 30p;
        font-family: "Inter-Semibold";
        cursor: pointer;
        a {
          color: unset;
          text-decoration: none;
        }
      }
      .sub-menu li:hover {
        color: #a8e100;
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: center;
      border-top: 1px solid #ddd;
      margin-top: 20px;
    }
  }
  .mask {
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const HeaderStyle = styled.header<{ color: string }>`
  height: 102px;
  line-height: 104px;
  padding: 10px 30px;
  box-sizing: border-box;
  background-color: #fff;
  @media (max-width: 750px) {
    background-color: ${(props) => props.color};
  }
  @media (max-width: 412px) {
    height: 60px;
    line-height: 60px;
    padding: 0 15px;
  }
`;

const HeaderContainer = styled.div`
  max-width: 1440px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  height: 100%;
`;

const LogoLink = styled(Link)`
  img {
    height: 55px;
    position: relative;
    top: 15px;
  }
  @media (max-width: 412px) {
    img {
      top: 10px;
      left: -8px;
    }
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
  @media (max-width: 750px) {
    display: none;
  }
`;

const SmNavStyle = styled.div`
  display: none;
  img {
    position: relative;
    top: 18px;
    cursor: pointer;
  }
  @media (max-width: 750px) {
    display: block;
  }
  @media (max-width: 412px) {
    img {
      width: 24px;
      top: 8px;
    }
  }
`;

const SelectBox = styled.div`
  display: flex;
  width: 80px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  a {
    color: unset;
    text-decoration: none;
  }
`;

// const EnterButton = styled.div`
//   height: 44px;
//   line-height: 44px;
//   border-radius: 4px;
//   background: #000;
//   padding-inline: 10px;
//   color: #a8e100;
//   font-size: 20px;
//   font-family: "Inter-Semibold";
//   display: flex;
//   align-items: center;
//   gap: 9px;
//   cursor: pointer;
// `;

const LanguageBox = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const ConnectButton = styled(Button)`
  color: unset;
  &:hover {
    background-color: rgba(168, 225, 0, 0.2);
  }
`;
