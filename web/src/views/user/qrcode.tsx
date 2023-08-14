import styled from "@emotion/styled";
import { QRCodeSVG } from "qrcode.react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useTranslation } from "react-i18next";
interface IProps {
  imgCode: string;
  handleClose: () => void;
}

export default function QrcodeBox({ imgCode, handleClose }: IProps) {
  const { t } = useTranslation();
  return (
    <QrcodeBoxStyle>
      <QRCodeSVG
        width={150}
        height={150}
        value={`https://seed.seedao.tech/#/share?img=${imgCode}`}
      />
      <div className="tip">{t("user.openWechat")}</div>
      <div className="close">
        <HighlightOffIcon
          fontSize="large"
          style={{ cursor: "pointer" }}
          onClick={handleClose}
        />
      </div>
    </QrcodeBoxStyle>
  );
}

const QrcodeBoxStyle = styled.div`
  padding: 20px;
  .tip {
    margin-bottom: 40px;
    margin-top: 40px;
  }
  .close {
  }
`;
