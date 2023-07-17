import styled from "@emotion/styled";
import Typography from "@mui/material/Typography";
import Grid from "@mui/system/Unstable_Grid/Grid";

export interface INFT {
  image: string;
  tokenId: string;
  name: string;
}

interface IProps {
  data: INFT;
}

export default function NFTCard({ data }: IProps) {
  return (
    <NFTStyle xs={6} sm={3}>
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
