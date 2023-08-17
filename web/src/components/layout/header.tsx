import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import LogoIcon from "assets/images/logo.svg";
import React, { useState } from "react";

// import GreenStarIcon from "assets/images/home/green_star.svg";
import MenuIcon from "assets/images/home/menu.svg";
import LanguageIcon from "assets/images/home/language.svg";
import { useTranslation } from "react-i18next";
import useSelectAccount from "../../hooks/useSelectAccout";
import MenuSeed, { SmMenuSeed } from "./menuSeed";
import MenuLogin, { SmMenuLogin } from "./menuLogin";

const SmNav = ({
  handleClose,
  account,
  connector,
}: {
  handleClose: () => void;
  account?: string;
  connector: any;
}) => {
  return (
    <SmMenu>
      <div className="content">
        <div className="top">
          <SmMenuSeed account={account} />
          <SmMenuLogin account={account} connector={connector} />
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
  const [showMenu, setShowMenu] = React.useState(false);
  const { account, connector } = useSelectAccount();

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
          <MenuLogin account={account} connector={connector} />
          {/* <EnterAppButton /> */}
        </NavStyle>
      </HeaderContainer>
      {showMenu && (
        <SmNav
          handleClose={() => setShowMenu(false)}
          account={account}
          connector={connector}
        />
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
          display: block;
          color: unset;
          text-decoration: none;
        }
      }
      .sub-menu li {
        padding-left: 20px;
      }
      .sub-menu li:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
    }
    .bottom {
      display: flex;
      align-items: center;
      gap: 20px;
      justify-content: center;
      border-top: 1px solid #ddd;
      margin-top: 10px;
    }
  }
  .mask {
    flex: 1;
    background-color: rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 414px) {
    height: calc(100vh - 60px);
    top: 60px;
    .content {
      .top {
        padding-inline: 15px;
      }
    }
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
  @media (max-width: 414px) {
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
    position: relative;
    top: 15px;
  }
  @media (max-width: 414px) {
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
  @media (max-width: 414px) {
    img {
      width: 24px;
      top: 8px;
    }
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
