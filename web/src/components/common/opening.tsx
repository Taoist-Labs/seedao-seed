import styled from "@emotion/styled";
import CircularProgress from "@mui/material/CircularProgress";

export default function Opening() {
  return (
    <OpeningStyle>
      {/* TODO opening gif */}
      <CircularProgress />
    </OpeningStyle>
  );
}

const OpeningStyle = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 99999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
