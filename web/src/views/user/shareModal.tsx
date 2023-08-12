import styled from "@emotion/styled";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import WechatIcon from "assets/images/share/WeChat.svg";
import TwitterIcon from "assets/images/share/Twitter.svg";
import DiscordIcon from "assets/images/share/Discord.svg";

import DownloadIcon from "assets/images/user/download.svg";
import SeedShare from "components/seedShare";
import * as htmlToImage from "html-to-image";
import { useEffect, useState } from "react";

interface IProps {
  show: boolean;
  handleClose: () => void;
}

export default function ShareModal({ show, handleClose }: IProps) {
  const { t } = useTranslation();
  const [imgSrc, setImgSrc] = useState("");

  const share2discord = () => {
    // TODO copy link
  };
  const share2twitter = () => {
    // TODO
    window.open(`https://twitter.com/intent/tweet?text=111&url=222`, "_blank");
  };
  const share2wechat = () => {
    // TODO generate qrcode
  };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "SEED.png";
    link.href = imgSrc;
    link.click();
  };

  useEffect(() => {
    const node = document.getElementById("SEED");
    if (!node) return;
    htmlToImage
      .toPng(node, { cacheBust: true })
      .then(function (dataUrl) {
        setImgSrc(dataUrl);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }, []);
  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
    >
      <ShareModalStyle>
        <div className="share-modal">
          <div className="share-content">
            <SeedShare />
          </div>
        </div>
        <RightBox>
          <div className="content">
            <div className="title">{t("user.shareTo")}</div>
            <ul>
              <li>
                <img src={WechatIcon} alt="" onClick={share2wechat} />
              </li>
              <li>
                <img src={TwitterIcon} alt="" onClick={share2twitter} />
              </li>
              <li>
                <img src={DiscordIcon} alt="" onClick={share2discord} />
              </li>
            </ul>
          </div>
          <div>
            <span className="download" onClick={handleDownload}>
              <img src={DownloadIcon} alt="" />
              <span>{t("user.download")}</span>
            </span>
          </div>
        </RightBox>
      </ShareModalStyle>
    </Modal>
  );
}

const ShareModalStyle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &:focus-visible {
    outline: none;
  }
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-radius: 8px;
  background: #fbf5ef;
  padding: 40px 50px;
  width: 657px;
  .share-modal {
    border: 8px solid #fff;
    background: #f9d9fb;
    width: 252px;
    height: 486px;
    .share-content {
      transform: scale(0.338);
      transform-origin: 0 0;
    }
  }
`;

const RightBox = styled.div`
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .content {
    .title {
      font-size: 24px;
      margin-bottom: 40px;
    }
    ul {
      display: flex;
      gap: 30px;
      justify-content: center;
      img {
        width: 60px;
        cursor: pointer;
      }
    }
  }
  .download {
    display: inline-block;
    cursor: pointer;
    img {
      position: relative;
      left: -12px;
      top: 6px;
      background-color: #cecdf6;
    }
  }
`;
