import styled from "@emotion/styled";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
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
          <Typography gutterBottom variant="h5" component="h5">
            {seed.name}
            {seed.tokenId}
          </Typography>
          <AttrBox>
            {seed.attrs.map((attr, idx) => (
              <li key={idx}>
                <Typography variant="body2" component="p">
                  {attr.name}
                </Typography>
                <Typography component="p">{attr.value}</Typography>
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
  height: 70%;
  background-color: #fff;
  padding: 50px 60px;
  display: flex;
  gap: 30px;
`;

const ModalLeft = styled.div`
  width: 45%;
  img {
    width: 100%;
  }
`;
const ModalRight = styled.div`
  flex: 1;
`;

const AttrBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    width: calc(50% - 10px);
    box-sizing: border-box;
    margin-inline: 5px;
    background: #eee;
    margin-bottom: 10px;
    padding: 8px 20px;
    p {
      line-height: 28px;
    }
  }
`;
