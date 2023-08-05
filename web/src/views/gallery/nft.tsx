import styled from "@emotion/styled";
import Grid from "@mui/system/Unstable_Grid/Grid";

interface IProps {
  data: INFT;
  onClick?: (data: INFT) => void;
}

export default function NFTCard({ data, onClick }: IProps) {
  return (
    <NFTStyle xs={6} sm={3} onClick={() => onClick && onClick(data)}>
      <img src={data.image} title={data.name} alt="" />
      <Intro>
        {data.name} {data.tokenId}
      </Intro>
    </NFTStyle>
  );
}

const NFTStyle = styled(Grid)`
  img {
    width: 100%;
  }
`;

const Intro = styled.div`
  text-align: center;
  margin-top: 14px;
  color: #686666;
  font-size: 16px;
  font-weight: 500;
`;
