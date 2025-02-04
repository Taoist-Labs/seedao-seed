import styled from "@emotion/styled";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ExpandIcon from "assets/images/expand.svg";
// import { useNavigate } from "react-router-dom";
import { useAppContext, AppActionType } from "providers/appProvider";
import { SELECT_WALLET } from "utils/constant";
import LoginModal from "components/modals/loginModal";
import Button from "@mui/material/Button";
import { addressToShow } from "utils/index";
import { css } from "@emotion/react";
import { useAccount, useDisconnect } from 'wagmi';

export default function MenuLogin({
  account
}: {
  account?: string;
  connector?: any;
}) {
  // const navigate = useNavigate();
  const { t } = useTranslation();
  const { dispatch } = useAppContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openSelect = Boolean(anchorEl);
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: "" });
    localStorage.removeItem(SELECT_WALLET);
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // connector?.deactivate();
      disconnect()
    } catch (error) {
      console.error("disconnect", error);
    }

    setAnchorEl(null);
  };

  // const go2profile = () => {
  //   navigate("/my");
  //   setAnchorEl(null);
  // };

  const showLoginModal = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
  };

  if (!account) {
    return (
      <>
        <LoginModal />
        <ConnectButton onClick={showLoginModal}>
          {t("header.connectWallet")}
        </ConnectButton>
      </>
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
        <img src={ExpandIcon} alt="" className="arrow" />
      </SelectBox>
      <Menu
        anchorEl={anchorEl}
        open={openSelect}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          "aria-labelledby": "wallet-select",
        }}
      >
        {/* <MenuItemStyle value={1} onClick={go2profile}>
          {t("header.myProfile")}
        </MenuItemStyle> */}
        <MenuItemStyle value={0} onClick={handleDisconnect}>
          {t("header.disconnect")}
        </MenuItemStyle>
      </Menu>
    </>
  );
}

export const SmMenuLogin = ({
  account,
}: {
  account?: string;
}) => {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const [expand, setExpand] = useState(false);

  // const go2profile = () => {
  //   navigate("/my");
  // };

  const handleDisconnect = () => {
    dispatch({ type: AppActionType.SET_WALLET_TYPE, payload: "" });
    localStorage.removeItem(SELECT_WALLET);
    try {
      // console.log("connector:", connector);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // connector?.deactivate();
      disconnect()
    } catch (error) {
      console.error("disconnect", error);
    }
  };

  const showLogin = () => {
    dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
  };

  return (
    <>
      {account ? (
        <div className="seed-menu" onClick={() => setExpand(!expand)}>
          <span>{addressToShow(account)}</span>
          {expand ? (
            <img src={ExpandIcon} alt="" className="arrow" />
          ) : (
            <img src={ExpandIcon} alt="" className="arrow" />
          )}
        </div>
      ) : (
        <SmConnectButton onClick={showLogin}>
          {t("header.connectWallet")}
        </SmConnectButton>
      )}

      {expand && (
        <ul className="sub-menu">
          {/* <li onClick={go2profile}>{t("header.myProfile")}</li> */}
          <li onClick={handleDisconnect}>{t("header.disconnect")}</li>
        </ul>
      )}
    </>
  );
};

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

const ConnectButtonStyle = css`
  font-family: "Inter-Semibold";
  font-size: 18px;
  cursor: pointer;
`;

const ConnectButton = styled(Button)`
  color: unset;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  ${ConnectButtonStyle}
`;

const SmConnectButton = styled.div`
  line-height: 44px;
  ${ConnectButtonStyle}
  @media (max-width: 414px) {
    font-size: 14px;
  }
`;

const MenuItemStyle = styled(MenuItem)`
  font-family: "Inter-Semibold";
  font-size: 18px;
  text-align: center;
  &.Mui-focusVisible {
    background-color: unset;
  }
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
