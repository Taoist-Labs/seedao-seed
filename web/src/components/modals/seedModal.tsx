import styled from "@emotion/styled";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { GALLERY_ATTRS } from "data/gallery";
import { useMemo } from "react";

interface IProps {
  seed: INFT;
  handleClose: () => void;
}

export default function SeedModal({ seed, handleClose }: IProps) {
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
            {GALLERY_ATTRS.map((attr, idx) => (
              <li key={idx}>
                <img src={attr.icon} alt="" />
                <div>
                  <p className="name">{attr.display}</p>
                  <p className="value">{findAttrValue(attr.name)}</p>
                </div>
              </li>
            ))}
          </AttrBox>
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
  @media (max-width: 750px) {
    .title {
      display: none;
    }
  } ;
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
`;

const CloseIconStyle = styled(CloseIcon)`
  font-size: 36px;
  fill: #0f0f0f;
  opacity: 0.5;
  cursor: pointer;
`;
