import styled from "@emotion/styled";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

interface IProps {
  seed: INFT;
  handleClose: () => void;
}

export default function SeedModal({ seed, handleClose }: IProps) {
  return (
    <Modal
      open={!!seed}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
    >
      <ModalContainer>
        <ModalLeft>
          <img src={seed.image} alt="" />
        </ModalLeft>
        <ModalRight>
          <div className="title">
            {seed.name}
            {seed.tokenId}
          </div>
          <AttrBox>
            {seed.attrs.map((attr, idx) => (
              <li key={idx}>
                <p className="name">{attr.name}</p>
                <p className="value">{attr.value}</p>
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
  height: 70%;
  padding: 50px 60px;
  display: flex;
  gap: 30px;
  border-radius: 8px;
  background: #fbf5ef;
  &:focus-visible {
    outline: none;
  }
`;

const ModalLeft = styled.div`
  width: 45%;
  img {
    width: 100%;
  }
`;
const ModalRight = styled.div`
  flex: 1;
  .title {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 20px;
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
    p {
      line-height: 28px;
    }
    .name {
      font-size: 12px;
      opacity: 0.5;
    }
    .value {
      font-size: 16px;
      font-weight: 600;
    }
  }
`;
