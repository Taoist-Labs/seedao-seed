import styled from "@emotion/styled";
import Grid from "@mui/system/Unstable_Grid/Grid";
import SeedImg from "components/seedImg";

interface IProps {
  data: INFT;
  onClick?: (data: INFT) => void;
}

export default function NFTCard({ data, onClick }: IProps) {
  return (
    <NFTStyle xs={6} sm={3} onClick={() => onClick && onClick(data)}>
      <SeedImg src={data.thumb || data.image} name={data.name}>
        <Intro>{data.tokenId ? data.tokenIdFormat : data.name}</Intro>
      </SeedImg>
    </NFTStyle>
  );
}

const NFTStyle = styled(Grid)``;

const Intro = styled.div`
  text-align: center;
  margin-top: 10px;
  color: #686666;
  font-size: 16px;
  font-family: "Inter-Medium";
  @media (max-width: 412px) {
    font-size: 12px;
  }
  margin-top: 5px;
  margin-bottom: 5px;
`;
