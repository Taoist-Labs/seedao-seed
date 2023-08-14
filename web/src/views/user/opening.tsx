import styled from "@emotion/styled";
import OpenGif from "assets/images/open.gif";

export default function OpeningModal() {
  return (
    <Mask>
      <img src={OpenGif} alt="" />
    </Mask>
  );
}

const Mask = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 9999;
  img {
    width: 300px;
  }
`;
