import styled from "@emotion/styled";
import Modal from "@mui/material/Modal";
import LevelStar from "components/svg/levelStar";
import { useTranslation } from "react-i18next";

interface IProps {
  show: boolean;
  handleClose: () => void;
  handleMint: () => void;
}

export default function MintModal({ show, handleClose, handleMint }: IProps) {
  const { t } = useTranslation();
  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
    >
      <MintModalStyle>
        <LevelStar />
        <div className="text">{t("user.congrats")}</div>
        <div className="tip">{t("user.congratsTip")}</div>
        <MintButton onClick={handleMint}>{t("user.startMint")}</MintButton>
      </MintModalStyle>
    </Modal>
  );
}

const MintModalStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  border-radius: 8px;
  background: #fbf5ef;
  padding-top: 67px;
  padding-bottom: 47px;
  text-align: center;
  &:focus-visible {
    outline: none;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  .text {
    font-size: 30px;
    margin-top: 29px;
  }
  .tip {
    color: #898e7b;
    font-size: 20px;
    line-height: 26px;
    margin-top: 24px;
    margin-bottom: 54px;
    white-space: pre-line;
  }
`;

const MintButton = styled.span`
  border-radius: 8px;
  background: #a8e100;
  height: 48px;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  padding-inline: 30px;
  color: #060606;
  font-size: 24px;
  font-family: "Inter-Bold";
`;
