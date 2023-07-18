import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
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
        <Typography gutterBottom variant="h6" component="div">
          {data.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data.tokenId}
        </Typography>
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
`;
