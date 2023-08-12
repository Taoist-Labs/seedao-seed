import styled from "@emotion/styled";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ShareIcon from "assets/images/user/share.svg";
import { ATTR_ICON_MAP } from "utils/constant";

interface IProps {
  seed: INFT;
  isShare?: boolean;
  handleClose: () => void;
  handleClickShare?: () => void;
}

export default function SeedModal({
  seed,
  isShare,
  handleClose,
  handleClickShare,
}: IProps) {
  const { t } = useTranslation();
  const findAttrValue = (attr: string) => {
    return seed.attrs.find((item) => item.name === attr)?.value;
  };

  const seedTitle = useMemo(() => {
    return `SEED NO.${seed.tokenId}`;
  }, [seed]);

  return (
    <Modal
      open={!!seed}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
    >
      <ModalContainer>
        <div className="sm-title">
          <span>{seedTitle}</span>
          <CloseIconStyle onClick={handleClose} />
        </div>
        <ModalLeft>
          <img src={seed.image} alt="" />
        </ModalLeft>
        <ModalRight>
          <div className="title">{seedTitle}</div>
          <AttrBox>
            {seed.attrs.map((attr, idx) => (
              <li key={idx}>
                <img src={ATTR_ICON_MAP[attr.name]} alt="" />
                <div>
                  <p className="name">{attr.name}</p>
                  <p className="value">{attr.value}</p>
                </div>
              </li>
            ))}
          </AttrBox>
          {isShare && (
            <div className="share" onClick={handleClickShare}>
              <span>{t("user.shareText")}</span> <img src={ShareIcon} alt="" />
            </div>
          )}
        </ModalRight>
      </ModalContainer>
    </Modal>
  );
}

const ModalContainer = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 1150px;
  padding: 50px 60px;
  display: flex;
  gap: 30px;
  border-radius: 8px;
  background: #fbf5ef;
  .sm-title {
    color: #040404;
    font-size: 30px;
    font-weight: 700;
    display: none;
    line-height: 90px;
    padding-inline: 30px;
    justify-content: space-between;
    align-items: center;
  }
  &:focus-visible {
    outline: none;
  }
  @media (max-width: 750px) {
    width: calc(100% - 60px);
    flex-direction: column;
    padding: 0;
    height: 80%;
    min-height: 900px;
    max-height: 99%;
    gap: 0;
    .sm-title {
      display: flex;
    }
  }
  @media (max-width: 412px) {
    width: calc(100% - 30px);
    .sm-title {
      font-size: 15px;
      padding-inline: 15px;
      line-height: 45px;
    }
    height: unset;
    min-height: unset;
    padding-bottom: 54px;
  }
`;

const ModalLeft = styled.div`
  width: 45%;
  img {
    width: 500px;
    max-width: 100%;
  }
  @media (max-width: 750px) {
    width: 100%;
    img {
      width: 100%;
    }
    margin-bottom: 20px;
  }
`;
const ModalRight = styled.div`
  flex: 1;

  .title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .share {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    margin-top: 60px;
    text-align: center;
    white-space: pre-line;
    justify-content: center;
    cursor: pointer;

    img {
    }
  }
  @media (max-width: 750px) {
    .title {
      display: none;
    }
  }
`;

const AttrBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    width: calc(50% - 10px);
    border-radius: 8px;
    border: 1px solid #d8d8d8;
    background: #fff;

    box-sizing: border-box;
    margin-inline: 5px;
    margin-bottom: 10px;
    padding: 8px 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 56px;
    img {
      width: 30px;
    }
    p {
      line-height: 28px;
    }
    .name {
      font-size: 12px;
      opacity: 0.5;
      line-height: 15px;
      margin-bottom: 4px;
    }
    .value {
      font-size: 16px;
      font-weight: 600;
      line-height: 19px;
    }
  }
  @media (max-width: 750px) {
    padding-inline: 18px;
    .name {
      display: none;
    }
  }
  @media (max-width: 412px) {
    li {
      height: 32px;
      img {
        width: 17px;
      }
      .value {
        font-size: 12px;
      }
    }
  }
`;

const CloseIconStyle = styled(CloseIcon)`
  font-size: 36px;
  fill: #0f0f0f;
  opacity: 0.5;
  cursor: pointer;
  @media (max-width: 412px) {
    font-size: 18px;
  }
`;
