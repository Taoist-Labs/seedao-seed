import styled from "@emotion/styled";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ExpandIcon from "assets/images/expand.svg";
import { useNavigate } from "react-router-dom";
import { useAppContext, AppActionType } from "providers/appProvider";

export default function MenuSeed({ account }: { account?: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dispatch } = useAppContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openSelect = Boolean(anchorEl);

  const onClickMySeed = () => {
    if (account) {
      navigate("/user");
    } else {
      dispatch({ type: AppActionType.SET_LOGIN_MODAL, payload: true });
      setAnchorEl(null);
    }
  };

  return (
    <>
      <SelectBox
        id="wallet-select"
        onClick={(event: React.MouseEvent<HTMLElement>) =>
          setAnchorEl(event.currentTarget)
        }
      >
        <span>{t("header.seed")}</span>
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
        <MenuItemStyle value={1} onClick={() => navigate("/")}>
          {t("header.about")}
        </MenuItemStyle>
        <MenuItemStyle value={0} onClick={() => navigate("/gallery")}>
          {t("header.gallery")}
        </MenuItemStyle>
        <MenuItemStyle value={1} onClick={onClickMySeed}>
          {t("header.mySeed")}
        </MenuItemStyle>
      </Menu>
    </>
  );
}

const SelectBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  a {
    color: unset;
    text-decoration: none;
  }
  .arrow {
    margin-left: 2px;
  }
`;

const MenuItemStyle = styled(MenuItem)`
  font-family: "Inter-Semibold";
  font-size: 18px;
  text-align: center;
`;
