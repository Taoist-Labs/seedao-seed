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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// import GreenStarIcon from "assets/images/home/green_star.svg";
import MenuIcon from "assets/images/home/menu.svg";
import LanguageIcon from "assets/images/home/language.svg";
import { useTranslation } from "react-i18next";
import useSelectAccount from "../../hooks/useSelectAccout";
import { SELECT_WALLET } from "utils/constant";
import MenuSeed from "./menu_seed";

const SmNav = ({
  handleClose,
  account,
}: {
  handleClose: () => void;
  account?: string;
}) => {
  const { t } = useTranslation();
  const [expand, setExpand] = useState(false);

  return (
    <SmMenu>
      <div className="content">
        <div className="top">
          <div className="seed-menu">
            {/* <span>{t("header.seed")}</span> */}
            <Link to="/gallery">{t("header.gallery")}</Link>

            {/* {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />} */}
          </div>
          {account && (
            <div className="seed-menu" onClick={() => setExpand(!expand)}>
              <span>{addressToShow(account)}</span>
              {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
          )}

          {expand && (
            <ul className="sub-menu">
              <li>
                <Link to="/my" className="my">
                  {t("header.myProfile")}
                </Link>
              </li>
              {/* <li onClick={handleDisconnect}>{t("header.disconnect")}</li> */}
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
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { dispatch } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openSelect = Boolean(anchorEl);
  const { connector } = useSelectAccount();

  const handleDisconnect = () => {
    dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: "" });
    localStorage.removeItem(SELECT_WALLET);
    try {
      console.log("connector:", connector);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      connector?.deactivate();
    } catch (error) {
      console.error("disconnect", error);
    }

    setAnchorEl(null);
  };

  const go2profile = () => {
    navigate("/my");
    setAnchorEl(null);
  };

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
  return (
    <>
      <SelectBox
        id="wallet-select"
        onClick={(event: React.MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
      >
        <span>{addressToShow(account)}</span>
        <ExpandMoreIcon />
      </SelectBox>
      <Menu
        anchorEl={anchorEl}
        open={openSelect}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "wallet-select",
        }}
      >
        <MenuItemStyle value={1} onClick={go2profile}>
          {t("header.myProfile")}
        </MenuItemStyle>
        <MenuItemStyle value={0} onClick={handleDisconnect}>
          {t("header.disconnect")}
        </MenuItemStyle>
      </Menu>
    </>
  );
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

  const [showMenu, setShowMenu] = React.useState(false);
  const { account } = useSelectAccount();

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
          <MenuSeed account={account} />
          <Languagebutton />
          <LoginBox account={account} />
          {/* <EnterAppButton /> */}
        </NavStyle>
      </HeaderContainer>
      {showMenu && (
        <SmNav handleClose={() => setShowMenu(false)} account={account} />
      )}
    </HeaderStyle>
  );
}

const SmMenu = styled.div`
  position: fixed;
  z-index: 99;
  left: 0;
  top: 90px;
  width: 100vw;
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;

  .content {
    background-color: #fff;
    .top {
      padding-inline: 30px;

      .seed-menu {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .seed-menu,
      .sub-menu,
      .seed-menu,
      .sub-menu li {
        line-height: 44px;
        /* padding-inline: 30p; */
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
      .my {
        padding-left: 20px;
        display: block;
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
  @media (max-width: 412px) {
    height: calc(100vh - 60px);
    top: 60px;
  }
`;

const HeaderStyle = styled.header<{ color: string }>`
  height: 90px;
  line-height: 90px;
  padding: 10px 30px;
  box-sizing: border-box;
  background-color: #fff;
  font-size: 18px;
  @media (max-width: 750px) {
    background-color: ${(props) => props.color};
  }
  @media (max-width: 412px) {
    height: 60px;
    line-height: 60px;
    padding: 0 15px;
    font-size: 14px;
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

const NavStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  font-family: "Inter-Semibold";
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
  font-family: "Inter-Semibold";
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
  line-height: unset;
`;

const ConnectButton = styled(Button)`
  font-family: "Inter-Semibold";
  font-size: 18px;
  color: unset;
  &:hover {
    background-color: rgba(168, 225, 0, 0.2);
  }
`;

const MenuItemStyle = styled(MenuItem)`
  font-family: "Inter-Semibold";
  font-size: 18px;
  text-align: center;
`;
