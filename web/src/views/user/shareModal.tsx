import styled from "@emotion/styled";
import Modal from "@mui/material/Modal";
import { useTranslation } from "react-i18next";
import WechatIcon from "assets/images/share/WeChat.svg";
import TwitterIcon from "assets/images/share/Twitter.svg";
import DiscordIcon from "assets/images/share/Discord.svg";

import DownloadIcon from "assets/images/user/download.svg";
import SeedShare from "components/seedShare";
import * as htmlToImage from "html-to-image";
import { useEffect, useMemo, useState } from "react";
import CopyBox from "components/common/copy";
import QrcodeBox from "./qrcode";
import { uploadImage } from "utils/request";

interface IProps {
  show: boolean;
  seed: INFT;
  handleClose: () => void;
}

const SHARE_TEXT =
  "🌱 Proudly unveiling my Seed NFT avatar, a testament to 500K points earned through creativity and collaboration within SeeDAO! 🚀 Join me in celebrating this achievement and our vibrant community. 🌟";
const HASH_TAGS = ["SeeDAO", "SeedNFT", "500KPoints"];

export default function ShareModal({ show, seed, handleClose }: IProps) {
  const { t } = useTranslation();
  const [imgBlob, setImgBlob] = useState<Blob>();
  const [isRead, setIsRead] = useState(false);
  const [imgCode, setImgCode] = useState("");
  const [showQrcode, setShowQrcode] = useState(false);

  const shareLink = useMemo(() => {
    return `https://social-share.fn-labs.workers.dev?image=${imgCode}`;
  }, [imgCode]);
  console.log("sharelink:", shareLink);

  const discordShareText = useMemo(() => {
    return `${SHARE_TEXT} ${HASH_TAGS.map((t) => "#" + t).join(
      " ",
    )} ${shareLink}`;
  }, [shareLink]);

  console.log("discordShareText: ", discordShareText);
  const share2twitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${SHARE_TEXT}&hashtags=${HASH_TAGS.join(
        ",",
      )}&url=${shareLink}`,
      "_blank",
    );
  };
  const share2wechat = () => {
    setShowQrcode(true);
  };
  const handleDownload = () => {
    const node = document.getElementById("SEED");
    if (!node) return;
    htmlToImage
      .toPng(node, { cacheBust: true })
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.download = "SEED.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  useEffect(() => {
    if (!imgBlob) return;
    // setImgCode("11");
    uploadImage(imgBlob)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setImgCode(res.name);
      });
  }, [imgBlob]);

  useEffect(() => {
    if (!isRead) {
      return;
    }
    const node = document.getElementById("SEED");
    if (!node) return;
    htmlToImage
      .toBlob(node, { cacheBust: true })
      .then(function (data) {
        data && setImgBlob(data);
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  }, [isRead]);
  return (
    <Modal
      open={show}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
    >
      <ShareModalStyle>
        <div className="share-modal">
          <div className="share-content">
            <SeedShare seed={seed} handleLoaded={() => setIsRead(true)} />
          </div>
        </div>
        {showQrcode ? (
          <RightBox>
            <QrcodeBox
              imgCode={imgCode}
              handleClose={() => setShowQrcode(false)}
            />
          </RightBox>
        ) : (
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
                  <CopyBox text={discordShareText}>
                    <img src={DiscordIcon} alt="" />
                  </CopyBox>
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
        )}
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
